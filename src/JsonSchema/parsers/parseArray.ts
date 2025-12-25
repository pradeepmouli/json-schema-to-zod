import { JsonSchemaObject, JsonSchema, Context } from '../../Types.js';
import { build, BaseBuilder } from '../../ZodBuilder/index.js';
import { parseSchema } from './parseSchema.js';

export const parseArray = (
	schema: JsonSchemaObject & { type: 'array' },
	refs: Context,
) => {
	let r: BaseBuilder;

	// Handle tuple (array of schemas) vs array (single schema)
	if (Array.isArray(schema.items)) {
		const itemSchemas = schema.items.map((v: JsonSchema, i: number) =>
			parseSchema(v, { ...refs, path: [...refs.path, 'items', i] }),
		);

		const builder = build.array(itemSchemas, refs);

		if (schema.minItems !== undefined) {
			builder.min(schema.minItems, schema.errorMessage?.minItems);
		}
		if (schema.maxItems !== undefined) {
			builder.max(schema.maxItems, schema.errorMessage?.maxItems);
		}

		r = builder;
	} else {
		const itemSchema = !schema.items
			? build.any(refs)
			: parseSchema(schema.items, {
					...refs,
					path: [...refs.path, 'items'],
				});

		const builder = build.array(itemSchema, refs);

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
