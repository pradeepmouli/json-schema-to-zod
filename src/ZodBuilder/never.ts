import { ZodBuilder } from './BaseBuilder.js';

/**
 * Fluent NeverBuilder: represents z.never() schema.
 */
export class NeverBuilder extends ZodBuilder<'never'> {
	readonly typeKind = 'never' as const;

	constructor(options?: import('../Types.js').Options) {
		super(options);
	}

	protected override base(): string {
		return 'z.never()';
	}
}
