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
});
