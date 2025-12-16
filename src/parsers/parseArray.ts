import { JsonSchemaObject, Refs } from '../Types.js';
import {
	build,
	buildTuple,
	applyMinItems,
	applyMaxItems,
	BaseBuilder,
	GenericBuilder,
} from '../ZodBuilder/index.js';
import { parseSchema } from './parseSchema.js';

export const parseArray = (
	schema: JsonSchemaObject & { type: 'array' },
	refs: Refs,
) => {
	let r: BaseBuilder<any>;

	// Handle tuple (array of schemas) vs array (single schema)
	if (Array.isArray(schema.items)) {
		const itemSchemas = schema.items.map((v, i) =>
			parseSchema(v, { ...refs, path: [...refs.path, 'items', i] }).text(),
		);
		let tupleSchema = buildTuple(itemSchemas);

		// For tuples, apply modifiers directly (no ArrayBuilder yet)
		if (schema.minItems !== undefined) {
			tupleSchema = applyMinItems(
				tupleSchema,
				schema.minItems,
				schema.errorMessage?.minItems,
			);
		}
		if (schema.maxItems !== undefined) {
			tupleSchema = applyMaxItems(
				tupleSchema,
				schema.maxItems,
				schema.errorMessage?.maxItems,
			);
		}
		r = new GenericBuilder(tupleSchema);
	} else {
		const itemSchema = !schema.items
			? 'z.any()'
			: parseSchema(schema.items, { ...refs, path: [...refs.path, 'items'] }).text();

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
