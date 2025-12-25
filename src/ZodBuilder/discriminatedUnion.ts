import type { TypeKind } from './index.js';
import { ZodBuilder } from './BaseBuilder.js';

/**
 * Fluent DiscriminatedUnionBuilder: represents z.discriminatedUnion() schema.
 * Accepts a discriminator key and an array of object schemas.
 */
export class DiscriminatedUnionBuilder extends ZodBuilder<'discriminatedUnion'> {
	readonly typeKind = 'discriminatedUnion' as const;
	private readonly _discriminator: string;
	private readonly _options: ZodBuilder<keyof TypeKind>[];

	constructor(discriminator: string, options: ZodBuilder<keyof TypeKind>[], zodOptions?: import('../Types.js').Options) {
		super(zodOptions);
		this._discriminator = discriminator;
		this._options = options;
	}

	protected override base(): string {
		const optionStrings = this._options.map((o) => o.text());
		return `z.discriminatedUnion(${JSON.stringify(this._discriminator)}, [${optionStrings.join(', ')}])`;
	}
}
