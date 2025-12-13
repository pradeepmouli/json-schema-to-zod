import { describe, it, expect } from "vitest";
import { parseEnum } from "../../src/parsers/parseEnum";

describe("parseEnum", () => {
  it("should create never with empty enum", () => {
    expect(
      parseEnum({
        enum: [],
      }),
    ).toBe("z.never()");
  });

  it("should create literal with single item enum", () => {
    expect(
      parseEnum({
        enum: ["someValue"],
      }),
    ).toBe(`z.literal("someValue")`);
  });

  it("should create enum array with string enums", () => {
    expect(
      parseEnum({
        enum: ["someValue", "anotherValue"],
      }),
    ).toBe(`z.enum(["someValue","anotherValue"])`);
  });

  it("should create union with mixed enums", () => {
    expect(
      parseEnum({
        enum: ["someValue", 57],
      }),
    ).toBe(`z.union([z.literal("someValue"), z.literal(57)])`);
  });
});
