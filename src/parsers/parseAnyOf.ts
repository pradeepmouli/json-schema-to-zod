import { JsonSchemaObject, JsonSchema, Refs } from '../Types.js';
import { BaseBuilder, UnionBuilder, AnyBuilder } from '../ZodBuilder/index.js';
import { parseSchema } from './parseSchema.js';

export const parseAnyOf = (
	schema: JsonSchemaObject & { anyOf: JsonSchema[] },
	refs: Refs,
): BaseBuilder<any> => {
	return schema.anyOf.length
		? schema.anyOf.length === 1
			? parseSchema(schema.anyOf[0], {
					...refs,
					path: [...refs.path, 'anyOf', 0],
				})
			: new UnionBuilder(
					schema.anyOf.map((schema, i) =>
						parseSchema(schema, { ...refs, path: [...refs.path, 'anyOf', i] }),
					),
				)
		: new AnyBuilder();
};
