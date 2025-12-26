import { ZodBuilder } from './BaseBuilder.js';

/**
 * LazyBuilder: represents z.lazy(() => schema)
 * Enables recursive schema definitions
 */
export class LazyBuilder extends ZodBuilder<'lazy'> {
	readonly typeKind = 'lazy' as const;
	private readonly _input: ZodBuilder;

	constructor(input: ZodBuilder, options?: import('../Types.js').Options) {
		super(options);
		this._input = input;
	}

	protected override base(): string {
		return `z.lazy(() => ${this._input.text()})`;
	}
}
