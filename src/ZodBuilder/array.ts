import { BaseBuilder } from './BaseBuilder.js';

/**
 * Fluent ArrayBuilder: wraps a Zod array schema string and provides chainable methods.
 */
export class ArrayBuilder extends BaseBuilder<ArrayBuilder> {
	_minItems?: { value: number; errorMessage?: string } = undefined;
	_maxItems?: { value: number; errorMessage?: string } = undefined;

	constructor(itemSchemaZod: BaseBuilder<any> | string) {
		const itemStr = typeof itemSchemaZod === 'string' ? itemSchemaZod : itemSchemaZod.text();
		super(`z.array(${itemStr})`);
	}

	/**
	 * Apply minItems constraint.
	 */
	min(value: number, errorMessage?: string): this {
		if (this._minItems === undefined || this._minItems.value > value) {
			this._minItems = { value, errorMessage };
		}
		return this;
	}

	/**
	 * Apply maxItems constraint.
	 */
	max(value: number, errorMessage?: string): this {
		if (this._maxItems === undefined || this._maxItems.value < value) {
			this._maxItems = { value, errorMessage };
		}
		return this;
	}

	/**
	 * Unwrap and return the final Zod code string.
	 */
	text(): string {
		let result = this._baseText;

		if (this._minItems !== undefined) {
			result = applyMinItems(
				result,
				this._minItems.value,
				this._minItems.errorMessage,
			);
		}
		if (this._maxItems !== undefined) {
			result = applyMaxItems(
				result,
				this._maxItems.value,
				this._maxItems.errorMessage,
			);
		}

		this._baseText = result;
		return super.text();
	}
}

/**
 * Build a Zod array schema string from an item schema.
 * Item schema can be either a BaseBuilder instance or a Zod schema string.
 */
export function buildArray(itemSchemaZod: BaseBuilder<any> | string): string {
	const itemStr = typeof itemSchemaZod === 'string' ? itemSchemaZod : itemSchemaZod.text();
	return `z.array(${itemStr})`;
}

/**
 * Build a Zod tuple schema string from item schemas.
 * Item schemas can be either BaseBuilder instances or Zod schema strings.
 */
export function buildTuple(itemSchemasZod: (BaseBuilder<any> | string)[]): string {
	const itemStrs = itemSchemasZod.map(item => 
		typeof item === 'string' ? item : item.text()
	);
	return `z.tuple([${itemStrs.join(',')}])`; // No space after comma
}

/**
 * Apply minItems constraint to an array schema.
 */
export function applyMinItems(
	zodStr: string,
	value: number,
	errorMessage?: string,
): string {
	return errorMessage
		? `${zodStr}.min(${JSON.stringify(value)}, ${JSON.stringify(errorMessage)})`
		: `${zodStr}.min(${JSON.stringify(value)})`;
}

/**
 * Apply maxItems constraint to an array schema.
 */
export function applyMaxItems(
	zodStr: string,
	value: number,
	errorMessage?: string,
): string {
	return errorMessage
		? `${zodStr}.max(${JSON.stringify(value)}, ${JSON.stringify(errorMessage)})`
		: `${zodStr}.max(${JSON.stringify(value)})`;
}
