import { BaseBuilder } from './BaseBuilder.js';

/**
 * UndefinedBuilder: represents z.undefined()
 */
export class UndefinedBuilder extends BaseBuilder {
	constructor() {
		super();
	}

	protected override base(): string {
		return 'z.undefined()';
	}
}
