import { BaseBuilder } from './BaseBuilder.js';

/**
 * Fluent IntersectionBuilder: represents z.intersection() schema.
 * Accepts two schemas and creates an intersection type.
 */
export class IntersectionBuilder extends BaseBuilder {
	private readonly _left: BaseBuilder | string;
	private readonly _right: BaseBuilder | string;

	constructor(left: BaseBuilder | string, right: BaseBuilder | string) {
		super();
		this._left = left;
		this._right = right;
	}

	protected override base(): string {
		const leftStr =
			typeof this._left === 'string' ? this._left : this._left.text();
		const rightStr =
			typeof this._right === 'string' ? this._right : this._right.text();
		return `z.intersection(${leftStr}, ${rightStr})`;
	}
}

/**
 * Build a Zod intersection schema string.
 */
export function buildIntersection(
	left: BaseBuilder | string,
	right: BaseBuilder | string,
): string {
	const leftStr = typeof left === 'string' ? left : left.text();
	const rightStr = typeof right === 'string' ? right : right.text();
	return `z.intersection(${leftStr}, ${rightStr})`;
}
