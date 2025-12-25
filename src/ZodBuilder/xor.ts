import { ZodBuilder } from './BaseBuilder.js';

/**
 * XorBuilder: represents z.xor(schemas)
 * Validates exclusive OR - exactly one schema must match
 */
export class XorBuilder extends ZodBuilder<'xor'> {
	readonly typeKind = 'xor' as const;
	private readonly _schemas: ZodBuilder[];

	constructor(schemas: ZodBuilder[], options?: import('../Types.js').Options) {
		super(options);
		this._schemas = schemas;
	}

	protected override base(): string {
		const schemaStrs = this._schemas.map((schema) => schema.text());
		return `z.xor([${schemaStrs.join(',')}])`;
	}
}
