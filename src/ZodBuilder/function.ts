import { ZodBuilder } from './BaseBuilder.js';

/**
 * FunctionBuilder: represents z.function()
 * Supports function signature validation with args and returns
 */
export class FunctionBuilder extends ZodBuilder<'function'> {
	readonly typeKind = 'function' as const;
	private _args?: ZodBuilder[] = undefined;
	private _returns?: ZodBuilder = undefined;

	/**
	 * Specify function arguments as an array of schemas
	 */
	args(...argSchemas: ZodBuilder[]): this {
		this._args = argSchemas;
		return this;
	}

	/**
	 * Specify function return type schema
	 */
	returns(returnSchema: ZodBuilder): this {
		this._returns = returnSchema;
		return this;
	}

	protected override base(): string {
		let result = 'z.function()';

		if (this._args && this._args.length > 0) {
			const argStrs = this._args.map((arg) => arg.text());
			result += `.args(${argStrs.join(',')})`;
		}

		if (this._returns) {
			result += `.returns(${this._returns.text()})`;
		}

		return result;
	}
}
