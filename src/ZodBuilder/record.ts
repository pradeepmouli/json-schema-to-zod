import { BaseBuilder } from './BaseBuilder.js';

/**
 * Fluent RecordBuilder: represents z.record() schema.
 * Accepts key and value schemas.
 */
export class RecordBuilder extends BaseBuilder {
	private readonly _keySchema: BaseBuilder | string;
	private readonly _valueSchema: BaseBuilder | string;

	constructor(
		keySchema: BaseBuilder | string,
		valueSchema: BaseBuilder | string
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
	keySchema: BaseBuilder | string,
	valueSchema: BaseBuilder | string
): string {
	const keyStr = typeof keySchema === 'string' ? keySchema : keySchema.text();
	const valueStr = typeof valueSchema === 'string' ? valueSchema : valueSchema.text();
	return `z.record(${keyStr}, ${valueStr})`;
}
