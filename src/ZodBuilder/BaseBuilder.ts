import {
	applyBrand,
	applyCatch,
	applyDefault,
	applyDescribe,
	applyNullable,
	applyOptional,
	applyRefine,
	applyReadonly,
	applySuperRefine,
} from './modifiers.js';

/**
 * BaseBuilder: Abstract base class for all Zod schema builders.
 * Provides shared modifier methods that apply to all schema types.
 *
 * Template Method Pattern:
 * - base(): Computes the type-specific schema string (must be overridden)
 * - modify(): Applies shared modifiers to the base schema
 * - text(): Orchestrates base() and modify() to produce final output
 */
export abstract class BaseBuilder {
	_optional: boolean = false;
	_nullable: boolean = false;
	_readonly: boolean = false;
	_defaultValue?: any = undefined;

	_describeText?: string = undefined;
	_brandText?: string = undefined;
	_fallbackText?: any = undefined;
	_refineFn?: string = undefined;
	_refineMessage?: string = undefined;
	_superRefineFns: string[] = [];

	/**
	 * Apply optional constraint.
	 */
	optional(): this {
		this._optional = true;
		return this;
	}

	/**
	 * Apply nullable constraint.
	 */
	nullable(): this {
		this._nullable = true;
		return this;
	}

	/**
	 * Apply default value.
	 */
	default(value: any): this {
		this._defaultValue = value;
		return this;
	}

	/**
	 * Apply describe modifier.
	 */
	describe(description: string): this {
		this._describeText = description;
		return this;
	}

	/**
	 * Apply brand modifier.
	 */
	brand(brand: string): this {
		this._brandText = brand;
		return this;
	}

	/**
	 * Apply readonly modifier.
	 */
	readonly(): this {
		this._readonly = true;
		return this;
	}

	/**
	 * Apply catch modifier.
	 */
	catch(fallback: any): this {
		this._fallbackText = fallback;
		return this;
	}

	/**
	 * Apply refine modifier.
	 *
	 * Note: function is provided as raw code string e.g. `(val) => val > 0`.
	 */
	refine(refineFn: string, message?: string): this {
		this._refineFn = refineFn;
		this._refineMessage = message;
		return this;
	}

	/**
	 * Apply superRefine modifier.
	 *
	 * Note: function is provided as raw code string e.g. `(val, ctx) => { ... }`.
	 */
	superRefine(superRefineFn: string): this {
		this._superRefineFns.push(superRefineFn);
		return this;
	}

	/**
	 * Compute the type-specific base schema string.
	 *
	 * This is the core abstract method in the template method pattern.
	 * Subclasses must implement this to provide their type-specific schema string
	 * (e.g., "z.string()", "z.number()", "z.object({...})").
	 *
	 * The base schema string returned by this method will then have shared modifiers
	 * applied via the `modify()` method when `text()` is called.
	 *
	 * @returns The base Zod schema string without any modifiers applied
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
		if (this._refineFn) {
			result = applyRefine(result, this._refineFn, this._refineMessage);
		}
		if (this._superRefineFns.length > 0) {
			const seen = new Set<string>();
			for (const fn of this._superRefineFns) {
				if (seen.has(fn)) continue;
				seen.add(fn);
				result = applySuperRefine(result, fn);
			}
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
