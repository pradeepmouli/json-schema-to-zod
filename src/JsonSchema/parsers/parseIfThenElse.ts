import { JsonSchemaObject, JsonSchema, Refs } from '../../Types.js';
import { parseSchema } from './parseSchema.js';
import { BaseBuilder, build } from '../../ZodBuilder/index.js';

export const parseIfThenElse = (
	schema: JsonSchemaObject & {
		if: JsonSchema;
		then: JsonSchema;
		else: JsonSchema;
	},
	refs: Refs,
): BaseBuilder => {
	const $if = parseSchema(schema.if, {
		...refs,
		path: [...refs.path, 'if'],
	}).text();
	const $then = parseSchema(schema.then, {
		...refs,
		path: [...refs.path, 'then'],
	}).text();
	const $else = parseSchema(schema.else, {
		...refs,
		path: [...refs.path, 'else'],
	}).text();

	return build.union([build.code($then), build.code($else)]).superRefine(
		`(value,ctx) => {
  const result = ${$if}.safeParse(value).success
    ? ${$then}.safeParse(value)
    : ${$else}.safeParse(value);
  if (!result.success) {
    result.error.errors.forEach((error) => ctx.addIssue(error))
  }
}`,
	);
};
