import { ZodBuilder } from './BaseBuilder.js';

/**
 * DurationBuilder: represents z.duration() in Zod v4.
 *
 * In v4, duration validation is a top-level function that provides better type inference
 * and tree-shaking compared to v3's z.string().duration() method chain.
 *
 * @example
 * ```typescript
 * // v4 mode
 * const duration = new DurationBuilder({ zodVersion: 'v4' });
 * duration.text(); // => 'z.duration()'
 * ```
 */
export class DurationBuilder extends ZodBuilder<'duration'> {
	readonly typeKind = 'duration' as const;
	private _errorMessage?: string;

	constructor(options?: import('../Types.js').Options) {
		super(options);
	}

	/**
	 * Set custom error message for duration validation.
	 */
	withError(message: string): this {
		this._errorMessage = message;
		return this;
	}

	protected override base(): string {
		// In v4, use z.duration() top-level function
		if (this.isV4()) {
			return `z.duration(${this._errorMessage ? this.withErrorMessage(this._errorMessage).slice(2) : ''})`;
		}
		// In v3, fall back to string().duration()
		const errorParam = this._errorMessage
			? this.withErrorMessage(this._errorMessage)
			: '';
		return `z.string().duration(${errorParam ? errorParam.slice(2) : ''})`;
	}
}
