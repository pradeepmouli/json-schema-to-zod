import { JsonSchemaObject, Serializable } from "../Types.js";
import { buildLiteral, ConstBuilder } from "../ZodBuilder/index.js";

export const parseConst = (schema: JsonSchemaObject & { const: Serializable }) => {
  return new ConstBuilder(buildLiteral(schema.const)).done();
};
