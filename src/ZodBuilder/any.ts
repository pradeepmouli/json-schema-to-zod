import { BaseBuilder } from './BaseBuilder.js';

/**
 * Fluent AnyBuilder: represents z.any() schema.
 */
export class AnyBuilder extends BaseBuilder {
	constructor() {
		super();
	}

	protected override base(): string {
		return 'z.any()';
	}
}
