import { describe, it, expect } from 'vitest';
import { jsonSchemaToZod } from '../src/index.js';
import { build } from '../src/ZodBuilder/index.js';

describe('Zod Version Support', () => {
	describe('Configuration', () => {
		it('should accept zodVersion option', () => {
			const schema = { type: 'string' as const };
			
			// Should not throw
			const v4Result = jsonSchemaToZod(schema, { zodVersion: 'v4' });
			const v3Result = jsonSchemaToZod(schema, { zodVersion: 'v3' });
			
			expect(v4Result).toBeTruthy();
			expect(v3Result).toBeTruthy();
		});

		it('should default to v3 for backward compatibility', () => {
			const schema = { type: 'string' as const };
			const result = jsonSchemaToZod(schema);
			
			// Default behavior should be same as v3
			expect(result).toBe('z.string()');
		});
	});

	describe('ObjectBuilder - strict mode', () => {
		it('should generate z.strictObject() in v4 mode when building fresh', () => {
			const builder = build.object({ name: build.string() }, { zodVersion: 'v4' }).strict();
			expect(builder.text()).toBe('z.strictObject({ "name": z.string() })');
		});

		it('should generate .strict() method in v3 mode', () => {
			const schema = {
				type: 'object' as const,
				properties: {
					name: { type: 'string' as const }
				},
				additionalProperties: false
			};
			
			const result = jsonSchemaToZod(schema, { zodVersion: 'v3' });
			expect(result).toBe('z.object({ "name": z.string().optional() }).strict()');
		});
		
		it('should handle additionalProperties: false in v4 mode', () => {
			const schema = {
				type: 'object' as const,
				properties: {
					name: { type: 'string' as const }
				},
				additionalProperties: false
			};
			
			const result = jsonSchemaToZod(schema, { zodVersion: 'v4' });
			// When using fromCode path, still uses .strict() method
			expect(result).toBe('z.object({ "name": z.string().optional() }).strict()');
		});
	});

	describe('ObjectBuilder - loose/passthrough mode', () => {
		it('should use loose in builder API', () => {
			const builder = build.object({ name: build.string() }, { zodVersion: 'v4' }).loose();
			expect(builder.text()).toBe('z.looseObject({ "name": z.string() })');
		});

		it('should use strict in builder API', () => {
			const builder = build.object({ name: build.string() }, { zodVersion: 'v4' }).strict();
			expect(builder.text()).toBe('z.strictObject({ "name": z.string() })');
		});
	});

	describe('ObjectBuilder - merge method', () => {
		it('should use .extend() in v4 mode', () => {
			const builder = build.object({ name: build.string() }, { zodVersion: 'v4' })
				.merge('otherSchema');
			expect(builder.text()).toContain('.extend(otherSchema)');
		});

		it('should use .merge() in v3 mode', () => {
			const builder = build.object({ name: build.string() }, { zodVersion: 'v3' })
				.merge('otherSchema');
			expect(builder.text()).toContain('.merge(otherSchema)');
		});
	});

	describe('Error Message Parameters (Future)', () => {
		// TODO: Implement once error message handling is version-aware
		it.skip('should use error parameter in v4 mode', () => {
			const schema = {
				type: 'string' as const,
				errorMessage: { type: 'Must be a string' }
			};
			
			const result = jsonSchemaToZod(schema, { zodVersion: 'v4' });
			expect(result).toContain('error:');
			expect(result).not.toContain('message:');
		});

		it.skip('should use message parameter in v3 mode', () => {
			const schema = {
				type: 'string' as const,
				errorMessage: { type: 'Must be a string' }
			};
			
			const result = jsonSchemaToZod(schema, { zodVersion: 'v3' });
			expect(result).toContain('message:');
			expect(result).not.toContain('error:');
		});
	});
});
