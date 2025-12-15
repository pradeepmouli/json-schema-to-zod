import { applyBrand, applyDefault, applyDescribe, applyNullable, applyOptional } from './modifiers';

/**
 * BaseBuilder: Abstract base class for all Zod schema builders.
 * Provides shared modifier methods that apply to all schema types.
 */
export abstract class BaseBuilder<T extends BaseBuilder<T>> {

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
    const { applyOptional } = require("./modifiers.js");
    this._baseText = applyOptional(this._baseText);
    return this as unknown as T;
  }

  /**
   * Apply nullable constraint.
   */
  nullable(): T {
	this._nullable = true;
    const { applyNullable } = require("./modifiers.js");
    this._baseText = applyNullable(this._baseText);
    return this as unknown as T;
  }

  /**
   * Apply default value.
   */
  default(value: any): T {
	this._defaultValue = value;
    const { applyDefault } = require("./modifiers.js");
    this._baseText = applyDefault(this._baseText, value);
    return this as unknown as T;
  }

  /**
   * Apply describe modifier.
   */
  describe(description: string): T {
	this._describeText = description;
    const { applyDescribe } = require("./modifiers.js");
    this._baseText = applyDescribe(this._baseText, description);
    return this as unknown as T;
  }

  /**
   * Apply brand modifier.
   */
  brand(brand: string): T {
	this._brandText = brand;
    const { applyBrand } = require("./modifiers.js");
    this._baseText = applyBrand(this._baseText, brand);
    return this as unknown as T;
  }

  /**
   * Apply readonly modifier.
   */
  readonly(): T {
	this._readonly = true;
    const { applyReadonly } = require("./modifiers.js");
    this._baseText = applyReadonly(this._baseText);
    return this as unknown as T;
  }

  /**
   * Apply catch modifier.
   */
  catch(fallback: any): T {
    const { applyCatch } = require("./modifiers.js");
    this._baseText = applyCatch(this._baseText, fallback);
    return this as unknown as T;
  }

  /**
   * Unwrap and return the final Zod code string.
   */
  text(): string {
	let finalCode = this._baseText;

	if (this._optional) {
		finalCode = applyOptional(finalCode);
	}
	if (this._nullable) {
		finalCode = applyNullable(finalCode);
	}
	if (this._defaultValue !== undefined) {
		finalCode = applyDefault(finalCode, this._defaultValue);
	}
	if (this._describeText) {
		finalCode = applyDescribe(finalCode, this._describeText);
	}
	if (this._brandText) {
		finalCode = applyBrand(finalCode, this._brandText);
	}

	if(this._readonly) {
		const { applyReadonly } = require("./modifiers.js");
		finalCode = applyReadonly(finalCode);
	}

	if(this._fallbackText !== undefined) {
		const { applyCatch } = require("./modifiers.js");
		finalCode = applyCatch(finalCode, this._fallbackText);
	}

	return finalCode;

  }
}
