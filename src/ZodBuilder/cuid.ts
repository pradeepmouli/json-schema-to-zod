import { ZodBuilder } from './BaseBuilder.js';

/**
 * CuidBuilder: represents z.cuid() or z.cuid2() in Zod v4.
 *
 * In v4, CUID validation is a top-level function that provides better type inference
 * and tree-shaking compared to v3's z.string().cuid() method chain.
 *
 * Supports both cuid (v1) and cuid2 (v2) variants.
 *
 * @example
 * ```typescript
 * // v4 mode - CUID v1
 * const cuid = new CuidBuilder('cuid', { zodVersion: 'v4' });
 * cuid.text(); // => 'z.cuid()'
 *
 * // v4 mode - CUID v2
 * const cuid2 = new CuidBuilder('cuid2', { zodVersion: 'v4' });
 * cuid2.text(); // => 'z.cuid2()'
 * ```
 */
export class CuidBuilder extends ZodBuilder<'cuid'> {
	readonly typeKind = 'cuid' as const;
	private _variant: 'cuid' | 'cuid2';
	private _errorMessage?: string;

	constructor(
		variant: 'cuid' | 'cuid2' = 'cuid',
		options?: import('../Types.js').Options,
	) {
		super(options);
		this._variant = variant;
	}

	/**
	 * Set custom error message for CUID validation.
	 */
	withError(message: string): this {
		this._errorMessage = message;
		return this;
	}

	protected override base(): string {
		const method = this._variant; // 'cuid' or 'cuid2'

		// In v4, use z.cuid() or z.cuid2() top-level function
		if (this.isV4()) {
			return `z.${method}(${this._errorMessage ? this.withErrorMessage(this._errorMessage).slice(2) : ''})`;
		}
		// In v3, fall back to string().cuid() or string().cuid2()
		const errorParam = this._errorMessage
			? this.withErrorMessage(this._errorMessage)
			: '';
		return `z.string().${method}(${errorParam ? errorParam.slice(2) : ''})`;
	}
}
