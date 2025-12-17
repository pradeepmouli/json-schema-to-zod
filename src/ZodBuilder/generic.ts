import { BaseBuilder } from './BaseBuilder.js';

/**
 * GenericBuilder: A concrete builder for arbitrary Zod schema strings.
 * Used when we need to wrap a pre-computed schema string (e.g., complex templates).
 */
export class GenericBuilder extends BaseBuilder {
	private readonly _code: string;

	constructor(code: string) {
		super();
		this._code = code;
	}

	protected override base(): string {
		return this._code;
	}
}
