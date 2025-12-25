import type { Context, Serializable } from '../../Types.js';
import type { JSONSchema } from 'json-schema-typed/draft-2020-12';
import { build } from '../../ZodBuilder/index.js';

export const parseEnum = (
	schema: JSONSchema.Interface & { enum: Serializable[] },
	refs?: Context,
) => {
	return build.enum(schema.enum, refs);
};
