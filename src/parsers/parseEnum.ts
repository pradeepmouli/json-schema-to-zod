import { JsonSchemaObject, Serializable } from "../Types.js";
import { build } from "../ZodBuilder/index.js";

export const parseEnum = (schema: JsonSchemaObject & { enum: Serializable[] }) => {
  return build.enum(schema.enum).text();
};
