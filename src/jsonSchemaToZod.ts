import { Options, JsonSchema } from './Types.js';
import { toZod } from './JsonSchema/index.js';

export const jsonSchemaToZod = (
	schema: JsonSchema,
	options?: Options,
): string => {
	return toZod(schema, options);
};
