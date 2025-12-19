import { ZodBuilder } from './BaseBuilder.js';

/**
 * Fluent StringBuilder: wraps a Zod string schema string and provides chainable methods.
 */
export class StringBuilder extends ZodBuilder<'string'> {
	readonly typeKind = 'string' as const;
	_format?: { format: string; errorMessage?: string } = undefined;
	_pattern?: { pattern: string; errorMessage?: string } = undefined;
	_minLength?: { value: number; errorMessage?: string } = undefined;
	_maxLength?: { value: number; errorMessage?: string } = undefined;
	_base64?: { errorMessage?: string } = undefined;
	_json?: { errorMessage?: string } = undefined;
	_pipe?: { contentSchema: ZodBuilder, errorMessage?: string } = undefined;

	constructor() {
		super();
	}

	/**
	 * Apply format constraint.
	 */
	format(format: string, errorMessage?: string): this {
		this._format = { format, errorMessage };
		return this;
	}

	/**
	 * Apply regex pattern constraint.
	 */
	regex(pattern: string | RegExp, errorMessage?: string): this {
		this._pattern = {
			pattern: typeof pattern === 'string' ? pattern : pattern.source,
			errorMessage,
		};
		return this;
	}

	/**
	 * Apply minLength constraint.
	 */
	min(value: number, errorMessage?: string): this {
		if (this._minLength === undefined || this._minLength.value > value) {
			this._minLength = { value, errorMessage };
		}
		return this;
	}

	/**
	 * Apply maxLength constraint.
	 */
	max(value: number, errorMessage?: string): this {
		if (this._maxLength === undefined || this._maxLength.value < value) {
			this._maxLength = { value, errorMessage };
		}
		return this;
	}

	/**
	 * Apply email format.
	 */
	email(errorMessage?: string): this {
		this._format = { format: 'email', errorMessage };
		return this;
	}

	/**
	 * Apply uuid format.
	 */
	uuid(errorMessage?: string): this {
		this._format = { format: 'uuid', errorMessage };
		return this;
	}

	/**
	 * Apply url format.
	 */
	url(errorMessage?: string): this {
		this._format = { format: 'url', errorMessage };
		return this;
	}

	/**
	 * Apply http/https URL format.
	 */
	httpUrl(errorMessage?: string): this {
		this._format = { format: 'httpUrl', errorMessage };
		return this;
	}

	/**
	 * Apply hostname format.
	 */
	hostname(errorMessage?: string): this {
		this._format = { format: 'hostname', errorMessage };
		return this;
	}

	/**
	 * Apply emoji format (single emoji character).
	 */
	emoji(errorMessage?: string): this {
		this._format = { format: 'emoji', errorMessage };
		return this;
	}

	/**
	 * Apply base64url format.
	 */
	base64url(errorMessage?: string): this {
		this._format = { format: 'base64url', errorMessage };
		return this;
	}

	/**
	 * Apply hex format.
	 */
	hex(errorMessage?: string): this {
		this._format = { format: 'hex', errorMessage };
		return this;
	}

	/**
	 * Apply JWT format.
	 */
	jwt(errorMessage?: string): this {
		this._format = { format: 'jwt', errorMessage };
		return this;
	}

	/**
	 * Apply nanoid format.
	 */
	nanoid(errorMessage?: string): this {
		this._format = { format: 'nanoid', errorMessage };
		return this;
	}

	/**
	 * Apply cuid format.
	 */
	cuid(errorMessage?: string): this {
		this._format = { format: 'cuid', errorMessage };
		return this;
	}

	/**
	 * Apply cuid2 format.
	 */
	cuid2(errorMessage?: string): this {
		this._format = { format: 'cuid2', errorMessage };
		return this;
	}

	/**
	 * Apply ulid format.
	 */
	ulid(errorMessage?: string): this {
		this._format = { format: 'ulid', errorMessage };
		return this;
	}

	/**
	 * Apply IPv4 format.
	 */
	ipv4(errorMessage?: string): this {
		this._format = { format: 'ipv4', errorMessage };
		return this;
	}

	/**
	 * Apply IPv6 format.
	 */
	ipv6(errorMessage?: string): this {
		this._format = { format: 'ipv6', errorMessage };
		return this;
	}

