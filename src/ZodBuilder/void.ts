import { ZodBuilder } from './BaseBuilder.js';

/**
 * VoidBuilder: represents z.void()
 */
export class VoidBuilder extends ZodBuilder {
	protected override base(): string {
		return 'z.void()';
	}
}
