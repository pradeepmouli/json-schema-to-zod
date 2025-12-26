import { ZodBuilder } from './BaseBuilder.js';

/**
 * NanoidBuilder: represents z.nanoid() in Zod v4.
 *
 * In v4, Nano ID validation is a top-level function that provides better type inference
 * and tree-shaking compared to v3's z.string().nanoid() method chain.
 *
 * @example
 * ```typescript
 * // v4 mode
 * const nanoid = new NanoidBuilder({ zodVersion: 'v4' });
 * nanoid.text(); // => 'z.nanoid()'
 * ```
 */
export class NanoidBuilder extends ZodBuilder<'nanoid'> {
	readonly typeKind = 'nanoid' as const;
	private _errorMessage?: string;

	constructor(options?: import('../Types.js').Options) {
		super(options);
	}

	/**
	 * Set custom error message for Nano ID validation.
	 */
	withError(message: string): this {
		this._errorMessage = message;
		return this;
	}

	protected override base(): string {
		// In v4, use z.nanoid() top-level function
		if (this.isV4()) {
			return `z.nanoid(${this._errorMessage ? this.withErrorMessage(this._errorMessage).slice(2) : ''})`;
		}
		// In v3, fall back to string().nanoid()
		const errorParam = this._errorMessage
			? this.withErrorMessage(this._errorMessage)
			: '';
		return `z.string().nanoid(${errorParam ? errorParam.slice(2) : ''})`;
	}
}
