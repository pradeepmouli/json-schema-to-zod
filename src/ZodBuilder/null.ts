import { ZodBuilder } from './BaseBuilder.js';

/**
 * Fluent NullBuilder: wraps a Zod null schema string and provides chainable methods.
 */
export class NullBuilder extends ZodBuilder<'null'> {
	readonly typeKind = 'null' as const;

	constructor(options?: import('../Types.js').Options) {
		super(options);
	}

	protected override base(): string {
		return 'z.null()';
	}
}
