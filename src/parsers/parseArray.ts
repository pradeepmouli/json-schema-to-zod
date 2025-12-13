import { JsonSchemaObject, Refs } from "../Types.js";
import { buildArray, buildTuple, applyMinItems, applyMaxItems } from "../ZodBuilder/index.js";
import { parseSchema } from "./parseSchema.js";

export const parseArray = (schema: JsonSchemaObject & { type: "array" }, refs: Refs) => {
  let r: string;

  // Handle tuple (array of schemas) vs array (single schema)
  if (Array.isArray(schema.items)) {
    const itemSchemas = schema.items.map((v, i) =>
      parseSchema(v, { ...refs, path: [...refs.path, "items", i] }),
    );
    r = buildTuple(itemSchemas);
  } else {
    const itemSchema = !schema.items
      ? "z.any()"
      : parseSchema(schema.items, { ...refs, path: [...refs.path, "items"] });
    r = buildArray(itemSchema);
  }

  // Apply minItems constraint
  if (schema.minItems !== undefined) {
    r = applyMinItems(r, schema.minItems, schema.errorMessage?.minItems);
  }

  // Apply maxItems constraint
  if (schema.maxItems !== undefined) {
    r = applyMaxItems(r, schema.maxItems, schema.errorMessage?.maxItems);
  }

  return r;
};
