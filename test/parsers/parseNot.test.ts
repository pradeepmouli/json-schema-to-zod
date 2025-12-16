import { describe, it, expect } from "vitest";
import { parseNot } from "../../src/parsers/parseNot";

describe("parseNot", () => {
  it("", () => {
    expect(
      parseNot(
        {
          not: {
            type: "string",
          },
        },
        { path: [], seen: new Map() },
      ).text(),
    ).toBe(
      'z.any().refine((value) => !z.string().safeParse(value).success, "Invalid input: Should NOT be valid against schema")',
    );
  });
});
