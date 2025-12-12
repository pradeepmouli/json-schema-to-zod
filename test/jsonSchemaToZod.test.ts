import { JSONSchema4, JSONSchema6Definition, JSONSchema7Definition } from "json-schema";
import jsonSchemaToZod from "../src";
import { suite } from "./suite";

describe("jsonSchemaToZod", () => {
  it("should accept json schema 7 and 4", () => {
    const schema = { type: "string" } as unknown;

    expect(jsonSchemaToZod(schema as JSONSchema4)).toBeTruthy();
    expect(jsonSchemaToZod(schema as JSONSchema6Definition)).toBeTruthy();
    expect(jsonSchemaToZod(schema as JSONSchema7Definition)).toBeTruthy();
  });

  it("should produce a string of JS code creating a Zod schema from a simple JSON schema", () => {
    expect(
      jsonSchemaToZod(
        {
          type: "string",
        },
        { module: "esm" },
      ),
      `import { z } from "zod"

export default z.string()
`,
    ).toBeTruthy();
  });

  it("should be possible to skip the import line", () => {
    expect(
      jsonSchemaToZod(
        {
          type: "string",
        },
        { module: "esm", noImport: true },
      ),
      `export default z.string()
`,
    ).toBeTruthy();
  });

  it("should be possible to add types", () => {
    expect(
      jsonSchemaToZod(
        {
          type: "string",
        },
        { name: "mySchema", module: "esm", type: true },
      ),
      `import { z } from "zod"

export const mySchema = z.string()
export type MySchema = z.infer<typeof mySchema>
`,
    ).toBeTruthy();
  });

  it("should be possible to add types with a custom name template", () => {
    expect(
      jsonSchemaToZod(
        {
          type: "string",
        },
        { name: "mySchema", module: "esm", type: "MyType" },
      ),
      `import { z } from "zod"

export const mySchema = z.string()
export type MyType = z.infer<typeof mySchema>
`,
    ).toBeTruthy();
  });

  it("should throw when given module cjs and type", () => {
    let didThrow = false;

    try {
      jsonSchemaToZod({ type: "string" }, { name: "hello", module: "cjs", type: true });
    } catch {
      didThrow = true;
    }

    expect(didThrow).toBeTruthy();
  });

  it("should throw when given type but no name", () => {
    let didThrow = false;

    try {
      jsonSchemaToZod({ type: "string" }, { module: "esm", type: true });
    } catch {
      didThrow = true;
    }

    expect(didThrow).toBeTruthy();
  });

  it("should include defaults", () => {
    expect(
      jsonSchemaToZod(
        {
          type: "string",
          default: "foo",
        },
        { module: "esm" },
      ),
      `import { z } from "zod"

export default z.string().default("foo")
`,
    ).toBeTruthy();
  });

  it("should include falsy defaults", () => {
    expect(
      jsonSchemaToZod(
        {
          type: "string",
          default: "",
        },
        { module: "esm" },
      ),
      `import { z } from "zod"

export default z.string().default("")
`,
    ).toBeTruthy();
  });

  it("should include falsy defaults", () => {
    expect(
      jsonSchemaToZod(
        {
          type: "string",
          const: "",
        },
        { module: "esm" },
      ),
      `import { z } from "zod"

export default z.literal("")
`,
    ).toBeTruthy();
  });

  it("can exclude defaults", () => {
    expect(
      jsonSchemaToZod(
        {
          type: "string",
          default: "foo",
        },
        { module: "esm", withoutDefaults: true },
      ),
      `import { z } from "zod"

export default z.string()
`,
    ).toBeTruthy();
  });

  it("should include describes", () => {
    expect(
      jsonSchemaToZod(
        {
          type: "string",
          description: "foo",
        },
        { module: "esm" },
      ),
      `import { z } from "zod"

export default z.string().describe("foo")
`,
    ).toBeTruthy();
  });

  it("can exclude describes", () => {
    expect(
      jsonSchemaToZod(
        {
          type: "string",
          description: "foo",
        },
        { module: "esm", withoutDescribes: true },
      ),
      `import { z } from "zod"

export default z.string()
`,
    ).toBeTruthy();
  });

  it("can include jsdocs", () => {
    expect(
      jsonSchemaToZod(
        {
          type: "object",
          description: "Description for schema",
          properties: {
            prop: {
              type: "string",
              description: "Description for prop",
            },
            obj: {
              type: "object",
              description:
                "Description for object that is multiline\nMore content\n\nAnd whitespace",
              properties: {
                nestedProp: {
                  type: "string",
                  description: "Description for nestedProp",
                },
                nestedProp2: {
                  type: "string",
                  description: "Description for nestedProp2",
                },
              },
            },
          },
        },
        { module: "esm", withJsdocs: true },
      ),
      `import { z } from "zod"

/**Description for schema*/
export default z.object({ 
/**Description for prop*/
"prop": z.string().describe("Description for prop").optional(), 
/**
* Description for object that is multiline
* More content
* 
* And whitespace
*/
"obj": z.object({ 
/**Description for nestedProp*/
"nestedProp": z.string().describe("Description for nestedProp").optional(), 
/**Description for nestedProp2*/
"nestedProp2": z.string().describe("Description for nestedProp2").optional() }).describe("Description for object that is multiline\\nMore content\\n\\nAnd whitespace").optional() }).describe("Description for schema")
`,
    ).toBeTruthy();
  });

  it("will remove optionality if default is present", () => {
    expect(
      jsonSchemaToZod(
        {
          type: "object",
          properties: {
            prop: {
              type: "string",
              default: "def",
            },
          },
        },
        { module: "esm" },
      ),
      `import { z } from "zod"

export default z.object({ "prop": z.string().default("def") })
`,
    ).toBeTruthy();
  });

  it("will handle falsy defaults", () => {
    expect(
      jsonSchemaToZod(
        {
          type: "boolean",
          default: false,
        },
        { module: "esm" },
      ),
      `import { z } from "zod"

export default z.boolean().default(false)
`,
    ).toBeTruthy();
  });

  it("will ignore undefined as default", () => {
    expect(
      jsonSchemaToZod(
        {
          type: "null",
          default: undefined,
        },
        { module: "esm" },
      ),
      `import { z } from "zod"

export default z.null()
`,
    ).toBeTruthy();
  });

  it("should be possible to define a custom parser", () => {
    assert(
      jsonSchemaToZod(
        {
          allOf: [{ type: "string" }, { type: "number" }, { type: "boolean", description: "foo" }],
        },
        {
          // module: false,
          parserOverride: (schema, refs) => {
            if (
              refs.path.length === 2 &&
              refs.path[0] === "allOf" &&
              refs.path[1] === 2 &&
              schema.type === "boolean" &&
              schema.description === "foo"
            ) {
              return "myCustomZodSchema";
            }
          },
        },
      ),

      `z.intersection(z.string(), z.intersection(z.number(), myCustomZodSchema))`,
    );
  });

  it("can output with cjs and a name", () => {
    expect(
      jsonSchemaToZod(
        {
          type: "string",
        },
        { module: "cjs", name: "someName" },
      ),
      `const { z } = require("zod")

module.exports = { "someName": z.string() }
`,
    ).toBeTruthy();
  });

  it("can output with cjs and no name", () => {
    expect(
      jsonSchemaToZod(
        {
          type: "string",
        },
        { module: "cjs" },
      ),
      `const { z } = require("zod")

module.exports = z.string()
`,
    ).toBeTruthy();
  });

  it("can output with name only", () => {
    expect(
      jsonSchemaToZod(
        {
          type: "string",
        },
        { name: "someName" },
      ),
      "const someName = z.string()",
    ).toBeTruthy();
  });

  it("can exclude name", () => {
    expect(jsonSchemaToZod(true), "z.any()").toBeTruthy();
  });
});
