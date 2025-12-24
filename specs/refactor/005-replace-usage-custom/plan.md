# Implementation Plan: Replace Custom JsonSchema Types with json-schema-typed

**Refactor ID**: refactor-005
**Status**: Planning
**Tech Stack**: TypeScript (strict mode) + vitest + oxlint

## Overview

Replace custom `JsonSchema` and `JsonSchemaObject` type definitions with types from the `json-schema-typed` library (draft-2020-12). This reduces maintenance burden, improves type safety, and provides better developer experience through comprehensive inline documentation.

## Technology Stack

- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm
- **Testing Framework**: vitest
- **Linting**: oxlint
- **Build System**: TypeScript compiler (tsc) with multiple targets (types, cjs, esm)
- **JSON Schema Draft**: draft-2020-12 (latest stable)

## Architecture

### Current State
```
src/Types.ts (custom type definitions)
  ├─ JsonSchema (union type)
  ├─ JsonSchemaObject (interface with ~50 properties)
  └─ Serializable (from type-fest)

All parsers import from Types.ts
```

### Target State
```
src/Types.ts (imports from json-schema-typed)
  ├─ JSONSchema (from json-schema-typed/draft-2020-12)
  ├─ JsonSchema (type alias for backward compatibility)
  ├─ JsonSchemaObject (JSONSchema.Interface + custom extensions)
  └─ Serializable (unchanged from type-fest)

All parsers continue using same imports (no changes needed)
```

## Implementation Strategy

### Phase 1: Setup & Type Replacement (Low Risk)
**Goal**: Replace type definitions without breaking existing code

1. Install `json-schema-typed@^8.0.0`
2. Update `src/Types.ts` to import from json-schema-typed/draft-2020-12
3. Create type aliases for backward compatibility
4. Extend types with custom properties (errorMessage, nullable)
5. Verify TypeScript compilation

**Risk Mitigation**: Type aliases ensure no breaking changes to consumers

### Phase 2: Test Schema Updates (Medium Risk)
**Goal**: Update test fixtures for draft-2020-12 compliance

1. Audit test schemas in `test/parsers/*.test.ts`
2. Identify draft-07 specific syntax (e.g., older conventions)
3. Update schemas to draft-2020-12 format
4. Handle nullable → type union conversions where appropriate
5. Update test expectations if behavior changes

**Risk Mitigation**: Incremental updates per test file, run tests after each

### Phase 3: Validation & Documentation (Low Risk)
**Goal**: Ensure everything works and communicate changes

1. Run full test suite
2. Run full build (all targets)
3. Update CHANGELOG.md with breaking changes
4. Update README.md with json-schema-typed attribution and draft version
5. Verify linter passes

**Risk Mitigation**: Comprehensive validation before documentation

## Key Decisions (from Clarifications)

1. **Draft Version**: draft-2020-12 (latest stable, future-proof)
2. **Type Strategy**: Intersection types (safe, backward compatible)
3. **Test Strategy**: Update schemas to draft-2020-12 format
4. **Nullable Handling**: Support both `nullable: true` and type unions
5. **Documentation**: CHANGELOG.md only (semantic versioning)

## Custom Extensions to Preserve

### errorMessage
OpenAPI Validator extension for custom error messages. Maintained in type definition.

```typescript
export type JsonSchemaObject = JSONSchema.Interface & {
  errorMessage?: { [key: string]: string | undefined };
};
```

### nullable
OpenAPI 3.0 extension. Supported alongside standard type unions for smooth transition.

```typescript
export type JsonSchemaObject = JSONSchema.Interface & {
  nullable?: boolean;
};
```

## Dependencies

### New Dependency
- `json-schema-typed@^8.0.0` (0 transitive dependencies)

### Existing Dependencies (Unchanged)
- `type-fest` (for Serializable type)
- TypeScript toolchain
- vitest, oxlint

## File Changes Summary

| File | Change Type | Description |
|------|-------------|-------------|
| package.json | Modified | Add json-schema-typed dependency |
| src/Types.ts | Modified | Replace custom types with imports |
| test/parsers/*.test.ts | Modified | Update schemas for draft-2020-12 |
| CHANGELOG.md | Modified | Document breaking changes |
| README.md | Modified | Add attribution, document draft version |

## Success Criteria

- [ ] TypeScript compilation succeeds (all targets)
- [ ] All tests pass (`npm test`)
- [ ] Linter passes (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Public API remains backward compatible
- [ ] Documentation complete (CHANGELOG.md, README.md)

## Rollback Strategy

**Trigger**: TypeScript errors, test failures, or breaking changes discovered

**Steps**:
1. `git revert <commit-sha>`
2. `pnpm install` (restore package.json)
3. `npm test` (verify restoration)

**RTO**: < 5 minutes (simple git revert)

## Timeline Estimate

- **Phase 1** (Setup & Types): 1-2 hours
- **Phase 2** (Test Updates): 2-4 hours
- **Phase 3** (Validation & Docs): 1 hour
- **Total**: 4-7 hours

## Risk Assessment

**Overall Risk**: LOW-MEDIUM
- Phase 1: LOW (type-only, reversible)
- Phase 2: MEDIUM (test behavior changes possible)
- Phase 3: LOW (documentation only)

**Mitigation**: Incremental commits, continuous testing, type aliases for compatibility
