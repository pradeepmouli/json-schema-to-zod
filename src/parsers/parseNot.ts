import { JsonSchemaObject, JsonSchema, Refs } from '../Types.js';
import { parseSchema } from './parseSchema.js';
import { BaseBuilder } from '../ZodBuilder/index.js';

export const parseNot = (
	schema: JsonSchemaObject & { not: JsonSchema },
	refs: Refs,
) => {
	return new BaseBuilder(
		`z.any().refine((value) => !${parseSchema(schema.not, {
			...refs,
			path: [...refs.path, 'not'],
		}).text()}.safeParse(value).success, "Invalid input: Should NOT be valid against schema")`,
	);
};
