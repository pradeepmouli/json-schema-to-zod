import { BaseBuilder } from './BaseBuilder.js';

/**
 * NaNBuilder: represents z.nan()
 */
export class NaNBuilder extends BaseBuilder {
	constructor() {
		super();
	}

	protected override base(): string {
		return 'z.nan()';
	}
}
