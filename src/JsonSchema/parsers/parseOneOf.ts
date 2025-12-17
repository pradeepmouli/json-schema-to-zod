import { JsonSchemaObject, JsonSchema, Refs } from '../../Types.js';
import { BaseBuilder, build } from '../../ZodBuilder/index.js';
import { parseSchema } from './parseSchema.js';

export const parseOneOf = (
	schema: JsonSchemaObject & { oneOf: JsonSchema[] },
	refs: Refs,
): BaseBuilder => {
	const schemaBuilders = schema.oneOf.map((schema, i) =>
		parseSchema(schema, {
			...refs,
			path: [...refs.path, 'oneOf', i],
		}),
	);

	return schema.oneOf.length
		? schema.oneOf.length === 1
			? schemaBuilders[0]
			: build
					.any()
					.superRefine(
						'(x, ctx) => {\n' +
							`    const schemas = [${schemaBuilders
								.map((b) => b.text())
								.join(', ')}];\n` +
							'    const errors = schemas.reduce<z.ZodError[]>(\n' +
							'      (errors, schema) =>\n' +
							'        ((result) =>\n' +
							'          result.error ? [...errors, result.error] : errors)(\n' +
							'          schema.safeParse(x),\n' +
							'        ),\n' +
							'      [],\n' +
							'    );\n' +
							'    if (schemas.length - errors.length !== 1) {\n' +
							'      ctx.addIssue({\n' +
							'        path: ctx.path,\n' +
							'        code: "invalid_union",\n' +
							'        unionErrors: errors,\n' +
							'        message: "Invalid input: Should pass single schema",\n' +
							'      });\n' +
							'    }\n' +
							'  }',
					)
		: build.any();
};
