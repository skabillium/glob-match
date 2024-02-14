import { describe, expect, it } from '@jest/globals';
import { check } from '../src/index';
import test from 'node:test';

describe('Full test suite', () => {
    it('Should work with "?"', () => {
        test('Should match', () => {
            expect(check('?at', 'Cat')).toBe(true);
            expect(check('?at', 'cat')).toBe(true);
        });
        test('Should not match', () => {
            expect(check('?at', 'at')).toBe(false);
        });
    });

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
    });

    // it('Should work with negation', () => {});

    // it('Should work with escaped strings', () => {});

    // it('Should work with edge cases', () => {});
});
