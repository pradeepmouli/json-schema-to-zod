import { Jsonifiable } from 'type-fest';
import type { JSONSchema } from 'json-schema-typed/draft-2020-12';
import type { transformer } from './JsonSchema/index.js';

export type Serializable = Jsonifiable;

// Type aliases for backward compatibility
export type JsonSchema = JSONSchema;
export type JsonSchemaObject = JSONSchema.Interface & {
	// Custom extensions
	errorMessage?: { [key: string]: string | undefined };
	nullable?: boolean; // OpenAPI 3.0 extension
};

export type ParserSelector = (
	schema: JsonSchemaObject,
	refs: Context,
) => import('./ZodBuilder/index.js').BaseBuilder;
export type ParserOverride = (
	schema: JsonSchemaObject,
	refs: Context,
) => import('./ZodBuilder/index.js').BaseBuilder | string | void;

export type ZodVersion = 'v3' | 'v4';

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
	/** Zod version to target for generated code (default: 'v4') */
	zodVersion?: ZodVersion;
};

export type Context = Options & {
	path: (string | number)[];
	seen: Map<
		object | boolean,
		{ n: number; r: import('./ZodBuilder/index.js').BaseBuilder | undefined }
	>;
};
