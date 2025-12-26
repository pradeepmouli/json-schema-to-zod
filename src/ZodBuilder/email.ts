import { ZodBuilder } from './BaseBuilder.js';

/**
 * EmailBuilder: represents z.email() in Zod v4.
 *
 * In v4, email validation is a top-level function that provides better type inference
 * and tree-shaking compared to v3's z.string().email() method chain.
 *
 * @example
 * ```typescript
 * // v4 mode
 * const email = new EmailBuilder({ zodVersion: 'v4' });
 * email.text(); // => 'z.email()'
 *
 * // With error message
 * email.text('Invalid email'); // => 'z.email({ error: "Invalid email" })'
 * ```
 */
export class EmailBuilder extends ZodBuilder<'email'> {
	readonly typeKind = 'email' as const;
	private _errorMessage?: string;

	constructor(options?: import('../Types.js').Options) {
		super(options);
	}

	/**
	 * Set custom error message for email validation.
	 */
	withError(message: string): this {
		this._errorMessage = message;
		return this;
	}

	protected override base(): string {
		// In v4, use z.email() top-level function
		if (this.isV4()) {
			return `z.email(${this._errorMessage ? this.withErrorMessage(this._errorMessage).slice(2) : ''})`;
		}
		// In v3, fall back to string().email()
		const errorParam = this._errorMessage
			? this.withErrorMessage(this._errorMessage)
			: '';
		return `z.string().email(${errorParam ? errorParam.slice(2) : ''})`;
	}
}
