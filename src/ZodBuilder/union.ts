import { BaseBuilder } from './BaseBuilder.js';

/**
 * Fluent UnionBuilder: represents z.union() schema.
 * Accepts multiple schemas and creates a union type.
 */
export class UnionBuilder extends BaseBuilder {
	private readonly _schemas: (BaseBuilder | string)[];

	constructor(schemas: (BaseBuilder | string)[]) {
		super();
		this._schemas = schemas;
	}

	protected override base(): string {
		const schemaStrings = this._schemas.map(s => typeof s === 'string' ? s : s.text());
		return `z.union([${schemaStrings.join(', ')}])`;
	}
}

/**
 * Build a Zod union schema string.
 */
export function buildUnion(schemas: (BaseBuilder | string)[]): string {
	const schemaStrings = schemas.map(s => typeof s === 'string' ? s : s.text());
	return `z.union([${schemaStrings.join(', ')}])`;
}
