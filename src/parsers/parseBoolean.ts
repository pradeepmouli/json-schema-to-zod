import { JsonSchemaObject } from "../Types.js";
import { build } from "../ZodBuilder/index.js";

export const parseBoolean = (_schema: JsonSchemaObject & { type: "boolean" }) => {
  return build.boolean().done();
};
