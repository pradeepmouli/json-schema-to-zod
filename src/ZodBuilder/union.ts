import { BaseBuilder } from './BaseBuilder.js';

/**
 * Fluent UnionBuilder: represents z.union() schema.
 * Accepts multiple schemas and creates a union type.
 */
export class UnionBuilder extends BaseBuilder {
	private readonly _schemas: BaseBuilder[];

	constructor(schemas: BaseBuilder[]) {
		super();
		this._schemas = schemas;
	}

	protected override base(): string {
		const schemaStrings = this._schemas.map((s) => s.text());
		return `z.union([${schemaStrings.join(', ')}])`;
	}
}
