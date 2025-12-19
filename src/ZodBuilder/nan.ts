import { ZodBuilder } from './BaseBuilder.js';

/**
 * NaNBuilder: represents z.nan()
 */
export class NaNBuilder extends ZodBuilder<'nan'> {
	readonly typeKind = 'nan' as const;

	protected override base(): string {
		return 'z.nan()';
	}
}
