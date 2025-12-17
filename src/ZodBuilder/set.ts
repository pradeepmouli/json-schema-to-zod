import { BaseBuilder } from './BaseBuilder.js';

/**
 * SetBuilder: represents z.set() with optional constraints
 */
export class SetBuilder extends BaseBuilder {
	_itemSchema: BaseBuilder;
	_min?: { value: number; errorMessage?: string } = undefined;
	_max?: { value: number; errorMessage?: string } = undefined;
	_size?: { value: number; errorMessage?: string } = undefined;

	constructor(itemSchema: BaseBuilder) {
		super();
		this._itemSchema = itemSchema;
	}

	/**
	 * Apply minimum size constraint.
	 */
	min(value: number, errorMessage?: string): this {
		this._min = { value, errorMessage };
		return this;
	}

	/**
	 * Apply maximum size constraint.
	 */
	max(value: number, errorMessage?: string): this {
		this._max = { value, errorMessage };
		return this;
	}

	/**
	 * Apply exact size constraint.
	 */
	size(value: number, errorMessage?: string): this {
		this._size = { value, errorMessage };
		return this;
	}

	protected override base(): string {
		return `z.set(${this._itemSchema.text()})`;
	}

	protected override modify(baseText: string): string {
		let result = baseText;

		if (this._min !== undefined) {
			result = applySetMin(result, this._min.value, this._min.errorMessage);
		}
		if (this._max !== undefined) {
			result = applySetMax(result, this._max.value, this._max.errorMessage);
		}
		if (this._size !== undefined) {
			result = applySetSize(result, this._size.value, this._size.errorMessage);
		}

		return super.modify(result);
	}
}

/**
 * Apply minimum size constraint to a set schema.
 */
export function applySetMin(
	zodStr: string,
	value: number,
	errorMessage?: string,
): string {
	return errorMessage
		? `${zodStr}.min(${value}, ${JSON.stringify(errorMessage)})`
		: `${zodStr}.min(${value})`;
}

/**
 * Apply maximum size constraint to a set schema.
 */
export function applySetMax(
	zodStr: string,
	value: number,
	errorMessage?: string,
): string {
	return errorMessage
		? `${zodStr}.max(${value}, ${JSON.stringify(errorMessage)})`
		: `${zodStr}.max(${value})`;
}

/**
 * Apply exact size constraint to a set schema.
 */
export function applySetSize(
	zodStr: string,
	value: number,
	errorMessage?: string,
): string {
	return errorMessage
		? `${zodStr}.size(${value}, ${JSON.stringify(errorMessage)})`
		: `${zodStr}.size(${value})`;
}
