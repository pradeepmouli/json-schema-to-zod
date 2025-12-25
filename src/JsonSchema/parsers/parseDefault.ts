import { Context, JsonSchemaObject } from '../../Types.js';
import { build } from '../../ZodBuilder/index.js';

export const parseDefault = (_schema: JsonSchemaObject, refs?: Context) => {
	return build.any(refs);
};
