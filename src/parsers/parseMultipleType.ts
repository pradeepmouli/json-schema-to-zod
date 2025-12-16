import { JsonSchemaObject, Refs } from '../Types.js';
import { parseSchema } from './parseSchema.js';
import { UnionBuilder } from '../ZodBuilder/index.js';

export const parseMultipleType = (
	schema: JsonSchemaObject & { type: string[] },
	refs: Refs,
) => {
	const parts = schema.type.map((type) =>
		parseSchema({ ...schema, type } as any, {
			...refs,
			withoutDefaults: true,
		}),
	);
	return new UnionBuilder(parts);
};
