import { JsonSchemaObject, Serializable } from "../Types.js";
import { buildEnum, EnumBuilder } from "../ZodBuilder/index.js";

export const parseEnum = (schema: JsonSchemaObject & { enum: Serializable[] }) => {
  return new EnumBuilder(buildEnum(schema.enum)).done();
};
