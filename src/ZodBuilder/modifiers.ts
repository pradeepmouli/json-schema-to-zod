/**
 * Generic modifiers that can be applied to any Zod schema.
 */

/**
 * Apply optional modifier to a schema.
 */
export function applyOptional<T extends string>(zodStr: T): `${T}.optional()` {
  return `${zodStr}.optional()`;
}

/**
 * Apply nullable modifier to a schema.
 */
export function applyNullable(zodStr: string): string {
  return `${zodStr}.nullable()`;
}

/**
 * Apply default value to a schema.
 */
export function applyDefault(zodStr: string, defaultValue: any): string {
  return `${zodStr}.default(${JSON.stringify(defaultValue)})`;
}

/**
 * Apply describe modifier to a schema.
 */
export function applyDescribe(zodStr: string, description: string): string {
  return `${zodStr}.describe(${JSON.stringify(description)})`;
}

/**
 * Apply brand to a schema.
 */
export function applyBrand(zodStr: string, brand: string): string {
  return `${zodStr}.brand(${JSON.stringify(brand)})`;
}

/**
 * Apply readonly modifier to a schema.
 */
export function applyReadonly(zodStr: string): string {
  return `${zodStr}.readonly()`;
}

/**
 * Apply catch modifier with fallback value.
 */
export function applyCatch(zodStr: string, fallbackValue: any): string {
  return `${zodStr}.catch(${JSON.stringify(fallbackValue)})`;
}
