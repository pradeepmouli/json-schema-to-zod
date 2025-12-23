export { toZod } from './toZod.js';
import { parseAllOf } from './parsers/parseAllOf.js';
import { parseAnyOf } from './parsers/parseAnyOf.js';
import { parseArray } from './parsers/parseArray.js';
import { parseBoolean } from './parsers/parseBoolean.js';
import { parseConst } from './parsers/parseConst.js';
import { parseDefault } from './parsers/parseDefault.js';
import { parseEnum } from './parsers/parseEnum.js';
import { parseIfThenElse } from './parsers/parseIfThenElse.js';
import { parseMultipleType } from './parsers/parseMultipleType.js';
import { parseNot } from './parsers/parseNot.js';
import { parseNull } from './parsers/parseNull.js';
import { parseNullable } from './parsers/parseNullable.js';
import { parseNumber } from './parsers/parseNumber.js';
import { parseObject } from './parsers/parseObject.js';
import { parseOneOf } from './parsers/parseOneOf.js';
import { parseSchema } from './parsers/parseSchema.js';
import { parseString } from './parsers/parseString.js';
import { its } from './its.js';
import type { JsonSchemaObject, Context } from '../Types.js';

export const parse = {
	array: parseArray,
	object: parseObject,
	integer: parseInt,
	boolean: parseBoolean,
	string: parseString,
	number: parseNumber,
	null: parseNull,
	enum: parseEnum,
	allOf: parseAllOf,
	anyOf: parseAnyOf,
	const: parseConst,
	default: parseDefault,
	ifThenElse: parseIfThenElse,
	multipleType: parseMultipleType,
	not: parseNot,
	nullable: parseNullable,
	oneOf: parseOneOf,
	schema: parseSchema,
	discriminator: undefined, // to be implemented
};

export type transformer = (schema: JsonSchemaObject, refs: Context) => JsonSchemaObject | undefined;


export function select(schema: any) {
	if (its.an.object(schema)) {
		return parse.object;
	} else if (its.an.array(schema)) {
		return parse.array;
	} else if (its.a.primitive(schema, 'string')) {
		return parse.string;
	} else if (
		its.a.primitive(schema, 'number') ||
		its.a.primitive(schema, 'integer')
	) {
		return parse.number;
	} else if (its.a.primitive(schema, 'boolean')) {
		return parse.boolean;
	} else if (its.a.primitive(schema, 'null')) {
		return parse.null;
	} else if (its.an.enum(schema)) {
		return parse.enum;
	} else {
		return parse.schema;
	}
}
