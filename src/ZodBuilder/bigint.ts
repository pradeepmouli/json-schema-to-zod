import { BaseBuilder } from './BaseBuilder.js';

/**
 * BigIntBuilder: represents z.bigint() with optional constraints
 */
export class BigIntBuilder extends BaseBuilder {
	_min?:
		| { value: bigint; exclusive: boolean; errorMessage?: string }
		| undefined = undefined;

	_max?:
		| { value: bigint; exclusive: boolean; errorMessage?: string }
		| undefined = undefined;

	_multipleOf?: { value: bigint; errorMessage?: string } | undefined =
		undefined;

	constructor() {
		super();
	}

	/**
	 * Apply minimum constraint (gte by default).
	 */
	min(
		value: bigint,
		exclusive: boolean = false,
		errorMessage?: string,
	): this {
		this._min = { value, exclusive, errorMessage };
		return this;
	}

	/**
	 * Apply maximum constraint (lte by default).
	 */
	max(
		value: bigint,
		exclusive: boolean = false,
		errorMessage?: string,
	): this {
		this._max = { value, exclusive, errorMessage };
		return this;
	}

	/**
	 * Apply multipleOf constraint.
	 */
	multipleOf(value: bigint, errorMessage?: string): this {
		this._multipleOf = { value, errorMessage };
		return this;
	}

	protected override base(): string {
		return 'z.bigint()';
	}

	protected override modify(baseText: string): string {
		let result = baseText;

		if (this._min !== undefined) {
			result = applyBigIntMin(
				result,
				this._min.value,
				this._min.exclusive,
				this._min.errorMessage,
			);
		}
		if (this._max !== undefined) {
			result = applyBigIntMax(
				result,
				this._max.value,
				this._max.exclusive,
				this._max.errorMessage,
			);
		}
		if (this._multipleOf !== undefined) {
			result = applyBigIntMultipleOf(
				result,
				this._multipleOf.value,
				this._multipleOf.errorMessage,
			);
		}

		return super.modify(result);
	}
}

/**
 * Apply minimum constraint to a bigint schema.
 */
export function applyBigIntMin(
	zodStr: string,
	value: bigint,
	exclusive: boolean,
	errorMessage?: string,
): string {
	const method = exclusive ? 'gt' : 'gte';
	const valueStr = `${value}n`;
	return errorMessage
		? `${zodStr}.${method}(${valueStr}, ${JSON.stringify(errorMessage)})`
		: `${zodStr}.${method}(${valueStr})`;
}

/**
 * Apply maximum constraint to a bigint schema.
 */
export function applyBigIntMax(
	zodStr: string,
	value: bigint,
	exclusive: boolean,
	errorMessage?: string,
): string {
	const method = exclusive ? 'lt' : 'lte';
	const valueStr = `${value}n`;
	return errorMessage
		? `${zodStr}.${method}(${valueStr}, ${JSON.stringify(errorMessage)})`
		: `${zodStr}.${method}(${valueStr})`;
}

/**
 * Apply multipleOf constraint to a bigint schema.
 */
export function applyBigIntMultipleOf(
	zodStr: string,
	value: bigint,
	errorMessage?: string,
): string {
	const valueStr = `${value}n`;
	return errorMessage
		? `${zodStr}.multipleOf(${valueStr}, ${JSON.stringify(errorMessage)})`
		: `${zodStr}.multipleOf(${valueStr})`;
}
