import { parseSchema } from "../../src/parsers/parseSchema.js";
import { describe, it, expect } from "vitest";

describe("parseSchema", () => {
  it("should be usable without providing refs", () => {
    expect(parseSchema({ type: "string" })).toBe("z.string()");
  });

  it("should return a seen and processed ref", () => {
    const seen = new Map();
    const schema = {
      type: "object",
      properties: {
        prop: {
          type: "string",
        },
      },
    };
    expect(parseSchema(schema, { seen, path: [] })).toBeTruthy();
    expect(parseSchema(schema, { seen, path: [] })).toBeTruthy();
  });

  it("should be possible to describe a readonly schema", () => {
    expect(parseSchema({ type: "string", readOnly: true })).toBe("z.string().readonly()");
  });

  it("should handle nullable", () => {
    expect(
      parseSchema(
        {
          type: "string",
          nullable: true,
        },
        { path: [], seen: new Map() },
      ),
    ).toBe("z.string().nullable()");
  });

  it("should handle enum", () => {
    expect(parseSchema({ enum: ["someValue", 57] })).toBe(
      `z.union([z.literal("someValue"), z.literal(57)])`,
    );
  });

  it("should handle multiple type", () => {
    expect(parseSchema({ type: ["string", "number"] })).toBe(`z.union([z.string(), z.number()])`);
  });

  it("should handle if-then-else type", () => {
    expect(
      parseSchema({
        if: { type: "string" },
        then: { type: "number" },
        else: { type: "boolean" },
      }),
    ).toBe(`z.union([z.number(), z.boolean()]).superRefine((value,ctx) => {
  const result = z.string().safeParse(value).success
    ? z.number().safeParse(value)
    : z.boolean().safeParse(value);
  if (!result.success) {
    result.error.errors.forEach((error) => ctx.addIssue(error))
  }
})`);
  });

  it("should handle anyOf", () => {
    expect(
      parseSchema({
        anyOf: [
          {
            type: "string",
          },
          { type: "number" },
        ],
      }),
    ).toBe("z.union([z.string(), z.number()])");
  });

  it("should handle oneOf", () => {
    expect(
      parseSchema({
        oneOf: [
          {
            type: "string",
          },
          { type: "number" },
        ],
      }),
    ).toBe(`z.any().superRefine((x, ctx) => {
    const schemas = [z.string(), z.number()];
    const errors = schemas.reduce<z.ZodError[]>(
      (errors, schema) =>
        ((result) =>
          result.error ? [...errors, result.error] : errors)(
          schema.safeParse(x),
        ),
      [],
    );
    if (schemas.length - errors.length !== 1) {
      ctx.addIssue({
        path: ctx.path,
        code: "invalid_union",
        unionErrors: errors,
        message: "Invalid input: Should pass single schema",
      });
    }
  })`);
  });
});
