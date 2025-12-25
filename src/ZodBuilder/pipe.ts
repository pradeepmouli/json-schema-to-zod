import { ZodBuilder } from './BaseBuilder.js';

/**
 * PipeBuilder: represents schema.pipe(targetSchema)
 * This is implemented as a modifier on the base schema rather than a standalone builder
 * since pipe is called on an existing schema
 */
export class PipeBuilder extends ZodBuilder<'pipe'> {
	readonly typeKind = 'pipe' as const;
	private readonly _sourceSchema: ZodBuilder;
	private readonly _targetSchema: ZodBuilder;

	constructor(sourceSchema: ZodBuilder, targetSchema: ZodBuilder, options?: import('../Types.js').Options) {
		super(options);
		this._sourceSchema = sourceSchema;
		this._targetSchema = targetSchema;
	}

	protected override base(): string {
		const sourceStr = this._sourceSchema.text();
		const targetStr = this._targetSchema.text();
		return `${sourceStr}.pipe(${targetStr})`;
	}
}
