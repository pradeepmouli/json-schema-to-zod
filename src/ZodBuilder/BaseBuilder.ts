import {
	applyBrand,
	applyCatch,
	applyDefault,
	applyDescribe,
	applyNullable,
	applyOptional,
	applyReadonly,
} from './modifiers';

/**
 * BaseBuilder: Abstract base class for all Zod schema builders.
 * Provides shared modifier methods that apply to all schema types.
 */
export class BaseBuilder<T extends BaseBuilder<T>> {
	_optional: boolean = false;
	_nullable: boolean = false;
	_readonly: boolean = false;
	_defaultValue?: any = undefined;

	_describeText?: string = undefined;
	_brandText?: string = undefined;
	_fallbackText?: any = undefined;

	protected _baseText: string;

	constructor(baseText: string) {
		this._baseText = baseText;
	}

	/**
	 * Apply optional constraint.
	 */
	optional(): T {
		this._optional = true;
		return this as unknown as T;
	}

	/**
	 * Apply nullable constraint.
	 */
	nullable(): T {
		this._nullable = true;
		return this as unknown as T;
	}

	/**
	 * Apply default value.
	 */
	default(value: any): T {
		this._defaultValue = value;
		return this as unknown as T;
	}

	/**
	 * Apply describe modifier.
	 */
	describe(description: string): T {
		this._describeText = description;
		return this as unknown as T;
	}

	/**
	 * Apply brand modifier.
	 */
	brand(brand: string): T {
		this._brandText = brand;
		return this as unknown as T;
	}

	/**
	 * Apply readonly modifier.
	 */
	readonly(): T {
		this._readonly = true;
		return this as unknown as T;
	}

	/**
	 * Apply catch modifier.
	 */
	catch(fallback: any): T {
		this._fallbackText = fallback;
		return this as unknown as T;
	}

	/**
	 * Unwrap and return the final Zod code string.
	 */
	text(): string {
		let finalCode = this._baseText;

		// Apply modifiers in stable order to match previous string-based output
		if (this._describeText) {
			finalCode = applyDescribe(finalCode, this._describeText);
		}
		if (this._nullable) {
			finalCode = applyNullable(finalCode);
		}
		if (this._defaultValue !== undefined) {
			finalCode = applyDefault(finalCode, this._defaultValue);
		}
		if (this._brandText) {
			finalCode = applyBrand(finalCode, this._brandText);
		}
		if (this._readonly) {
			finalCode = applyReadonly(finalCode);
		}
		if (this._optional) {
			finalCode = applyOptional(finalCode);
		}
		if (this._fallbackText !== undefined) {
			finalCode = applyCatch(finalCode, this._fallbackText);
		}

		return finalCode;
	}
}
