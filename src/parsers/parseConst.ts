import { JsonSchemaObject, Serializable } from "../Types.js";
import { build } from "../ZodBuilder/index.js";

export const parseConst = (schema: JsonSchemaObject & { const: Serializable }) => {
  return build.literal(schema.const).text();
};
