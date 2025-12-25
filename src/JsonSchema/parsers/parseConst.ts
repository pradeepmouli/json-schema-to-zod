import { Context, JsonSchemaObject, Serializable } from '../../Types.js';
import { build } from '../../ZodBuilder/index.js';

export const parseConst = (
	schema: JsonSchemaObject & { const: Serializable },
	refs?: Context,
) => {
	return build.literal(schema.const, refs);
};
