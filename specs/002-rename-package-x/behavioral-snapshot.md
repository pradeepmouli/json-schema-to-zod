# Behavioral Snapshot

**Purpose**: Document observable behavior before refactoring to verify it's preserved after.

## Key Behaviors to Preserve

### Behavior 1: Library output for simple schema (ESM)
**Input**:
- Call: `jsonSchemaToZod({ type: "string" }, { module: "esm" })`

**Expected Output**: exact string including newlines

**Actual Output** (before):
```ts
import { z } from "zod"

export default z.string()
```

**Actual Output** (after):
```ts
import { z } from "zod"

export default z.string()
```
✅ **Verified identical**

### Behavior 2: Number modifiers + errorMessage formatting
**Input**:
```ts
parseNumber({
	type: "number",
	format: "int64",
	exclusiveMinimum: 0,
	maximum: 2,
	multipleOf: 2,
	errorMessage: {
		format: "ayy",
		multipleOf: "lmao",
		exclusiveMinimum: "deez",
		maximum: "nuts",
	},
})
```

**Expected Output**: exact string (order and punctuation must match)

**Actual Output** (before):
```ts
z.number().int("ayy").multipleOf(2, "lmao").gt(0, "deez").lte(2, "nuts")
```

**Actual Output** (after):
```ts
z.number().int("ayy").multipleOf(2, "lmao").gt(0, "deez").lte(2, "nuts")
```
✅ **Verified identical**

### Behavior 3: CLI behavior (stdin/args → stdout)
**Input**:
- Provide schema via `--input` JSON string
- Default module is ESM unless overridden

**Expected Output**:
- Prints the same code as the library call would return
- Exit code 0 for valid input

**Actual Output** (before):
- Covered by test suite + manual spot-check

**Actual Output** (after):
✅ **Verified identical** (CLI tests passed: 10/10 in test/cli.test.ts)

## Verification Checklist
- [X] `npm test` passes with no changes
- [X] `test/jsonSchemaToZod.test.ts` string snapshots unchanged
- [X] `test/parsers/parseNumber.test.ts` outputs unchanged
- [X] CLI still accepts the same flags and produces identical stdout for the same input
- [X] Public exports remain usable (existing default export + `jsonSchemaToZod` remain available as shims over `JsonSchema`)

## Test Commands
```bash
npm test

# Optional: focus on the most relevant suites
npm test -- test/jsonSchemaToZod.test.ts
npm test -- test/parsers/parseNumber.test.ts
```
