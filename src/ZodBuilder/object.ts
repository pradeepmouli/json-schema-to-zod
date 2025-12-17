import { BaseBuilder } from './BaseBuilder.js';
import { build } from './index.js';

/**
 * Fluent ObjectBuilder: wraps a Zod object schema string and provides chainable methods.
 */
export class ObjectBuilder extends BaseBuilder {
	readonly _properties: Record<string, BaseBuilder>;
	private _precomputedSchema?: string; // Store pre-built schema string from fromCode()
	private _strict: boolean = false;
	private _loose: boolean = false;
	private _catchallSchema?: string;
	private _superRefineFn?: string;
	private _andSchema?: string;

	constructor(properties: Record<string, BaseBuilder> = {}) {
		super();
		this._properties = properties;
	}

	/**
	 * Create ObjectBuilder from existing Zod object code string.
	 * Used when applying modifiers to already-built object schemas.
	 */
	static fromCode(code: string): ObjectBuilder {
		const builder = build.object({});
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

	private _extendSchema?: string;
	private _mergeSchema?: string;
	private _pickKeys?: string[];
	private _omitKeys?: string[];

	/**
	 * Extend the object schema with additional properties.
	 */
	extend(extendSchemaZod: string): this {
		this._extendSchema = extendSchemaZod;
		return this;
	}

	/**
	 * Merge with another object schema.
	 */
	merge(mergeSchemaZod: string): this {
		this._mergeSchema = mergeSchemaZod;
		return this;
	}

	/**
	 * Pick specific keys from the object schema.
	 */
	pick(keys: string[]): this {
		this._pickKeys = keys;
		return this;
	}

	/**
	 * Omit specific keys from the object schema.
	 */
	omit(keys: string[]): this {
		this._omitKeys = keys;
		return this;
	}

	/**
	 * Compute the base object schema.
	 */
	protected override base(): string {
		return (
			this._precomputedSchema ?? objectTextFromProperties(this._properties)
		);
	}

	protected override modify(baseText: string): string {
		let result = baseText;

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
		if (this._extendSchema) {
			result = applyExtend(result, this._extendSchema);
		}
		if (this._mergeSchema) {
			result = applyMerge(result, this._mergeSchema);
		}
		if (this._pickKeys) {
			result = applyPick(result, this._pickKeys);
		}
		if (this._omitKeys) {
			result = applyOmit(result, this._omitKeys);
		}

		return super.modify(result);
	}
}

function objectTextFromProperties(
	properties: Record<string, BaseBuilder>,
): string {
	if (Object.keys(properties).length === 0) {
		return 'z.object({})';
	}

	const props = Object.entries(properties)
		.map(([key, val]) => {
			const zodStr = val.text();
			return `${JSON.stringify(key)}: ${zodStr}`;
		})
		.join(', ');

	return `z.object({ ${props} })`;
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

/**
 * Apply extend to add properties to an object schema.
 */
export function applyExtend(zodStr: string, extendSchemaZod: string): string {
	return `${zodStr}.extend(${extendSchemaZod})`;
}

/**
 * Apply merge to merge with another object schema.
 */
export function applyMerge(zodStr: string, mergeSchemaZod: string): string {
	return `${zodStr}.merge(${mergeSchemaZod})`;
}

/**
 * Apply pick to select specific keys from object schema.
 */
export function applyPick(zodStr: string, keys: string[]): string {
	const keysObj = `{ ${keys.map((k) => `${JSON.stringify(k)}: true`).join(', ')} }`;
	return `${zodStr}.pick(${keysObj})`;
}

/**
 * Apply omit to exclude specific keys from object schema.
 */
export function applyOmit(zodStr: string, keys: string[]): string {
	const keysObj = `{ ${keys.map((k) => `${JSON.stringify(k)}: true`).join(', ')} }`;
	return `${zodStr}.omit(${keysObj})`;
}
