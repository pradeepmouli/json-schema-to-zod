import { ZodBuilder } from './BaseBuilder.js';

/**
 * CustomBuilder: represents z.custom() for custom validation
 */
export class CustomBuilder extends ZodBuilder<'custom'> {
	readonly typeKind = 'custom' as const;
	_validateFn?: string;
	_params?: any;

	constructor(validateFn?: string, params?: any) {
		super();
		this._validateFn = validateFn;
		this._params = params;
	}

	protected override base(): string {
		if (this._validateFn) {
			if (this._params !== undefined) {
				return `z.custom(${this._validateFn}, ${JSON.stringify(this._params)})`;
			}
			return `z.custom(${this._validateFn})`;
		}
		return 'z.custom()';
	}
}
