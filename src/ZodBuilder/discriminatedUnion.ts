import { BaseBuilder } from './BaseBuilder.js';

/**
 * Fluent DiscriminatedUnionBuilder: represents z.discriminatedUnion() schema.
 * Accepts a discriminator key and an array of object schemas.
 */
export class DiscriminatedUnionBuilder extends BaseBuilder {
	private readonly _discriminator: string;
	private readonly _options: (BaseBuilder | string)[];

	constructor(discriminator: string, options: (BaseBuilder | string)[]) {
		super();
		this._discriminator = discriminator;
		this._options = options;
	}

	protected override base(): string {
		const optionStrings = this._options.map((o) =>
			typeof o === 'string' ? o : o.text(),
		);
		return `z.discriminatedUnion(${JSON.stringify(this._discriminator)}, [${optionStrings.join(', ')}])`;
	}
}

/**
 * Build a Zod discriminated union schema string.
 */
export function buildDiscriminatedUnion(
	discriminator: string,
	options: (BaseBuilder | string)[],
): string {
	const optionStrings = options.map((o) =>
		typeof o === 'string' ? o : o.text(),
	);
	return `z.discriminatedUnion(${JSON.stringify(discriminator)}, [${optionStrings.join(', ')}])`;
}
