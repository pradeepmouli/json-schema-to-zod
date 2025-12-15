# Behavioral Snapshot: json-schema-to-zod Refactoring

**Refactor ID**: refactor-001
**Created**: 2025-12-11
**Purpose**: Document key observable behaviors that MUST be preserved during refactoring to vitest, oxfmt/oxlint, and ts-morph

## Observable Behaviors to Preserve

### 1. Core API Behavior: jsonSchemaToZod Function

**Function Signature**:

```typescript
function jsonSchemaToZod(
  schema: any,
  options?: JsonSchemaToZodOptions
): string
```

**JsonSchemaToZodOptions**:

```typescript
type JsonSchemaToZodOptions = {
  // Module syntax for generated code: 'esm' | 'cjs' | undefined
  module?: 'esm' | 'cjs';
  // Named schema export when module is set; affects type export when `type` is true
  name?: string;
  // When true in ESM mode, also emit `export type <Name> = z.infer<typeof <name>>;`
  type?: boolean;
  // Removes import line from emitted output
  noImport?: boolean;
  // Generate jsdoc comments from `description` fields in schema
  withJsdocs?: boolean;
  // Max recursion depth before falling back to `z.any()` (CLI default 0)
  depth?: number;
};
```

**Expected Behavior**: Given a JSON schema object and optional configuration, returns a valid TypeScript code string representing a Zod schema.

**Test Cases**:

#### Test 1.1: Simple String Schema

**Input**:

```json
{
  "type": "string"
}
```

**Expected Output**:

```typescript
import { z } from 'zod';
export default z.string();
```

**Verification**: Output must be valid TypeScript that compiles and produces equivalent validation logic before/after refactoring.

#### Test 1.2: Object with Multiple Properties

**Input**:

```json
{
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "number" }
  },
  "required": ["name"]
}
```

**Expected Output** (contains):

- Import statement: `import { z } from 'zod';`
- Object definition with `z.object({...})`
- `name` property: `z.string()`
- `age` property: `z.number().optional()`

**Verification**: Generated object structure and property types must be identical.

#### Test 1.3: With Module Option (ESM)

**Input**:

```json
{
  "type": "string"
}
```

**Options**:

```typescript
{ module: "esm", name: "mySchema" }
```

**Expected Output** (contains):

- ESM import: `import { z } from 'zod';`
- Named export: `export const mySchema = z.string();`
- NOT default export

**Verification**: Module format (ESM vs CJS) must be correctly applied.

#### Test 1.4: With Module Option (CJS)

**Options**:

```typescript
{ module: "cjs", name: "mySchema" }
```

**Expected Output** (contains):

- CJS import: `const { z } = require('zod');`
- CJS export: `module.exports = z.string();`

**Verification**: CommonJS syntax must be correct.

### 2. CLI Behavior: Command-Line Interface

**Command**: `json-schema-to-zod [options]`

#### Test 2.1: File Input/Output

**Command**:

```bash
json-schema-to-zod -i test-schema.json -o output.ts
```

**Expected Behavior**:

- Reads JSON schema from `test-schema.json`
- Parses the schema
- Generates TypeScript code
- Writes output to `output.ts`
- Exit code: 0 (success)

**Verification**: Generated file must exist and contain valid TypeScript.

#### Test 2.2: Piped Input

**Command**:

```bash
cat test-schema.json | json-schema-to-zod
```

**Expected Behavior**:

- Reads JSON from stdin
- Generates TypeScript code
- Writes to stdout
- Exit code: 0

**Verification**: Output must be valid TypeScript written to stdout.

#### Test 2.3: CLI with Name Option

**Command**:

```bash
json-schema-to-zod -i schema.json -n "UserSchema" -m esm -t
```

**Expected Behavior**:

- Generates named export: `export const UserSchema = ...`
- Also generates type export: `export type UserSchema = ...`
- Uses ESM syntax

**Verification**: Both schema and type exports present.

### 3. Code Generation Idempotency: npm run gen

**Command**: `npm run gen`

**Expected Behavior**:

- Scans `src/` directory (excluding specific files)
- Generates `src/index.ts` with exports from all parser modules
- Output must be deterministic (same input → same output always)

