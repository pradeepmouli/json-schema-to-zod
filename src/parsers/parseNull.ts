import { JsonSchemaObject } from "../Types.js";
import { buildNull, NullBuilder } from "../ZodBuilder/index.js";

export const parseNull = (_schema: JsonSchemaObject & { type: "null" }) => {
  return new NullBuilder(buildNull()).done();
};
