// Base builders (primitive data → Zod code)
export { BooleanBuilder, buildBoolean } from "./boolean.js";
export { NullBuilder, buildNull } from "./null.js";
export { ConstBuilder, buildLiteral, buildConst } from "./const.js";
export { EnumBuilder, buildEnum } from "./enum.js";
export {
  NumberBuilder,
  buildNumber,
  applyInt,
  applyMultipleOf,
  applyMin as applyNumberMin,
  applyMax as applyNumberMax,
} from "./number.js";
export {
  StringBuilder,
  buildString,
  applyFormat,
  applyPattern,
  applyMinLength,
  applyMaxLength,
  applyBase64,
  applyJsonTransform,
  applyPipe,
} from "./string.js";
export {
  ArrayBuilder,
  buildArray,
  buildTuple,
  applyMinItems,
  applyMaxItems,
} from "./array.js";
export {
  ObjectBuilder,
  buildObject,
  buildRecord,
  applyStrict,
  applyCatchall,
  applyLoose,
  applyPassthrough,
  applySuperRefine,
  applyAnd,
} from "./object.js";

// Import builder classes for the factory
import { NumberBuilder } from "./number.js";
import { StringBuilder } from "./string.js";
import { BooleanBuilder } from "./boolean.js";
import { NullBuilder } from "./null.js";
import { ArrayBuilder } from "./array.js";
import { ObjectBuilder } from "./object.js";
import { EnumBuilder } from "./enum.js";
import { ConstBuilder } from "./const.js";

// Generic modifiers
export {
  applyOptional,
  applyNullable,
  applyDefault,
  applyDescribe,
  applyBrand,
  applyReadonly,
  applyCatch,
} from "./modifiers.js";

// Builder factories - Zod-like API
export const build = {
  number: () => new NumberBuilder(),
  string: () => new StringBuilder(),
  boolean: () => new BooleanBuilder(),
  null: () => new NullBuilder(),
  array: (itemSchemaZod: string) => new ArrayBuilder(itemSchemaZod),
  object: (properties: Record<string, string> = {}) => new ObjectBuilder(properties),
  enum: (values: import("../Types.js").Serializable[]) => new EnumBuilder(values),
  literal: (value: import("../Types.js").Serializable) => new ConstBuilder(value),
};
