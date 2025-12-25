/**
 * Generic modifiers that can be applied to any Zod schema.
 */

import type { TypeKind, TypeKindOf } from './index.js';

function asText(input: string): string {
	return input;
}

/**
 * Apply optional modifier to a schema.
 */
export function applyOptional(zodStr: string): string {
	return `${asText(zodStr)}.optional()`;
}

/**
 * Apply nullable modifier to a schema.
 */
export function applyNullable(zodStr: string): string {
	return `${asText(zodStr)}.nullable()`;
}

/**
 * Apply default value to a schema.
 */
export function applyDefault(zodStr: string, defaultValue: any): string {
	return `${asText(zodStr)}.default(${JSON.stringify(defaultValue)})`;
}

/**
 * Apply describe modifier to a schema.
 */
export function applyDescribe(zodStr: string, description: string): string {
	return `${asText(zodStr)}.describe(${JSON.stringify(description)})`;
}

/**
 * Apply brand to a schema.
 */
export function applyBrand(zodStr: string, brand: string): string {
	return `${asText(zodStr)}.brand(${JSON.stringify(brand)})`;
}

/**
 * Apply readonly modifier to a schema.
 */
export function applyReadonly(zodStr: string): string {
	return `${asText(zodStr)}.readonly()`;
}

/**
 * Apply refine modifier.
 */
export function applyRefine(
	zodStr: string,
	refineFn: string,
	message?: string,
): string {
	return message
		? `${asText(zodStr)}.refine(${refineFn}, ${JSON.stringify(message)})`
		: `${asText(zodStr)}.refine(${refineFn})`;
}

/**
 * Apply superRefine modifier.
 */
export function applySuperRefine(zodStr: string, refineFn: string): string {
	return `${asText(zodStr)}.superRefine(${refineFn})`;
}

/**
 * Apply catch modifier with fallback value.
 */
export function applyCatch(zodStr: string, fallbackValue: any): string {
	return `${asText(zodStr)}.catch(${JSON.stringify(fallbackValue)})`;
}

/**
 * Apply meta modifier to attach metadata to a schema.
 */
export function applyMeta(
	zodStr: string,
	metadata: Record<string, any>,
): string {
	return `${asText(zodStr)}.meta(${JSON.stringify(metadata)})`;
}

/**
 * Apply transform modifier.
 */
export function applyTransform(zodStr: string, transformFn: string): string {
	return `${asText(zodStr)}.transform(${transformFn})`;
}

/**
 * BaseBuilder: Abstract base class for all Zod schema builders.
 * Provides shared modifier methods that apply to all schema types.
 *
 * Template Method Pattern:
 * - base(): Computes the type-specific schema string (must be overridden)
 * - modify(): Applies shared modifiers to the base schema
 * - text(): Orchestrates base() and modify() to produce final output
 */

export abstract class ZodBuilder<T extends string = string> {
	abstract readonly typeKind: T;
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
	_metaData?: any = undefined;
	_transformFn?: string = undefined;

	protected options?: import('../Types.js').Options;

	constructor(options?: import('../Types.js').Options) {
		this.options = options;
	}

	/**
	 * Get the target Zod version for code generation.
	 * @returns 'v3' or 'v4' (default: 'v3' for backward compatibility)
	 */
	protected get zodVersion(): import('../Types.js').ZodVersion {
		return this.options?.zodVersion || 'v3';
	}

	/**
	 * Check if targeting Zod v4.
	 */
	protected isV4(): boolean {
		return this.zodVersion === 'v4';
	}

	/**
	 * Check if targeting Zod v3.
	 */
	protected isV3(): boolean {
		return this.zodVersion === 'v3';
	}

	/**
	 * Generate version-appropriate error message parameter for Zod methods.
	 * @param message - Error message string
	 * @returns Parameter string with leading comma (e.g., ', { error: "msg" }') or empty string
	 * @example
	 * // v4 mode
	 * `z.email()${this.withErrorMessage('Invalid email')}`
	 * // => 'z.email({ error: "Invalid email" })'
	 *
	 * // v3 mode
	 * `z.string().email()${this.withErrorMessage('Invalid email')}`
	 * // => 'z.string().email({ message: "Invalid email" })'
	 */
	protected withErrorMessage(message?: string): string {
		if (!message) return '';
		const param = this.isV4() ? 'error' : 'message';
		return `, { ${param}: ${JSON.stringify(message)} }`;
	}

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
	 * Apply meta modifier.
	 */
	meta(metadata: Record<string, any>): this {
		this._metaData = metadata;
		return this;
	}

	/**
	 * Apply transform modifier.
	 *
	 * Note: function is provided as raw code string e.g. `(val) => transformedVal`.
	 */
	transform(transformFn: string): this {
		this._transformFn = transformFn;
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

	is<T extends keyof TypeKind>(type: T | keyof T): this is TypeKindOf<T> {
		return this.typeKind === type;
	}

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
		if (this._metaData !== undefined) {
			result = applyMeta(result, this._metaData);
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
		if (this._transformFn) {
			result = applyTransform(result, this._transformFn);
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

	toString(): string {
		return this.text();
	}
}