**Verification Steps**:

1. Run `npm run gen` twice in succession
2. Compare generated files: `diff src/index.ts <(npm run gen > /tmp/gen-output.ts)`
3. Result: No differences (idempotent)

**Test Cases**:

#### Test 3.1: Generated Index Contains All Parsers

**Expected Content**:

- `export * from "./parsers/parseAllOf.js"`
- `export * from "./parsers/parseAnyOf.js"`
- `export * from "./parsers/parseArray.js"`
- ... (all parser modules)
- `export * from "./utils/half.js"`
- `export * from "./utils/jsdocs.js"`
- `export * from "./utils/omit.js"`
- `export * from "./utils/withMessage.js"`
- `import { jsonSchemaToZod } from "./jsonSchemaToZod.js"`
- `export default jsonSchemaToZod`

**Verification**: All expected exports present, no spurious exports, proper file references.

#### Test 3.2: Excluded Files Not Exported

**Expected Behavior**:

- `src/index.ts` itself NOT re-exported
- `src/cli.ts` NOT re-exported (CLI-only module)
- `src/utils/cliTools.ts` NOT re-exported (CLI-only utility)

**Verification**: grep searches confirm these files absent from exports.

### 4. Module Export Contracts

#### Test 4.1: ESM Exports

**Test Code**:

```typescript
import { jsonSchemaToZod } from "json-schema-to-zod";
import defaultExport from "json-schema-to-zod";
import { parseObject, parseString } from "json-schema-to-zod";

// All should work
```

**Expected Behavior**: ESM import syntax works; default export = jsonSchemaToZod function; named exports available.

#### Test 4.2: CJS Exports

**Test Code**:

```javascript
const { jsonSchemaToZod } = require("json-schema-to-zod");
const defaultExport = require("json-schema-to-zod");
```

**Expected Behavior**: CJS require syntax works; default export = jsonSchemaToZod function.

## Verification Checklist Before/After Refactoring

### Pre-Refactoring Verification

- [ ] Run full test suite: `npm test` → all tests pass
- [ ] Run code generation: `npm run gen` → src/index.ts generated without errors
- [ ] Test CLI with sample schema → valid output produced
- [ ] Verify ESM exports work with `import` statements
- [ ] Verify CJS exports work with `require()` statements
- [ ] Document actual outputs for comparison

### Post-Refactoring Verification

- [ ] Run full test suite with Vitest: `npm test` → all tests pass (MUST match pre-refactor assertions)
- [ ] Run code generation: `npm run gen` → src/index.ts generated; compare to pre-refactor version (MUST match byte-for-byte)
- [ ] Test CLI with identical sample schema → output identical to pre-refactor
- [ ] Verify ESM exports still work
- [ ] Verify CJS exports still work
- [ ] Compare all generated outputs to pre-refactor (MUST be identical)

## Key Invariants

1. **API Stability**: `jsonSchemaToZod(schema, options)` returns identical strings before and after refactoring
2. **CLI Stability**: `json-schema-to-zod` CLI produces identical output files and stdout before and after refactoring
3. **Index Stability**: `npm run gen` produces byte-identical `src/index.ts` before and after refactoring
4. **Export Stability**: All ESM and CJS exports available before and after refactoring
5. **Test Stability**: All test assertions pass without modification before and after refactoring

## Measurement Strategy

### Before Refactoring (Baseline)

1. Run all tests; capture exit code and assertion count
2. Save output of: `npm run gen > /tmp/index.baseline.ts`
3. Run CLI on 3-5 standard test schemas; save outputs
4. Document any formatting/linting issues observed

### After Refactoring (Validation)

1. Run all tests; verify exit code and assertion count MATCH
2. Run: `npm run gen > /tmp/index.refactored.ts`
3. Diff: `diff /tmp/index.baseline.ts /tmp/index.refactored.ts` → MUST be empty
4. Run CLI on same 3-5 test schemas; verify outputs MATCH
5. Confirm formatting/linting issues are resolved

## Status

- **Created**: 2025-12-11
- **Reviewed**: Pending
- **Baseline Snapshot**: Pending capture before refactoring begins
