import { ZodBuilder } from './BaseBuilder.js';

/**
 * Fluent NullBuilder: wraps a Zod null schema string and provides chainable methods.
 */
export class NullBuilder extends ZodBuilder<'null'> {
	readonly typeKind = 'null' as const;

	constructor() {
		super();
	}

	protected override base(): string {
		return 'z.null()';
	}
}
