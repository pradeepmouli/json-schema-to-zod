import { JsonSchemaObject, JsonSchema, Context } from '../../Types.js';
import { parseSchema } from './parseSchema.js';
import { build } from '../../ZodBuilder/index.js';

export const parseNot = (
	schema: JsonSchemaObject & { not: JsonSchema },
	refs: Context,
) => {
	const notSchema = parseSchema(schema.not, {
		...refs,
		path: [...refs.path, 'not'],
	}).text();

	return build
		.any()
		.refine(
			`(value) => !${notSchema}.safeParse(value).success`,
			'Invalid input: Should NOT be valid against schema',
		);
};
