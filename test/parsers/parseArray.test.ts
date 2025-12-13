import { describe, it, expect } from "vitest";
import { parseArray } from "../../src/parsers/parseArray";

describe("parseArray", () => {
  it("should create tuple with items array", () => {
    expect(
      parseArray(
        {
          type: "array",
          items: [
            {
              type: "string",
            },
            {
              type: "number",
            },
          ],
        },
        { path: [], seen: new Map() },
      ),
    ).toBe("z.tuple([z.string(),z.number()])");
  });

  it("should create array with items object", () => {
    expect(
      parseArray(
        {
          type: "array",
          items: {
            type: "string",
          },
        },
        { path: [], seen: new Map() },
      ),
    ).toBe("z.array(z.string())");
  });

  it("should create max for maxItems", () => {
    expect(
      parseArray(
        {
          type: "array",
          maxItems: 2,
          items: {
            type: "string",
          },
        },
        { path: [], seen: new Map() },
      ),
    ).toBe("z.array(z.string()).max(2)");
  });
});
