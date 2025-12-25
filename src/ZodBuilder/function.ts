import { ZodBuilder } from './BaseBuilder.js';

/**
 * FunctionBuilder: represents z.function()
 * Supports function signature validation with args and returns
 */
export class FunctionBuilder extends ZodBuilder<'function'> {
	readonly typeKind = 'function' as const;
	private _input?: ZodBuilder[] = undefined;
	private _output?: ZodBuilder = undefined;

	constructor(params: { input?: ZodBuilder[]; output?: ZodBuilder } = {}, options?: import('../Types.js').Options) {
		super(options);
		this._input = params.input;
		this._output = params.output;
	}

	/**
	 * Specify function arguments as an array of schemas
	 */
	args(...input: ZodBuilder[]): FunctionBuilder {
		return new FunctionBuilder({ input, output: this._output });
	}

	/**
	 * Specify function return type schema
	 */
	returns(output: ZodBuilder): FunctionBuilder {
		return new FunctionBuilder({ input: this._input, output });
	}

	protected override base(): string {
		let result = 'z.function()';

		if (this._input) {
			const argStrs = this._input.map((arg) => arg.text());
			result += `.args(${argStrs.join(',')})`;
		}
		if (this._output) {
			result += `.returns(${this._output.text()})`;
		}

		return result;
	}
}
