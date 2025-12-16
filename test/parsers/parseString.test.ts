import { describe, it, expect } from "vitest";
import { parseString } from "../../src/parsers/parseString";

describe("parseString", () => {
  const run = (output: string, data: unknown) =>
    eval(`const {z} = require("zod"); ${output}.safeParse(${JSON.stringify(data)})`);

  it("DateTime format", () => {
    const datetime = "2018-11-13T20:20:39Z";

    const code = parseString({
      type: "string",
      format: "date-time",
      errorMessage: { format: "hello" },
    }).text();

    expect(code).toBe('z.string().datetime({ offset: true, message: "hello" })');

    expect(run(code, datetime)).toEqual({ success: true, data: datetime });
  });

  it("email", () => {
    expect(
      parseString({
        type: "string",
        format: "email",
      }).text(),
    ).toBe("z.string().email()");
  });

  it("ip", () => {
    expect(
      parseString({
        type: "string",
        format: "ip",
      }).text(),
    ).toBe("z.string().ip()");
    expect(
      parseString({
        type: "string",
        format: "ipv6",
      }).text(),
    ).toBe(`z.string().ip({ version: "v6" })`);
  });

  it("uri", () => {
    expect(
      parseString({
        type: "string",
        format: "uri",
      }).text(),
    ).toBe(`z.string().url()`);
  });

  it("uuid", () => {
    expect(
      parseString({
        type: "string",
        format: "uuid",
      }).text(),
    ).toBe(`z.string().uuid()`);
  });

  it("time", () => {
    expect(
      parseString({
        type: "string",
        format: "time",
      }).text(),
    ).toBe(`z.string().time()`);
  });

  it("date", () => {
    expect(
      parseString({
        type: "string",
        format: "date",
      }).text(),
    ).toBe(`z.string().date()`);
  });

  it("duration", () => {
    expect(
      parseString({
        type: "string",
        format: "duration",
      }).text(),
    ).toBe(`z.string().duration()`);
  });

  it("base64", () => {
    expect(
      parseString({
        type: "string",
        contentEncoding: "base64",
      }).text(),
    ).toBe("z.string().base64()");
    expect(
      parseString({
        type: "string",
        contentEncoding: "base64",
        errorMessage: {
          contentEncoding: "x",
        },
      }).text(),
    ).toBe('z.string().base64("x")');
    expect(
      parseString({
        type: "string",
        format: "binary",
      }).text(),
    ).toBe("z.string().base64()");
    expect(
      parseString({
        type: "string",
        format: "binary",
        errorMessage: {
          format: "x",
        },
      }).text(),
    ).toBe('z.string().base64("x")');
  });

  it("stringified JSON", () => {
    expect(
      parseString({
        type: "string",
        contentMediaType: "application/json",
        contentSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            age: {
              type: "integer",
            },
          },
          required: ["name", "age"],
        },
      }).text(),
    ).toBe(
      'z.string().transform((str, ctx) => { try { return JSON.parse(str); } catch (err) { ctx.addIssue({ code: "custom", message: "Invalid JSON" }); }}).pipe(z.object({ "name": z.string(), "age": z.number().int() }))',
    );
    expect(
      parseString({
        type: "string",
        contentMediaType: "application/json",
        contentSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
            },
            age: {
              type: "integer",
            },
          },
          required: ["name", "age"],
        },
        errorMessage: {
          contentMediaType: "x",
          contentSchema: "y",
        },
      }).text(),
    ).toBe(
      'z.string().transform((str, ctx) => { try { return JSON.parse(str); } catch (err) { ctx.addIssue({ code: "custom", message: "Invalid JSON" }); }}, "x").pipe(z.object({ "name": z.string(), "age": z.number().int() }), "y")',
    );
  });

  it("should accept errorMessage", () => {
    expect(
      parseString({
        type: "string",
        format: "ipv4",
        pattern: "x",
        minLength: 1,
        maxLength: 2,
        errorMessage: {
          format: "ayy",
          pattern: "lmao",
          minLength: "deez",
          maxLength: "nuts",
        },
      }).text(),
    ).toBe(
      'z.string().ip({ version: "v4", message: "ayy" }).regex(new RegExp("x"), "lmao").min(1, "deez").max(2, "nuts")',
    );
  });
});
