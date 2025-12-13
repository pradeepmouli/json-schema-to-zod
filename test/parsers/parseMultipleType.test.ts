import { describe, it, expect } from "vitest";
import { parseSchema } from "../../src/parsers/parseSchema";

describe("parseMultipleType", () => {
  it("should handle object with multitype properties with default", () => {
    const schema = {
      type: "object",
      properties: {
        prop: {
          type: ["string", "null"],
          default: null,
        },
      },
    };
    expect(parseSchema(schema, { path: [], seen: new Map() })).toBe(
      `z.object({ "prop": z.union([z.string(), z.null()]).default(null) })`,
    );
  });
});
