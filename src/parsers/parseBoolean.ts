import { JsonSchemaObject } from "../Types.js";
import { buildBoolean, BooleanBuilder } from "../ZodBuilder/index.js";

export const parseBoolean = (_schema: JsonSchemaObject & { type: "boolean" }) => {
  return new BooleanBuilder(buildBoolean()).done();
};
