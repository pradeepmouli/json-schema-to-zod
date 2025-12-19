import { describe, it, expect } from 'vitest';
import { parseConst } from '../../src/JsonSchema/parsers/parseConst';

describe('parseConst', () => {
	it('should handle falsy constants', () => {
		expect(
			parseConst({
				const: false,
			}).text(),
		).toBe('z.literal(false)');
	});
});
