import { describe, it, expect } from "vitest";
import { parseConst } from "../../src/parsers/parseConst";

describe("parseConst", () => {
  it("should handle falsy constants", () => {
    expect(
      parseConst({
        const: false,
      }),
    ).toBe("z.literal(false)");
  });
});
