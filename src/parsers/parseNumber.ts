import { JsonSchemaObject } from "../Types.js";
import {
  buildNumber,
  applyInt,
  applyMultipleOf,
  applyNumberMin,
  applyNumberMax,
} from "../ZodBuilder/index.js";

export const parseNumber = (schema: JsonSchemaObject & { type: "number" | "integer" }) => {
  let r = buildNumber();

  // Apply integer constraint
  if (schema.type === "integer") {
    r = applyInt(r, schema.errorMessage?.type);
  } else if (schema.format === "int64") {
    r = applyInt(r, schema.errorMessage?.format);
  }

  // Apply multipleOf constraint
  if (schema.multipleOf !== undefined) {
    r = applyMultipleOf(r, schema.multipleOf, schema.errorMessage?.multipleOf);
  }

  // Apply minimum constraint
  if (typeof schema.minimum === "number") {
    r = applyNumberMin(
      r,
      schema.minimum,
      schema.exclusiveMinimum === true,
      schema.errorMessage?.minimum,
    );
  } else if (typeof schema.exclusiveMinimum === "number") {
    r = applyNumberMin(r, schema.exclusiveMinimum, true, schema.errorMessage?.exclusiveMinimum);
  }

  // Apply maximum constraint
  if (typeof schema.maximum === "number") {
    r = applyNumberMax(
      r,
      schema.maximum,
      schema.exclusiveMaximum === true,
      schema.errorMessage?.maximum,
    );
  } else if (typeof schema.exclusiveMaximum === "number") {
    r = applyNumberMax(r, schema.exclusiveMaximum, true, schema.errorMessage?.exclusiveMaximum);
  }

  return r;
};
