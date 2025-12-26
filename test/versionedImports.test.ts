import { describe, it, expect } from 'vitest';

describe('Version-specific imports', () => {
	describe('v3 import', () => {
		it('should export build with v3 API', async () => {
			const { build } = await import('../src/v3.js');

			// Core builders should be available
			expect(build.string).toBeDefined();
			expect(build.number).toBeDefined();
			expect(build.boolean).toBeDefined();
			expect(build.array).toBeDefined();
			expect(build.object).toBeDefined();
			expect(build.union).toBeDefined();
			expect(build.date).toBeDefined();
			expect(build.bigint).toBeDefined();

			// V4-only builders should NOT be available in v3
			expect((build as any).promise).toBeUndefined();
			expect((build as any).lazy).toBeUndefined();
			expect((build as any).function).toBeUndefined();
			expect((build as any).codec).toBeUndefined();
			expect((build as any).preprocess).toBeUndefined();
			expect((build as any).pipe).toBeUndefined();
			expect((build as any).json).toBeUndefined();
			expect((build as any).file).toBeUndefined();
			expect((build as any).nativeEnum).toBeUndefined();
			expect((build as any).templateLiteral).toBeUndefined();
			expect((build as any).xor).toBeUndefined();
			expect((build as any).keyof).toBeUndefined();
		});

		it('should allow creating core schemas', async () => {
			const { build } = await import('../src/v3.js');

			const stringSchema = build.string();
			expect(stringSchema.text()).toBe('z.string()');

			const numberSchema = build.number();
			expect(numberSchema.text()).toBe('z.number()');

			const objectSchema = build.object({
				name: build.string(),
				age: build.number(),
			});
			expect(objectSchema.text()).toContain('z.object');
		});
	});

	describe('v4 import', () => {
		it('should export build with full v4 API', async () => {
			const { build } = await import('../src/v4.js');

			// Core builders should be available
			expect(build.string).toBeDefined();
			expect(build.number).toBeDefined();
			expect(build.boolean).toBeDefined();
			expect(build.array).toBeDefined();
			expect(build.object).toBeDefined();
			expect(build.union).toBeDefined();

			// V4-only builders should be available
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
		});

		it('should allow creating v4-specific schemas', async () => {
			const { build } = await import('../src/v4.js');

			const promiseSchema = build.promise(build.string());
			expect(promiseSchema.text()).toBe('z.promise(z.string())');

			const lazySchema = build.lazy(build.string());
			expect(lazySchema.text()).toBe('z.lazy(() => z.string())');

			const jsonSchema = build.json();
			expect(jsonSchema.text()).toBe('z.json()');

			const fileSchema = build.file();
			expect(fileSchema.text()).toBe('z.file()');
		});

		it('should allow creating core schemas', async () => {
			const { build } = await import('../src/v4.js');

			const stringSchema = build.string();
			expect(stringSchema.text()).toBe('z.string()');

			const numberSchema = build.number();
			expect(numberSchema.text()).toBe('z.number()');
		});
	});

	describe('default import (backward compatibility)', () => {
		it('should still have all builders including v4', async () => {
			const { build } = await import('../src/ZodBuilder/index.js');

			// Should have everything (backward compatibility)
			expect(build.string).toBeDefined();
			expect(build.promise).toBeDefined();
			expect(build.lazy).toBeDefined();
			expect(build.json).toBeDefined();
		});
	});

	describe('buildV3 and buildV4 exports', () => {
		it('should export buildV3 with core builders only', async () => {
			const { buildV3 } = await import('../src/ZodBuilder/index.js');

			expect(buildV3.string).toBeDefined();
			expect(buildV3.number).toBeDefined();
			expect((buildV3 as any).promise).toBeUndefined();
			expect((buildV3 as any).lazy).toBeUndefined();
		});

		it('should export buildV4 with all builders', async () => {
			const { buildV4 } = await import('../src/ZodBuilder/index.js');

			expect(buildV4.string).toBeDefined();
			expect(buildV4.number).toBeDefined();
			expect(buildV4.promise).toBeDefined();
			expect(buildV4.lazy).toBeDefined();
			expect(buildV4.json).toBeDefined();
		});
	});
});
