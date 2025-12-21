import { JsonSchemaObject, JsonSchema, Refs } from '../../Types.js';
import type { ZodBuilder } from '../../ZodBuilder/BaseBuilder.js';
import { build, type UnionBuilder } from '../../ZodBuilder/index.js';
import { parseSchema } from './parseSchema.js';

export const parseAnyOf = (
	schema: JsonSchemaObject & { anyOf: JsonSchema[] },
	refs: Refs,
): UnionBuilder | ZodBuilder => {
	return schema.anyOf.length
		? schema.anyOf.length === 1
			? parseSchema(schema.anyOf[0], {
					...refs,
					path: [...refs.path, 'anyOf', 0],
				})
			: build.union(
					schema.anyOf.map((schema, i) =>
						parseSchema(schema, { ...refs, path: [...refs.path, 'anyOf', i] }),
					),
				)
		: build.any();
};
