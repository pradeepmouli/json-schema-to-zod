import { ZodBuilder } from './BaseBuilder.js';

/**
 * UlidBuilder: represents z.ulid() in Zod v4.
 *
 * In v4, ULID validation is a top-level function that provides better type inference
 * and tree-shaking compared to v3's z.string().ulid() method chain.
 *
 * @example
 * ```typescript
 * // v4 mode
 * const ulid = new UlidBuilder({ zodVersion: 'v4' });
 * ulid.text(); // => 'z.ulid()'
 * ```
 */
export class UlidBuilder extends ZodBuilder<'ulid'> {
	readonly typeKind = 'ulid' as const;
	private _errorMessage?: string;

	constructor(options?: import('../Types.js').Options) {
		super(options);
	}

	/**
	 * Set custom error message for ULID validation.
	 */
	withError(message: string): this {
		this._errorMessage = message;
		return this;
	}

	protected override base(): string {
		// In v4, use z.ulid() top-level function
		if (this.isV4()) {
			return `z.ulid(${this._errorMessage ? this.withErrorMessage(this._errorMessage).slice(2) : ''})`;
		}
		// In v3, fall back to string().ulid()
		const errorParam = this._errorMessage
			? this.withErrorMessage(this._errorMessage)
			: '';
		return `z.string().ulid(${errorParam ? errorParam.slice(2) : ''})`;
	}
}
