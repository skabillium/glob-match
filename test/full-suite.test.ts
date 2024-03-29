import { describe, expect, it } from '@jest/globals';
import { check, Checker } from '../src/index';

describe('Full test suite', () => {
    // Single char
    it('Should work with "?"', () => {
        expect(check('?at', 'Cat')).toBe(true);
        expect(check('?at', 'cat')).toBe(true);
        expect(check('?at', 'at')).toBe(false);
    });

    // Wildcard
    it('Should work with *', () => {
        expect(check('Law*', 'Law')).toBe(true);
        expect(check('Law*', 'Lawyer')).toBe(true);
        expect(check('Law*', 'GrawkLaw')).toBe(false);
        expect(check('Law*', 'aw')).toBe(false);
        expect(check('*Law*', 'Law')).toBe(true);
        expect(check('*Law*', 'GrokLaw')).toBe(true);
        expect(check('*Law*', 'Lawyer')).toBe(true);
        expect(check('*Law*', 'La')).toBe(false);
        expect(check('*Law*', 'aw')).toBe(false);

        expect(check('*.js', 'example.js')).toBe(true);
        expect(check('*.js', 'o.js')).toBe(true);
        expect(check('*.js', 'example.ts')).toBe(false);
    });

    // Brackets
    it('Should work with multiple values', () => {
        expect(check('*.[abc]', 'main.a')).toBe(true);
        expect(check('*.[abc]', 'main.b')).toBe(true);
        expect(check('*.[abc]', 'main.c')).toBe(true);
        expect(check('*.[abc]', 'main.d')).toBe(false);
        expect(() => check('*.[abc', 'main.a')).toThrow();

        expect(check('[CB]at', 'Cat')).toBe(true);
        expect(check('[CB]at', 'Bat')).toBe(true);
        expect(check('[CB]at', 'cat')).toBe(false);
        expect(check('[CB]at', 'bat')).toBe(false);
        expect(check('[CB]at', 'CBat')).toBe(false);
        expect(check('[CB]at', 'bat')).toBe(false);

        expect(check('example.[jt]s', 'example.js')).toBe(true);
        expect(check('example.[jt]s', 'example.ts')).toBe(true);
        expect(check('example.[jt]s', 'example.csv')).toBe(false);
    });

    // Brackets with ranges
    it('Should work with ranges', () => {
        expect(check('[A-Z]m', 'Am')).toBe(true);
        expect(check('[A-Z]m', 'Hm')).toBe(true);
        expect(check('[A-Z]m', 'Zm')).toBe(true);
        expect(check('[A-Z]m', 'm')).toBe(false);
        expect(check('[A-Z]m', 'Amsterdam')).toBe(false);
        expect(check('main.[a-c]', 'main.a')).toBe(true);
        expect(check('main.[a-c]', 'main.c')).toBe(true);
        expect(check('main.[a-c]', 'main.d')).toBe(false);
        expect(check('Letter[A-Za-z0-9]', 'Letter')).toBe(false);
        expect(check('Letter[A-Za-z0-9]', 'Letter1')).toBe(true);
    });

    // Negation
    it('Should work with negation', () => {
        expect(check('[!CB]at', 'Cat')).toBe(false);
        expect(check('[!CB]at', 'Bat')).toBe(false);
        expect(check('[!CB]at', 'cat')).toBe(true);
        expect(check('main.[!a-c]', 'main.d')).toBe(true);
        expect(check('main.[!a-c]', 'main.c')).toBe(false);
        expect(check('Letter[!1]', 'Letter1')).toBe(false);
        expect(check('Letter[!1]', 'Letter2')).toBe(true);
    });

    // Escaped characters
    it('Should work with escaped strings', () => {
        expect(check('\\*', '*')).toBe(true);
    });

    // Multiple test cases between brackets
    it('Should work multiple test cases between brackets', () => {
        expect(check('Letter[A-Za-z0-9]', 'Letter1')).toBe(true);
        expect(check('Letter[A-Za-z0-9]', 'Letter1a')).toBe(false);

        expect(check('Letter[A-Z1]', 'LetterA')).toBe(true);
        expect(check('Letter[A-Z1]', 'LetterB')).toBe(true);
        expect(check('Letter[A-Z1]', 'LetterZ')).toBe(true);
        expect(check('Letter[A-Z1]', 'Letter1')).toBe(true);
        expect(check('Letter[A-Z1]', 'Letter2')).toBe(false);
        expect(check('Letter[A-Z1]', 'Lettera')).toBe(false);
    });

    // Non-aplhanumeric chars between brackets
    it('Should work with non-alphanumeric characters between brackets', () => {
        expect(check('[!]a-]', 'b')).toBe(true);
        expect(check('[!]a-]', ']')).toBe(false);
        expect(check('[!]a-]', 'a')).toBe(false);
        expect(check('[!]a-]', '-')).toBe(false);

        expect(check('[--0]', '-')).toBe(true);
        expect(check('[--0]', '.')).toBe(true);
        expect(check('[--0]', '/')).toBe(true);
        expect(check('[--0]', '0')).toBe(true);
        expect(check('[--0]', 'b')).toBe(false);

        expect(check('[][!]', ']')).toBe(true);
        expect(check('[][!]', '[')).toBe(true);
        expect(check('[][!]', '!')).toBe(true);
        expect(check('[][!]', 'a')).toBe(false);
        expect(() => check('[][!', ']')).toThrow();

        expect(check('[[?*\\]', '[')).toBe(true);
        expect(check('[[?*\\]', '?')).toBe(true);
        expect(check('[[?*\\]', '*')).toBe(true);
        expect(check('[[?*\\]', '\\')).toBe(true);
        expect(check('[[?*\\]', 'a')).toBe(false);
    });

    // Unicode
    it('Should work with unicode', () => {
        // Cyrilic
        expect(check('[Пп]ривет, [Мм]ир', 'Привет, Мир')).toBe(true);

        // Greek
        expect(check('[Γγ]ειά σου, [Ττ]ι κάνεις', 'Γειά σου, τι κάνεις')).toBe(
            true,
        );
    });

    // Syntax errors
    it('Should throw syntax errors', () => {
        expect(() => check('[', 'a')).toThrow();
        expect(() => check('[!', 'a')).toThrow();
        expect(() => check('[--', 'a')).toThrow();
        expect(() => check('\\', 'a')).toThrow();
    });

    // Build checker function
    it('Should create a checker function', () => {
        const isMatch = Checker('*cat*');

        expect(isMatch('concatenate')).toBe(true);
        expect(isMatch('hello')).toBe(false);
    });

    // Option parsing
    it('Should parse options correctly', () => {
        const invalid = 'main.[abc';
        const str = 'main.b';

        expect(() => check(invalid, str)).toThrow();
        expect(() => check(invalid, str, { onError: 'throw' })).toThrow();
        expect(check(invalid, str, { onError: 'false' })).toBe(false);
    });

    it('Checker function should parse options', () => {
        const isMatchError = Checker('main.[abc');
        expect(() => isMatchError('main.a')).toThrow();

        const isMatchFalse = Checker('main.[abc', { onError: 'false' });
        expect(isMatchFalse('main.a')).toBe(false);
    });
});
