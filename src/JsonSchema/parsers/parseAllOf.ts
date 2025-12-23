import { parseSchema } from './parseSchema.js';
import { half } from '../../utils/half.js';
import { JsonSchemaObject, JsonSchema, Context } from '../../Types.js';
import { build, type IntersectionBuilder } from '../../ZodBuilder/index.js';
import type { ZodBuilder } from '../../ZodBuilder/BaseBuilder.js';

const originalIndex = Symbol('Original index');

const ensureOriginalIndex = (arr: JsonSchema[]) => {
	let newArr = [];

	for (let i = 0; i < arr.length; i++) {
		const item = arr[i];
		if (typeof item === 'boolean') {
			newArr.push(
				item ? { [originalIndex]: i } : { [originalIndex]: i, not: {} },
			);
		} else if (originalIndex in item) {
			return arr;
		} else {
			newArr.push({ ...item, [originalIndex]: i });
		}
	}

	return newArr;
};

export function parseAllOf(
	schema: JsonSchemaObject & { allOf: JsonSchema[] },
	refs: Context,
): ZodBuilder | IntersectionBuilder {
	if (schema.allOf.length === 0) {
		return build.never();
	} else if (schema.allOf.length === 1) {
		const item = schema.allOf[0];

		return parseSchema(item, {
			...refs,
			path: [...refs.path, 'allOf', (item as any)[originalIndex]],
		});
	} else {
		const [left, right] = half(ensureOriginalIndex(schema.allOf)) as any;

		return build.intersection(
			parseAllOf({ allOf: left }, refs),
			parseAllOf({ allOf: right }, refs),
		);
	}
}
