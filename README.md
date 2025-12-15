# X-to-Zod

[![NPM Version](https://img.shields.io/npm/v/x-to-zod.svg)](https://npmjs.org/package/x-to-zod)
[![NPM Downloads](https://img.shields.io/npm/dw/x-to-zod.svg)](https://npmjs.org/package/x-to-zod)

_Looking for the exact opposite? Check out [zod-to-json-schema](https://npmjs.org/package/zod-to-json-schema)_

## Summary

A runtime package and CLI tool to convert JSON schema (draft 4+) objects or files into Zod schemas in the form of JavaScript code.

Before v2 it used [`prettier`](https://www.npmjs.com/package/prettier) for formatting and [`json-refs`](https://www.npmjs.com/package/json-refs) to resolve schemas. To replicate the previous behaviour, please use their respective CLI tools.

Since v2 the CLI supports piped JSON.

## Developer Notes

### Internal Architecture: Fluent Zod-like Builders

This section documents the internal builder architecture for contributors working on the codebase.

#### Builder Pattern

The internal `ZodBuilder` system uses a fluent interface pattern matching Zod's API:

```typescript
// Factory API (mirrors Zod)
build.number()     → NumberBuilder
build.string()     → StringBuilder
build.array(item)  → ArrayBuilder
build.object(props) → ObjectBuilder
build.enum(values) → EnumBuilder
build.literal(val) → ConstBuilder
build.boolean()    → BooleanBuilder
build.null()       → NullBuilder
```

#### Lazy Evaluation Pattern

All builders follow a consistent lazy evaluation pattern:

1. **Constructor** initializes `_baseText` with base schema (e.g., `"z.number()"`)
2. **Modifier methods** store constraint metadata in private fields (e.g., `_min`, `_max`, `_format`)
3. **`.text()` method** generates code by:
   - Applying type-specific constraints to `_baseText`
   - Updating `this._baseText` with result
   - Calling `super.text()` to apply shared modifiers from BaseBuilder
4. **BaseBuilder.text()** applies shared modifiers (`_optional`, `_nullable`, etc.)

**Example Flow:**
```typescript
build.number().int().max(10).optional().text()

// Step 1: build.number() creates NumberBuilder with _baseText="z.number()"
// Step 2: .int() sets _int=true, returns this (no code generation yet)
// Step 3: .max(10) sets _max={value:10}, returns this
// Step 4: .optional() sets _optional=true, returns this
// Step 5: .text() generates: "z.number().int().max(10).optional()"
```

#### Smart Constraint Merging

Multiple calls to the same modifier intelligently merge:

- `.min(5).min(10)` → keeps strictest (10)
- `.max(20).max(15)` → keeps strictest (15)
- `.multipleOf(3)` → automatically sets `_int = true`

#### BaseBuilder Inheritance

All builders extend `BaseBuilder<T>` which provides 8 shared modifiers:
- `.optional()`, `.nullable()`, `.default(val)`, `.describe(str)`
- `.brand(str)`, `.readonly()`, `.catch(val)`, `.text()`

This eliminates 154 lines of duplicated code and ensures consistent behavior across all builder types.

## Usage

### Online

[Just paste your JSON schemas here!](https://stefanterdell.github.io/x-to-zod-react/)

### CLI

#### Simplest example

```console
npm i -g x-to-zod
```

```console
x-to-zod -i mySchema.json -o mySchema.ts
```

#### Example with `$refs` resolved and output formatted

```console
npm i -g x-to-zod json-refs prettier
```

```console
json-refs resolve mySchema.json | x-to-zod | prettier --parser typescript > mySchema.ts
```

#### Options

| Flag           | Shorthand | Function                                                                                       |
| -------------- | --------- | ---------------------------------------------------------------------------------------------- |
| `--input`      | `-i`      | JSON or a source file path. Required if no data is piped.                                      |
| `--output`     | `-o`      | A file path to write to. If not supplied stdout will be used.                                  |
| `--name`       | `-n`      | The name of the schema in the output                                                           |
| `--depth`      | `-d`      | Maximum depth of recursion in schema before falling back to `z.any()`. Defaults to 0.          |
| `--module`     | `-m`      | Module syntax; `esm`, `cjs` or none. Defaults to `esm` in the CLI and `none` programmaticly.   |
| `--type`       | `-t`      | Export a named type along with the schema. Requires `name` to be set and `module` to be `esm`. |
| `--noImport`   | `-ni`     | Removes the `import { z } from 'zod';` or equivalent from the output.                          |
| `--withJsdocs` | `-wj`     | Generate jsdocs off of the description property.                                               |

### Programmatic

#### Simple example

```typescript
import { jsonSchemaToZod } from "x-to-zod";

const myObject = {
  type: "object",
  properties: {
    hello: {
      type: "string",
    },
  },
};

const module = jsonSchemaToZod(myObject, { module: "esm" });

// `type` can be either a string or - outside of the CLI - a boolean. If its `true`, the name of the type will be the name of the schema with a capitalized first letter.
const moduleWithType = jsonSchemaToZod(myObject, {
  name: "mySchema",
  module: "esm",
  type: true,
});

const cjs = jsonSchemaToZod(myObject, { module: "cjs", name: "mySchema" });

const justTheSchema = jsonSchemaToZod(myObject);
```

##### `module`

```typescript
import { z } from "zod";

export default z.object({ hello: z.string().optional() });
```

##### `moduleWithType`
import { z } from "zod";

export const mySchema = z.object({ hello: z.string().optional() });
export type MySchema = z.infer<typeof mySchema>;
```

##### `cjs`

```typescript
const { z } = require("zod");

module.exports = { mySchema: z.object({ hello: z.string().optional() }) };
```

##### `justTheSchema`

```typescript
z.object({ hello: z.string().optional() });
```

#### Example with `$refs` resolved and output formatted

```typescript
import { z } from "zod";
import { resolveRefs } from "json-refs";
import { format } from "prettier";
import jsonSchemaToZod from "x-to-zod";

async function example(jsonSchema: Record<string, unknown>): Promise<string> {
  const { resolved } = await resolveRefs(jsonSchema);
  const code = jsonSchemaToZod(resolved);
  const formatted = await format(code, { parser: "typescript" });

  return formatted;
}
```

#### Overriding a parser

You can pass a function to the `overrideParser` option, which represents a function that receives the current schema node and the reference object, and should return a string when it wants to replace a default output. If the default output should be used for the node just return void.

#### Schema factoring

Factored schemas (like object schemas with "oneOf" etc.) is only partially supported. Here be dragons.

#### Use at Runtime

The output of this package is not meant to be used at runtime. JSON Schema and Zod does not overlap 100% and the scope of the parsers are purposefully limited in order to help the author avoid a permanent state of chaotic insanity. As this may cause some details of the original schema to be lost in translation, it is instead recommended to use tools such as [Ajv](https://ajv.js.org/) to validate your runtime values directly against the original JSON Schema.

That said, it's possible in most cases to use `eval`. Here's an example that you shouldn't use:

```typescript
const zodSchema = eval(jsonSchemaToZod({ type: "string" }, { module: "cjs" }));

zodSchema.safeParse("Please just use Ajv instead");
```
