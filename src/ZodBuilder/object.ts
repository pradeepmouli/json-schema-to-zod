import { BaseBuilder } from './BaseBuilder.js';

/**
 * Fluent ObjectBuilder: wraps a Zod object schema string and provides chainable methods.
 */
export class ObjectBuilder extends BaseBuilder<ObjectBuilder> {
	readonly _properties: Record<string, BaseBuilder<any> | string>;
	private _precomputedSchema?: string; // Store pre-built schema string from fromCode()
	private _strict: boolean = false;
	private _loose: boolean = false;
	private _catchallSchema?: string;
	private _superRefineFn?: string;
	private _andSchema?: string;

	constructor(properties: Record<string, BaseBuilder<any> | string> = {}) {
		super();
		this._properties = properties;
	}

	/**
	 * Create ObjectBuilder from existing Zod object code string.
	 * Used when applying modifiers to already-built object schemas.
	 */
	static fromCode(code: string): ObjectBuilder {
		const builder = new ObjectBuilder({});
		builder._precomputedSchema = code;
		return builder;
	}

	/**
	 * Apply strict mode (no additional properties allowed).
	 */
	strict(): this {
		this._strict = true;
		return this;
	}

	/**
	 * Apply catchall schema for additional properties.
	 */
	catchall(catchallSchemaZod: string): this {
		this._catchallSchema = catchallSchemaZod;
		return this;
	}

	/**
	 * Apply loose mode (allow additional properties). Uses .loose() for Zod v4.
	 */
	loose(): this {
		this._loose = true;
		return this;
	}

	/**
	 * Apply superRefine for pattern properties validation.
	 */
	superRefine(refineFn: string): this {
		this._superRefineFn = refineFn;
		return this;
	}

	/**
	 * Apply and combinator (merge with another schema).
	 */
	and(otherSchemaZod: string): this {
		this._andSchema = otherSchemaZod;
		return this;
	}

	/**
	 * Compute the base object schema with type-specific modifiers.
	 */
	protected override base(): string {
		// Use precomputed schema if available, otherwise build from properties
		let result = this._precomputedSchema ?? buildObject(this._properties);

		// Apply object-specific modifiers
		if (this._strict) {
			result = applyStrict(result);
		}
		if (this._catchallSchema) {
			result = applyCatchall(result, this._catchallSchema);
		}
		if (this._loose) {
			result = applyLoose(result);
		}
		if (this._superRefineFn) {
			result = applySuperRefine(result, this._superRefineFn);
		}
		if (this._andSchema) {
			result = applyAnd(result, this._andSchema);
		}

		return result;
	}
}

/**
 * Build a Zod object schema string from property definitions.
 * Properties can be either BaseBuilder instances or Zod schema strings.
 */
export function buildObject(properties: Record<string, BaseBuilder<any> | string>): string {
	if (Object.keys(properties).length === 0) {
		return 'z.object({})';
	}

	const props = Object.entries(properties)
		.map(([key, val]) => {
			const zodStr = typeof val === 'string' ? val : val.text();
			return `${JSON.stringify(key)}: ${zodStr}`;
		})
		.join(', ');

	return `z.object({ ${props} })`;
}

/**
 * Build a Zod record schema string.
 * Key and value schemas can be either BaseBuilder instances or Zod schema strings.
 */
export function buildRecord(
	keySchemaZod: BaseBuilder<any> | string,
	valueSchemaZod: BaseBuilder<any> | string,
): string {
	const keyStr = typeof keySchemaZod === 'string' ? keySchemaZod : keySchemaZod.text();
	const valueStr = typeof valueSchemaZod === 'string' ? valueSchemaZod : valueSchemaZod.text();
	return `z.record(${keyStr}, ${valueStr})`;
}

/**
 * Apply strict mode (no additional properties allowed).
 */
export function applyStrict(zodStr: string): string {
	return `${zodStr}.strict()`;
}

/**
 * Apply catchall schema for additional properties.
 */
export function applyCatchall(
	zodStr: string,
	catchallSchemaZod: string,
): string {
	return `${zodStr}.catchall(${catchallSchemaZod})`;
}

/**
 * Apply loose mode (allow additional properties).
 * In Zod v4, use .loose() instead of .passthrough().
 */
export function applyLoose(zodStr: string): string {
	return `${zodStr}.loose()`;
}

/**
 * Apply passthrough mode (deprecated; use applyLoose for Zod v4).
 * Kept for backward compatibility with existing code.
 */
export function applyPassthrough(zodStr: string): string {
	return `${zodStr}.passthrough()`;
}

/**
 * Apply superRefine for pattern properties validation.
 */
export function applySuperRefine(zodStr: string, refineFn: string): string {
	return `${zodStr}.superRefine(${refineFn})`;
}

/**
 * Apply and combinator (merge with another schema).
 */
export function applyAnd(zodStr: string, otherSchemaZod: string): string {
	return `${zodStr}.and(${otherSchemaZod})`;
}
