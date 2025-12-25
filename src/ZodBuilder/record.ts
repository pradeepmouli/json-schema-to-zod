import { ZodBuilder } from './BaseBuilder.js';

/**
 * Fluent RecordBuilder: represents z.record() schema.
 * Accepts key and value schemas.
 * 
 * Note: Always uses two-argument form z.record(keySchema, valueSchema)
 * which is compatible with both Zod v3 and v4. In Zod v3, the single-argument
 * form z.record(valueSchema) was allowed, but this builder always provides
 * both arguments for consistency and v4 compatibility.
 */
export class RecordBuilder extends ZodBuilder<'record'> {
	readonly typeKind = 'record' as const;
	private readonly _keySchema: ZodBuilder;
	private readonly _valueSchema: ZodBuilder;

	constructor(keySchema: ZodBuilder, valueSchema: ZodBuilder, options?: import('../Types.js').Options) {
		super(options);
		this._keySchema = keySchema;
		this._valueSchema = valueSchema;
	}

	protected override base(): string {
		const keyStr = this._keySchema.text();
		const valueStr = this._valueSchema.text();
		return `z.record(${keyStr}, ${valueStr})`;
	}
}
