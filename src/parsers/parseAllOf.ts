import { parseSchema } from './parseSchema.js';
import { JsonSchemaObject, JsonSchema, Refs } from '../Types.js';
import { BaseBuilder, IntersectionBuilder } from '../ZodBuilder/index.js';

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
	refs: Refs,
): BaseBuilder<any> {
	if (schema.allOf.length === 0) {
		return new BaseBuilder('z.never()');
	}

	const items = ensureOriginalIndex(schema.allOf);
	if (items.length === 1) {
		const item = items[0];
		return parseSchema(item, {
			...refs,
			path: [...refs.path, 'allOf', (item as any)[originalIndex]],
		});
	}

	const parts = items.map((sub: any) =>
		parseSchema(sub, {
			...refs,
			path: [...refs.path, 'allOf', sub[originalIndex]],
		}),
	);
	return new IntersectionBuilder(parts);
}
