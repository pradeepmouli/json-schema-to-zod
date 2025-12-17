// Base builder class
export { BaseBuilder } from './BaseBuilder.js';

// Base builders (primitive data → Zod code)
export { BooleanBuilder } from './boolean.js';
export { NullBuilder } from './null.js';
export { ConstBuilder } from './const.js';
export { EnumBuilder } from './enum.js';

export {
	NumberBuilder,
	applyInt,
	applyMultipleOf,
	applyMin as applyNumberMin,
	applyMax as applyNumberMax,
} from './number.js';
export {
	StringBuilder,
	applyFormat,
	applyPattern,
	applyMinLength,
	applyMaxLength,
	applyBase64,
	applyJsonTransform,
	applyPipe,
} from './string.js';
export { ArrayBuilder, applyMinItems, applyMaxItems } from './array.js';
export {
	ObjectBuilder,
	applyStrict,
	applyCatchall,
	applyLoose,
	applyPassthrough,
	applyAnd,
} from './object.js';

// New builders (Phase 1)
export { AnyBuilder } from './any.js';
export { NeverBuilder } from './never.js';
export { UnknownBuilder } from './unknown.js';
export { LiteralBuilder } from './literal.js';
export { UnionBuilder } from './union.js';
export { IntersectionBuilder } from './intersection.js';
export { DiscriminatedUnionBuilder } from './discriminatedUnion.js';
export { TupleBuilder } from './tuple.js';
export { RecordBuilder } from './record.js';

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
import { GenericBuilder } from './generic.js';

// Generic modifiers
export {
	applyOptional,
	applyNullable,
	applyDefault,
	applyDescribe,
	applyBrand,
	applyReadonly,
	applyCatch,
	applyRefine,
	applySuperRefine,
} from './modifiers.js';


// Builder factories - Zod-like API
export const build = {
	number: () => new NumberBuilder(),
	string: () => new StringBuilder(),
	boolean: () => new BooleanBuilder(),
	null: () => new NullBuilder(),

	array: (
		items:
			| import('./BaseBuilder.js').BaseBuilder
			| import('./BaseBuilder.js').BaseBuilder[],
	) => new ArrayBuilder(items),
	object: (
		properties: Record<string, import('./BaseBuilder.js').BaseBuilder> = {},
	) => new ObjectBuilder(properties),
	enum: (values: import('../Types.js').Serializable[]) =>
		new EnumBuilder(values),
	literal: (value: import('../Types.js').Serializable) =>
		new ConstBuilder(value),
	// New builders
	any: () => new AnyBuilder(),
	never: () => new NeverBuilder(),
	unknown: () => new UnknownBuilder(),
	literalValue: (value: import('../Types.js').Serializable) =>
		new LiteralBuilder(value),
	// Escape hatch for raw Zod code
	code: (code: string) => new GenericBuilder(code),
	raw: (code: string) => new GenericBuilder(code),
	union: (schemas: import('./BaseBuilder.js').BaseBuilder[]) =>
		new UnionBuilder(schemas),
	intersection: (
		left: import('./BaseBuilder.js').BaseBuilder,
		right: import('./BaseBuilder.js').BaseBuilder,
	) => new IntersectionBuilder(left, right),
	tuple: (items: import('./BaseBuilder.js').BaseBuilder[]) =>
		new TupleBuilder(items),
	record: (
		keySchema: import('./BaseBuilder.js').BaseBuilder,
		valueSchema: import('./BaseBuilder.js').BaseBuilder,
	) => new RecordBuilder(keySchema, valueSchema),
};
