import { describe, it, expect } from 'vitest';
import { parseAllOf } from '../../src/JsonSchema/parsers/parseAllOf';

describe('parseAllOf', () => {
	it('should create never if empty', () => {
		expect(
			parseAllOf(
				{
					allOf: [],
				},
				{ path: [], seen: new Map() },
			).text(),
		).toBe('z.never()');
	});

	it('should handle true values', () => {
		expect(
			parseAllOf(
				{
					allOf: [{ type: 'string' }, true],
				},
				{ path: [], seen: new Map() },
			).text(),
		).toBe('z.intersection(z.string(), z.any())');
	});

	it('should handle false values', () => {
		expect(
			parseAllOf(
				{
					allOf: [{ type: 'string' }, false],
				},
				{ path: [], seen: new Map() },
			).text(),
		).toBe(
			`z.intersection(z.string(), z.any().refine((value) => !z.any().safeParse(value).success, "Invalid input: Should NOT be valid against schema"))`,
		);
	});
});
