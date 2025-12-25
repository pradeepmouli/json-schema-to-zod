# Behavioral Snapshot: Zod v4 Builder Updates

**Refactor ID**: refactor-006
**Created**: 2025-12-25
**Purpose**: Document key behaviors to preserve during Zod v4 migration

## Critical: Behavior Must Not Change

This refactor updates builders to generate Zod v4-compatible code. The **validation behavior** must remain identical - same inputs must validate/fail in the same way before and after.

## Key Behaviors to Preserve

### 1. String Format Validation
**Input**: JSON Schema with string format constraints
```json
{ "type": "string", "format": "email" }
```
**Expected Output**: Generated schema validates emails correctly
- Valid: `"test@example.com"` → passes
- Invalid: `"not-an-email"` → fails
**Generated Code Change**: `z.string().email()` → `z.email()`
**Verification**: Both must accept/reject same inputs

### 2. Object Strictness
**Input**: JSON Schema with `additionalProperties: false`
```json
{
  "type": "object",
  "properties": { "name": { "type": "string" } },
  "additionalProperties": false
}
```
**Expected Output**: Generated schema rejects extra properties
- Valid: `{ name: "test" }` → passes
- Invalid: `{ name: "test", extra: "value" }` → fails
**Generated Code Change**: `z.object({...}).strict()` → `z.strictObject({...})`
**Verification**: Extra properties must be rejected identically

### 3. Enum Validation
**Input**: TypeScript enum `enum Color { Red = "red", Green = "green" }`
**Expected Output**: Generated schema validates enum values
- Valid: `"red"` → passes
- Invalid: `"yellow"` → fails
**Generated Code Change**: `z.nativeEnum(Color)` → `z.enum(Color)`
**Verification**: Same values accepted/rejected

### 4. Error Message Customization
**Input**: JSON Schema with custom error messages
```json
{ "type": "string", "minLength": 5, "errorMessage": "..." }
```
**Expected Output**: Validation errors contain custom message
**Generated Code Change**: `{ message: "..." }` → `{ error: "..." }`
**Verification**: Custom messages appear in validation errors

## Known Breaking Behavior Changes in Zod v4

### Breaking Change 1: Number Infinity
**v3 Behavior**: May accept `Infinity`
**v4 Behavior**: Rejects `Infinity`
**Action**: Document in migration guide

### Breaking Change 2: UUID Strictness
**v3 Behavior**: Lenient UUID validation
**v4 Behavior**: Strict RFC compliance (variant bits = `10`)
**Action**: May need to use `z.guid()` for backward compatibility

### Breaking Change 3: Record Exhaustiveness
**v3 Behavior**: Partial records with enum keys allowed
**v4 Behavior**: All enum keys required (use `z.partialRecord()` for old behavior)
**Action**: Check if partial records are needed

### Breaking Change 4: Defaults in Optional Fields
**v3 Behavior**: Defaults not applied in optional fields
**v4 Behavior**: Defaults ARE applied
**Action**: May change output shape - verify tests

## Test Commands
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Type check
npm run type-check

# Lint
npm run lint
```

## Verification Checklist
- [ ] All existing tests pass without modification
- [ ] Test with real-world JSON schemas
- [ ] Verify error messages remain useful
- [ ] Check TypeScript type inference
- [ ] Test edge cases: null, undefined, empty values
- [ ] Test composed schemas (union, intersection)
- [ ] Verify format validations work correctly

---
*Behavioral snapshot for refactor-006 - See .specify/extensions/workflows/refactor/*
