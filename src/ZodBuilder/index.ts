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
export { KeyofBuilder } from './keyof.js';

// Zod v4 string format builders
export { EmailBuilder } from './email.js';
export { UrlBuilder } from './url.js';
export { UuidBuilder } from './uuid.js';
export { DatetimeBuilder } from './datetime.js';
export { TimeBuilder } from './time.js';
export { DurationBuilder } from './duration.js';
export { IpBuilder } from './ip.js';
export { Base64Builder } from './base64.js';
export { EmojiBuilder } from './emoji.js';
export { CuidBuilder } from './cuid.js';
export { UlidBuilder } from './ulid.js';
export { NanoidBuilder } from './nanoid.js';

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
import { KeyofBuilder } from './keyof.js';
import { DiscriminatedUnionBuilder } from './discriminatedUnion.js';

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
const coreBuilders = {
	number: (options?: import('../Types.js').Options) =>
		new NumberBuilder(options),
	string: (options?: import('../Types.js').Options) =>
		new StringBuilder(options),
	boolean: (options?: import('../Types.js').Options) =>
		new BooleanBuilder(options),
	null: (options?: import('../Types.js').Options) => new NullBuilder(options),
	array: (
		itemSchemaZod:
			| import('./BaseBuilder.js').ZodBuilder
			| import('./BaseBuilder.js').ZodBuilder[],
		options?: import('../Types.js').Options,
	) => new ArrayBuilder(itemSchemaZod, options),
	object: (
		properties: Record<string, import('./BaseBuilder.js').ZodBuilder> = {},
		options?: import('../Types.js').Options,
	) => new ObjectBuilder(properties, options),
	enum: (
		values: import('../Types.js').Serializable[],
		options?: import('../Types.js').Options,
	) => new EnumBuilder(values, options),
	literal: (
		value: import('../Types.js').Serializable,
		options?: import('../Types.js').Options,
	) => new ConstBuilder(value, options),
	// New builders
	any: (options?: import('../Types.js').Options) => new AnyBuilder(options),
	never: (options?: import('../Types.js').Options) => new NeverBuilder(options),
	unknown: (options?: import('../Types.js').Options) =>
		new UnknownBuilder(options),
	literalValue: (
		value: import('../Types.js').Serializable,
		options?: import('../Types.js').Options,
	) => new LiteralBuilder(value, options),
	// Escape hatch for raw Zod code
	code: (code: string, options?: import('../Types.js').Options) =>
		new GenericBuilder(code, options),
	raw: (code: string, options?: import('../Types.js').Options) =>
		new GenericBuilder(code, options),
	union: (
		schemas: import('./BaseBuilder.js').ZodBuilder[],
		options?: import('../Types.js').Options,
	) => new UnionBuilder(schemas, options),
	intersection: (
		left: import('./BaseBuilder.js').ZodBuilder,
		right: import('./BaseBuilder.js').ZodBuilder,
		options?: import('../Types.js').Options,
	) => new IntersectionBuilder(left, right, options),
	tuple: (
		items: import('./BaseBuilder.js').ZodBuilder[],
		options?: import('../Types.js').Options,
	) => new TupleBuilder(items, options),
	record: (
		keySchema: import('./BaseBuilder.js').ZodBuilder,
		valueSchema: import('./BaseBuilder.js').ZodBuilder,
		options?: import('../Types.js').Options,
	) => new RecordBuilder(keySchema, valueSchema, options),
	// Additional type builders
	void: (options?: import('../Types.js').Options) => new VoidBuilder(options),
	undefined: (options?: import('../Types.js').Options) =>
		new UndefinedBuilder(options),
	date: (options?: import('../Types.js').Options) => new DateBuilder(options),
	bigint: (options?: import('../Types.js').Options) =>
		new BigIntBuilder(options),
	symbol: (options?: import('../Types.js').Options) =>
		new SymbolBuilder(options),
	nan: (options?: import('../Types.js').Options) => new NaNBuilder(options),
	set: (
		itemSchema: import('./BaseBuilder.js').ZodBuilder,
		options?: import('../Types.js').Options,
	) => new SetBuilder(itemSchema, options),
	map: (
		keySchema: import('./BaseBuilder.js').ZodBuilder,
		valueSchema: import('./BaseBuilder.js').ZodBuilder,
		options?: import('../Types.js').Options,
	) => new MapBuilder(keySchema, valueSchema, options),
	custom: (
		validateFn?: string,
		params?: any,
		options?: import('../Types.js').Options,
	) => new CustomBuilder(validateFn, params, options),
	discriminatedUnion: (
		discriminator: string,
		schemas: import('./BaseBuilder.js').ZodBuilder<string>[],
		options?: import('../Types.js').Options,
	) => new DiscriminatedUnionBuilder(discriminator, schemas as any, options),
} as const;
const v4OnlyBuilders = {
	// Zod v4 builders
	promise: (
		innerSchema: import('./BaseBuilder.js').ZodBuilder,
		options?: import('../Types.js').Options,
	) => new PromiseBuilder(innerSchema, options),
	lazy: (
		input: import('./BaseBuilder.js').ZodBuilder,
		options?: import('../Types.js').Options,
	) => new LazyBuilder(input, options),
	function: (
		functionSignature: {
			input?: import('./BaseBuilder.js').ZodBuilder[];
			output?: import('./BaseBuilder.js').ZodBuilder;
		},
		options?: import('../Types.js').Options,
	) => new FunctionBuilder(functionSignature, options),
	codec: (
		inSchema: import('./BaseBuilder.js').ZodBuilder,
		outSchema: import('./BaseBuilder.js').ZodBuilder,
		options?: import('../Types.js').Options,
	) => new CodecBuilder(inSchema, outSchema, options),
	preprocess: (
		transformFn: string,
		schema: import('./BaseBuilder.js').ZodBuilder,
		options?: import('../Types.js').Options,
	) => new PreprocessBuilder(transformFn, schema, options),
	pipe: (
		sourceSchema: import('./BaseBuilder.js').ZodBuilder,
		targetSchema: import('./BaseBuilder.js').ZodBuilder,
		options?: import('../Types.js').Options,
	) => new PipeBuilder(sourceSchema, targetSchema, options),
	json: (options?: import('../Types.js').Options) => new JsonBuilder(options),
	file: (options?: import('../Types.js').Options) => new FileBuilder(options),
	nativeEnum: (
		enumReference: string,
		options?: import('../Types.js').Options,
	) => new NativeEnumBuilder(enumReference, options),
	templateLiteral: (
		parts: (string | import('./BaseBuilder.js').ZodBuilder)[],
		options?: import('../Types.js').Options,
	) => new TemplateLiteralBuilder(parts, options),
	xor: (
		schemas: import('./BaseBuilder.js').ZodBuilder[],
		options?: import('../Types.js').Options,
	) => new XorBuilder(schemas, options),
	keyof: (
		objectSchema: import('./BaseBuilder.js').ZodBuilder,
		options?: import('../Types.js').Options,
	) => new KeyofBuilder(objectSchema, options),
} as const;

// Builder factories - Zod-like API (includes all builders for backward compatibility)
export const build = {
	...coreBuilders,
	...v4OnlyBuilders,
} as const;

export type TypeKind = {
	[T in keyof typeof build]: ReturnType<(typeof build)[T]>;
};

export type TypeKindOf<T extends keyof TypeKind> = TypeKind[T];

// Version-specific builder exports
export const buildV3 = coreBuilders;
export const buildV4 = build;

// Type exports for version-specific APIs
export type { V3BuildAPI, V4BuildAPI } from './versions.js';
