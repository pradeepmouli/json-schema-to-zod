import { JsonSchemaObject } from "../Types.js";
import { buildNumber } from "../ZodBuilder/index.js";

export const parseNumber = (schema: JsonSchemaObject & { type: "number" | "integer" }) => {
  return buildNumber(schema);
};
