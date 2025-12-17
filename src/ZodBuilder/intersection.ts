import { BaseBuilder } from './BaseBuilder.js';

/**
 * Fluent IntersectionBuilder: represents z.intersection() schema.
 * Accepts two schemas and creates an intersection type.
 */
export class IntersectionBuilder extends BaseBuilder {
	private readonly _left: BaseBuilder;
	private readonly _right: BaseBuilder;

	constructor(left: BaseBuilder, right: BaseBuilder) {
		super();
		this._left = left;
		this._right = right;
	}

	protected override base(): string {
		const leftStr = this._left.text();
		const rightStr = this._right.text();
		return `z.intersection(${leftStr}, ${rightStr})`;
	}
}
