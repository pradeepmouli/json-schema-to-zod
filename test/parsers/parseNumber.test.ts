import { describe, it, expect } from 'vitest';
import { parseNumber } from '../../src/parsers/parseNumber';

describe('parseNumber', () => {
	it('should handle integer', () => {
		expect(
			parseNumber({
				type: 'integer',
			}).text(),
		).toBe(`z.number().int()`);

		expect(
			parseNumber({
				type: 'integer',
				multipleOf: 1,
			}).text(),
		).toBe(`z.number().int()`);

		expect(
			parseNumber({
				type: 'number',
				multipleOf: 1,
			}).text(),
		).toBe(`z.number().int()`);
	});

	it('should handle maximum with exclusiveMinimum', () => {
		expect(
			parseNumber({
				type: 'number',
				exclusiveMinimum: true,
				minimum: 2,
			}).text(),
		).toBe(`z.number().gt(2)`);
	});

	it('should handle minimum', () => {
		expect(
			parseNumber({
				type: 'number',
				minimum: 2,
			}).text(),
		).toBe(`z.number().gte(2)`);
	});

	it('should handle maximum with exclusiveMaximum', () => {
		expect(
			parseNumber({
				type: 'number',
				exclusiveMaximum: true,
				maximum: 2,
			}).text(),
		).toBe(`z.number().lt(2)`);
	});

	it('should handle numeric exclusiveMaximum', () => {
		expect(
			parseNumber({
				type: 'number',
				exclusiveMaximum: 2,
			}).text(),
		).toBe(`z.number().lt(2)`);
	});

	it('should accept errorMessage', () => {
		expect(
			parseNumber({
				type: 'number',
				format: 'int64',
				exclusiveMinimum: 0,
				maximum: 2,
				multipleOf: 2,
				errorMessage: {
					format: 'ayy',
					multipleOf: 'lmao',
					exclusiveMinimum: 'deez',
					maximum: 'nuts',
				},
			}).text(),
		).toBe(
			'z.number().int("ayy").multipleOf(2, "lmao").gt(0, "deez").lte(2, "nuts")',
		);
	});
});
