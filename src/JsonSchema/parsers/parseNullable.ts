import { JsonSchemaObject, Context } from '../../Types.js';
import { omit } from '../../utils/omit.js';
import { parseSchema } from './parseSchema.js';

/**
 * For compatibility with open api 3.0 nullable
 */
export const parseNullable = (
	schema: JsonSchemaObject & { nullable: true },
	refs: Context,
) => {
	return parseSchema(omit(schema, 'nullable'), refs, true).nullable();
};
