import { BaseBuilder } from './BaseBuilder.js';

/**
 * MapBuilder: represents z.map() with optional constraints
 */
export class MapBuilder extends BaseBuilder {
	_keySchema: BaseBuilder;
	_valueSchema: BaseBuilder;
	_min?: { value: number; errorMessage?: string } = undefined;
	_max?: { value: number; errorMessage?: string } = undefined;
	_size?: { value: number; errorMessage?: string } = undefined;

	constructor(keySchema: BaseBuilder, valueSchema: BaseBuilder) {
		super();
		this._keySchema = keySchema;
		this._valueSchema = valueSchema;
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
		return `z.map(${this._keySchema.text()}, ${this._valueSchema.text()})`;
	}

	protected override modify(baseText: string): string {
		let result = baseText;

		if (this._min !== undefined) {
			result = applyMapMin(result, this._min.value, this._min.errorMessage);
		}
		if (this._max !== undefined) {
			result = applyMapMax(result, this._max.value, this._max.errorMessage);
		}
		if (this._size !== undefined) {
			result = applyMapSize(result, this._size.value, this._size.errorMessage);
		}

		return super.modify(result);
	}
}

/**
 * Apply minimum size constraint to a map schema.
 */
export function applyMapMin(
	zodStr: string,
	value: number,
	errorMessage?: string,
): string {
	return errorMessage
		? `${zodStr}.min(${JSON.stringify(value)}, ${JSON.stringify(errorMessage)})`
		: `${zodStr}.min(${JSON.stringify(value)})`;
}

/**
 * Apply maximum size constraint to a map schema.
 */
export function applyMapMax(
	zodStr: string,
	value: number,
	errorMessage?: string,
): string {
	return errorMessage
		? `${zodStr}.max(${JSON.stringify(value)}, ${JSON.stringify(errorMessage)})`
		: `${zodStr}.max(${JSON.stringify(value)})`;
}

/**
 * Apply exact size constraint to a map schema.
 */
export function applyMapSize(
	zodStr: string,
	value: number,
	errorMessage?: string,
): string {
	return errorMessage
		? `${zodStr}.size(${JSON.stringify(value)}, ${JSON.stringify(errorMessage)})`
		: `${zodStr}.size(${JSON.stringify(value)})`;
}
