import { BaseBuilder } from './BaseBuilder.js';

/**
 * Fluent NumberBuilder: wraps a Zod number schema string and provides chainable methods
 * that delegate to the existing apply* functions.
 */
export class NumberBuilder extends BaseBuilder<NumberBuilder> {
	_int: boolean | { errorMessage: string } = false;
	_multipleOf: number | { value: number; errorMessage?: string } | undefined =
		undefined;

	_min:
		| { value: number; exclusive: boolean; errorMessage?: string }
		| undefined = undefined;

	_max:
		| { value: number; exclusive: boolean; errorMessage?: string }
		| undefined = undefined;

	constructor() {
		super('z.number()');
	}

	/**
	 * Apply integer constraint.
	 */
	int(errorMessage?: string): this {
		if (this._int === false) {
			this._int = errorMessage ? { errorMessage } : true;
		}
		return this;
	}

	/**
	 * Apply multipleOf constraint.
	 */
	multipleOf(value: number, errorMessage?: string): this {
		this._multipleOf = { value, errorMessage };
		if (this._int === false) {
			this._int = true;
		}
		return this;
	}

	/**
	 * Apply minimum constraint (gte by default).
	 */
	min(value: number, exclusive: boolean = false, errorMessage?: string): this {
		if (
			this._min === undefined ||
			this._min.value > value ||
			(this._min.value === value && this._min.exclusive && !exclusive)
		) {
			this._min = { value, exclusive, errorMessage };
		}
		return this;
	}

	/**
	 * Apply maximum constraint (lte by default).
	 */
	max(value: number, exclusive: boolean = false, errorMessage?: string): this {
		if (
			this._max === undefined ||
			this._max.value < value ||
			(this._max.value === value && this._max.exclusive && !exclusive)
		)
			this._max = { value, exclusive, errorMessage };

		return this;
	}

	/**
	 * Apply optional constraint.
	 */

	/**
	 * Apply nullable constraint.
	 */

	/**
	 * Apply default value.
	 */

	/**
	 * Apply describe modifier.
	 */

	/**
	 * Unwrap and return the final Zod code string.
	 */
	text(): string {
		let result = this._baseText;
		if (this._int !== false) {
			if (typeof this._int === 'object') {
				result = applyInt(result, this._int.errorMessage);
			} else {
				result = applyInt(result);
			}
		}
		if (this._multipleOf !== undefined) {
			if (typeof this._multipleOf === 'number') {
				result = applyMultipleOf(result, this._multipleOf);
			} else
				result = applyMultipleOf(
					result,
					this._multipleOf.value,
					this._multipleOf.errorMessage,
				);
		}
		if (this._min !== undefined) {
			result = applyMin(
				result,
				this._min.value,
				this._min.exclusive,
				this._min.errorMessage,
			);
		}
		if (this._max !== undefined) {
			result = applyMax(
				result,
				this._max.value,
				this._max.exclusive,
				this._max.errorMessage,
			);
		}
		this._baseText = result;
		return super.text();
	}
}

/**
 * Build a base Zod number schema string.
 */
export function buildNumber(): string {
	return 'z.number()';
}

/**
 * Apply integer constraint to a number schema.
 */
export function applyInt(zodStr: string, errorMessage?: string): string {
	if (errorMessage) {
		return `${zodStr}.int(${JSON.stringify(errorMessage)})`;
	}
	return `${zodStr}.int()`;
}

/**
 * Apply multipleOf constraint to a number schema.
 */
export function applyMultipleOf(
	zodStr: string,
	value: number,
	errorMessage?: string,
): string {
	// Special case: multipleOf 1 is equivalent to int
	if (value === 1) {
		// Avoid duplicate .int() if already present
		if (zodStr.includes('.int(')) {
			return zodStr;
		}
		return applyInt(zodStr, errorMessage);
	}

	if (errorMessage) {
		return `${zodStr}.multipleOf(${JSON.stringify(value)}, ${JSON.stringify(errorMessage)})`;
	}
	return `${zodStr}.multipleOf(${JSON.stringify(value)})`;
}

/**
 * Apply minimum constraint to a number schema.
 */
export function applyMin(
	zodStr: string,
	value: number,
	exclusive: boolean,
	errorMessage?: string,
): string {
	const method = exclusive ? 'gt' : 'gte';
	if (errorMessage) {
		return `${zodStr}.${method}(${JSON.stringify(value)}, ${JSON.stringify(errorMessage)})`;
	}
	return `${zodStr}.${method}(${JSON.stringify(value)})`;
}

/**
 * Apply maximum constraint to a number schema.
 */
export function applyMax(
	zodStr: string,
	value: number,
	exclusive: boolean,
	errorMessage?: string,
): string {
	const method = exclusive ? 'lt' : 'lte';
	if (errorMessage) {
		return `${zodStr}.${method}(${JSON.stringify(value)}, ${JSON.stringify(errorMessage)})`;
	}
	return `${zodStr}.${method}(${JSON.stringify(value)})`;
}
