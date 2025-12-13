import { JsonSchemaObject } from "../Types.js";
import {
  buildString,
  applyFormat,
  applyPattern,
  applyMinLength,
  applyMaxLength,
  applyBase64,
  applyJsonTransform,
  applyPipe,
} from "../ZodBuilder/index.js";
import { parseSchema } from "./parseSchema.js";

export const parseString = (schema: JsonSchemaObject & { type: "string" }) => {
  let r = buildString();

  // Apply format constraint
  if (schema.format) {
    r = applyFormat(r, schema.format, schema.errorMessage?.format);
  }

  // Apply pattern constraint
  if (schema.pattern) {
    r = applyPattern(r, schema.pattern, schema.errorMessage?.pattern);
  }

  // Apply minLength constraint
  if (schema.minLength !== undefined) {
    r = applyMinLength(r, schema.minLength, schema.errorMessage?.minLength);
  }

  // Apply maxLength constraint
  if (schema.maxLength !== undefined) {
    r = applyMaxLength(r, schema.maxLength, schema.errorMessage?.maxLength);
  }

  // Apply contentEncoding constraint
  if (schema.contentEncoding === "base64") {
    r = applyBase64(r, schema.errorMessage?.contentEncoding);
  }

  // Apply contentMediaType constraint
  if (schema.contentMediaType === "application/json") {
    r = applyJsonTransform(r, schema.errorMessage?.contentMediaType);

    // Apply contentSchema pipe if present
    if (schema.contentSchema && typeof schema.contentSchema === "object") {
      const contentSchemaZod = parseSchema(schema.contentSchema);
      r = applyPipe(r, contentSchemaZod, schema.errorMessage?.contentSchema);
    }
  }

  return r;
};
