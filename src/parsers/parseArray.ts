import { JsonSchemaObject, Refs } from '../Types.js';
import { build, BaseBuilder } from '../ZodBuilder/index.js';
import { parseSchema } from './parseSchema.js';

export const parseArray = (
	schema: JsonSchemaObject & { type: 'array' },
	refs: Refs,
) => {
	let r: BaseBuilder;

	// Handle tuple (array of schemas) vs array (single schema)
	if (Array.isArray(schema.items)) {
		const itemSchemas = schema.items.map((v, i) =>
			parseSchema(v, { ...refs, path: [...refs.path, 'items', i] }),
		);

		const builder = build.array(itemSchemas);

		if (schema.minItems !== undefined) {
			builder.min(schema.minItems, schema.errorMessage?.minItems);
		}
		if (schema.maxItems !== undefined) {
			builder.max(schema.maxItems, schema.errorMessage?.maxItems);
		}

		r = builder;
	} else {
		const itemSchema = !schema.items
			? build.any()
			: parseSchema(schema.items, {
					...refs,
					path: [...refs.path, 'items'],
				});

		const builder = build.array(itemSchema);

		// Apply minItems constraint
		if (schema.minItems !== undefined) {
			builder.min(schema.minItems, schema.errorMessage?.minItems);
		}

		// Apply maxItems constraint
		if (schema.maxItems !== undefined) {
			builder.max(schema.maxItems, schema.errorMessage?.maxItems);
		}

		r = builder;
	}

	return r;
};
