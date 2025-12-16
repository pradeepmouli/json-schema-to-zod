import { JsonSchemaObject } from '../Types.js';
import { AnyBuilder } from '../ZodBuilder/index.js';

export const parseDefault = (_schema: JsonSchemaObject) => {
	return new AnyBuilder();
};
