import { ZodBuilder } from './BaseBuilder.js';

/**
 * Fluent ArrayBuilder: wraps a Zod array schema string and provides chainable methods.
 *
 * NONEMPTY() TYPE INFERENCE - Version Notes:
 * Both Zod v3 and v4 support .nonempty() with identical validation behavior.
 * However, type inference differs:
 * - .nonempty() infers [T, ...T[]] (tuple-like with at least one element)
 * - .min(1) infers T[] (regular array)
 *
 * Implementation: ArrayBuilder uses .min(1) instead of .nonempty() for:
 * 1. Consistency across versions
 * 2. Clarity in error messages
 * 3. Alignment with JSON Schema constraints (which don't express tuple constraints)
 *
 * The validation is functionally identical in both v3 and v4.
 * See ARRAY-NONEMPTY-NOTES.md for details.
 */
export class ArrayBuilder extends ZodBuilder<'array'> {
	readonly typeKind = 'array' as const;
	private readonly _itemSchema: ZodBuilder | ZodBuilder[];
	_minItems?: { value: number; errorMessage?: string } = undefined;
	_maxItems?: { value: number; errorMessage?: string } = undefined;

	constructor(
		itemSchema: ZodBuilder | ZodBuilder[],
		options?: import('../Types.js').Options,
	) {
		super(options);
		this._itemSchema = itemSchema;
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
	 * Compute the base array schema.
	 */
	protected override base(): string {
		if (Array.isArray(this._itemSchema)) {
			const itemStrs = this._itemSchema.map((item) => item.text());
			return `z.tuple([${itemStrs.join(',')}])`; // No space after comma
		}

		const itemStr = this._itemSchema.text();
		return `z.array(${itemStr})`;
	}

	protected override modify(baseText: string): string {
		let result = baseText;

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

		return super.modify(result);
	}
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
