import { describe, it, expect } from "vitest";
import { parseEnum } from "../../src/parsers/parseEnum";

describe("parseEnum", () => {
  it("should create never with empty enum", () => {
    expect(
      parseEnum({
        enum: [],
      }).text(),
    ).toBe("z.never()");
  });

  it("should create literal with single item enum", () => {
    expect(
      parseEnum({
        enum: ["someValue"],
      }).text(),
    ).toBe(`z.literal("someValue")`);
  });

  it("should create enum array with string enums", () => {
    expect(
      parseEnum({
        enum: ["someValue", "anotherValue"],
      }).text(),
    ).toBe(`z.enum(["someValue","anotherValue"])`);
  });

  it("should create union with mixed enums", () => {
    expect(
      parseEnum({
        enum: ["someValue", 57],
      }).text(),
    ).toBe(`z.union([z.literal("someValue"), z.literal(57)])`);
  });
});
