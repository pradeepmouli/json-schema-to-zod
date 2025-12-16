// Base builder class
export { BaseBuilder } from './BaseBuilder.js';

// Utility builders
export { GenericBuilder, buildGeneric } from './generic.js';

// Base builders (primitive data → Zod code)
export { BooleanBuilder, buildBoolean } from './boolean.js';
export { NullBuilder, buildNull } from './null.js';
export { ConstBuilder, buildLiteral, buildConst } from './const.js';
export { EnumBuilder, buildEnum } from './enum.js';
export {
	NumberBuilder,
	buildNumber,
	applyInt,
	applyMultipleOf,
	applyMin as applyNumberMin,
	applyMax as applyNumberMax,
} from './number.js';
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
} from './string.js';
export {
	ArrayBuilder,
	buildArray,
	buildTuple,
	applyMinItems,
	applyMaxItems,
} from './array.js';
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
} from './object.js';

// New builders (Phase 1)
export { AnyBuilder, buildAny } from './any.js';
export { NeverBuilder, buildNever } from './never.js';
export { UnknownBuilder, buildUnknown } from './unknown.js';
export { LiteralBuilder, buildLiteralValue } from './literal.js';
export { UnionBuilder, buildUnion } from './union.js';
export { IntersectionBuilder, buildIntersection } from './intersection.js';
export { DiscriminatedUnionBuilder, buildDiscriminatedUnion } from './discriminatedUnion.js';
export { TupleBuilder, buildTupleSchema } from './tuple.js';
export { RecordBuilder, buildRecordSchema } from './record.js';

// Import builder classes for the factory
import { NumberBuilder } from './number.js';
import { StringBuilder } from './string.js';
import { BooleanBuilder } from './boolean.js';
import { NullBuilder } from './null.js';
import { ArrayBuilder } from './array.js';
import { ObjectBuilder } from './object.js';
import { EnumBuilder } from './enum.js';
import { ConstBuilder } from './const.js';
import { AnyBuilder } from './any.js';
import { NeverBuilder } from './never.js';
import { UnknownBuilder } from './unknown.js';
import { LiteralBuilder } from './literal.js';
import { UnionBuilder } from './union.js';
import { IntersectionBuilder } from './intersection.js';
import { TupleBuilder } from './tuple.js';
import { RecordBuilder } from './record.js';

// Generic modifiers
export {
	applyOptional,
	applyNullable,
	applyDefault,
	applyDescribe,
	applyBrand,
	applyReadonly,
	applyCatch,
} from './modifiers.js';

// Builder factories - Zod-like API
export const build = {
	number: () => new NumberBuilder(),
	string: () => new StringBuilder(),
	boolean: () => new BooleanBuilder(),
	null: () => new NullBuilder(),
	array: (itemSchemaZod: import('./BaseBuilder.js').BaseBuilder | string) => new ArrayBuilder(itemSchemaZod),
	object: (properties: Record<string, import('./BaseBuilder.js').BaseBuilder | string> = {}) =>
		new ObjectBuilder(properties),
	enum: (values: import('../Types.js').Serializable[]) =>
		new EnumBuilder(values),
	literal: (value: import('../Types.js').Serializable) =>
		new ConstBuilder(value),
	// New builders
	any: () => new AnyBuilder(),
	never: () => new NeverBuilder(),
	unknown: () => new UnknownBuilder(),
	literalValue: (value: import('../Types.js').Serializable) => new LiteralBuilder(value),
	union: (schemas: (import('./BaseBuilder.js').BaseBuilder | string)[]) => new UnionBuilder(schemas),
	intersection: (left: import('./BaseBuilder.js').BaseBuilder | string, right: import('./BaseBuilder.js').BaseBuilder | string) => 
		new IntersectionBuilder(left, right),
	tuple: (items: (import('./BaseBuilder.js').BaseBuilder | string)[]) => new TupleBuilder(items),
	record: (keySchema: import('./BaseBuilder.js').BaseBuilder | string, valueSchema: import('./BaseBuilder.js').BaseBuilder | string) => 
		new RecordBuilder(keySchema, valueSchema),
};
