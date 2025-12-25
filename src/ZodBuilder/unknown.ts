import { ZodBuilder } from './BaseBuilder.js';

/**
 * Fluent UnknownBuilder: represents z.unknown() schema.
 */
export class UnknownBuilder extends ZodBuilder<'unknown'> {
	readonly typeKind = 'unknown' as const;

	constructor(options?: import('../Types.js').Options) {
		super(options);
	}

	protected override base(): string {
		return 'z.unknown()';
	}
}
