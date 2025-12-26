import { ZodBuilder } from './BaseBuilder.js';

/**
 * TimeBuilder: represents z.time() in Zod v4.
 *
 * In v4, time validation is a top-level function that provides better type inference
 * and tree-shaking compared to v3's z.string().time() method chain.
 *
 * @example
 * ```typescript
 * // v4 mode
 * const time = new TimeBuilder({ zodVersion: 'v4' });
 * time.text(); // => 'z.time()'
 *
 * // With precision
 * time.withPrecision(3).text(); // => 'z.time({ precision: 3 })'
 * ```
 */
export class TimeBuilder extends ZodBuilder<'time'> {
	readonly typeKind = 'time' as const;
	private _precision?: number;
	private _errorMessage?: string;

	constructor(options?: import('../Types.js').Options) {
		super(options);
	}

	/**
	 * Set precision for time validation (millisecond precision).
	 */
	withPrecision(precision: number): this {
		this._precision = precision;
		return this;
	}

	/**
	 * Set custom error message for time validation.
	 */
	withError(message: string): this {
		this._errorMessage = message;
		return this;
	}

	protected override base(): string {
		// Build options object
		const options: string[] = [];
		if (this._precision !== undefined) {
			options.push(`precision: ${this._precision}`);
		}
		if (this._errorMessage) {
			const param = this.isV4() ? 'error' : 'message';
			options.push(`${param}: ${JSON.stringify(this._errorMessage)}`);
		}

		const optionsStr = options.length > 0 ? `{ ${options.join(', ')} }` : '';

		// In v4, use z.time() top-level function
		if (this.isV4()) {
			return `z.time(${optionsStr})`;
		}
		// In v3, fall back to string().time()
		return `z.string().time(${optionsStr})`;
	}
}
