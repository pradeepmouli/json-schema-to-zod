/**
 * Generic modifiers that can be applied to any Zod schema.
 */

function asText(input: string): string {
	return input;
}

/**
 * Apply optional modifier to a schema.
 */
export function applyOptional(zodStr: string): string {
	return `${asText(zodStr)}.optional()`;
}

/**
 * Apply nullable modifier to a schema.
 */
export function applyNullable(zodStr: string): string {
	return `${asText(zodStr)}.nullable()`;
}

/**
 * Apply default value to a schema.
 */
export function applyDefault(zodStr: string, defaultValue: any): string {
	return `${asText(zodStr)}.default(${JSON.stringify(defaultValue)})`;
}

/**
 * Apply describe modifier to a schema.
 */
export function applyDescribe(zodStr: string, description: string): string {
	return `${asText(zodStr)}.describe(${JSON.stringify(description)})`;
}

/**
 * Apply brand to a schema.
 */
export function applyBrand(zodStr: string, brand: string): string {
	return `${asText(zodStr)}.brand(${JSON.stringify(brand)})`;
}

/**
 * Apply readonly modifier to a schema.
 */
export function applyReadonly(zodStr: string): string {
	return `${asText(zodStr)}.readonly()`;
}

/**
 * Apply refine modifier.
 */
export function applyRefine(
	zodStr: string,
	refineFn: string,
	message?: string,
): string {
	return message
		? `${asText(zodStr)}.refine(${refineFn}, ${JSON.stringify(message)})`
		: `${asText(zodStr)}.refine(${refineFn})`;
}

/**
 * Apply superRefine modifier.
 */
export function applySuperRefine(zodStr: string, refineFn: string): string {
	return `${asText(zodStr)}.superRefine(${refineFn})`;
}

/**
 * Apply catch modifier with fallback value.
 */
export function applyCatch(zodStr: string, fallbackValue: any): string {
	return `${asText(zodStr)}.catch(${JSON.stringify(fallbackValue)})`;
}
