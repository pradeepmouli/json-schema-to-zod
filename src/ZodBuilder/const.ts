import { Serializable } from '../Types.js';
import { ZodBuilder } from './BaseBuilder.js';

/**
 * Fluent ConstBuilder: wraps a Zod literal schema string and provides chainable methods.
 */
export class ConstBuilder extends ZodBuilder<'literal'> {
	readonly typeKind = 'literal' as const;
	private readonly _value: Serializable;

	constructor(value: Serializable) {
		super();
		this._value = value;
	}

	protected override base(): string {
		return `z.literal(${JSON.stringify(this._value)})`;
	}
}
