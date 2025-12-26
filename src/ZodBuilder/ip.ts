import { ZodBuilder } from './BaseBuilder.js';

/**
 * IpBuilder: represents z.ip(), z.ipv4(), z.ipv6() in Zod v4.
 *
 * In v4, IP validation is a top-level function that provides better type inference
 * and tree-shaking compared to v3's z.string().ip() method chain.
 *
 * Supports variants: ip (any), ipv4, ipv6, cidrv4, cidrv6
 *
 * @example
 * ```typescript
 * // v4 mode - any IP
 * const ip = new IpBuilder('ip', { zodVersion: 'v4' });
 * ip.text(); // => 'z.ip()'
 *
 * // v4 mode - IPv4 only
 * const ipv4 = new IpBuilder('ipv4', { zodVersion: 'v4' });
 * ipv4.text(); // => 'z.ipv4()'
 *
 * // v4 mode - IPv6 only
 * const ipv6 = new IpBuilder('ipv6', { zodVersion: 'v4' });
 * ipv6.text(); // => 'z.ipv6()'
 * ```
 */
export class IpBuilder extends ZodBuilder<'ip'> {
	readonly typeKind = 'ip' as const;
	private _variant: 'ip' | 'ipv4' | 'ipv6' | 'cidrv4' | 'cidrv6';
	private _errorMessage?: string;

	constructor(
		variant: 'ip' | 'ipv4' | 'ipv6' | 'cidrv4' | 'cidrv6' = 'ip',
		options?: import('../Types.js').Options,
	) {
		super(options);
		this._variant = variant;
	}

	/**
	 * Set custom error message for IP validation.
	 */
	withError(message: string): this {
		this._errorMessage = message;
		return this;
	}

	protected override base(): string {
		const method = this._variant;

		// In v4, use z.ip() / z.ipv4() / z.ipv6() top-level functions
		if (this.isV4()) {
			return `z.${method}(${this._errorMessage ? this.withErrorMessage(this._errorMessage).slice(2) : ''})`;
		}

		// In v3, fall back to string().ip() / string().ipv4() / string().ipv6()
		const errorParam = this._errorMessage
			? this.withErrorMessage(this._errorMessage)
			: '';

		// For 'ip' variant in v3, need to pass version option
		if (method === 'ip') {
			return `z.string().ip(${errorParam ? errorParam.slice(2) : ''})`;
		}

		// For specific variants (ipv4, ipv6), call the specific method
		if (method === 'ipv4') {
			return `z.string().ip(${errorParam ? `{ version: "v4"${errorParam.slice(1)}` : '{ version: "v4" }'})`;
		}
		if (method === 'ipv6') {
			return `z.string().ip(${errorParam ? `{ version: "v6"${errorParam.slice(1)}` : '{ version: "v6" }'})`;
		}

		// CIDR variants
		if (method === 'cidrv4') {
			return `z.string().cidr(${errorParam ? `{ version: "v4"${errorParam.slice(1)}` : '{ version: "v4" }'})`;
		}
		if (method === 'cidrv6') {
			return `z.string().cidr(${errorParam ? `{ version: "v6"${errorParam.slice(1)}` : '{ version: "v6" }'})`;
		}

		return `z.string().ip(${errorParam ? errorParam.slice(2) : ''})`;
	}
}
