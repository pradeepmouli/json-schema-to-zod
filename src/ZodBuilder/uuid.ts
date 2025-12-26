import { ZodBuilder } from './BaseBuilder.js';

/**
 * UuidBuilder: represents z.uuid() or z.guid() in Zod v4.
 *
 * In v4, UUID/GUID validation is a top-level function that provides better type inference
 * and tree-shaking compared to v3's z.string().uuid() method chain.
 *
 * @example
 * ```typescript
 * // v4 mode - UUID
 * const uuid = new UuidBuilder('uuid', { zodVersion: 'v4' });
 * uuid.text(); // => 'z.uuid()'
 *
 * // v4 mode - GUID (alias)
 * const guid = new UuidBuilder('guid', { zodVersion: 'v4' });
 * guid.text(); // => 'z.guid()'
 * ```
 */
export class UuidBuilder extends ZodBuilder<'uuid'> {
	readonly typeKind = 'uuid' as const;
	private _variant: 'uuid' | 'guid';
	private _errorMessage?: string;

	constructor(
		variant: 'uuid' | 'guid' = 'uuid',
		options?: import('../Types.js').Options,
	) {
		super(options);
		this._variant = variant;
	}

	/**
	 * Set custom error message for UUID validation.
	 */
	withError(message: string): this {
		this._errorMessage = message;
		return this;
	}

	protected override base(): string {
		const method = this._variant; // 'uuid' or 'guid'

		// In v4, use z.uuid() or z.guid() top-level function
		if (this.isV4()) {
			return `z.${method}(${this._errorMessage ? this.withErrorMessage(this._errorMessage).slice(2) : ''})`;
		}
		// In v3, fall back to string().uuid() or string().guid()
		const errorParam = this._errorMessage
			? this.withErrorMessage(this._errorMessage)
			: '';
		return `z.string().${method}(${errorParam ? errorParam.slice(2) : ''})`;
	}
}
