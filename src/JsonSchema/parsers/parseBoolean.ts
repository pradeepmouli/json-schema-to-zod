import { Context, JsonSchemaObject } from '../../Types.js';
import { build } from '../../ZodBuilder/index.js';

export const parseBoolean = (
	_schema: JsonSchemaObject & { type: 'boolean' },
	refs?: Context,
) => {
	return build.boolean(refs);
};
