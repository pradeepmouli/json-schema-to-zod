import { JsonSchemaObject } from '../../Types.js';
import { build } from '../../ZodBuilder/index.js';

export const parseDefault = (_schema: JsonSchemaObject) => {
	return build.any();
};
