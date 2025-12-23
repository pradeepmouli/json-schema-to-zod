import { JsonSchemaObject, Context } from '../../Types.js';
import { parseSchema } from './parseSchema.js';
import { build } from '../../ZodBuilder/index.js';

export const parseMultipleType = (
	schema: JsonSchemaObject & { type: string[] },
	refs: Context,
) => {
	return build.union(
		schema.type.map((type) =>
			parseSchema({ ...schema, type } as any, {
				...refs,
				withoutDefaults: true,
			}),
		),
	);
};
