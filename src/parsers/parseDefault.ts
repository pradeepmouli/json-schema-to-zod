import { JsonSchemaObject } from '../Types.js';
import { BaseBuilder } from '../ZodBuilder/index.js';

export const parseDefault = (_schema: JsonSchemaObject) => {
	return new BaseBuilder('z.any()');
};
