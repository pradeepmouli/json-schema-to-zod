import { ZodBuilder } from './BaseBuilder.js';

/**
 * KeyofBuilder: represents z.keyof(objectSchema)
 * Extracts keys from an object schema as an enum
 */
export class KeyofBuilder extends ZodBuilder<'keyof'> {
	readonly typeKind = 'keyof' as const;
	private readonly _objectSchema: ZodBuilder;

	constructor(objectSchema: ZodBuilder, options?: import('../Types.js').Options) {
		super(options);
		this._objectSchema = objectSchema;
	}

	protected override base(): string {
		const objectStr = this._objectSchema.text();
		return `z.keyof(${objectStr})`;
	}
}
