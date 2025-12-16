/**
 * Generic modifiers that can be applied to any Zod schema.
 */

import { BaseBuilder } from './BaseBuilder';

type BuilderInput = BaseBuilder | string;

function asText(input: BuilderInput): string {
	return typeof input === 'string' ? input : input.text();
}

/**
 * Apply optional modifier to a schema.
 */
export function applyOptional<T extends BuilderInput>(zodStr: T): string {
	return `${asText(zodStr)}.optional()`;
}

/**
 * Apply nullable modifier to a schema.
 */
export function applyNullable(zodStr: BuilderInput): string {
	return `${asText(zodStr)}.nullable()`;
}

/**
 * Apply default value to a schema.
 */
export function applyDefault(zodStr: BuilderInput, defaultValue: any): string {
	return `${asText(zodStr)}.default(${JSON.stringify(defaultValue)})`;
}

/**
 * Apply describe modifier to a schema.
 */
export function applyDescribe(
	zodStr: BuilderInput,
	description: string,
): string {
	return `${asText(zodStr)}.describe(${JSON.stringify(description)})`;
}

/**
 * Apply brand to a schema.
 */
export function applyBrand(zodStr: BuilderInput, brand: string): string {
	return `${asText(zodStr)}.brand(${JSON.stringify(brand)})`;
}

/**
 * Apply readonly modifier to a schema.
 */
export function applyReadonly(zodStr: BuilderInput): string {
	return `${asText(zodStr)}.readonly()`;
}

/**
 * Apply catch modifier with fallback value.
 */
export function applyCatch(zodStr: BuilderInput, fallbackValue: any): string {
	return `${asText(zodStr)}.catch(${JSON.stringify(fallbackValue)})`;
}
