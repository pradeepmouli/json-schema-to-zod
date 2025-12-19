import { ZodBuilder } from './BaseBuilder.js';

/**
 * Fluent RecordBuilder: represents z.record() schema.
 * Accepts key and value schemas.
 */
export class RecordBuilder extends ZodBuilder<'record'> {
	readonly typeKind = 'record' as const;
	private readonly _keySchema: ZodBuilder;
	private readonly _valueSchema: ZodBuilder;

	constructor(keySchema: ZodBuilder, valueSchema: ZodBuilder) {
		super();
		this._keySchema = keySchema;
		this._valueSchema = valueSchema;
	}

	protected override base(): string {
		const keyStr = this._keySchema.text();
		const valueStr = this._valueSchema.text();
		return `z.record(${keyStr}, ${valueStr})`;
	}
}
