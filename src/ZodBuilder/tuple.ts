import { ZodBuilder } from './BaseBuilder.js';

/**
 * Fluent TupleBuilder: represents z.tuple() schema.
 * Accepts an array of schemas representing tuple items.
 */
export class TupleBuilder extends ZodBuilder<'tuple'> {
	readonly typeKind = 'tuple' as const;
	private readonly _items: ZodBuilder[];

	constructor(items: ZodBuilder[]) {
		super();
		this._items = items;
	}

	protected override base(): string {
		const itemStrings = this._items.map((item) => item.text());
		return `z.tuple([${itemStrings.join(',')}])`; // No space after comma to match buildTuple
	}
}
