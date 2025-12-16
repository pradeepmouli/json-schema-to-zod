# Behavioral Snapshot

**Purpose**: Document observable behavior before refactoring to verify it's preserved after.

## Key Behaviors to Preserve

### Behavior 1: Simple String Schema
**Input**: `{ type: "string", minLength: 5 }`
**Expected Output**: `z.string().min(5)` (or with describe/default if present)
**Actual Output** (before): [To be captured]
**Actual Output** (after): [Must match exactly]

### Behavior 2: Nested Object Schema
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
**Expected Output**: `z.object({ name: z.string(), age: z.number().optional() })`
**Actual Output** (before): [To be captured]
**Actual Output** (after): [Must match exactly]

### Behavior 3: Union of Types (anyOf)
**Input**: `{ anyOf: [{ type: "string" }, { type: "number" }] }`
**Expected Output**: `z.union([z.string(), z.number()])`
**Actual Output** (before): [To be captured]
**Actual Output** (after): [Must match exactly]

### Behavior 4: Array with Modifiers
**Input**: `{ type: "array", items: { type: "string" }, minItems: 1, maxItems: 10 }`
**Expected Output**: `z.array(z.string()).min(1).max(10)`
**Actual Output** (before): [To be captured]
**Actual Output** (after): [Must match exactly]

### Behavior 5: Object with Modifiers
**Input**: 
```json
{
  "type": "object",
  "properties": { "id": { "type": "string" } },
  "description": "A user record",
  "default": { "id": "123" }
}
```
**Expected Output**: `z.object({ id: z.string() }).describe("A user record").default({"id":"123"})`
**Actual Output** (before): [To be captured]
**Actual Output** (after): [Must match exactly]

### Behavior 6: Nullable Field
**Input**: `{ type: "string", nullable: true }`
**Expected Output**: `z.string().nullable()`
**Actual Output** (before): [To be captured]
**Actual Output** (after): [Must match exactly]

### Behavior 7: Optional Field in Object
**Input**: 
```json
{
  "type": "object",
  "properties": {
    "optional_field": { "type": "string" }
  }
}
```
**Expected Output**: `z.object({ optional_field: z.string().optional() })`
**Actual Output** (before): [To be captured]
**Actual Output** (after): [Must match exactly]

## Test Commands
```bash
# Run all tests
npm test

# Run specific test files
npm test -- jsonSchemaToZod.test.ts
npm test -- parsers/

# Run eval tests (verify generated code works)
npm test -- eval.test.ts

# Manual testing - convert a schema
npm run build && npm run cli -- test/all.json
```

## Verification Checklist
- [ ] All tests in `test/` directory pass
- [ ] Generated Zod code is string-identical to baseline
- [ ] eval.test.ts passes (generated schemas are valid Zod)
- [ ] CLI produces identical output files
- [ ] No console warnings/errors
- [ ] Performance baseline maintained

---
*Update this file with actual test results before and after refactoring*
