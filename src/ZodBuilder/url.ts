import { ZodBuilder } from './BaseBuilder.js';

/**
 * UrlBuilder: represents z.url() in Zod v4.
 *
 * In v4, URL validation is a top-level function that provides better type inference
 * and tree-shaking compared to v3's z.string().url() method chain.
 *
 * @example
 * ```typescript
 * // v4 mode
 * const url = new UrlBuilder({ zodVersion: 'v4' });
 * url.text(); // => 'z.url()'
 *
 * // With error message
 * url.text('Invalid URL'); // => 'z.url({ error: "Invalid URL" })'
 * ```
 */
export class UrlBuilder extends ZodBuilder<'url'> {
	readonly typeKind = 'url' as const;
	private _errorMessage?: string;

	constructor(options?: import('../Types.js').Options) {
		super(options);
	}

	/**
	 * Set custom error message for URL validation.
	 */
	withError(message: string): this {
		this._errorMessage = message;
		return this;
	}

	protected override base(): string {
		// In v4, use z.url() top-level function
		if (this.isV4()) {
			return `z.url(${this._errorMessage ? this.withErrorMessage(this._errorMessage).slice(2) : ''})`;
		}
		// In v3, fall back to string().url()
		const errorParam = this._errorMessage
			? this.withErrorMessage(this._errorMessage)
			: '';
		return `z.string().url(${errorParam ? errorParam.slice(2) : ''})`;
	}
}
