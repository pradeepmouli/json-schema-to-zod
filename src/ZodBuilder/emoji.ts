import { ZodBuilder } from './BaseBuilder.js';

/**
 * EmojiBuilder: represents z.emoji() in Zod v4.
 *
 * In v4, emoji validation is a top-level function that provides better type inference
 * and tree-shaking compared to v3's z.string().emoji() method chain.
 *
 * @example
 * ```typescript
 * // v4 mode
 * const emoji = new EmojiBuilder({ zodVersion: 'v4' });
 * emoji.text(); // => 'z.emoji()'
 * ```
 */
export class EmojiBuilder extends ZodBuilder<'emoji'> {
	readonly typeKind = 'emoji' as const;
	private _errorMessage?: string;

	constructor(options?: import('../Types.js').Options) {
		super(options);
	}

	/**
	 * Set custom error message for emoji validation.
	 */
	withError(message: string): this {
		this._errorMessage = message;
		return this;
	}

	protected override base(): string {
		// In v4, use z.emoji() top-level function
		if (this.isV4()) {
			return `z.emoji(${this._errorMessage ? this.withErrorMessage(this._errorMessage).slice(2) : ''})`;
		}
		// In v3, fall back to string().emoji()
		const errorParam = this._errorMessage
			? this.withErrorMessage(this._errorMessage)
			: '';
		return `z.string().emoji(${errorParam ? errorParam.slice(2) : ''})`;
	}
}
