import { JsonSchemaObject, JsonSchema, Refs } from '../Types.js';
import { BaseBuilder, UnionBuilder } from '../ZodBuilder/index.js';
import { parseSchema } from './parseSchema.js';

export const parseAnyOf = (
	schema: JsonSchemaObject & { anyOf: JsonSchema[] },
	refs: Refs,
): BaseBuilder<any> => {
	if (!schema.anyOf.length) return new BaseBuilder('z.any()');

	if (schema.anyOf.length === 1) {
		return parseSchema(schema.anyOf[0], {
			...refs,
			path: [...refs.path, 'anyOf', 0],
		});
	}

	const parts = schema.anyOf.map((sub, i) =>
		parseSchema(sub, { ...refs, path: [...refs.path, 'anyOf', i] }),
	);
	return new UnionBuilder(parts);
};
