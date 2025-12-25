import { ZodBuilder } from './BaseBuilder.js';

/**
 * TemplateLiteralBuilder: represents z.templateLiteral(parts)
 * Validates template literal string types
 */
export class TemplateLiteralBuilder extends ZodBuilder<'templateLiteral'> {
	readonly typeKind = 'templateLiteral' as const;
	private readonly _parts: (string | ZodBuilder)[];

	constructor(parts: (string | ZodBuilder)[], options?: import('../Types.js').Options) {
		super(options);
		this._parts = parts;
	}

	protected override base(): string {
		const partsStr = this._parts
			.map((part) => {
				if (typeof part === 'string') {
					return JSON.stringify(part);
				}
				return part.text();
			})
			.join(',');
		return `z.templateLiteral([${partsStr}])`;
	}
}
