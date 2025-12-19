import { ZodBuilder } from './BaseBuilder.js';

/**
 * DateBuilder: represents z.date() with optional constraints
 */
export class DateBuilder extends ZodBuilder<'date'> {
	readonly typeKind = 'date' as const;
	_min?: { value: Date; errorMessage?: string } = undefined;
	_max?: { value: Date; errorMessage?: string } = undefined;

	/**
	 * Apply minimum date constraint.
	 */
	min(value: Date, errorMessage?: string): this {
		this._min = { value, errorMessage };
		return this;
	}

	/**
	 * Apply maximum date constraint.
	 */
	max(value: Date, errorMessage?: string): this {
		this._max = { value, errorMessage };
		return this;
	}

	protected override base(): string {
		return 'z.date()';
	}

	protected override modify(baseText: string): string {
		let result = baseText;

		if (this._min !== undefined) {
			result = applyDateMin(result, this._min.value, this._min.errorMessage);
		}
		if (this._max !== undefined) {
			result = applyDateMax(result, this._max.value, this._max.errorMessage);
		}

		return super.modify(result);
	}
}

/**
 * Apply minimum date constraint to a date schema.
 */
export function applyDateMin(
	zodStr: string,
	value: Date,
	errorMessage?: string,
): string {
	const dateStr = `new Date(${JSON.stringify(value.toISOString())})`;
	return errorMessage
		? `${zodStr}.min(${dateStr}, ${JSON.stringify(errorMessage)})`
		: `${zodStr}.min(${dateStr})`;
}

/**
 * Apply maximum date constraint to a date schema.
 */
export function applyDateMax(
	zodStr: string,
	value: Date,
	errorMessage?: string,
): string {
	const dateStr = `new Date(${JSON.stringify(value.toISOString())})`;
	return errorMessage
		? `${zodStr}.max(${dateStr}, ${JSON.stringify(errorMessage)})`
		: `${zodStr}.max(${dateStr})`;
}
