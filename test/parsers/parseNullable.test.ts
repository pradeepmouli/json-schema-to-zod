import { describe, it, expect } from "vitest";
import { parseSchema } from "../../src";

describe("parseNullable", () => {
  it("parseSchema should not add default twice", () => {
    expect(
      parseSchema(
        {
          type: "string",
          nullable: true,
          default: null,
        },
        { path: [], seen: new Map() },
      ).text(),
    ).toBe("z.string().nullable().default(null)");
  });
});
