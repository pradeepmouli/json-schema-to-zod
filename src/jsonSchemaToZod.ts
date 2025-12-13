import { Options, JsonSchema } from "./Types.js";
import { jsonSchemaToZod as jsonSchemaToZodImpl } from "./JsonSchema/index.js";

export const jsonSchemaToZod = (
  schema: JsonSchema,
  options?: Options,
): string => {
  return jsonSchemaToZodImpl(schema, options);
};
