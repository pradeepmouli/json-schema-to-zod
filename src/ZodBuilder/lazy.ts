import { ZodBuilder } from './BaseBuilder.js';

/**
 * LazyBuilder: represents z.lazy(() => schema)
 * Enables recursive schema definitions
 */
export class LazyBuilder extends ZodBuilder<'lazy'> {
	readonly typeKind = 'lazy' as const;
	private readonly _getter: string;

	constructor(getter: string) {
		super();
		this._getter = getter;
	}

	protected override base(): string {
		return `z.lazy(${this._getter})`;
	}
}
