import { ZodBuilder } from './BaseBuilder.js';

/**
 * Base64Builder: represents z.base64() in Zod v4.
 *
 * In v4, base64 validation is a top-level function that provides better type inference
 * and tree-shaking compared to v3's z.string().base64() method chain.
 *
 * @example
 * ```typescript
 * // v4 mode
 * const b64 = new Base64Builder({ zodVersion: 'v4' });
 * b64.text(); // => 'z.base64()'
 * ```
 */
export class Base64Builder extends ZodBuilder<'base64'> {
	readonly typeKind = 'base64' as const;
	private _errorMessage?: string;

	constructor(options?: import('../Types.js').Options) {
		super(options);
	}

	/**
	 * Set custom error message for base64 validation.
	 */
	withError(message: string): this {
		this._errorMessage = message;
		return this;
	}

	protected override base(): string {
		// In v4, use z.base64() top-level function
		if (this.isV4()) {
			return `z.base64(${this._errorMessage ? this.withErrorMessage(this._errorMessage).slice(2) : ''})`;
		}
		// In v3, fall back to string().base64()
		const errorParam = this._errorMessage
			? this.withErrorMessage(this._errorMessage)
			: '';
		return `z.string().base64(${errorParam ? errorParam.slice(2) : ''})`;
	}
}
