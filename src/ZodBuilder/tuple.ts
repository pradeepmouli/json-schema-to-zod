import { BaseBuilder } from './BaseBuilder.js';

/**
 * Fluent TupleBuilder: represents z.tuple() schema.
 * Accepts an array of schemas representing tuple items.
 */
export class TupleBuilder extends BaseBuilder {
	private readonly _items: (BaseBuilder | string)[];

	constructor(items: (BaseBuilder | string)[]) {
		super();
		this._items = items;
	}

	protected override base(): string {
		const itemStrings = this._items.map((item) =>
			typeof item === 'string' ? item : item.text(),
		);
		return `z.tuple([${itemStrings.join(',')}])`; // No space after comma to match buildTuple
	}
}

/**
 * Build a Zod tuple schema string.
 */
export function buildTupleSchema(items: (BaseBuilder | string)[]): string {
	const itemStrings = items.map((item) =>
		typeof item === 'string' ? item : item.text(),
	);
	return `z.tuple([${itemStrings.join(',')}])`; // No space after comma to match buildTuple
}
