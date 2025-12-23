import { JsonSchemaObject, JsonSchema, Context } from '../../Types.js';
import { BaseBuilder, build } from '../../ZodBuilder/index.js';
import { parseSchema } from './parseSchema.js';

export const parseOneOf = (
	schema: JsonSchemaObject & { oneOf: JsonSchema[] },
	refs: Context,
): BaseBuilder => {
	const schemaBuilders = schema.oneOf.map((schema, i) =>
		parseSchema(schema, {
			...refs,
			path: [...refs.path, 'oneOf', i],
		}),
	);

	return schema.oneOf.length
		? schema.oneOf.length === 1
			? schemaBuilders[0]
			: build.xor(schemaBuilders)
		: build.any();
};