	/**
	 * Apply MAC address format.
	 */
	mac(errorMessage?: string): this {
		this._format = { format: 'mac', errorMessage };
		return this;
	}

	/**
	 * Apply IPv4 CIDR block format.
	 */
	cidrv4(errorMessage?: string): this {
		this._format = { format: 'cidrv4', errorMessage };
		return this;
	}

	/**
	 * Apply IPv6 CIDR block format.
	 */
	cidrv6(errorMessage?: string): this {
		this._format = { format: 'cidrv6', errorMessage };
		return this;
	}

	/**
	 * Apply hash format with algorithm.
	 */
	hash(algorithm: 'sha256' | 'sha1' | 'sha384' | 'sha512' | 'md5', errorMessage?: string): this {
		this._format = { format: `hash:${algorithm}`, errorMessage };
		return this;
	}

	/**
	 * Apply ISO date format.
	 */
	isoDate(errorMessage?: string): this {
		this._format = { format: 'iso.date', errorMessage };
		return this;
	}

	/**
	 * Apply ISO time format.
	 */
	isoTime(errorMessage?: string): this {
		this._format = { format: 'iso.time', errorMessage };
		return this;
	}

	/**
	 * Apply ISO datetime format.
	 */
	isoDatetime(errorMessage?: string): this {
		this._format = { format: 'iso.datetime', errorMessage };
		return this;
	}

	/**
	 * Apply ISO duration format.
	 */
	isoDuration(errorMessage?: string): this {
		this._format = { format: 'iso.duration', errorMessage };
		return this;
	}

	/**
	 * Apply UUIDv4 format.
	 */
	uuidv4(errorMessage?: string): this {
		this._format = { format: 'uuidv4', errorMessage };
		return this;
	}

	/**
	 * Apply UUIDv6 format.
	 */
	uuidv6(errorMessage?: string): this {
		this._format = { format: 'uuidv6', errorMessage };
		return this;
	}

	/**
	 * Apply UUIDv7 format.
	 */
	uuidv7(errorMessage?: string): this {
		this._format = { format: 'uuidv7', errorMessage };
		return this;
	}

	/**
	 * Apply base64 encoding constraint.
	 */
	base64(errorMessage?: string): this {
		this._base64 = { errorMessage };
		return this;
	}

	/**
	 * Apply JSON transform.
	 */
	json(errorMessage?: string): this {
		this._json = { errorMessage };
		return this;
	}

	/**
	 * Apply pipe with parsed content schema.
	 */
	pipe(contentSchema: ZodBuilder, errorMessage?: string): this {
		this._pipe = { contentSchema, errorMessage };
		return this;
	}

	/**
	 * Compute the base string schema.
	 */
	protected override base(): string {
		return 'z.string()';
	}

	protected override modify(baseText: string): string {
		let result = baseText;

		if (this._format !== undefined) {
			result = applyFormat(
				result,
				this._format.format,
				this._format.errorMessage,
			);
		}
		if (this._pattern !== undefined) {
			result = applyPattern(
				result,
				this._pattern.pattern,
				this._pattern.errorMessage,
			);
		}
		if (this._minLength !== undefined) {
			result = applyMinLength(
				result,
				this._minLength.value,
				this._minLength.errorMessage,
			);
		}
		if (this._maxLength !== undefined) {
			result = applyMaxLength(
				result,
				this._maxLength.value,
				this._maxLength.errorMessage,
			);
		}
		if (this._base64 !== undefined) {
			result = applyBase64(result, this._base64.errorMessage);
		}
		if (this._json !== undefined) {
			result = applyJsonTransform(result, this._json.errorMessage);
		}
		if (this._pipe !== undefined) {
			result = applyPipe(
				result,
				this._pipe.contentSchema,
				this._pipe.errorMessage,
			);
		}

		return super.modify(result);
	}
}

/**
 * Apply format constraint to a string schema.
 */
