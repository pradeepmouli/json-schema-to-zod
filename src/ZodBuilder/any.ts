import { ZodBuilder } from './BaseBuilder.js';

/**
 * Fluent AnyBuilder: represents z.any() schema.
 */
export class AnyBuilder extends ZodBuilder<'any'> {
	readonly typeKind = 'any' as const;
	constructor(options?: import('../Types.js').Options) {
		super(options);
	}

	protected override base(): string {
		return 'z.any()';
	}
}
