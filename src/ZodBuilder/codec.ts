import { ZodBuilder } from './BaseBuilder.js';

/**
 * CodecBuilder: represents z.codec(inSchema, outSchema)
 * Enables bidirectional data transformations
 */
export class CodecBuilder extends ZodBuilder<'codec'> {
	readonly typeKind = 'codec' as const;
	private readonly _inSchema: ZodBuilder;
	private readonly _outSchema: ZodBuilder;

	constructor(inSchema: ZodBuilder, outSchema: ZodBuilder) {
		super();
		this._inSchema = inSchema;
		this._outSchema = outSchema;
	}

	protected override base(): string {
		const inStr = this._inSchema.text();
		const outStr = this._outSchema.text();
		return `z.codec(${inStr},${outStr})`;
	}
}
