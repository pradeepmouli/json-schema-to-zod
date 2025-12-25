import { ZodBuilder, applySuperRefine } from './BaseBuilder.js';
import { build } from './index.js';

/**
 * Fluent ObjectBuilder: wraps a Zod object schema string and provides chainable methods.
 */
export class ObjectBuilder extends ZodBuilder<'object'> {
	readonly typeKind = 'object' as const;
	readonly _properties: Record<string, ZodBuilder>;
	private _precomputedSchema?: string; // Store pre-built schema string from fromCode()
	private _strict: boolean = false;
	private _loose: boolean = false;
	private _catchallSchema?: string;
	private _superRefineFn?: string;
	private _andSchema?: ZodBuilder;
	private _extendSchema?: ObjectBuilder | string;
	private _mergeSchema?: ObjectBuilder | string;
	private _pickKeys?: string[];
	private _omitKeys?: string[];

	constructor(properties: Record<string, ZodBuilder> = {}, options?: import('../Types.js').Options) {
		super(options);
		this._properties = properties;
	}

	/**
	 * Create ObjectBuilder from existing Zod object code string.
	 * Used when applying modifiers to already-built object schemas.
	 */
	static fromCode(code: string, options?: import('../Types.js').Options): ObjectBuilder {
		const builder = build.object({}, options);
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
	and(otherSchemaZod: ZodBuilder): this {
		this._andSchema = otherSchemaZod;
		return this;
	}

	/**
	 * Extend the object schema with additional properties.
	 */
	extend(extendSchemaZod: ObjectBuilder | string): this {
		this._extendSchema = extendSchemaZod;
		return this;
	}

	/**
	 * Merge with another object schema.
	 */
	merge(mergeSchemaZod: ObjectBuilder | string): this {
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
		if (this._precomputedSchema) {
			return this._precomputedSchema;
		}
		
		// In v4, use strictObject/looseObject if strict/loose is set AND no precomputed schema
		// This only applies when building fresh from properties
		if (this.isV4() && !this._catchallSchema && !this._andSchema && !this._extendSchema && !this._mergeSchema && !this._pickKeys && !this._omitKeys && !this._superRefineFn) {
			if (this._strict) {
				return objectTextFromProperties(this._properties, 'strict');
			}
			if (this._loose) {
				return objectTextFromProperties(this._properties, 'loose');
			}
		}
		
		return objectTextFromProperties(this._properties);
	}

	protected override modify(baseText: string): string {
		let result = baseText;

		// Apply strict/loose as methods in v3 mode OR when modifying precomputed schema in v4
		// (precomputed schemas from fromCode can't use strictObject/looseObject at base level)
		const useMethodForm = !this.isV4() || this._precomputedSchema;
		
		if (this._strict && useMethodForm) {
			result = applyStrict(result);
		}
		
		if (this._catchallSchema) {
			result = applyCatchall(result, this._catchallSchema);
		}
		
		if (this._loose && useMethodForm) {
			result = applyLoose(result);
		}
		
		if (this._superRefineFn) {
			result = applySuperRefine(result, this._superRefineFn);
		}
		if (this._andSchema) {
			result = applyAnd(result, this._andSchema);
		}
		if (this._extendSchema) {
			result = applyExtend(
				result,
				typeof this._extendSchema === 'string'
					? this._extendSchema
					: this._extendSchema.text(),
			);
		}
		if (this._mergeSchema) {
			// In v4, merge becomes extend
			if (this.isV4()) {
				result = applyExtend(
					result,
					typeof this._mergeSchema === 'string'
						? this._mergeSchema
						: this._mergeSchema.text(),
				);
			} else {
				result = applyMerge(
					result,
					typeof this._mergeSchema === 'string'
						? this._mergeSchema
						: this._mergeSchema.text(),
				);
			}
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
	properties: Record<string, ZodBuilder>,
	mode?: 'strict' | 'loose',
): string {
	if (Object.keys(properties).length === 0) {
		if (mode === 'strict') {
			return 'z.strictObject({})';
		} else if (mode === 'loose') {
			return 'z.looseObject({})';
		}
		return 'z.object({})';
	}

	const props = Object.entries(properties)
		.map(([key, val]) => {
			const zodStr = val.text();
			return `${JSON.stringify(key)}: ${zodStr}`;
		})
		.join(', ');

	if (mode === 'strict') {
		return `z.strictObject({ ${props} })`;
	} else if (mode === 'loose') {
		return `z.looseObject({ ${props} })`;
	}
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
 * Apply and combinator (merge with another schema).
 */
export function applyAnd(zodStr: string, otherSchemaZod: ZodBuilder): string {
	return `${zodStr}.and(${otherSchemaZod.text()})`;
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
