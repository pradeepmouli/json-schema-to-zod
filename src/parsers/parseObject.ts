import { JsonSchemaObject, Refs } from '../Types.js';
import {
	build,
	buildRecord,
	ObjectBuilder,
	BaseBuilder,
} from '../ZodBuilder/index.js';
import { addJsdocs } from '../utils/jsdocs.js';
import { parseAnyOf } from './parseAnyOf.js';
import { parseOneOf } from './parseOneOf.js';
import { its, parseSchema } from './parseSchema.js';
import { parseAllOf } from './parseAllOf.js';

export function parseObject(
	objectSchema: JsonSchemaObject & { type: 'object' },
	refs: Refs,
): BaseBuilder {
	let result: string;

	// Step 1: Build base object from properties
	if (
		objectSchema.properties &&
		Object.keys(objectSchema.properties).length > 0
	) {
		const properties: Record<string, BaseBuilder> = {};
		const propsWithJsdocs: string[] = [];

		for (const key of Object.keys(objectSchema.properties)) {
			const propSchema = objectSchema.properties[key];

			let propZod = parseSchema(propSchema, {
				...refs,
				path: [...refs.path, 'properties', key],
			});

			// Determine if property is optional
			const hasDefault =
				typeof propSchema === 'object' && propSchema.default !== undefined;
			const required = Array.isArray(objectSchema.required)
				? objectSchema.required.includes(key)
				: typeof propSchema === 'object' && propSchema.required === true;
			const optional = !hasDefault && !required;

			if (optional) {
				propZod.optional();
			}

			// Store builder directly in properties record for type safety and composability
			properties[key] = propZod;

			// Build the property string for JSDoc: "key": zodSchema
			let propStr = `${JSON.stringify(key)}: ${propZod.text()}`;

			// Add JSDoc if enabled (prepends to the property string)
			if (refs.withJsdocs && typeof propSchema === 'object') {
				propStr = addJsdocs(propSchema, propStr);
			}

			propsWithJsdocs.push(propStr);
		}

		// Build object - if JSDoc enabled, build manually; otherwise use ObjectBuilder
		if (refs.withJsdocs) {
			result = `z.object({ ${propsWithJsdocs.join(', ')} })`;
		} else {
			result = build.object(properties).text();
		}
	} else if (objectSchema.properties) {
		// Empty properties object
		result = build.object({}).text();
	} else {
		result = '';
	} // Step 2: Handle additionalProperties
	const additionalPropertiesZod =
		objectSchema.additionalProperties !== undefined
			? parseSchema(objectSchema.additionalProperties, {
					...refs,
					path: [...refs.path, 'additionalProperties'],
				}).text()
			: undefined;

	// Step 3: Handle patternProperties
	if (objectSchema.patternProperties) {
		const parsedPatternProps = Object.fromEntries(
			Object.entries(objectSchema.patternProperties).map(
				([pattern, propSchema]) => [
					pattern,
					parseSchema(propSchema, {
						...refs,
						path: [...refs.path, 'patternProperties', pattern],
					}).text(),
				],
			),
		);

		// Build the base schema for pattern properties
		if (result) {
			// We have properties, so add catchall
			const catchallSchemas = Object.values(parsedPatternProps);
			if (additionalPropertiesZod) {
				catchallSchemas.push(additionalPropertiesZod);
			}

			const builder = ObjectBuilder.fromCode(result);
			if (catchallSchemas.length > 1) {
				builder.catchall(`z.union([${catchallSchemas.join(', ')}])`);
			} else if (catchallSchemas.length === 1) {
				builder.catchall(catchallSchemas[0]);
			}
			result = builder.text();
		} else {
			// No properties, build a record
			const valueSchemas = Object.values(parsedPatternProps);
			if (additionalPropertiesZod) {
				valueSchemas.push(additionalPropertiesZod);
			}

			if (valueSchemas.length > 1) {
				result = buildRecord(
					'z.string()',
					`z.union([${valueSchemas.join(', ')}])`,
				);
			} else if (valueSchemas.length === 1) {
				result = buildRecord('z.string()', valueSchemas[0]);
			}
		}

		// Build superRefine for pattern validation

		let refineFn = '(value, ctx) => {\n';
		refineFn += 'for (const key in value) {\n';

		if (additionalPropertiesZod) {
			if (
				objectSchema.properties &&
				Object.keys(objectSchema.properties).length > 0
			) {
				const propKeys = Object.keys(objectSchema.properties)
					.map((k) => JSON.stringify(k))
					.join(', ');
				refineFn += `let evaluated = [${propKeys}].includes(key)\n`;
			} else {
				refineFn += 'let evaluated = false\n';
			}
		}

		for (const [pattern, patternZod] of Object.entries(parsedPatternProps)) {
			refineFn += `if (key.match(new RegExp(${JSON.stringify(pattern)}))) {\n`;
			if (additionalPropertiesZod) {
				refineFn += 'evaluated = true\n';
			}
			refineFn += `const result = ${patternZod}.safeParse(value[key])\n`;
			refineFn += 'if (!result.success) {\n';
			refineFn += `ctx.addIssue({\n          path: [key],\n          code: 'custom',\n          message: \`Invalid input: Key matching regex /\${key}/ must match schema\`,\n          params: {\n            issues: result.error.issues\n          }\n        })\n`;
			refineFn += '}\n';
			refineFn += '}\n';
		}

		if (additionalPropertiesZod) {
			refineFn += 'if (!evaluated) {\n';
			refineFn += `const result = ${additionalPropertiesZod}.safeParse(value[key])\n`;
			refineFn += 'if (!result.success) {\n';
			refineFn += `ctx.addIssue({\n          path: [key],\n          code: 'custom',\n          message: \`Invalid input: must match catchall schema\`,\n          params: {\n            issues: result.error.issues\n          }\n        })\n`;
			refineFn += '}\n';
			refineFn += '}\n';
		}

		refineFn += '}\n';
		refineFn += '}';

		result = ObjectBuilder.fromCode(result).superRefine(refineFn).text();
	} else if (result && additionalPropertiesZod) {
		// No pattern properties, but we have additionalProperties
		const builder = ObjectBuilder.fromCode(result);
		if (additionalPropertiesZod === 'z.never()') {
			result = builder.strict().text();
		} else {
			result = builder.catchall(additionalPropertiesZod).text();
		}
	} else if (!result) {
		// No properties, no patternProperties
		if (additionalPropertiesZod) {
			result = buildRecord('z.string()', additionalPropertiesZod);
		} else {
			result = buildRecord('z.string()', 'z.any()');
		}
	}

	// Step 4: Handle combinators (anyOf, oneOf, allOf)
	let builder = ObjectBuilder.fromCode(result);

	if (its.an.anyOf(objectSchema)) {
		const anyOfZod = parseAnyOf(
			{
				...objectSchema,
				anyOf: objectSchema.anyOf!.map((x) =>
					typeof x === 'object' &&
					!x.type &&
					(x.properties || x.additionalProperties || x.patternProperties)
						? { ...x, type: 'object' }
						: x,
				) as any,
			},
			refs,
		).text();
		builder.and(anyOfZod);
	}

	if (its.a.oneOf(objectSchema)) {
		const oneOfZod = parseOneOf(
			{
				...objectSchema,
				oneOf: objectSchema.oneOf!.map((x) =>
					typeof x === 'object' &&
					!x.type &&
					(x.properties || x.additionalProperties || x.patternProperties)
						? { ...x, type: 'object' }
						: x,
				) as any,
			},
			refs,
		).text();
		builder.and(oneOfZod);
	}

	if (its.an.allOf(objectSchema)) {
		const allOfZod = parseAllOf(
			{
				...objectSchema,
				allOf: objectSchema.allOf!.map((x) =>
					typeof x === 'object' &&
					!x.type &&
					(x.properties || x.additionalProperties || x.patternProperties)
						? { ...x, type: 'object' }
						: x,
				) as any,
			},
			refs,
		).text();
		builder.and(allOfZod);
	}

	return builder;
}
