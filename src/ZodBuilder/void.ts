import { BaseBuilder } from './BaseBuilder.js';

/**
 * VoidBuilder: represents z.void()
 */
export class VoidBuilder extends BaseBuilder {
	constructor() {
		super();
	}

	protected override base(): string {
		return 'z.void()';
	}
}
