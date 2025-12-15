import { Serializable } from '../Types.js';
import { BaseBuilder } from './BaseBuilder.js';

/**
 * Fluent EnumBuilder: wraps a Zod enum schema string and provides chainable methods.
 */
export class EnumBuilder extends BaseBuilder<EnumBuilder> {
	constructor(values: Serializable[]) {
		let code: string;
		if (values.length === 0) {
			code = 'z.never()';
		} else if (values.length === 1) {
			code = `z.literal(${JSON.stringify(values[0])})`;
		} else if (values.every((x) => typeof x === 'string')) {
			// All strings - use z.enum()
			code = `z.enum([${values.map((x) => JSON.stringify(x))}])`;
		} else {
			// Mixed types - use union of literals
			const literals = values.map((val) => `z.literal(${JSON.stringify(val)})`);
			code = `z.union([${literals.join(', ')}])`;
		}
		super(code);
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