export function applyFormat(
	zodStr: string,
	format: string,
	errorMessage?: string,
): string {
	switch (format) {
		case 'email':
			return errorMessage
				? `${zodStr}.email(${JSON.stringify(errorMessage)})`
				: `${zodStr}.email()`;
		case 'ip':
			return errorMessage
				? `${zodStr}.ip(${JSON.stringify(errorMessage)})`
				: `${zodStr}.ip()`;
		case 'ipv4':
			return errorMessage
				? `${zodStr}.ip({ version: "v4", message: ${JSON.stringify(errorMessage)} })`
				: `${zodStr}.ip({ version: "v4" })`;
		case 'ipv6':
			return errorMessage
				? `${zodStr}.ip({ version: "v6", message: ${JSON.stringify(errorMessage)} })`
				: `${zodStr}.ip({ version: "v6" })`;
		case 'uri':
		case 'url':
			return errorMessage
				? `${zodStr}.url(${JSON.stringify(errorMessage)})`
				: `${zodStr}.url()`;
		case 'httpUrl':
			return errorMessage
				? `${zodStr}.httpUrl(${JSON.stringify(errorMessage)})`
				: `${zodStr}.httpUrl()`;
		case 'hostname':
			return errorMessage
				? `${zodStr}.hostname(${JSON.stringify(errorMessage)})`
				: `${zodStr}.hostname()`;
		case 'emoji':
			return errorMessage
				? `${zodStr}.emoji(${JSON.stringify(errorMessage)})`
				: `${zodStr}.emoji()`;
		case 'uuid':
			return errorMessage
				? `${zodStr}.uuid(${JSON.stringify(errorMessage)})`
				: `${zodStr}.uuid()`;
		case 'uuidv4':
			return errorMessage
				? `${zodStr}.uuid({ version: "v4", message: ${JSON.stringify(errorMessage)} })`
				: `${zodStr}.uuid({ version: "v4" })`;
		case 'uuidv6':
			return errorMessage
				? `${zodStr}.uuid({ version: "v6", message: ${JSON.stringify(errorMessage)} })`
				: `${zodStr}.uuid({ version: "v6" })`;
		case 'uuidv7':
			return errorMessage
				? `${zodStr}.uuid({ version: "v7", message: ${JSON.stringify(errorMessage)} })`
				: `${zodStr}.uuid({ version: "v7" })`;
		case 'base64url':
			return errorMessage
				? `${zodStr}.base64url(${JSON.stringify(errorMessage)})`
				: `${zodStr}.base64url()`;
		case 'hex':
			return errorMessage
				? `${zodStr}.hex(${JSON.stringify(errorMessage)})`
				: `${zodStr}.hex()`;
		case 'jwt':
			return errorMessage
				? `${zodStr}.jwt(${JSON.stringify(errorMessage)})`
				: `${zodStr}.jwt()`;
		case 'nanoid':
			return errorMessage
				? `${zodStr}.nanoid(${JSON.stringify(errorMessage)})`
				: `${zodStr}.nanoid()`;
		case 'cuid':
			return errorMessage
				? `${zodStr}.cuid(${JSON.stringify(errorMessage)})`
				: `${zodStr}.cuid()`;
		case 'cuid2':
			return errorMessage
				? `${zodStr}.cuid2(${JSON.stringify(errorMessage)})`
				: `${zodStr}.cuid2()`;
		case 'ulid':
			return errorMessage
				? `${zodStr}.ulid(${JSON.stringify(errorMessage)})`
				: `${zodStr}.ulid()`;
		case 'mac':
			return errorMessage
				? `${zodStr}.mac(${JSON.stringify(errorMessage)})`
				: `${zodStr}.mac()`;
		case 'cidrv4':
			return errorMessage
				? `${zodStr}.cidrv4(${JSON.stringify(errorMessage)})`
				: `${zodStr}.cidrv4()`;
		case 'cidrv6':
			return errorMessage
				? `${zodStr}.cidrv6(${JSON.stringify(errorMessage)})`
				: `${zodStr}.cidrv6()`;
		case 'iso.date':
			return errorMessage
				? `${zodStr}.iso.date(${JSON.stringify(errorMessage)})`
				: `${zodStr}.iso.date()`;
		case 'iso.time':
			return errorMessage
				? `${zodStr}.iso.time(${JSON.stringify(errorMessage)})`
				: `${zodStr}.iso.time()`;
		case 'iso.datetime':
			return errorMessage
				? `${zodStr}.iso.datetime(${JSON.stringify(errorMessage)})`
				: `${zodStr}.iso.datetime()`;
		case 'iso.duration':
			return errorMessage
				? `${zodStr}.iso.duration(${JSON.stringify(errorMessage)})`
				: `${zodStr}.iso.duration()`;
		case 'date-time':
			return errorMessage
				? `${zodStr}.datetime({ offset: true, message: ${JSON.stringify(errorMessage)} })`
				: `${zodStr}.datetime({ offset: true })`;
		case 'time':
			return errorMessage
				? `${zodStr}.time(${JSON.stringify(errorMessage)})`
				: `${zodStr}.time()`;
		case 'date':
			return errorMessage
				? `${zodStr}.date(${JSON.stringify(errorMessage)})`
				: `${zodStr}.date()`;
		case 'binary':
			return errorMessage
				? `${zodStr}.base64(${JSON.stringify(errorMessage)})`
				: `${zodStr}.base64()`;
		case 'duration':
			return errorMessage
				? `${zodStr}.duration(${JSON.stringify(errorMessage)})`
				: `${zodStr}.duration()`;
		default:
			// Handle hash formats
			if (format.startsWith('hash:')) {
				const algorithm = format.substring(5);
				return errorMessage
					? `${zodStr}.hash(${JSON.stringify(algorithm)}, ${JSON.stringify(errorMessage)})`
					: `${zodStr}.hash(${JSON.stringify(algorithm)})`;
			}
			return zodStr;
	}
}

