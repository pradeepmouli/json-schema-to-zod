import { BaseBuilder } from './BaseBuilder.js';

/**
 * NaNBuilder: represents z.nan()
 */
export class NaNBuilder extends BaseBuilder {
	protected override base(): string {
		return 'z.nan()';
	}
}
