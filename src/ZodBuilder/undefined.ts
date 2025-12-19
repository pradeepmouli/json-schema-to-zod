import { ZodBuilder } from './BaseBuilder.js';

/**
 * UndefinedBuilder: represents z.undefined()
 */
export class UndefinedBuilder extends ZodBuilder<'undefined'> {
	readonly typeKind = 'undefined' as const;

	protected override base(): string {
		return 'z.undefined()';
	}
}
