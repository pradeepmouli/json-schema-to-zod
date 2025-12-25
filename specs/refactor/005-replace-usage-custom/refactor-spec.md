# Refactor Spec: Replace Custom JsonSchema Types with json-schema-typed

**Refactor ID**: refactor-005
**Branch**: `refactor/005-replace-usage-custom`
**Created**: 2025-12-24
**Type**: [ ] Performance | [x] Maintainability | [ ] Security | [ ] Architecture | [x] Tech Debt
**Impact**: [ ] High Risk | [ ] Medium Risk | [x] Low Risk
**Status**: [ ] Planning | [ ] Baseline Captured | [ ] In Progress | [ ] Validation | [x] Complete

## Input
User description: "replace usage of custom JsonSchema types with types exposed by json-schema-typed"

## Clarifications

### Session 2025-12-24
- Q: JSON Schema Draft Version Selection → A: draft-2020-12
- Q: Handling Type Incompatibilities with Existing Schemas → A: Extend types with intersection
- Q: Migration Strategy for Existing Test Schemas → A: Update test schemas to draft-2020-12 format
- Q: Handling the `nullable` Extension → A: Support both patterns during transition
- Q: Documentation Strategy for Breaking Changes → A: Add section to CHANGELOG.md only

## Motivation

### Current State Problems
**Code Smell(s)**:
- [x] Duplication (DRY violation)
- [ ] God Object/Class (too many responsibilities)
- [ ] Long Method (too complex)
- [ ] Feature Envy (accessing other object's data)
- [x] Primitive Obsession
- [ ] Dead Code
- [ ] Magic Numbers/Strings
- [ ] Tight Coupling
- [x] Other: Reinventing the wheel - maintaining custom types that exist in a well-maintained library

**Concrete Examples**:
- [src/Types.ts lines 6-56: Custom JsonSchema and JsonSchemaObject type definitions]
- [Duplicate type definitions throughout the codebase that could be replaced with standard types]
- [The custom types lack the comprehensive inline documentation that json-schema-typed provides]

### Business/Technical Justification
[Why is this refactoring needed NOW?]
- [ ] Blocking new features
- [ ] Performance degradation
- [ ] Security vulnerability
- [ ] Causing frequent bugs
- [x] Developer velocity impact
- [x] Technical debt accumulation
- [x] Other: Better TypeScript IntelliSense with json-schema-typed's inline documentation

**Rationale**:
The json-schema-typed package provides:
1. Complete TypeScript definitions for JSON Schema with inline documentation
2. Support for multiple JSON Schema drafts (draft-07, draft-2019-09, draft-2020-12)
3. Well-tested and widely-used (4.2M weekly downloads)
4. Proper type alignment with JSON Schema specification (union with boolean values)
5. Reduces our maintenance burden

## Proposed Improvement

### Refactoring Pattern/Technique
**Primary Technique**: Replace Custom Types with Standard Library

**High-Level Approach**:
1. Install json-schema-typed as a dependency
2. Replace custom JsonSchema and JsonSchemaObject type definitions with imports from json-schema-typed
3. Update all import statements throughout the codebase (no changes needed - using type aliases)
4. Handle any minor type incompatibilities (e.g., custom errorMessage property)
5. Update documentation to reference json-schema-typed

**Files Affected**:
- **Modified**:
  - src/Types.ts (replace type definitions with imports)
  - package.json (add json-schema-typed dependency)
  - CHANGELOG.md (document breaking changes and migration notes)
  - README.md (update documentation)
  - test/parsers/*.test.ts (update test schemas for draft-2020-12)
- **Created**: None
- **Deleted**: None
- **Moved**: None

### Design Improvements
**Before**:
```typescript
// Custom type definitions in src/Types.ts
export type JsonSchema = JsonSchemaObject | boolean | { $ref: string };
export type JsonSchemaObject = {
  type?: string | string[];
  properties?: { [key: string]: JsonSchema };
  // ... dozens of properties manually maintained
  errorMessage?: { [key: string]: string | undefined };
};
```

**After**:
```typescript
// Import from json-schema-typed (draft-2020-12)
import { type JSONSchema } from 'json-schema-typed/draft-2020-12';

// Create type aliases for backward compatibility
export type JsonSchema = JSONSchema;
export type JsonSchemaObject = JSONSchema.Interface & {
  errorMessage?: { [key: string]: string | undefined };
  nullable?: boolean; // OpenAPI 3.0 extension, maintained for compatibility
  // Preserve custom extensions
};
```

**Note**: The `nullable` property is maintained for backward compatibility (OpenAPI 3.0 extension), while also supporting the standard draft-2020-12 approach of using `type: ["string", "null"]` unions.

## Baseline Metrics
*Captured before refactoring begins - see metrics-before.md*

### Code Complexity
- **Lines of Code**: ~50 lines for custom type definitions in src/Types.ts
- **Duplication**: Type definitions duplicated conceptually with json-schema-typed
- **Maintenance Burden**: Ongoing need to keep types in sync with JSON Schema spec

### Test Coverage
- **Overall Coverage**: Will maintain existing coverage
- **Lines Covered**: No change expected (type-only refactor)
- **Branches Covered**: No change expected
- **Functions Covered**: No change expected

### Performance
- **Build Time**: Will maintain (type-only change)
- **Bundle Size**: No change (types are compile-time only)
- **Runtime Performance**: No change (types are compile-time only)
- **Memory Usage**: No change (types are compile-time only)

### Dependencies
- **Direct Dependencies**: Will increase by 1 (json-schema-typed)
- **Total Dependencies**: json-schema-typed has 0 dependencies
- **Type Safety**: Improved with better-documented types

## Target Metrics
*Goals to achieve - measurable success criteria*

### Code Quality Goals
- **Lines of Code**: Reduce type definition code by ~40 lines in src/Types.ts
- **Duplication**: Eliminate duplicate type definitions
- **Test Coverage**: Maintain 100% (no test changes needed)
- **Type Safety**: Maintain or improve (better types from json-schema-typed)
- **Documentation**: Improved IntelliSense with json-schema-typed's inline docs

### Performance Goals
- **Build Time**: Maintain (no regression)
- **Bundle Size**: Maintain (types don't affect bundle)
- **Runtime Performance**: Maintain (types are compile-time only)

### Success Threshold
**Minimum acceptable improvement**:
- All tests pass without modification
- Custom JsonSchema types successfully replaced with json-schema-typed
- No breaking changes to public API
- TypeScript compilation succeeds

## Behavior Preservation Guarantee
*CRITICAL: Refactoring MUST NOT change external behavior*

### External Contracts Unchanged
- [x] API signatures unchanged (type aliases maintain compatibility)
- [x] Function signatures unchanged
- [x] CLI arguments unchanged
- [x] No runtime behavior changes (types are compile-time only)

### Test Suite Validation
- [x] **Tests may require updates for draft-2020-12 compliance**
- [x] Test schemas will be updated to draft-2020-12 format where needed
- [x] Test expectations may need adjustment if draft-2020-12 changes behavior

### Behavioral Snapshot
**Key behaviors to preserve**:
1. All parsers correctly handle JSON Schema objects with same properties
2. Type guards in its.ts continue to work correctly
3. Transformer functions accept same schema objects
4. Generated Zod code remains identical for same inputs

**Test**: Run `npm test` before and after refactoring - all tests MUST pass

## Risk Assessment

### Risk Level Justification
**Why Low Risk**:
- Type-only changes with no runtime impact
- Well-defined scope (type replacements in src/Types.ts)
- Comprehensive test suite ensures behavior preservation
- json-schema-typed is a mature, widely-used library (4.2M weekly downloads)
- Changes are reversible (can revert types if issues arise)
- No breaking changes to consumers (using type aliases)

### Potential Issues
- **Risk 1**: Type incompatibilities with custom extensions (e.g., errorMessage)
  - **Mitigation**: Extend json-schema-typed types with custom properties using intersection types
  - **Rollback**: Revert to custom types if incompatibilities cannot be resolved

- **Risk 2**: Breaking changes for consumers if types are part of public API
  - **Mitigation**: Maintain same export names and type aliases for backward compatibility
  - **Rollback**: Revert commit if breaking changes detected

### Safety Measures
- [x] Incremental commits (can revert partially)
- [x] TypeScript compilation catches issues at build time
- [x] Test suite validates behavior preservation
- [x] Low blast radius (type-only changes)

## Rollback Plan

### How to Undo
1. Revert the git commit: `git revert <commit-sha>`
2. Run `npm install` to restore previous package.json state
3. Run `npm test` to verify restoration
4. No manual cleanup needed (pure code change)

### Rollback Triggers
Revert if any of these occur:
- [x] TypeScript compilation fails
- [x] Test suite failures
- [x] Breaking changes to public API discovered
- [ ] User-facing bug reports related to refactored area
- [ ] Monitoring alerts

### Recovery Time Objective
**RTO**: < 5 minutes (simple git revert)

## Implementation Plan

### Phase 1: Baseline (Before Refactoring)
1. ✅ Create refactor spec (this document)
2. Run baseline tests: `npm test`
3. Capture baseline metrics (optional for type-only changes)
4. Tag current state: `git tag pre-refactor-005 -m "Baseline before refactor-005"`

### Phase 2: Refactoring (Incremental)
1. **Step 1**: Install json-schema-typed dependency
   - Run `npm install json-schema-typed@^8.0.0`
   - Verify package.json updated

2. **Step 2**: Update src/Types.ts with new type imports
   - Import JSONSchema from json-schema-typed/draft-2020-12
   - Create type aliases for backward compatibility
   - Extend with custom properties (errorMessage, nullable for OpenAPI compatibility)

3. **Step 3**: Verify TypeScript compilation
   - Run `npm run build:types`
   - Fix any compilation errors

4. **Step 4**: Update test schemas for draft-2020-12 compatibility
   - Review test fixtures in test/parsers/ for draft-specific syntax
   - Update schemas using deprecated draft-07 conventions
   - Adjust test expectations if behavior changes with new draft

5. **Step 5**: Run test suite
   - Run `npm test`
   - Fix any test failures due to draft differences
   - Document any behavioral changes

6. **Step 6**: Update documentation
   - Update CHANGELOG.md with breaking changes section:
     - JSON Schema draft-2020-12 adoption
     - Type changes from custom to json-schema-typed
     - Migration notes for nullable vs type unions
     - Any behavioral differences
   - Update README.md to mention json-schema-typed usage and draft-2020-12
   - Add attribution for json-schema-typed

**Principle**: Each step should compile and pass tests

### Phase 3: Validation
1. Build all targets: `npm run build`
2. Run full test suite: `npm test`
3. Run linter: `npm run lint`
4. Verify no breaking changes to public API

### Phase 4: Capture Metrics
1. Run metrics script (if available)
2. Compare with baseline
3. Update refactor-spec.md with results

## Verification Checklist

### Pre-Refactoring
- [x] Refactor spec created and documented
- [ ] All tests passing (100% pass rate)
- [ ] Git tag created
- [x] Rollback plan prepared

### During Refactoring
- [ ] Incremental commits (each one compiles and tests pass)
- [ ] External behavior unchanged
- [ ] New dependency justified (json-schema-typed)
- [ ] Comments updated to match code

### Post-Refactoring
- [ ] All tests still passing (100% pass rate)
- [ ] Target metrics achieved
- [ ] No performance regression
- [ ] Code builds successfully
- [ ] Documentation updated

### Acceptance Criteria
- [ ] json-schema-typed installed and listed in package.json
- [ ] src/Types.ts imports from json-schema-typed instead of defining custom types
- [ ] All TypeScript files compile without errors
- [ ] All tests pass: `npm test` returns success
- [ ] Linter passes: `npm run lint` returns success
- [ ] Build succeeds: `npm run build` completes
- [ ] Public API remains compatible (type aliases maintain backward compatibility)
- [ ] CHANGELOG.md updated with breaking changes and migration notes
- [ ] README.md updated to reference json-schema-typed and draft-2020-12

## Related Work

### Blocks
None - this is a low-risk maintainability improvement

### Enables
- Easier adoption of future JSON Schema drafts
- Better developer experience with IntelliSense
- Reduced maintenance burden

### Dependencies
None - can be done independently

## Notes

- Using draft-2020-12 (latest stable draft) for future-proof compatibility and modern JSON Schema features
- The errorMessage property is a custom extension and needs to be preserved via type extension
- The nullable property (OpenAPI 3.0 extension) is maintained for backward compatibility alongside standard type unions
- The Serializable type from type-fest can remain unchanged
- Draft version clearly documented in README for consumer awareness
- Migration path allows gradual transition from nullable to type unions

---
*Refactor spec created using `/refactor` workflow - See .specify/extensions/workflows/refactor/*
