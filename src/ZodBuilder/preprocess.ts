import { ZodBuilder } from './BaseBuilder.js';

/**
 * PreprocessBuilder: represents z.preprocess(transformFn, schema)
 * Transforms data before validation
 */
export class PreprocessBuilder extends ZodBuilder<'preprocess'> {
	readonly typeKind = 'preprocess' as const;
	private readonly _preprocessFn: string;
	private readonly _schema: ZodBuilder;

	constructor(transformFn: string, schema: ZodBuilder) {
		super();
		this._preprocessFn = transformFn;
		this._schema = schema;
	}

	protected override base(): string {
		const schemaStr = this._schema.text();
		return `z.preprocess(${this._preprocessFn},${schemaStr})`;
	}
}
