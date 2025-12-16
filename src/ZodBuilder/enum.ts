import { Serializable } from '../Types.js';
import { BaseBuilder } from './BaseBuilder.js';

/**
 * Fluent EnumBuilder: wraps a Zod enum schema string and provides chainable methods.
 */
export class EnumBuilder extends BaseBuilder {
	private readonly _values: Serializable[];

	constructor(values: Serializable[]) {
		super();
		this._values = values;
	}

	protected override base(): string {
		if (this._values.length === 0) {
			return 'z.never()';
		} else if (this._values.length === 1) {
			return `z.literal(${JSON.stringify(this._values[0])})`;
		} else if (this._values.every((x) => typeof x === 'string')) {
			// All strings - use z.enum()
			return `z.enum([${this._values.map((x) => JSON.stringify(x))}])`;
		} else {
			// Mixed types - use union of literals
			const literals = this._values.map(
				(val) => `z.literal(${JSON.stringify(val)})`,
			);
			return `z.union([${literals.join(', ')}])`;
		}
	}
}

/**
 * Build a Zod enum schema string from an array of enum values.
 * Handles empty enums, single literals, string enums, and mixed-type unions.
 */
export function buildEnum(values: Serializable[]): string {
	if (values.length === 0) {
		return 'z.never()';
	} else if (values.length === 1) {
		// union does not work when there is only one element
		return `z.literal(${JSON.stringify(values[0])})`;
	} else if (values.every((x) => typeof x === 'string')) {
		return `z.enum([${values.map((x) => JSON.stringify(x))}])`;
	} else {
		return `z.union([${values.map((x) => `z.literal(${JSON.stringify(x)})`).join(', ')}])`;
	}
}
