export function toRegex(pattern: string) {
    return new RegExp(pattern);
}

type MatchOptions = {
    patternStart: number;
    strStart: number;
};

function UnclosedBracketException() {
    return new Error('Unclosed bracket');
}

function UnfinishedEscapeException() {
    return new Error('Unfinished escape');
}

function glob(pattern: string, str: string, opts?: MatchOptions): boolean {
    let p = opts?.patternStart ?? 0;
    let s = opts?.strStart ?? 0;

    while (p !== pattern.length && s !== str.length) {
        switch (pattern[p]) {
            case '?':
                p++;
                s++;
                break;

            case '*':
                const result = glob(pattern, str, {
                    patternStart: p + 1,
                    strStart: s,
                });
                if (result) {
                    return result;
                }
                s++;
                break;
            case '[':
                let negate = false;
                p++;

                if (pattern[p] === '!') {
                    negate = true;
                    p++;
                    if (p === pattern.length) {
                        throw UnclosedBracketException();
                    }
                }

                let chars = '';
                while (pattern[p] !== ']' && p < pattern.length) {
                    if (pattern[p] === '-') {
                        const encoder = new TextEncoder();
                        const start = encoder.encode(pattern[p - 1])[0];
                        p++;
                        const end = encoder.encode(pattern[p])[0];
                        if (end <= start) {
                            // TODO: Show the chars not the codes
                            throw new Error(
                                `Invalid range from ${start} to ${end}`,
                            );
                        }

                        for (let i = start + 1; i <= end; i++) {
                            chars += String.fromCharCode(i);
                        }
                        p++;
                    }

                    if (pattern[p] === ']') {
                        break;
                    }

                    chars += pattern[p];
                    p++;
                }

                if (pattern[p] !== ']') {
                    throw UnclosedBracketException();
                }

                // Result is a logical xor between the char includes and the negation
                const matched = chars.includes(str[s]) !== negate;
                if (!matched) {
                    return false;
                }

                p++;
                s++;
                break;
            case '\\':
                p++;
                if (p === pattern.length) {
                    throw UnfinishedEscapeException();
                }
            default:
                if (pattern[p] === str[s]) {
                    p++;
                    s++;
                } else {
                    return false;
                }
        }
    }

    if (s === str.length) {
        while (pattern[p] === '*') {
            p++;
        }

        if (p === pattern.length) {
            return true;
        }
    }

    return false;
}

type OnError = 'false' | 'throw';
type CheckOptions = { onError: OnError };

/**
 * Checks if a string matches a glob pattern
 * @param pattern Glob pattern to check against
 * @param str String
 */
export function check(
    pattern: string,
    str: string,
    checkOptions?: CheckOptions,
): boolean {
    // Provide the option of not throwing an error when validating
    const onError = checkOptions?.onError ?? 'throw';
    try {
        return glob(pattern, str);
    } catch (err) {
        if (onError === 'throw') {
            throw err;
        }

        return false;
    }
}
