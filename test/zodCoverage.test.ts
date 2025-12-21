import { describe, it, expect } from 'vitest';
import { build } from '../src/ZodBuilder';

describe('Zod v4 Type Coverage', () => {
	it('verifies build.x exists for all core z.x types', () => {
		// Core primitive types
		expect(build.string).toBeDefined();
		expect(build.number).toBeDefined();
		expect(build.boolean).toBeDefined();
		expect(build.bigint).toBeDefined();
		expect(build.date).toBeDefined();
		expect(build.symbol).toBeDefined();

		// Special values
		expect(build.undefined).toBeDefined();
		expect(build.null).toBeDefined();
		expect(build.void).toBeDefined();
		expect(build.any).toBeDefined();
		expect(build.unknown).toBeDefined();
		expect(build.never).toBeDefined();
		expect(build.nan).toBeDefined();

		// Complex types
		expect(build.array).toBeDefined();
		expect(build.object).toBeDefined();
		expect(build.tuple).toBeDefined();
		expect(build.record).toBeDefined();
		expect(build.map).toBeDefined();
		expect(build.set).toBeDefined();

		// Enums and literals
		expect(build.enum).toBeDefined();
		expect(build.literal).toBeDefined();

		// Unions and intersections
		expect(build.union).toBeDefined();
		expect(build.intersection).toBeDefined();
		expect(build.discriminatedUnion).toBeDefined();

		// Zod v4 specific types
		expect(build.promise).toBeDefined();
		expect(build.lazy).toBeDefined();
		expect(build.function).toBeDefined();
		expect(build.codec).toBeDefined();
		expect(build.preprocess).toBeDefined();
		expect(build.pipe).toBeDefined();
		expect(build.json).toBeDefined();
		expect(build.file).toBeDefined();
		expect(build.nativeEnum).toBeDefined();
		expect(build.templateLiteral).toBeDefined();
		expect(build.xor).toBeDefined();
		expect(build.keyof).toBeDefined();

		// Custom schemas
		expect(build.custom).toBeDefined();
	});

	it('documents optional Zod v4 types not implemented as builders', () => {
		// These are Zod v4 types that are either:
		// 1. Modifiers (we have as methods): optional, nullable, readonly, etc.
		// 2. Specialized variants of existing types
		// 3. String/number format validators (implemented as builder methods)
		const notNeededAsBuilders = [
			'optional, nullable, nullish, readonly - implemented as builder methods',
			'_default, prefault, success - wrapper modifiers, available via methods',
			'check, refine, superRefine, transform - implemented as builder methods',
			'int, int32, int64, uint32, uint64, float32, float64 - number format validators',
			'email, url, uuid, guid, cuid, etc. - string format validators (string methods)',
			'strictObject, looseObject - object variants (could be added if needed)',
			'partialRecord, looseRecord - record variants (could be added if needed)',
		];

		console.log('Zod v4 types not implemented as separate builders:');
		notNeededAsBuilders.forEach((item) => console.log(`  - ${item}`));

		// This test passes - just documenting design decisions
		expect(notNeededAsBuilders.length).toBeGreaterThan(0);
	});

	it('verifies all core type builders exist', () => {
		// Comprehensive check - if this passes, we have good coverage
		const coreBuilders = [
			'string',
			'number',
			'boolean',
			'bigint',
			'date',
			'symbol',
			'undefined',
			'null',
			'void',
			'any',
			'unknown',
			'never',
			'nan',
			'array',
			'object',
			'tuple',
			'record',
			'map',
			'set',
			'enum',
			'literal',
			'nativeEnum',
			'union',
			'intersection',
			'discriminatedUnion',
			'xor',
			'promise',
			'lazy',
			'function',
			'codec',
			'preprocess',
			'pipe',
			'json',
			'file',
			'templateLiteral',
			'keyof',
			'custom',
		];

		const missing = coreBuilders.filter((name) => !(name in build));

		expect(missing).toEqual([]);
		expect(Object.keys(build).length).toBeGreaterThanOrEqual(
			coreBuilders.length,
		);
	});
});
