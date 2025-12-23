import { Jsonifiable } from 'type-fest';
import type { transformer } from './JsonSchema/index.js';

export type Serializable = Jsonifiable;

export type JsonSchema = JsonSchemaObject | boolean | { $ref: string };
export type JsonSchemaObject = {
	// left permissive by design
	type?: string | string[];

	// object
	properties?: { [key: string]: JsonSchema };
	additionalProperties?: JsonSchema;
	unevaluatedProperties?: JsonSchema;
	patternProperties?: { [key: string]: JsonSchema };
	minProperties?: number;
	maxProperties?: number;
	required?: string[] | boolean;
	propertyNames?: JsonSchema;

	// array
	items?: JsonSchema | JsonSchema[];
	additionalItems?: JsonSchema;
	minItems?: number;
	maxItems?: number;
	uniqueItems?: boolean;

	// string
	minLength?: number;
	maxLength?: number;
	pattern?: string;
	format?: string;

	// number
	minimum?: number;
	maximum?: number;
	exclusiveMinimum?: number | boolean;
	exclusiveMaximum?: number | boolean;
	multipleOf?: number;

	// unions
	anyOf?: JsonSchema[];
	allOf?: JsonSchema[];
	oneOf?: JsonSchema[];

	if?: JsonSchema;
	then?: JsonSchema;
	else?: JsonSchema;

	// shared
	const?: Serializable;
	enum?: Serializable[];

	errorMessage?: { [key: string]: string | undefined };
} & { [key: string]: any };

export type ParserSelector = (
	schema: JsonSchemaObject,
	refs: Context,
) => import('./ZodBuilder/index.js').BaseBuilder;
export type ParserOverride = (
	schema: JsonSchemaObject,
	refs: Context,
) => import('./ZodBuilder/index.js').BaseBuilder | string | void;

export type Options = {
	name?: string;
	module?: 'cjs' | 'esm' | 'none';
	withoutDefaults?: boolean;
	withoutDescribes?: boolean;
	withJsdocs?: boolean;
	parserOverride?: ParserOverride;
	depth?: number;
	type?: boolean | string;
	noImport?: boolean;
	preferUnions?: boolean;
	disableRefs?: boolean;
	preprocessors?: transformer[];
};

export type Context = Options & {
	path: (string | number)[];
	seen: Map<
		object | boolean,
		{ n: number; r: import('./ZodBuilder/index.js').BaseBuilder | undefined }
	>;
};
