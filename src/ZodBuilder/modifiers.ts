/**
 * Generic modifiers that can be applied to any Zod schema.
 */

type Buildable = string | { text(): string };

const toText = (schema: Buildable): string =>
	typeof schema === 'string' ? schema : schema.text();

/**
 * Apply optional modifier to a schema.
 */
export function applyOptional(zod: Buildable): string {
	const base = toText(zod);
	return `${base}.optional()`;
}

/**
 * Apply nullable modifier to a schema.
 */
export function applyNullable(zod: Buildable): string {
	return `${toText(zod)}.nullable()`;
}

/**
 * Apply default value to a schema.
 */
export function applyDefault(zod: Buildable, defaultValue: any): string {
	return `${toText(zod)}.default(${JSON.stringify(defaultValue)})`;
}

/**
 * Apply describe modifier to a schema.
 */
export function applyDescribe(zod: Buildable, description: string): string {
	return `${toText(zod)}.describe(${JSON.stringify(description)})`;
}

/**
 * Apply brand to a schema.
 */
export function applyBrand(zod: Buildable, brand: string): string {
	return `${toText(zod)}.brand(${JSON.stringify(brand)})`;
}

/**
 * Apply readonly modifier to a schema.
 */
export function applyReadonly(zod: Buildable): string {
	return `${toText(zod)}.readonly()`;
}

/**
 * Apply catch modifier with fallback value.
 */
export function applyCatch(zod: Buildable, fallbackValue: any): string {
	return `${toText(zod)}.catch(${JSON.stringify(fallbackValue)})`;
}
