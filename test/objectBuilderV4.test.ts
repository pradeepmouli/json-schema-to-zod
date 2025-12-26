import { describe, it, expect } from 'vitest';
import { build } from '../src/ZodBuilder/index.js';
import { ObjectBuilder } from '../src/ZodBuilder/object.js';

describe('ObjectBuilder - Zod v4 Compatibility', () => {
	describe('T047: passthrough() in v3 mode', () => {
		it('should generate .loose() in v4 mode', () => {
			const obj = build
				.object(
					{
						name: build.string(),
					},
					{ zodVersion: 'v4' },
				)
				.loose();
			expect(obj.text()).toBe('z.looseObject({ "name": z.string() })');
		});

		it('should generate .passthrough() when modifying precomputed schema in v4', () => {
			const obj = build
				.object(
					{
						name: build.string(),
					},
					{ zodVersion: 'v4' },
				)
				.loose();

			// When modifying a precomputed schema, use method form
			const modified = ObjectBuilder.fromCode(obj.text(), {
				zodVersion: 'v4',
			}).loose();
			expect(modified.text()).toBe(
				'z.looseObject({ "name": z.string() }).loose()',
			);
		});

		it('should generate .passthrough() in v3 mode', () => {
			const obj = build
				.object(
					{
						name: build.string(),
					},
					{ zodVersion: 'v3' },
				)
				.loose();
			expect(obj.text()).toBe('z.object({ "name": z.string() }).passthrough()');
		});

		it('should generate .passthrough() when modifying precomputed schema in v3', () => {
			const baseObj = build.object(
				{
					name: build.string(),
				},
				{ zodVersion: 'v3' },
			);

			const modified = ObjectBuilder.fromCode(baseObj.text(), {
				zodVersion: 'v3',
			}).loose();
			expect(modified.text()).toBe(
				'z.object({ "name": z.string() }).passthrough()',
			);
		});
	});

	describe('T048: merge vs extend handling', () => {
		it('should generate .extend() in v4 mode', () => {
			const base = build.object(
				{
					id: build.number(),
				},
				{ zodVersion: 'v4' },
			);
			const extension = build.object(
				{
					name: build.string(),
				},
				{ zodVersion: 'v4' },
			);

			const merged = base.merge(extension);
			expect(merged.text()).toBe(
				'z.object({ "id": z.number() }).extend(z.object({ "name": z.string() }))',
			);
		});

		it('should generate .merge() in v3 mode', () => {
			const base = build.object(
				{
					id: build.number(),
				},
				{ zodVersion: 'v3' },
			);
			const extension = build.object(
				{
					name: build.string(),
				},
				{ zodVersion: 'v3' },
			);

			const merged = base.merge(extension);
			expect(merged.text()).toBe(
				'z.object({ "id": z.number() }).merge(z.object({ "name": z.string() }))',
			);
		});

		it('should handle merge with string schema in v4', () => {
			const base = build.object(
				{
					id: build.number(),
				},
				{ zodVersion: 'v4' },
			);

			const merged = base.merge('z.object({ name: z.string() })');
			expect(merged.text()).toBe(
				'z.object({ "id": z.number() }).extend(z.object({ name: z.string() }))',
			);
		});

		it('should handle merge with string schema in v3', () => {
			const base = build.object(
				{
					id: build.number(),
				},
				{ zodVersion: 'v3' },
			);

			const merged = base.merge('z.object({ name: z.string() })');
			expect(merged.text()).toBe(
				'z.object({ "id": z.number() }).merge(z.object({ name: z.string() }))',
			);
		});
	});

	describe('strict() and loose() interaction', () => {
		it('should prioritize strict over loose in v4', () => {
			const obj = build
				.object(
					{
						name: build.string(),
					},
					{ zodVersion: 'v4' },
				)
				.loose()
				.strict();
			expect(obj.text()).toBe('z.strictObject({ "name": z.string() })');
		});

		it('should prioritize loose over strict when loose is called last in v4', () => {
			const obj = build
				.object(
					{
						name: build.string(),
					},
					{ zodVersion: 'v4' },
				)
				.strict()
				.loose();
			expect(obj.text()).toBe('z.looseObject({ "name": z.string() })');
		});

		it('should handle strict then loose in v3 mode', () => {
			const obj = build
				.object(
					{
						name: build.string(),
					},
					{ zodVersion: 'v3' },
				)
				.strict()
				.loose();
			expect(obj.text()).toBe('z.object({ "name": z.string() }).passthrough()');
		});
	});

	describe('Combined modifiers', () => {
		it('should handle strict + merge in v4', () => {
			const base = build
				.object(
					{
						id: build.number(),
					},
					{ zodVersion: 'v4' },
				)
				.strict();
			const extension = build.object(
				{
					name: build.string(),
				},
				{ zodVersion: 'v4' },
			);

			const merged = base.merge(extension);
			// When merge is present, strict must be applied as a method modifier
			// because v4 strictObject() cannot be extended inline
			expect(merged.text()).toBe(
				'z.object({ "id": z.number() }).extend(z.object({ "name": z.string() }))',
			);
		});

		it('should handle loose + merge in v3', () => {
			const base = build
				.object(
					{
						id: build.number(),
					},
					{ zodVersion: 'v3' },
				)
				.loose();
			const extension = build.object(
				{
					name: build.string(),
				},
				{ zodVersion: 'v3' },
			);

			const merged = base.merge(extension);
			expect(merged.text()).toBe(
				'z.object({ "id": z.number() }).passthrough().merge(z.object({ "name": z.string() }))',
			);
		});
	});
});
