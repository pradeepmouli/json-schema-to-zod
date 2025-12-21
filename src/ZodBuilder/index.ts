// Base builder class
export { ZodBuilder as BaseBuilder } from './BaseBuilder.js';

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
	applyExtend,
	applyMerge,
	applyPick,
	applyOmit,
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

// Additional type builders
export { VoidBuilder } from './void.js';
export { UndefinedBuilder } from './undefined.js';
export { DateBuilder, applyDateMin, applyDateMax } from './date.js';
export {
	BigIntBuilder,
	applyBigIntMin,
	applyBigIntMax,
	applyBigIntMultipleOf,
} from './bigint.js';
export { SymbolBuilder } from './symbol.js';
export { NaNBuilder } from './nan.js';
export { SetBuilder, applySetMin, applySetMax, applySetSize } from './set.js';
export { MapBuilder, applyMapMin, applyMapMax, applyMapSize } from './map.js';
export { CustomBuilder } from './custom.js';

// Zod v4 builders
export { PromiseBuilder } from './promise.js';
export { LazyBuilder } from './lazy.js';
export { FunctionBuilder } from './function.js';
export { CodecBuilder } from './codec.js';
export { PreprocessBuilder } from './preprocess.js';
export { PipeBuilder } from './pipe.js';
export { JsonBuilder } from './json.js';
export { FileBuilder } from './file.js';
export { NativeEnumBuilder } from './nativeEnum.js';
export { TemplateLiteralBuilder } from './templateLiteral.js';
export { XorBuilder } from './xor.js';

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
import { VoidBuilder } from './void.js';
import { UndefinedBuilder } from './undefined.js';
import { DateBuilder } from './date.js';
import { BigIntBuilder } from './bigint.js';
import { SymbolBuilder } from './symbol.js';
import { NaNBuilder } from './nan.js';
import { SetBuilder } from './set.js';
import { MapBuilder } from './map.js';
import { CustomBuilder } from './custom.js';
import { PromiseBuilder } from './promise.js';
import { LazyBuilder } from './lazy.js';
import { FunctionBuilder } from './function.js';
import { CodecBuilder } from './codec.js';
import { PreprocessBuilder } from './preprocess.js';
import { PipeBuilder } from './pipe.js';
import { JsonBuilder } from './json.js';
import { FileBuilder } from './file.js';
import { NativeEnumBuilder } from './nativeEnum.js';
import { TemplateLiteralBuilder } from './templateLiteral.js';
import { XorBuilder } from './xor.js';
import { DiscriminatedUnionBuilder } from '../index.js';

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
	applyMeta,
	applyTransform,
} from './BaseBuilder.js';

// Builder factories - Zod-like API
export const build = {
	number: () => new NumberBuilder(),
	string: () => new StringBuilder(),
	boolean: () => new BooleanBuilder(),
	null: () => new NullBuilder(),
	array: (
		itemSchemaZod:
			| import('./BaseBuilder.js').ZodBuilder
			| import('./BaseBuilder.js').ZodBuilder[],
	) => new ArrayBuilder(itemSchemaZod),
	object: (
		properties: Record<string, import('./BaseBuilder.js').ZodBuilder> = {},
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
	union: (schemas: import('./BaseBuilder.js').ZodBuilder[]) =>
		new UnionBuilder(schemas),
	intersection: (
		left: import('./BaseBuilder.js').ZodBuilder,
		right: import('./BaseBuilder.js').ZodBuilder,
	) => new IntersectionBuilder(left, right),
	tuple: (items: import('./BaseBuilder.js').ZodBuilder[]) =>
		new TupleBuilder(items),
	record: (
		keySchema: import('./BaseBuilder.js').ZodBuilder,
		valueSchema: import('./BaseBuilder.js').ZodBuilder,
	) => new RecordBuilder(keySchema, valueSchema),
	// Additional type builders
	void: () => new VoidBuilder(),
	undefined: () => new UndefinedBuilder(),
	date: () => new DateBuilder(),
	bigint: () => new BigIntBuilder(),
	symbol: () => new SymbolBuilder(),
	nan: () => new NaNBuilder(),
	set: (itemSchema: import('./BaseBuilder.js').ZodBuilder) =>
		new SetBuilder(itemSchema),
	map: (
		keySchema: import('./BaseBuilder.js').ZodBuilder,
		valueSchema: import('./BaseBuilder.js').ZodBuilder,
	) => new MapBuilder(keySchema, valueSchema),
	custom: (validateFn?: string, params?: any) =>
		new CustomBuilder(validateFn, params),
	discriminatedUnion: (
		discriminator: string,
		options: import('./BaseBuilder.js').ZodBuilder<string>[],
	) => new DiscriminatedUnionBuilder(discriminator, options as any),
	// Zod v4 builders
	promise: (innerSchema: import('./BaseBuilder.js').ZodBuilder) =>
		new PromiseBuilder(innerSchema),
	lazy: (getter: string) => new LazyBuilder(getter),
	function: () => new FunctionBuilder(),
	codec: (
		inSchema: import('./BaseBuilder.js').ZodBuilder,
		outSchema: import('./BaseBuilder.js').ZodBuilder,
	) => new CodecBuilder(inSchema, outSchema),
	preprocess: (
		transformFn: string,
		schema: import('./BaseBuilder.js').ZodBuilder,
	) => new PreprocessBuilder(transformFn, schema),
	pipe: (
		sourceSchema: import('./BaseBuilder.js').ZodBuilder,
		targetSchema: import('./BaseBuilder.js').ZodBuilder,
	) => new PipeBuilder(sourceSchema, targetSchema),
	json: () => new JsonBuilder(),
	file: () => new FileBuilder(),
	nativeEnum: (enumReference: string) => new NativeEnumBuilder(enumReference),
	templateLiteral: (
		parts: (string | import('./BaseBuilder.js').ZodBuilder)[],
	) => new TemplateLiteralBuilder(parts),
	xor: (schemas: import('./BaseBuilder.js').ZodBuilder[]) =>
		new XorBuilder(schemas),
} as const;

export type TypeKind = {
	[T in keyof typeof build]: ReturnType<(typeof build)[T]>;
};

export type TypeKindOf<T extends keyof TypeKind> = TypeKind[T];
