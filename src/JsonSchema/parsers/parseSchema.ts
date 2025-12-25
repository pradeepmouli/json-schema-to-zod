import { parseAnyOf } from './parseAnyOf.js';
import { parseBoolean } from './parseBoolean.js';
import { parseDefault } from './parseDefault.js';
import { parseMultipleType } from './parseMultipleType.js';
import { parseNot } from './parseNot.js';
import { parseNull } from './parseNull.js';
import { parseAllOf } from './parseAllOf.js';
import { parseArray } from './parseArray.js';
import { parseConst } from './parseConst.js';
import { parseEnum } from './parseEnum.js';
import { parseIfThenElse } from './parseIfThenElse.js';
import { parseNumber } from './parseNumber.js';
import { parseObject } from './parseObject.js';
import { parseString } from './parseString.js';
import { parseOneOf } from './parseOneOf.js';
import { parseNullable } from './parseNullable.js';
import {
	ParserSelector,
	Context,
	JsonSchemaObject,
	JsonSchema,
} from '../../Types.js';
import { BaseBuilder, build } from '../../ZodBuilder/index.js';
import { ZodBuilder } from '../../ZodBuilder/BaseBuilder.js';
import { its } from '../its.js';

export const parseSchema = (
	schema: JsonSchema,
	refs: Context = { seen: new Map(), path: [] },
	blockMeta?: boolean,
): ZodBuilder => {
	if (typeof schema !== 'object') return schema ? build.any() : build.never();

	if (refs.preprocessors) {
		for (const preprocessor of refs.preprocessors) {
			const output = preprocessor(schema as JsonSchemaObject, refs);
			if (output) schema = output;
		}
	}
	if (refs.parserOverride) {
		const custom = refs.parserOverride(schema, refs);

		if (typeof custom === 'string') {
			return build.code(custom);
		}

		if (custom instanceof ZodBuilder) {
			return custom;
		}
	}

	let seen = refs.seen.get(schema);

	if (seen) {
		if (seen.r !== undefined) {
			return seen.r;
		}

		if (refs.depth === undefined || seen.n >= refs.depth) {
			return build.any();
		}

		seen.n += 1;
	} else {
		seen = { r: undefined, n: 0 };
		refs.seen.set(schema, seen);
	}

	let parsed = selectParser(schema, refs);
	if (!blockMeta) {
		if (!refs.withoutDescribes) {
			parsed = addDescribes(schema, parsed);
		}

		if (!refs.withoutDefaults) {
			parsed = addDefaults(schema, parsed);
		}

		parsed = addAnnotations(schema, parsed);
	}

	seen.r = parsed;

	return parsed;
};

const addDescribes = (
	schema: JsonSchemaObject,
	builder: BaseBuilder,
): BaseBuilder => {
	if (schema.description) {
		return builder.describe(schema.description);
	}

	return builder;
};

const addDefaults = (
	schema: JsonSchemaObject,
	builder: BaseBuilder,
): BaseBuilder => {
	if (schema.default !== undefined) {
		return builder.default(schema.default);
	}

	return builder;
};

const addAnnotations = (
	schema: JsonSchemaObject,
	builder: BaseBuilder,
): BaseBuilder => {
	if (schema.readOnly) {
		return builder.readonly();
	}

	return builder;
};

const selectParser: ParserSelector = (schema, refs) => {
	if (its.a.nullable(schema)) {
		return parseNullable(schema, refs);
	} else if (its.an.object(schema)) {
		return parseObject(schema, refs);
	} else if (its.an.array(schema)) {
		return parseArray(schema, refs);
	} else if (its.an.anyOf(schema)) {
		return parseAnyOf(schema, refs);
	} else if (its.an.allOf(schema)) {
		return parseAllOf(schema, refs);
	} else if (its.a.oneOf(schema)) {
		return parseOneOf(schema, refs);
	} else if (its.a.not(schema)) {
		return parseNot(schema, refs);
	} else if (its.an.enum(schema)) {
		return parseEnum(schema, refs); //<-- needs to come before primitives
	} else if (its.a.const(schema)) {
		return parseConst(schema, refs);
	} else if (its.a.multipleType(schema)) {
		return parseMultipleType(schema, refs);
	} else if (its.a.primitive(schema, 'string')) {
		return parseString(schema, refs);
	} else if (
		its.a.primitive(schema, 'number') ||
		its.a.primitive(schema, 'integer')
	) {
		return parseNumber(schema, refs);
	} else if (its.a.primitive(schema, 'boolean')) {
		return parseBoolean(schema, refs);
	} else if (its.a.primitive(schema, 'null')) {
		return parseNull(schema, refs);
	} else if (its.a.conditional(schema)) {
		return parseIfThenElse(schema, refs);
	} else {
		return parseDefault(schema, refs);
	}
};
