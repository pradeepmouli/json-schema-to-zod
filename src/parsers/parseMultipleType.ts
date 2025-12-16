import { JsonSchemaObject, Refs } from '../Types.js';
import { parseSchema } from './parseSchema.js';
import { GenericBuilder } from '../ZodBuilder/index.js';

export const parseMultipleType = (
	schema: JsonSchemaObject & { type: string[] },
	refs: Refs,
) => {
	return new GenericBuilder(
		`z.union([${schema.type
			.map((type) =>
				parseSchema({ ...schema, type } as any, {
					...refs,
					withoutDefaults: true,
				}).text(),
			)
			.join(', ')}])`,
	);
};
