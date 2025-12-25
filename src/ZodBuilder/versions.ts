/**
 * Version-specific type definitions for Zod builders.
 * This file defines which builder methods are available in each Zod version.
 */

import type { ZodBuilder } from './BaseBuilder.js';

// V4-only builder types (not available in v3)
export type V4OnlyBuilders = {
	promise: (innerSchema: ZodBuilder) => ZodBuilder;
	lazy: (getter: string) => ZodBuilder;
	function: (functionSignature?: {
		input?: ZodBuilder[];
		output?: ZodBuilder;
	}) => ZodBuilder;
	codec: (inSchema: ZodBuilder, outSchema: ZodBuilder) => ZodBuilder;
	preprocess: (transformFn: string, schema: ZodBuilder) => ZodBuilder;
	pipe: (sourceSchema: ZodBuilder, targetSchema: ZodBuilder) => ZodBuilder;
	json: () => ZodBuilder;
	file: () => ZodBuilder;
	nativeEnum: (enumReference: string) => ZodBuilder;
	templateLiteral: (parts: (string | ZodBuilder)[]) => ZodBuilder;
	xor: (schemas: ZodBuilder[]) => ZodBuilder;
	keyof: (objectSchema: ZodBuilder) => ZodBuilder;
};

// Core builders available in both v3 and v4
export type CoreBuilders = {
	number: () => ZodBuilder;
	string: () => ZodBuilder;
	boolean: () => ZodBuilder;
	null: () => ZodBuilder;
	array: (itemSchemaZod: ZodBuilder | ZodBuilder[]) => ZodBuilder;
	object: (properties?: Record<string, ZodBuilder>) => ZodBuilder;
	enum: (values: any[]) => ZodBuilder;
	literal: (value: any) => ZodBuilder;
	any: () => ZodBuilder;
	never: () => ZodBuilder;
	unknown: () => ZodBuilder;
	literalValue: (value: any) => ZodBuilder;
	code: (code: string) => ZodBuilder;
	raw: (code: string) => ZodBuilder;
	union: (schemas: ZodBuilder[]) => ZodBuilder;
	intersection: (left: ZodBuilder, right: ZodBuilder) => ZodBuilder;
	tuple: (items: ZodBuilder[]) => ZodBuilder;
	record: (keySchema: ZodBuilder, valueSchema: ZodBuilder) => ZodBuilder;
	void: () => ZodBuilder;
	undefined: () => ZodBuilder;
	date: () => ZodBuilder;
	bigint: () => ZodBuilder;
	symbol: () => ZodBuilder;
	nan: () => ZodBuilder;
	set: (itemSchema: ZodBuilder) => ZodBuilder;
	map: (keySchema: ZodBuilder, valueSchema: ZodBuilder) => ZodBuilder;
	custom: (validateFn?: string, params?: any) => ZodBuilder;
	discriminatedUnion: (
		discriminator: string,
		schemas: ZodBuilder[],
	) => ZodBuilder;
};

// V3 build API (core builders only)
export type V3BuildAPI = CoreBuilders;

// V4 build API (core builders + v4-only builders)
export type V4BuildAPI = CoreBuilders & V4OnlyBuilders;
