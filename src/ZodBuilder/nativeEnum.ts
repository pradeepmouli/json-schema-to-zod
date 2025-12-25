import { ZodBuilder } from './BaseBuilder.js';

/**
 * NativeEnumBuilder: represents z.nativeEnum(enumObject)
 * Validates against TypeScript native enum values
 */
export class NativeEnumBuilder extends ZodBuilder<'nativeEnum'> {
	readonly typeKind = 'nativeEnum' as const;
	private readonly _enumReference: string;

	constructor(enumReference: string, options?: import('../Types.js').Options) {
		super(options);
		this._enumReference = enumReference;
	}

	protected override base(): string {
		return `z.nativeEnum(${this._enumReference})`;
	}
}
