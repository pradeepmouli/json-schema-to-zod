import { JsonSchemaObject, JsonSchema, Refs } from '../../Types.js';
import { parseSchema } from './parseSchema.js';
import { build } from '../../ZodBuilder/index.js';

export const parseNot = (
	schema: JsonSchemaObject & { not: JsonSchema },
	refs: Refs,
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
