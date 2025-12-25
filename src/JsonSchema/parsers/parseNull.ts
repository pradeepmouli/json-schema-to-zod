import { Context, JsonSchemaObject } from '../../Types.js';
import { build } from '../../ZodBuilder/index.js';

export const parseNull = (_schema: JsonSchemaObject & { type: 'null' }, refs?: Context) => {
	return build.null(refs);
};
