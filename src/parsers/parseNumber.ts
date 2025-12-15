import { JsonSchemaObject } from '../Types.js';
import { build } from '../ZodBuilder/index.js';

export const parseNumber = (
	schema: JsonSchemaObject & { type: 'number' | 'integer' },
) => {
	const builder = build.number();

	// Apply integer constraint
	if (schema.type === 'integer') {
		builder.int(schema.errorMessage?.type);
	} else if (schema.format === 'int64') {
		builder.int(schema.errorMessage?.format);
	}

	// Apply multipleOf constraint
	if (schema.multipleOf !== undefined) {
		builder.multipleOf(schema.multipleOf, schema.errorMessage?.multipleOf);
	}

	// Apply minimum constraint
	if (typeof schema.minimum === 'number') {
		builder.min(
			schema.minimum,
			schema.exclusiveMinimum === true,
			schema.errorMessage?.minimum,
		);
	} else if (typeof schema.exclusiveMinimum === 'number') {
		builder.min(
			schema.exclusiveMinimum,
			true,
			schema.errorMessage?.exclusiveMinimum,
		);
	}

	// Apply maximum constraint
	if (typeof schema.maximum === 'number') {
		builder.max(
			schema.maximum,
			schema.exclusiveMaximum === true,
			schema.errorMessage?.maximum,
		);
	} else if (typeof schema.exclusiveMaximum === 'number') {
		builder.max(
			schema.exclusiveMaximum,
			true,
			schema.errorMessage?.exclusiveMaximum,
		);
	}

	return builder.text();
};
