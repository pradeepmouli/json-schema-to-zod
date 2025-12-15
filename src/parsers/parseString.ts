import { JsonSchemaObject } from '../Types.js';
import { build } from '../ZodBuilder/index.js';
import { parseSchema } from './parseSchema.js';

export const parseString = (schema: JsonSchemaObject & { type: 'string' }) => {
	const builder = build.string();

	// Apply format constraint
	if (schema.format) {
		builder.format(schema.format, schema.errorMessage?.format);
	}

	// Apply pattern constraint
	if (schema.pattern) {
		builder.regex(schema.pattern, schema.errorMessage?.pattern);
	}

	// Apply minLength constraint
	if (schema.minLength !== undefined) {
		builder.min(schema.minLength, schema.errorMessage?.minLength);
	}

	// Apply maxLength constraint
	if (schema.maxLength !== undefined) {
		builder.max(schema.maxLength, schema.errorMessage?.maxLength);
	}

	// Apply contentEncoding constraint
	if (schema.contentEncoding === 'base64') {
		builder.base64(schema.errorMessage?.contentEncoding);
	}

	// Apply contentMediaType constraint
	if (schema.contentMediaType === 'application/json') {
		builder.json(schema.errorMessage?.contentMediaType);

		// Apply contentSchema pipe if present
		if (schema.contentSchema && typeof schema.contentSchema === 'object') {
			const contentSchemaZod = parseSchema(schema.contentSchema);
			builder.pipe(contentSchemaZod, schema.errorMessage?.contentSchema);
		}
	}

	return builder.text();
};
