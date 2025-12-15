import { BaseBuilder } from './BaseBuilder.js';

/**
 * Fluent BooleanBuilder: wraps a Zod boolean schema string and provides chainable methods.
 */
export class BooleanBuilder extends BaseBuilder<BooleanBuilder> {
	constructor() {
		super('z.boolean()');
	}
}

/**
 * Build a Zod boolean schema string.
 */
export function buildBoolean(): string {
	return 'z.boolean()';
}
