# Behavioral Snapshot: refactor-005

**Purpose**: Document key behaviors that MUST be preserved during the refactoring to replace custom JsonSchema types with json-schema-typed.

**Date**: 2025-12-24

## Key Behaviors to Preserve

### Behavior 1: JSON Schema Parsing
**Input**: Valid JSON Schema objects (object, array, string, number, etc.)
**Expected Output**: Parsers correctly identify and process schema types
**Actual Output** (before): All tests in `test/parsers/` pass
**Actual Output** (after): [Must match - all tests pass]
**Verification**: `npm test test/parsers/`

### Behavior 2: Type Guards
**Input**: JsonSchemaObject instances
**Expected Output**: Type guard functions correctly identify schema variants
**Actual Output** (before): 
- `its.an.object()` returns true for `{ type: 'object' }`
- `its.an.array()` returns true for `{ type: 'array' }`
- `its.a.nullable()` returns true for schemas with `nullable: true`
**Actual Output** (after): [Must match]
**Verification**: Type guards in `src/JsonSchema/its.ts` work identically

### Behavior 3: Generated Zod Code
**Input**: Sample JSON Schema documents
**Expected Output**: Same Zod code output for same inputs
**Actual Output** (before): Run `npm test` - all snapshots pass
**Actual Output** (after): [Must match - all snapshots pass]
**Verification**: `npm test`

### Behavior 4: Error Messages
**Input**: JSON Schema with errorMessage property
**Expected Output**: Custom errorMessage is preserved in generated code
**Actual Output** (before**: Schemas with errorMessage generate Zod with custom messages
**Actual Output** (after): [Must match]
**Verification**: Test error message handling

### Behavior 5: Public API Compatibility
**Input**: Consumer code importing types
**Expected Output**: No breaking changes to exported types
**Actual Output** (before): JsonSchema, JsonSchemaObject, etc. are exported
**Actual Output** (after): [Must match - same exports available]
**Verification**: TypeScript compilation of consumer code succeeds

## Test Commands
```bash
# Run all tests
npm test

# Run parser tests
npm test test/parsers/

# Build to verify TypeScript compilation
npm run build

# Run linter
npm run lint
```

## Sample Verification

### Sample 1: Basic Object Schema
```typescript
const schema: JsonSchema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' }
  },
  required: ['name']
};
```
**Before**: Generates valid Zod object schema
**After**: [Must generate identical Zod code]

### Sample 2: Custom Error Message
```typescript
const schema: JsonSchemaObject = {
  type: 'string',
  minLength: 5,
  errorMessage: {
    minLength: 'Must be at least 5 characters'
  }
};
```
**Before**: Error message is included in output
**After**: [Must include same error message]

## Validation Checklist

- [ ] All tests pass before refactoring
- [ ] All tests pass after refactoring (without modification)
- [ ] Generated Zod code is identical for same inputs
- [ ] Type guards work identically
- [ ] Custom properties (errorMessage) are preserved
- [ ] Public API exports are unchanged
- [ ] TypeScript compilation succeeds
- [ ] No runtime errors

---
*Document actual outputs before starting refactoring, then verify they match after*

