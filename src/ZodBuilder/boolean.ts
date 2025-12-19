import { ZodBuilder } from './BaseBuilder.js';

/**
 * Fluent BooleanBuilder: wraps a Zod boolean schema string and provides chainable methods.
 */
export class BooleanBuilder extends ZodBuilder<'boolean'> {
	readonly typeKind = 'boolean' as const;
	constructor() {
		super();
	}

	protected override base(): string {
		return 'z.boolean()';
	}
}
