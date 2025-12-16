import { BaseBuilder } from './BaseBuilder.js';

type Buildable = BaseBuilder<any> | string;

const toText = (value: Buildable): string =>
	typeof value === 'string' ? value : value.text();

/**
 * Fluent ObjectBuilder: wraps a Zod object schema string and provides chainable methods.
 */
export class ObjectBuilder extends BaseBuilder<ObjectBuilder> {
	readonly _properties: Record<string, Buildable>;
	constructor(properties: Record<string, Buildable> = {}) {
		super('');
		this._properties = properties;
	}

	/**
	 * Create ObjectBuilder from existing Zod object code string.
	 * Used when applying modifiers to already-built object schemas.
	 */
	static fromCode(code: string): ObjectBuilder {
		const builder = new ObjectBuilder({});
		builder._baseText = code;
		return builder;
	}

	override text(): string {
		if (this._baseText) {
			return super.text();
		}
		this._baseText = buildObject(this._properties);
		return super.text();
	}

	/**
	 * Apply strict mode (no additional properties allowed).
	 */
	strict(): this {
		this._baseText = applyStrict(this._baseText);
		return this;
	}

	/**
	 * Apply catchall schema for additional properties.
	 */
	catchall(catchallSchema: Buildable): this {
		this._baseText = applyCatchall(this._baseText, catchallSchema);
		return this;
	}

	/**
	 * Apply loose mode (allow additional properties). Uses .loose() for Zod v4.
	 */
	loose(): this {
		this._baseText = applyLoose(this._baseText);
		return this;
	}

	/**
	 * Apply superRefine for pattern properties validation.
	 */
	superRefine(refineFn: string): this {
		this._baseText = applySuperRefine(this._baseText, refineFn);
		return this;
	}

	/**
	 * Apply and combinator (merge with another schema).
	 */
	and(otherSchema: Buildable): this {
		this._baseText = applyAnd(this._baseText, otherSchema);
		return this;
	}
}

/**
 * Build a Zod object schema string from property definitions.
 * Properties should already have Zod schema strings as values.
 */
export function buildObject(properties: Record<string, Buildable>): string {
	if (Object.keys(properties).length === 0) {
		return 'z.object({})';
	}

	const props = Object.entries(properties)
		.map(([key, schema]) => `${JSON.stringify(key)}: ${toText(schema)}`)
		.join(', ');

	return `z.object({ ${props} })`;
}

/**
 * Build a Zod record schema string.
 */
export function buildRecord(
	keySchema: Buildable,
	valueSchema: Buildable,
): string {
	return `z.record(${toText(keySchema)}, ${toText(valueSchema)})`;
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
	catchallSchema: Buildable,
): string {
	return `${zodStr}.catchall(${toText(catchallSchema)})`;
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
export function applyAnd(zodStr: string, otherSchema: Buildable): string {
	return `${zodStr}.and(${toText(otherSchema)})`;
}
