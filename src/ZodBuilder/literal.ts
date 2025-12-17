import { BaseBuilder } from './BaseBuilder.js';
import { Serializable } from '../Types.js';

/**
 * Fluent LiteralBuilder: represents z.literal() schema.
 */
export class LiteralBuilder extends BaseBuilder {
	private readonly _value: Serializable;

	constructor(value: Serializable) {
		super();
		this._value = value;
	}

	protected override base(): string {
		return `z.literal(${JSON.stringify(this._value)})`;
	}
}