/**
 * Apply regex pattern constraint to a string schema.
 */
export function applyPattern(
	zodStr: string,
	pattern: string,
	errorMessage?: string,
): string {
	return errorMessage
		? `${zodStr}.regex(new RegExp(${JSON.stringify(pattern)}), ${JSON.stringify(errorMessage)})`
		: `${zodStr}.regex(new RegExp(${JSON.stringify(pattern)}))`;
}

/**
 * Apply minLength constraint to a string schema.
 */
export function applyMinLength(
	zodStr: string,
	value: number,
	errorMessage?: string,
): string {
	return errorMessage
		? `${zodStr}.min(${JSON.stringify(value)}, ${JSON.stringify(errorMessage)})`
		: `${zodStr}.min(${JSON.stringify(value)})`;
}

/**
 * Apply maxLength constraint to a string schema.
 */
export function applyMaxLength(
	zodStr: string,
	value: number,
	errorMessage?: string,
): string {
	return errorMessage
		? `${zodStr}.max(${JSON.stringify(value)}, ${JSON.stringify(errorMessage)})`
		: `${zodStr}.max(${JSON.stringify(value)})`;
}

/**
 * Apply base64 encoding constraint to a string schema.
 */
export function applyBase64(zodStr: string, errorMessage?: string): string {
	return errorMessage
		? `${zodStr}.base64(${JSON.stringify(errorMessage)})`
		: `${zodStr}.base64()`;
}

/**
 * Apply JSON transform to a string schema.
 * Note: The transform function always uses "Invalid JSON" as the internal error message.
 * The errorMessage parameter becomes the second argument to .transform() for Zod's error handling.
 */
export function applyJsonTransform(
	zodStr: string,
	errorMessage?: string,
): string {
	const transformPart = `(str, ctx) => { try { return JSON.parse(str); } catch (err) { ctx.addIssue({ code: "custom", message: "Invalid JSON" }); }}`;

	if (errorMessage) {
		return `${zodStr}.transform(${transformPart}, ${JSON.stringify(errorMessage)})`;
	}
	return `${zodStr}.transform(${transformPart})`;
} /**
 * Apply pipe with parsed content schema.
 */
export function applyPipe(
	zodStr: string,
	contentSchemaZod: ZodBuilder,
	errorMessage?: string,
): string {
	return errorMessage
		? `${zodStr}.pipe(${contentSchemaZod.text()}, ${JSON.stringify(errorMessage)})`
		: `${zodStr}.pipe(${contentSchemaZod.text()})`;
}
