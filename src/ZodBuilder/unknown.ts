import { BaseBuilder } from './BaseBuilder.js';

/**
 * Fluent UnknownBuilder: represents z.unknown() schema.
 */
export class UnknownBuilder extends BaseBuilder {
	constructor() {
		super();
	}

	protected override base(): string {
		return 'z.unknown()';
	}
}
