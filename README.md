# X-to-Zod

[![NPM Version](https://img.shields.io/npm/v/x-to-zod.svg)](https://npmjs.org/package/x-to-zod)
[![NPM Downloads](https://img.shields.io/npm/dw/x-to-zod.svg)](https://npmjs.org/package/x-to-zod)

> **Note:** This is an enhanced fork of [json-schema-to-zod](https://github.com/StefanTerdell/json-schema-to-zod) by Stefan Terdell. All credit for the original implementation goes to the original author and contributors.

## Overview

A runtime package and CLI tool to convert JSON schema (draft 4+) objects or files into Zod schemas in the form of JavaScript code.

**TypeScript Type Definitions:** This package uses [json-schema-typed](https://github.com/ThomasAribart/json-schema-typed) for comprehensive JSON Schema draft-2020-12 type definitions, providing excellent IntelliSense and type safety.

_Looking for the exact opposite? Check out [zod-to-json-schema](https://npmjs.org/package/zod-to-json-schema)_

## Enhancements in This Fork

This fork includes several architectural improvements and new features:

### 1. **Fluent Builder Pattern Architecture**
- Complete rewrite of internal code generation using fluent builders
- Consistent lazy evaluation pattern across all schema types
- Builder classes mirror Zod's API: `build.number()`, `build.string()`, `build.object()`, etc.
- Smart constraint merging (e.g., multiple `.min()` calls keep the strictest value)

### 2. **Consolidated Modifier System**
- All builders extend `BaseBuilder<T>` with shared modifiers
- Eliminated 154 lines of duplicated code
- Consistent behavior for `.optional()`, `.nullable()`, `.default()`, `.describe()`, `.brand()`, `.readonly()`, `.catch()`, and more

### 3. **Enhanced Zod v4 Support**
- Support for new Zod v4 types: `void`, `undefined`, `date`, `bigint`, `symbol`, `nan`
- String validators: `url`, `httpUrl`, `hostname`, `emoji`, `base64url`, `hex`, `jwt`, `nanoid`, `cuid`, `cuid2`, `ulid`, `ipv4`, `ipv6`, `mac`, `cidrv4`, `cidrv6`, `hash`, `isoDate`, `isoTime`, `isoDatetime`, `isoDuration`, `uuidv4`, `uuidv6`, `uuidv7`
- Collection types: `set`, `map`
- Advanced types: `promise`, `lazy`, `function`, `codec`, `preprocess`, `pipe`, `json`, `file`, `nativeEnum`, `templateLiteral`, `xor`, `keyof`

### 4. **Improved oneOf Handling**
- Simplified implementation using native `z.xor()` instead of manual superRefine
- Cleaner generated code for exclusive OR (exactly one schema must match)

### 5. **Better Module Resolution**
- Fixed ESM build configuration for proper TypeScript module resolution
- Added `moduleResolution: "bundler"` for compatibility with modern bundlers

### 6. **Code Quality**
- Migrated to Vitest for faster test execution
- Updated linting with oxlint
- Better test coverage and organization

### 7. **Zod v3/v4 Dual-Mode Support**
- Generate schemas compatible with either Zod v3 or v4 via `zodVersion` option
- Defaults to `'v4'` (use `'v3'` for backward compatibility)
- v4 mode generates new syntax: `z.strictObject()`, `z.looseObject()`, `.extend()` instead of `.merge()`
- Fully backward compatible - specify `zodVersion: 'v3'` to maintain existing behavior

## Installation

```console
npm i -g x-to-zod
```

## Usage

### Version-Specific Imports

This package supports importing version-specific builder APIs. This ensures you only use features compatible with your target Zod version and provides TypeScript type safety.

#### Using Zod v4 (default)

```typescript
import { build } from 'x-to-zod/v4';

// All v4 features available
const promiseSchema = build.promise(build.string());
const lazySchema = build.lazy('() => mySchema');
const jsonSchema = build.json();
```

#### Using Zod v3 (backward compatibility)

```typescript
import { build } from 'x-to-zod/v3';

// Only v3-compatible features available
const stringSchema = build.string();
const objectSchema = build.object({ name: build.string() });

// TypeScript error - v4-only features not available:
// const promiseSchema = build.promise(build.string()); // ❌
```

**Benefits:**
- **Type Safety:** TypeScript prevents using v4-only features when importing from `v3`
- **Explicit Intent:** Makes your Zod version dependency clear in code
- **Future-Proof:** Easier migration when Zod releases new versions

**Default Import:** The main package export includes all features (v4-compatible):
```typescript
import { build } from 'x-to-zod';
// Same as 'x-to-zod/v4'
```

### CLI

#### Simplest example
```console
x-to-zod -i mySchema.json -o mySchema.ts
```

#### Example with `$refs` resolved and output formatted

```console
npm i -g x-to-zod json-refs prettier

```console
json-refs resolve mySchema.json | x-to-zod | prettier --parser typescript > mySchema.ts
```
#### Options

| Flag           | Shorthand | Function                                                                                       |
| -------------- | --------- | ---------------------------------------------------------------------------------------------- |
| `--input`      | `-i`      | JSON or a source file path. Required if no data is piped.                                      |
| `--name`       | `-n`      | The name of the schema in the output                                                           |
| `--depth`      | `-d`      | Maximum depth of recursion in schema before falling back to `z.any()`. Defaults to 0.          |
| `--module`     | `-m`      | Module syntax; `esm`, `cjs` or none. Defaults to `esm` in the CLI and `none` programmatically. |
| `--type`       | `-t`      | Export a named type along with the schema. Requires `name` to be set and `module` to be `esm`. |
| `--withJsdocs` | `-wj`     | Generate jsdocs off of the description property.                                               |

### Programmatic

#### Simple example
```typescript
import { jsonSchemaToZod } from "x-to-zod";
const myObject = {
  type: "object",
    hello: {
      type: "string",
    },
  },
};

const module = jsonSchemaToZod(myObject, { module: "esm" });

// `type` can be either a string or - outside of the CLI - a boolean. If it's `true`,
// the name of the type will be the name of the schema with a capitalized first letter.
const moduleWithType = jsonSchemaToZod(myObject, {
  name: "mySchema",
  module: "esm",
  type: true,
});

const cjs = jsonSchemaToZod(myObject, { module: "cjs", name: "mySchema" });

const justTheSchema = jsonSchemaToZod(myObject);
```

## Builder API

The `build.*` factory creates fluent builders that mirror Zod's API. Each builder supports `.text()` to produce code and shares common modifiers like `.optional()`, `.nullable()`, `.default()`, `.describe()`, `.brand()`, `.readonly()`, `.catch()`, `.refine()`, `.superRefine()`, `.meta()`, `.transform()`.

- **Primitives:**
  - `build.string()` → `StringBuilder`
  - `build.number()` → `NumberBuilder`
  - `build.boolean()` → `BooleanBuilder`
  - `build.bigint()` → `BigintBuilder`
  - `build.symbol()` → `SymbolBuilder`
  - `build.nan()` → `NanBuilder`
  - `build.null()` → `NullBuilder`
  - `build.undefined()` → `UndefinedBuilder`
  - `build.void()` → `VoidBuilder`

- **Structured:**
  - `build.object(props)` → `ObjectBuilder`
    - Helpers: `.strict()`, `.loose()`, `.catchall(schema)`, `.superRefine(fn)`, `.and(schema)`, `.extend(schema|string)`, `.merge(schema|string)`, `.pick(keys)`, `.omit(keys)`
  - `build.array(item)` → `ArrayBuilder`
  - `build.tuple(items)` → `TupleBuilder`
  - `build.record(key, value)` → `RecordBuilder`
  - `build.map(key, value)` → `MapBuilder`
  - `build.set(item)` → `SetBuilder`

- **Enums and Literals:**
  - `build.enum(values)` → `EnumBuilder`
  - `build.literal(value)` → `LiteralBuilder`
  - `build.nativeEnum(enumObj)` → `NativeEnumBuilder`

- **Unions and Intersections:**
  - `build.union(schemas)` → `UnionBuilder`
  - `build.intersection(a, b)` → `IntersectionBuilder`
  - `build.discriminatedUnion(tag, options)` → `DiscriminatedUnionBuilder`
  - `build.xor(schemas)` → `XorBuilder` (exactly one must match)

- **Functions and Lazy:**
  - `build.function()` → `FunctionBuilder`
    - `.args(...schemas)`, `.returns(schema)`
  - `build.lazy(getter)` → `LazyBuilder`

- **Pipes and Transforms:**
  - `build.pipe(input)` → `PipeBuilder`
  - `build.preprocess(fn, schema)` → `PreprocessBuilder`
  - `build.codec(parseFn, serializeFn)` → `CodecBuilder`
  - `build.json()` → `JsonBuilder`

- **Strings (validators):**
  - `build.string().url()`, `.httpUrl()`, `.hostname()`, `.emoji()`, `.base64url()`, `.hex()`, `.jwt()`, `.nanoid()`, `.cuid()`, `.cuid2()`, `.ulid()`, `.ipv4()`, `.ipv6()`, `.mac()`, `.cidrv4()`, `.cidrv6()`, `.hash(algorithm)`, `.isoDate()`, `.isoTime()`, `.isoDatetime()`, `.isoDuration()`, `.uuidv4()`, `.uuidv6()`, `.uuidv7()`

- **Numbers (constraints):**
  - `build.number().int()`, `.min(n)`, `.max(n)`, `.positive()`, `.negative()`, `.nonnegative()`, `.nonpositive()`, `.multipleOf(n)`

- **Templates and Keys:**
  - `build.templateLiteral(parts)` → `TemplateLiteralBuilder`
  - `build.keyof(obj)` → `KeyofBuilder`

### Examples

```ts
// Object with constraints and shared modifiers
build
  .object({ id: build.string().uuidv7(), name: build.string().min(1) })
  .strict()
  .default({ id: '...', name: '' })
  .text();

// XOR union (exactly one must match)
build.xor([build.string(), build.number()]).text();

// Function schema
build.function().args(build.string(), build.number()).returns(build.boolean()).text();
```

##### `module`

```typescript
import { z } from "zod";

export default z.object({ hello: z.string().optional() });
```

##### `moduleWithType`

```typescript
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

## Zod Version Support

This library supports generating schemas compatible with both Zod v3 and v4 through the `zodVersion` option.

### Basic Usage

```typescript
import { jsonSchemaToZod } from "x-to-zod";

// Generate Zod v4 code (default)
const schemaV4 = jsonSchemaToZod(mySchema);
// or explicitly
const schemaV4Explicit = jsonSchemaToZod(mySchema, { zodVersion: 'v4' });

// Generate Zod v3 code (for backward compatibility)
const schemaV3 = jsonSchemaToZod(mySchema, { zodVersion: 'v3' });
```

### Key Differences

The `zodVersion` option affects how certain Zod constructs are generated:

#### Object Strict/Loose Modes

**v4 mode (default):**
```typescript
// additionalProperties: false
z.strictObject({ name: z.string() })

// passthrough behavior
z.looseObject({ name: z.string() })
```

**v3 mode:**
```typescript
// additionalProperties: false
z.object({ name: z.string() }).strict()

// passthrough behavior (using .loose() method)
z.object({ name: z.string() }).loose()
```

#### Object Merge

**v4 mode (default):**
```typescript
baseObject.extend(otherObject)
```

**v3 mode:**
```typescript
baseObject.merge(otherObject)
```

#### Error Messages (Future)

When implemented, error messages will use different parameter names:

**v3 mode:** `{ message: "error text" }`  
**v4 mode:** `{ error: "error text" }`

### Builder API with Version Support

The builder API also respects the `zodVersion` option:

```typescript
import { build } from "x-to-zod/builders";

// v4 mode (default)
build.object({ name: build.string() }).strict().text()
// => 'z.strictObject({ "name": z.string() })'

// v3 mode
build.object({ name: build.string() }, { zodVersion: 'v3' }).strict().text()
// => 'z.object({ "name": z.string() }).strict()'
```

### Migration Guide

#### When to use v4 mode (default)
- New projects starting with Zod v4
- Ready to adopt v4's improved API
- Want cleaner generated code

#### When to use v3 mode
- Existing projects using Zod v3
- Want to avoid any breaking changes
- Gradual migration to Zod v4

#### Migration Steps

1. **For new projects** - use v4 mode (default) and enjoy the improved syntax
2. **For existing projects** - add `zodVersion: 'v3'` to maintain current behavior
3. **Test thoroughly** - ensure all generated schemas work as expected
4. **Switch to v4 mode** - remove `zodVersion: 'v3'` when ready
5. **Update consuming code** - adjust for any Zod v4 API changes
6. **Enjoy improved syntax** - benefit from cleaner, more concise schemas

### Compatibility Notes

- **Default is v4** for new projects; use `zodVersion: 'v3'` for backward compatibility
- **Both modes are fully tested** and production-ready
- **No runtime dependencies** on specific Zod versions - generates code strings only
- **Mix and match** - you can generate different schemas with different versions as needed

## Advanced Features

### Parser Override

The `parserOverride` option allows you to customize the code generation for specific schema nodes. This is useful when you need to:
- Use custom Zod schemas for specific patterns
- Replace generated code with hand-crafted validators
- Integrate with custom validation libraries

#### Function Signature

```typescript
type ParserOverride = (
  schema: JsonSchemaObject,
  refs: Context
) => BaseBuilder | string | void;
```

**Parameters:**
- `schema`: The current JSON schema node being processed
- `refs`: Context object containing:
  - `path`: Array tracking the current position in the schema (e.g., `['allOf', 0, 'properties', 'name']`)
  - `seen`: Map for circular reference detection
  - All other options passed to `jsonSchemaToZod()`

**Return Values:**
- `string`: Replace the generated code with your custom Zod expression (e.g., `'myCustomSchema'`)
- `BaseBuilder`: Return a builder instance to customize generation programmatically
- `void` (or `undefined`): Use the default parser behavior for this node

#### Example: Replace Specific Schema Nodes

```typescript
import { jsonSchemaToZod } from "x-to-zod";

const schema = {
  allOf: [
    { type: 'string' },
    { type: 'number' },
    { type: 'boolean', description: 'custom-flag' }
  ]
};

const code = jsonSchemaToZod(schema, {
  parserOverride: (schema, refs) => {
    // Target the third element in allOf with specific description
    if (
      refs.path.length === 2 &&
      refs.path[0] === 'allOf' &&
      refs.path[1] === 2 &&
      schema.type === 'boolean' &&
      schema.description === 'custom-flag'
    ) {
      // Replace with custom validation
      return 'myCustomBooleanValidator';
    }
    // Use default behavior for all other nodes
  }
});

// Output: z.intersection(z.string(), z.intersection(z.number(), myCustomBooleanValidator))
```

#### Example: Use Custom Schemas for Format Strings

```typescript
import { jsonSchemaToZod } from "x-to-zod";

const schema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email' },
    customId: { type: 'string', format: 'x-custom-id' }
  }
};

const code = jsonSchemaToZod(schema, {
  parserOverride: (schema, refs) => {
    // Replace custom format with your own schema
    if (schema.type === 'string' && schema.format === 'x-custom-id') {
      return 'customIdSchema.refine((v) => /^ID-\\d{6}$/.test(v))';
    }
  }
});
```

#### Example: Path-Based Conditional Logic

```typescript
const code = jsonSchemaToZod(complexSchema, {
  parserOverride: (schema, refs) => {
    // Target all schemas under 'definitions'
    if (refs.path[0] === 'definitions') {
      const defName = refs.path[1];
      return `sharedSchemas.${defName}`;
    }

    // Target deeply nested properties
    if (refs.path.join('.') === 'properties.user.properties.metadata') {
      return 'z.record(z.string(), z.unknown())';
    }
  }
});
```

### Preprocessors

The `preprocessors` option allows you to transform JSON schema nodes **before** parsing begins. This is useful for:
- Normalizing vendor-specific schema extensions
- Applying global transformations to schemas
- Removing or modifying unsupported keywords
- Injecting default values or constraints

#### Function Signature

```typescript
type transformer = (
  schema: JsonSchemaObject,
  refs: Context
) => JsonSchemaObject | undefined;
```

**Parameters:**
- `schema`: The current JSON schema node
- `refs`: Context object with path tracking and options

**Return Values:**
- `JsonSchemaObject`: The transformed schema (replaces the original)
- `undefined`: Keep the schema unchanged

#### Execution Order

Preprocessors run **before** `parserOverride` and before any default parsing:

1. **Preprocessors** transform the schema
2. **ParserOverride** can replace code generation
3. **Default parsers** generate Zod code

#### Example: Normalize Vendor Extensions

```typescript
import { jsonSchemaToZod } from "x-to-zod";

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      'x-custom-min': 5,  // Vendor-specific extension
      'x-custom-max': 100
    }
  }
};

const code = jsonSchemaToZod(schema, {
  preprocessors: [
    (schema, refs) => {
      // Convert custom extensions to standard JSON schema
      if (schema['x-custom-min'] !== undefined) {
        return {
          ...schema,
          minLength: schema['x-custom-min'],
          maxLength: schema['x-custom-max']
        };
      }
    }
  ]
});

// Output includes: z.string().min(5).max(100)
```

#### Example: Strip Unsupported Keywords

```typescript
const code = jsonSchemaToZod(schema, {
  preprocessors: [
    (schema, refs) => {
      const { $comment, examples, ...rest } = schema;
      // Remove keywords not supported by Zod
      return rest;
    }
  ]
});
```

#### Example: Inject Constraints Based on Path

```typescript
const code = jsonSchemaToZod(schema, {
  preprocessors: [
    (schema, refs) => {
      // Add minimum length to all string properties under 'user'
      if (
        refs.path[0] === 'properties' &&
        refs.path[1] === 'user' &&
        schema.type === 'string' &&
        !schema.minLength
      ) {
        return {
          ...schema,
          minLength: 1  // Ensure non-empty strings
        };
      }
    }
  ]
});
```

#### Example: Multiple Preprocessors

Preprocessors are executed in order, allowing you to chain transformations:

```typescript
const code = jsonSchemaToZod(schema, {
  preprocessors: [
    // First: normalize vendor extensions
    (schema) => {
      if (schema['x-nullable']) {
        return { ...schema, nullable: true };
      }
    },
    // Second: apply default constraints
    (schema) => {
      if (schema.type === 'string' && !schema.maxLength) {
        return { ...schema, maxLength: 1000 };
      }
    },
    // Third: remove internal metadata
    (schema) => {
      const { 'x-internal-id': _, ...rest } = schema;
      return rest;
    }
  ]
});
```

### Combining ParserOverride and Preprocessors

Use both options together for maximum flexibility:

```typescript
const code = jsonSchemaToZod(schema, {
  preprocessors: [
    // Transform schema structure first
    (schema) => {
      if (schema['x-custom-type']) {
        return { type: schema['x-custom-type'], ...schema };
      }
    }
  ],
  parserOverride: (schema, refs) => {
    // Then override code generation for specific cases
    if (schema.type === 'custom-type') {
      return 'myCustomTypeValidator';
    }
  }
});
```

## Important Notes

### Schema Factoring

Factored schemas (like object schemas with "oneOf" etc.) is only partially supported. Here be dragons.

### Use at Runtime

The output of this package is not meant to be used at runtime. JSON Schema and Zod does not overlap 100% and the scope of the parsers are purposefully limited in order to help the author avoid a permanent state of chaotic insanity. As this may cause some details of the original schema to be lost in translation, it is instead recommended to use tools such as [Ajv](https://ajv.js.org/) to validate your runtime values directly against the original JSON Schema.

That said, it's possible in most cases to use `eval`. Here's an example that you shouldn't use:

```typescript
const zodSchema = eval(jsonSchemaToZod({ type: "string" }, { module: "cjs" }));

zodSchema.safeParse("Please just use Ajv instead");
```

## Credits

This is a fork of [json-schema-to-zod](https://github.com/StefanTerdell/json-schema-to-zod) by [Stefan Terdell](https://github.com/StefanTerdell).

### Type Definitions

JSON Schema TypeScript type definitions provided by [json-schema-typed](https://github.com/ThomasAribart/json-schema-typed) by Thomas Aribart, supporting JSON Schema draft-2020-12.

### Original Contributors

Original contributors include:
- Chen (https://github.com/werifu)
- Nuno Carduso (https://github.com/ncardoso-barracuda)
- Lars Strojny (https://github.com/lstrojny)
- Navtoj Chahal (https://github.com/navtoj)
- Ben McCann (https://github.com/benmccann)
- Dmitry Zakharov (https://github.com/DZakh)
- Michel Turpin (https://github.com/grimly)
- David Barratt (https://github.com/davidbarratt)
- pevisscher (https://github.com/pevisscher)
- Aidin Abedi (https://github.com/aidinabedi)
- Brett Zamir (https://github.com/brettz9)
- vForgeOne (https://github.com/vforgeone)
- Adrian Ordonez (https://github.com/adrianord)
- Jonas Reucher (https://github.com/Mantls)

## License

ISC
