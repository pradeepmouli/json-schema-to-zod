import { ZodBuilder } from './BaseBuilder.js';

/**
 * DatetimeBuilder: represents z.datetime() in Zod v4.
 *
 * In v4, datetime validation is a top-level function that provides better type inference
 * and tree-shaking compared to v3's z.string().datetime() method chain.
 *
 * @example
 * ```typescript
 * // v4 mode
 * const dt = new DatetimeBuilder({ zodVersion: 'v4' });
 * dt.text(); // => 'z.datetime()'
 *
 * // With precision
 * dt.withPrecision(3).text(); // => 'z.datetime({ precision: 3 })'
 * ```
 */
export class DatetimeBuilder extends ZodBuilder<'datetime'> {
	readonly typeKind = 'datetime' as const;
	private _precision?: number;
	private _offset?: boolean;
	private _errorMessage?: string;

	constructor(options?: import('../Types.js').Options) {
		super(options);
	}

	/**
	 * Set precision for datetime validation (millisecond precision).
	 */
	withPrecision(precision: number): this {
		this._precision = precision;
		return this;
	}

	/**
	 * Require timezone offset in datetime string.
	 */
	withOffset(required: boolean = true): this {
		this._offset = required;
		return this;
	}

	/**
	 * Set custom error message for datetime validation.
	 */
	withError(message: string): this {
		this._errorMessage = message;
		return this;
	}

	protected override base(): string {
		// Build options object for v4
		const options: string[] = [];
		if (this._precision !== undefined) {
			options.push(`precision: ${this._precision}`);
		}
		if (this._offset !== undefined) {
			options.push(`offset: ${this._offset}`);
		}
		if (this._errorMessage) {
			const param = this.isV4() ? 'error' : 'message';
			options.push(`${param}: ${JSON.stringify(this._errorMessage)}`);
		}

		const optionsStr = options.length > 0 ? `{ ${options.join(', ')} }` : '';

		// In v4, use z.datetime() top-level function
		if (this.isV4()) {
			return `z.datetime(${optionsStr})`;
		}
		// In v3, fall back to string().datetime()
		return `z.string().datetime(${optionsStr})`;
	}
}
