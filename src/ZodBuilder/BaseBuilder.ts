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
 * 
 * Template Method Pattern:
 * - base(): Computes the type-specific schema string (must be overridden)
 * - modify(): Applies shared modifiers to the base schema
 * - text(): Orchestrates base() and modify() to produce final output
 */
export abstract class BaseBuilder<T extends BaseBuilder<T>> {
	_optional: boolean = false;
	_nullable: boolean = false;
	_readonly: boolean = false;
	_defaultValue?: any = undefined;

	_describeText?: string = undefined;
	_brandText?: string = undefined;
	_fallbackText?: any = undefined;

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
	 * Compute the type-specific base schema string.
	 * Subclasses must override this to provide their specific schema generation.
	 */
	protected abstract base(): string;

	/**
	 * Apply all shared modifiers to the base schema string.
	 * This method is called by text() and applies modifiers in a stable order.
	 */
	protected modify(baseText: string): string {
		let result = baseText;

		// Apply modifiers in stable order to match previous string-based output
		if (this._describeText) {
			result = applyDescribe(result, this._describeText);
		}
		if (this._nullable) {
			result = applyNullable(result);
		}
		if (this._defaultValue !== undefined) {
			result = applyDefault(result, this._defaultValue);
		}
		if (this._brandText) {
			result = applyBrand(result, this._brandText);
		}
		if (this._readonly) {
			result = applyReadonly(result);
		}
		if (this._optional) {
			result = applyOptional(result);
		}
		if (this._fallbackText !== undefined) {
			result = applyCatch(result, this._fallbackText);
		}

		return result;
	}

	/**
	 * Unwrap and return the final Zod code string.
	 * This orchestrates the template method pattern: text() = modify(base())
	 */
	text(): string {
		return this.modify(this.base());
	}
}
