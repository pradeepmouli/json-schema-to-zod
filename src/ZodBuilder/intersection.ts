import { ZodBuilder } from './BaseBuilder.js';

/**
 * Fluent IntersectionBuilder: represents z.intersection() schema.
 * Accepts two schemas and creates an intersection type.
 */
export class IntersectionBuilder extends ZodBuilder<'intersection'> {
	readonly typeKind = 'intersection' as const;
	private readonly _left: ZodBuilder;
	private readonly _right: ZodBuilder;

	constructor(left: ZodBuilder, right: ZodBuilder) {
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
