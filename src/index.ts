export function toRegex(pattern: string) {
    return new RegExp(pattern);
}

type CheckOptions = {
    pStart: number;
    sStart: number;
};

export function check(
    pattern: string,
    str: string,
    opts?: CheckOptions,
): boolean {
    let p = opts?.pStart ?? 0;
    let s = opts?.sStart ?? 0;

    while (p !== pattern.length && s !== str.length) {
        switch (pattern[p]) {
            case '?':
                p++;
                s++;
                break;

            case '*':
                const result = check(pattern, str, {
                    pStart: p + 1,
                    sStart: s,
                });
                if (result) {
                    return result;
                }
                s++;
                break;
            case '[':
                throw new Error('TODO: Char list not implemented');
            case '\\':
                throw new Error('TODO: Escape not implemented');
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
