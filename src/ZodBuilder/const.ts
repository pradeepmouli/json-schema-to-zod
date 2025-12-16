import { Serializable } from '../Types.js';
import { BaseBuilder } from './BaseBuilder.js';

/**
 * Fluent ConstBuilder: wraps a Zod literal schema string and provides chainable methods.
 */
export class ConstBuilder extends BaseBuilder {
	private readonly _value: Serializable;

	constructor(value: Serializable) {
		super();
		this._value = value;
	}

	protected override base(): string {
		return `z.literal(${JSON.stringify(this._value)})`;
	}
}

/**
 * Build a Zod literal schema string from a const value.
 */
export function buildLiteral(value: Serializable): string {
	return `z.literal(${JSON.stringify(value)})`;
}

/**
 * @deprecated Use buildLiteral instead
 */
export const buildConst = buildLiteral;
