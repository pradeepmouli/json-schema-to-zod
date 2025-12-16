import { describe, it, expect } from 'vitest';
import { jsonSchemaToZod } from '../src/jsonSchemaToZod.js';

describe('eval', () => {
	it('is usable I guess', () => {
		const zodSchema = eval(
			jsonSchemaToZod({ type: 'string' }, { module: 'cjs' }),
		);

		expect(zodSchema.safeParse('Please just use Ajv instead')).toEqual({
			success: true,
			data: 'Please just use Ajv instead',
		});
	});
});
