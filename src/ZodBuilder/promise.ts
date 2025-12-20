import { ZodBuilder } from './BaseBuilder.js';

/**
 * PromiseBuilder: represents z.promise(innerType)
 * Wraps an inner schema for async value validation
 */
export class PromiseBuilder extends ZodBuilder<'promise'> {
	readonly typeKind = 'promise' as const;
	private readonly _innerSchema: ZodBuilder;

	constructor(innerSchema: ZodBuilder) {
		super();
		this._innerSchema = innerSchema;
	}

	protected override base(): string {
		const innerStr = this._innerSchema.text();
		return `z.promise(${innerStr})`;
	}
}
