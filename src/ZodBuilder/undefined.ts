import { BaseBuilder } from './BaseBuilder.js';

/**
 * UndefinedBuilder: represents z.undefined()
 */
export class UndefinedBuilder extends BaseBuilder {
	protected override base(): string {
		return 'z.undefined()';
	}
}
