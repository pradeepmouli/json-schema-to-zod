import { describe, it, expect } from 'vitest';
import { build } from '../src/ZodBuilder/index.js';

describe('NativeEnumBuilder - Zod v4 Unified API', () => {
	describe('T050: z.enum() in v4 mode', () => {
		it('should generate z.enum() for native enum in v4 mode', () => {
			const enumBuilder = build.nativeEnum('MyEnum', { zodVersion: 'v4' });
			expect(enumBuilder.text()).toBe('z.enum(MyEnum)');
		});

		it('should handle enum with modifiers in v4 mode', () => {
			const enumBuilder = build
				.nativeEnum('StatusEnum', { zodVersion: 'v4' })
				.optional();
			expect(enumBuilder.text()).toBe('z.enum(StatusEnum).optional()');
		});

		it('should handle enum with default value in v4 mode', () => {
			const enumBuilder = build
				.nativeEnum('ColorEnum', { zodVersion: 'v4' })
				.default('ColorEnum.Red');
			expect(enumBuilder.text()).toBe(
				'z.enum(ColorEnum).default("ColorEnum.Red")',
			);
		});

		it('should handle enum with description in v4 mode', () => {
			const enumBuilder = build
				.nativeEnum('RoleEnum', { zodVersion: 'v4' })
				.describe('User role enumeration');
			expect(enumBuilder.text()).toBe(
				'z.enum(RoleEnum).describe("User role enumeration")',
			);
		});
	});

	describe('T051: z.nativeEnum() in v3 mode', () => {
		it('should generate z.nativeEnum() for native enum in v3 mode', () => {
			const enumBuilder = build.nativeEnum('MyEnum', { zodVersion: 'v3' });
			expect(enumBuilder.text()).toBe('z.nativeEnum(MyEnum)');
		});

		it('should handle enum with modifiers in v3 mode', () => {
			const enumBuilder = build
				.nativeEnum('StatusEnum', { zodVersion: 'v3' })
				.optional();
			expect(enumBuilder.text()).toBe('z.nativeEnum(StatusEnum).optional()');
		});

		it('should handle enum with default value in v3 mode', () => {
			const enumBuilder = build
				.nativeEnum('ColorEnum', { zodVersion: 'v3' })
				.default('ColorEnum.Blue');
			expect(enumBuilder.text()).toBe(
				'z.nativeEnum(ColorEnum).default("ColorEnum.Blue")',
			);
		});

		it('should handle enum with description in v3 mode', () => {
			const enumBuilder = build
				.nativeEnum('RoleEnum', { zodVersion: 'v3' })
				.describe('User role enumeration');
			expect(enumBuilder.text()).toBe(
				'z.nativeEnum(RoleEnum).describe("User role enumeration")',
			);
		});
	});

	describe('T052: Enum value handling', () => {
		it('should handle complex enum references in v4', () => {
			const enumBuilder = build.nativeEnum('MyModule.MyEnum', {
				zodVersion: 'v4',
			});
			expect(enumBuilder.text()).toBe('z.enum(MyModule.MyEnum)');
		});

		it('should handle complex enum references in v3', () => {
			const enumBuilder = build.nativeEnum('MyModule.MyEnum', {
				zodVersion: 'v3',
			});
			expect(enumBuilder.text()).toBe('z.nativeEnum(MyModule.MyEnum)');
		});

		it('should handle enum in object schema with v4', () => {
			const objBuilder = build.object(
				{
					status: build.nativeEnum('StatusEnum', { zodVersion: 'v4' }),
					count: build.number({ zodVersion: 'v4' }),
				},
				{ zodVersion: 'v4' },
			);
			expect(objBuilder.text()).toBe(
				'z.object({ "status": z.enum(StatusEnum), "count": z.number() })',
			);
		});

		it('should handle enum in object schema with v3', () => {
			const objBuilder = build.object(
				{
					status: build.nativeEnum('StatusEnum', { zodVersion: 'v3' }),
					count: build.number({ zodVersion: 'v3' }),
				},
				{ zodVersion: 'v3' },
			);
			expect(objBuilder.text()).toBe(
				'z.object({ "status": z.nativeEnum(StatusEnum), "count": z.number() })',
			);
		});

		it('should handle nullable enum in v4', () => {
			const enumBuilder = build
				.nativeEnum('MyEnum', { zodVersion: 'v4' })
				.nullable();
			expect(enumBuilder.text()).toBe('z.enum(MyEnum).nullable()');
		});

		it('should handle nullable enum in v3', () => {
			const enumBuilder = build
				.nativeEnum('MyEnum', { zodVersion: 'v3' })
				.nullable();
			expect(enumBuilder.text()).toBe('z.nativeEnum(MyEnum).nullable()');
		});

		it('should handle array of enums in v4', () => {
			const arrayBuilder = build.array(
				build.nativeEnum('StatusEnum', { zodVersion: 'v4' }),
				{ zodVersion: 'v4' },
			);
			expect(arrayBuilder.text()).toBe('z.array(z.enum(StatusEnum))');
		});

		it('should handle array of enums in v3', () => {
			const arrayBuilder = build.array(
				build.nativeEnum('StatusEnum', { zodVersion: 'v3' }),
				{ zodVersion: 'v3' },
			);
			expect(arrayBuilder.text()).toBe('z.array(z.nativeEnum(StatusEnum))');
		});
	});

	describe('Version switching', () => {
		it('should use v4 by default when no zodVersion specified', () => {
			const enumBuilder = build.nativeEnum('DefaultEnum');
			expect(enumBuilder.text()).toBe('z.enum(DefaultEnum)');
		});

		it('should respect zodVersion option', () => {
			const v4Builder = build.nativeEnum('MyEnum', { zodVersion: 'v4' });
			const v3Builder = build.nativeEnum('MyEnum', { zodVersion: 'v3' });

			expect(v4Builder.text()).toBe('z.enum(MyEnum)');
			expect(v3Builder.text()).toBe('z.nativeEnum(MyEnum)');
		});
	});
});
