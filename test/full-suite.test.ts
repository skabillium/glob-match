import { describe, expect, it } from '@jest/globals';
import { check } from '../src/index';
import test from 'node:test';

describe('Full test suite', () => {
    // Single char
    it('Should work with "?"', () => {
        test('Should match', () => {
            expect(check('?at', 'Cat')).toBe(true);
            expect(check('?at', 'cat')).toBe(true);
        });
        test('Should not match', () => {
            expect(check('?at', 'at')).toBe(false);
        });
    });

    // Wildcard
    it('Should work with *', () => {
        test('Law* with Law', () => {
            expect(check('Law*', 'Law')).toBe(true);
        });

        test('Law* with Lawyer', () => {
            expect(check('Law*', 'Lawyer')).toBe(true);
        });

        test('Law* with GrawkLaw', () => {
            expect(check('Law*', 'GrawkLaw')).toBe(false);
        });

        test('Law* with aw', () => {
            expect(check('Law*', 'aw')).toBe(false);
        });

        test('*Law* with Law', () => {
            expect(check('*Law*', 'Law')).toBe(true);
        });

        test('*Law* with GrokLaw', () => {
            expect(check('*Law*', 'GrokLaw')).toBe(true);
        });

        test('*Law* with Lawyer', () => {
            expect(check('*Law*', 'Lawyer')).toBe(true);
        });

        test('*Law* with La', () => {
            expect(check('*Law*', 'La')).toBe(false);
        });

        test('*Law* with aw', () => {
            expect(check('*Law*', 'aw')).toBe(false);
        });
    });

    // Brackets
    it('Should work with multiple values', () => {
        test('*.[abc] with main.a', () => {
            expect(check('*.[abc]', 'main.a')).toBe(true);
        });
        test('*.[abc] with main.b', () => {
            expect(check('*.[abc]', 'main.b')).toBe(true);
        });
        test('*.[abc] with main.c', () => {
            expect(check('*.[abc]', 'main.c')).toBe(true);
        });
        test('*.[abc] with main.d', () => {
            expect(check('*.[abc]', 'main.d')).toBe(false);
        });
        test('*.[abc with main.a', () => {
            expect(() => check('*.[abc', 'main.a')).toThrow();
        });

        test('[CB]at with Cat', () => {
            expect(check('[CB]at', 'Cat')).toBe(true);
        });
        test('[CB]at with Bat', () => {
            expect(check('[CB]at', 'Bat')).toBe(true);
        });
        test('[CB]at with cat', () => {
            expect(check('[CB]at', 'cat')).toBe(false);
        });
        test('[CB]at with bat', () => {
            expect(check('[CB]at', 'bat')).toBe(false);
        });
        test('[CB]at with CBat', () => {
            expect(check('[CB]at', 'CBat')).toBe(false);
        });
        test('[CB]at with bat', () => {
            expect(check('[CB]at', 'bat')).toBe(false);
        });
    });

    // Brackets with ranges
    it('Should work with ranges', () => {
        test('[A-Z]m with Am', () => {
            expect(check('[A-Z]m', 'Am')).toBe(true);
        });
        test('[A-Z]m with Hm', () => {
            expect(check('[A-Z]m', 'Hm')).toBe(true);
        });
        test('[A-Z]m with Zm', () => {
            expect(check('[A-Z]m', 'Zm')).toBe(true);
        });
        test('[A-Z]m with m', () => {
            expect(check('[A-Z]m', 'm')).toBe(false);
        });
        test('[A-Z]m with Amsterdam', () => {
            expect(check('[A-Z]m', 'Amsterdam')).toBe(false);
        });
        test('main.[a-c] with main.a', () => {
            expect(check('main.[a-c]', 'main.a')).toBe(true);
        });
        test('main.[a-c] with main.c', () => {
            expect(check('main.[a-c]', 'main.c')).toBe(true);
        });
        test('main.[a-c] with main.d', () => {
            expect(check('main.[a-c]', 'main.d')).toBe(false);
        });
        test('Letter[A-Za-z0-9] with Letter', () => {
            expect(check('Letter[A-Za-z0-9]', 'Letter')).toBe(false);
        });
        test('Letter[A-Za-z0-9] with Letter1', () => {
            expect(check('Letter[A-Za-z0-9]', 'Letter1')).toBe(true);
        });
    });

    // Negation
    it('Should work with negation', () => {
        test('[!CB]at with Cat', () => {
            expect(check('[!CB]at', 'Cat')).toBe(false);
        });
        test('[!CB]at with Bat', () => {
            expect(check('[!CB]at', 'Bat')).toBe(false);
        });
        test('[!CB]at with cat', () => {
            expect(check('[!CB]at', 'cat')).toBe(true);
        });
        test('main.[!a-c] with main.d', () => {
            expect(check('main.[!a-c]', 'main.d')).toBe(true);
        });
        test('main.[!a-c] with main.c', () => {
            expect(check('main.[!a-c]', 'main.c')).toBe(false);
        });
        test('Letter[!1] with Letter1', () => {
            expect(check('Letter[!1]', 'Letter1')).toBe(false);
        });
        test('Letter[!1] with Letter2', () => {
            expect(check('Letter[!1]', 'Letter2')).toBe(true);
        });
        test('Letter[A-Za-z0-9] with Letter1', () => {
            expect(check('Letter[A-Za-z0-9]', 'Letter1')).toBe(true);
        });
    });

    // Escaped characters
    it('Should work with escaped strings', () => {
        test('\\* with *', () => {
            expect(check('\\*', '*')).toBe(true);
        });
    });

    // Weird edge cases
    it('Should work with edge cases', () => {
        test('Letter[A-Z1] with LetterA', () => {
            expect(check('Letter[A-Z1]', 'LetterA')).toBe(true);
        });
        test('Letter[A-Z1] with LetterB', () => {
            expect(check('Letter[A-Z1]', 'LetterB')).toBe(true);
        });
        test('Letter[A-Z1] with LetterZ', () => {
            expect(check('Letter[A-Z1]', 'LetterZ')).toBe(true);
        });
        test('Letter[A-Z1] with Letter1', () => {
            expect(check('Letter[A-Z1]', 'Letter1')).toBe(true);
        });
        test('Letter[A-Z1] with Letter2', () => {
            expect(check('Letter[A-Z1]', 'Letter2')).toBe(false);
        });
        test('Letter[A-Z1] with Lettera', () => {
            expect(check('Letter[A-Z1]', 'Lettera')).toBe(false);
        });

        test('[!]a-] with b', () => {
            expect(check('[!]a-]', 'b')).toBe(true);
        });
        test('[!]a-] with ]', () => {
            expect(check('[!]a-]', ']')).toBe(false);
        });
        test('[!]a-] with a', () => {
            expect(check('[!]a-]', 'a')).toBe(false);
        });
        test('[!]a-] with -', () => {
            expect(check('[!]a-]', '-')).toBe(false);
        });
    });

    // Unicode
    it('Should work with unicode', () => {
        test('[Γγ]ειά σου, [Ττ]ι κάνεις with Γειά σου, τι κάνεις', () => {
            expect(
                check('[Γγ]ειά σου, [Ττ]ι κάνεις', 'Γειά σου, τι κάνεις'),
            ).toBe(true);
        });
        test('[Пп]ривет, [Мм]ир with Привет, Мир', () => {
            expect(check('[Пп]ривет, [Мм]ир', 'Привет, Мир')).toBe(true);
        });
    });

    // Syntax errors
    it('Should throw syntax errors', () => {
        test('[', () => {
            expect(() => check('[', 'a')).toThrow();
        });
        test('[!', () => {
            expect(() => check('[!', 'a')).toThrow();
        });
        test('[--', () => {
            expect(() => check('[--', 'a')).toThrow();
        });
        test('\\', () => {
            expect(() => check('\\', 'a')).toThrow();
        });
    });

    // Option parsing
    it('Should parse options correctly', () => {
        const invalid = 'main.[abc';
        const str = 'main.b';
        test(`Invalid ${invalid}`, () => {
            expect(() => check(invalid, str)).toThrow();
            expect(() => check(invalid, str, { onError: 'throw' })).toThrow();
            expect(check(invalid, str, { onError: 'false' })).toBe(false);
        });
    });
});
