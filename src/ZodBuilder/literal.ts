import { ZodBuilder } from './BaseBuilder.js';
import { Serializable } from '../Types.js';

/**
 * Fluent LiteralBuilder: represents z.literal() schema.
 */
export class LiteralBuilder extends ZodBuilder<'literal'> {
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
