export function toRegex(pattern: string) {
    return new RegExp(pattern);
}

type CheckOptions = {
    patternStart: number;
    strStart: number;
};

function glob(pattern: string, str: string, opts?: CheckOptions): boolean {
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
                let matched = false;
                let negate = false;
                p++;
                if (p === pattern.length) {
                    throw new Error('Invalid glog string, Unclosed "["');
                }

                if (pattern[p] === '!') {
                    negate = true;
                    p++;
                    if (p === pattern.length) {
                        throw new Error('Invalid glog string, Unclosed "["');
                    }
                }

                let previous = pattern[p];
                matched = previous === str[s];
                p++;

                while (pattern[p] !== ']' && p !== pattern.length) {
                    switch (pattern[p]) {
                        case '-':
                            {
                                p++;
                                switch (pattern[p]) {
                                    case ']':
                                        matched = str[s] === '-';
                                        break;
                                    default: {
                                        if (p === pattern.length) {
                                            throw new Error('syntax');
                                        }
                                        matched =
                                            previous <= str[s] &&
                                            str[s] <= pattern[p];
                                        previous = pattern[p];
                                        p++;
                                    }
                                }
                            }

                            break;
                        default: {
                            console.log('Here');
                            previous = pattern[p];
                            matched = previous === str[s];
                            p++;
                        }
                    }
                }

                if (pattern[p] !== ']') {
                    throw new Error('Invalid glob  string, Unclosed "["');
                }

                if (negate) {
                    matched = !matched;
                }

                if (!matched) {
                    return false;
                }

                p++;
                s++;
                break;
            case '\\':
                p++;
                if (p === pattern.length) {
                    throw new Error('Invalid glob string, unfinished escape');
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

/**
 * Checks if a string matches a glob pattern
 * @param pattern Glob pattern to check against
 * @param str String
 * @returns {boolean}
 */
export function check(pattern: string, str: string): boolean {
    return glob(pattern, str);
}
