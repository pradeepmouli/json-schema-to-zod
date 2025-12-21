import { ZodBuilder } from './BaseBuilder.js';

/**
 * Fluent UnionBuilder: represents z.union() schema.
 * Accepts multiple schemas and creates a union type.
 */
export class UnionBuilder extends ZodBuilder<'union'> {
	readonly typeKind = 'union' as const;
	private readonly _schemas: ZodBuilder[];

	constructor(schemas: ZodBuilder[]) {
		super();
		this._schemas = schemas;
	}

	protected override base(): string {
		const schemaStrings = this._schemas.map((s) => s.text());
		return `z.union([${schemaStrings.join(', ')}])`;
	}
}
