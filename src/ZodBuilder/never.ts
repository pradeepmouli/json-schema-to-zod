import { BaseBuilder } from './BaseBuilder.js';

/**
 * Fluent NeverBuilder: represents z.never() schema.
 */
export class NeverBuilder extends BaseBuilder {
	constructor() {
		super();
	}

	protected override base(): string {
		return 'z.never()';
	}
}

/**
 * Build a Zod never schema string.
 */
export function buildNever(): string {
	return 'z.never()';
}
