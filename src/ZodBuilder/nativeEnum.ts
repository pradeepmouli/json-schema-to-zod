import { ZodBuilder } from './BaseBuilder.js';

/**
 * NativeEnumBuilder: represents z.enum() in v4 or z.nativeEnum() in v3
 * Validates against TypeScript native enum values.
 *
 * In Zod v4, the enum API is unified - both native TypeScript enums and
 * string literal enums use z.enum(). In v3, native enums use z.nativeEnum().
 */
export class NativeEnumBuilder extends ZodBuilder<'nativeEnum'> {
	readonly typeKind = 'nativeEnum' as const;
	private readonly _enumReference: string;

	constructor(enumReference: string, options?: import('../Types.js').Options) {
		super(options);
		this._enumReference = enumReference;
	}

	protected override base(): string {
		// In v4, use unified z.enum() API
		// In v3, use z.nativeEnum() for TypeScript native enums
		if (this.isV4()) {
			return `z.enum(${this._enumReference})`;
		}
		return `z.nativeEnum(${this._enumReference})`;
	}
}
