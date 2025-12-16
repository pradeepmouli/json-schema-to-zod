import { BaseBuilder } from './BaseBuilder.js';

/**
 * Fluent RecordBuilder: represents z.record() schema.
 * Accepts key and value schemas.
 */
export class RecordBuilder extends BaseBuilder<RecordBuilder> {
	private readonly _keySchema: BaseBuilder<any> | string;
	private readonly _valueSchema: BaseBuilder<any> | string;

	constructor(
		keySchema: BaseBuilder<any> | string,
		valueSchema: BaseBuilder<any> | string
	) {
		super();
		this._keySchema = keySchema;
		this._valueSchema = valueSchema;
	}

	protected override base(): string {
		const keyStr = typeof this._keySchema === 'string' ? this._keySchema : this._keySchema.text();
		const valueStr = typeof this._valueSchema === 'string' ? this._valueSchema : this._valueSchema.text();
		return `z.record(${keyStr}, ${valueStr})`;
	}
}

/**
 * Build a Zod record schema string.
 */
export function buildRecordSchema(
	keySchema: BaseBuilder<any> | string,
	valueSchema: BaseBuilder<any> | string
): string {
	const keyStr = typeof keySchema === 'string' ? keySchema : keySchema.text();
	const valueStr = typeof valueSchema === 'string' ? valueSchema : valueSchema.text();
	return `z.record(${keyStr}, ${valueStr})`;
}
