import { BaseBuilder } from './BaseBuilder.js';

/**
 * Fluent NullBuilder: wraps a Zod null schema string and provides chainable methods.
 */
export class NullBuilder extends BaseBuilder<NullBuilder> {
	constructor() {
		super();
	}

	protected override base(): string {
		return 'z.null()';
	}
}

/**
 * Build a Zod null schema string.
 */
export function buildNull(): string {
	return 'z.null()';
}
