import { JsonSchemaObject } from "../Types.js";
import { build } from "../ZodBuilder/index.js";

export const parseNull = (_schema: JsonSchemaObject & { type: "null" }) => {
  return build.null().text();
};
