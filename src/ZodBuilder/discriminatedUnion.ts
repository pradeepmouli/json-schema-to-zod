import { BaseBuilder } from './BaseBuilder.js';

/**
 * Fluent DiscriminatedUnionBuilder: represents z.discriminatedUnion() schema.
 * Accepts a discriminator key and an array of object schemas.
 */
export class DiscriminatedUnionBuilder extends BaseBuilder {
	private readonly _discriminator: string;
	private readonly _options: BaseBuilder[];

	constructor(discriminator: string, options: BaseBuilder[]) {
		super();
		this._discriminator = discriminator;
		this._options = options;
	}

	protected override base(): string {
		const optionStrings = this._options.map((o) => o.text());
		return `z.discriminatedUnion(${JSON.stringify(this._discriminator)}, [${optionStrings.join(', ')}])`;
	}
}
