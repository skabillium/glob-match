import { describe, expect, it } from '@jest/globals';
import { check } from '../src/index';
import test from 'node:test';

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
        expect(check('Letter[A-Za-z0-9]', 'Letter1')).toBe(true);
    });

    // Escaped characters
    it('Should work with escaped strings', () => {
        expect(check('\\*', '*')).toBe(true);
    });

    // Weird edge cases
    it('Should work with edge cases', () => {
        expect(check('Letter[A-Z1]', 'LetterA')).toBe(true);
        expect(check('Letter[A-Z1]', 'LetterB')).toBe(true);
        expect(check('Letter[A-Z1]', 'LetterZ')).toBe(true);
        expect(check('Letter[A-Z1]', 'Letter1')).toBe(true);
        expect(check('Letter[A-Z1]', 'Letter2')).toBe(false);
        expect(check('Letter[A-Z1]', 'Lettera')).toBe(false);
        expect(check('[!]a-]', 'b')).toBe(true);
        expect(check('[!]a-]', ']')).toBe(false);
        expect(check('[!]a-]', 'a')).toBe(false);
        expect(check('[!]a-]', '-')).toBe(false);
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

    // Option parsing
    it('Should parse options correctly', () => {
        const invalid = 'main.[abc';
        const str = 'main.b';

        expect(() => check(invalid, str)).toThrow();
        expect(() => check(invalid, str, { onError: 'throw' })).toThrow();
        expect(check(invalid, str, { onError: 'false' })).toBe(false);
    });
});
