import { ZodBuilder } from './BaseBuilder.js';

/**
 * Fluent AnyBuilder: represents z.any() schema.
 */
export class AnyBuilder extends ZodBuilder<'any'> {
	readonly typeKind = 'any' as const;
	constructor() {
		super();
	}

	protected override base(): string {
		return 'z.any()';
	}
}
