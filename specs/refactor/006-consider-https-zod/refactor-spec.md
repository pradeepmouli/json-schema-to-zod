# Refactor Spec: Update Builders for Zod v4 Compatibility

**Refactor ID**: refactor-006
**Branch**: `refactor/006-consider-https-zod`
**Created**: 2025-12-25
**Type**: [X] Architecture | [X] Tech Debt
**Impact**: [X] High Risk
**Status**: [X] Planning | [X] Baseline Captured | [ ] In Progress | [ ] Validation | [ ] Complete

## Input
User description: "consider https://zod.dev/v4/changelog and update builders accordingly"

## Clarifications

### Session 2025-12-25

- Q: How should we handle backward compatibility for users with Zod v4 breaking changes (UUID strictness, record exhaustiveness, defaults in optional fields, infinity rejection)? → A: Add configuration option for zodVersion control
- Q: How should the StringBuilder API change when formats move to top-level in Zod v4? → A: Hybrid approach - detect format early and switch to format-specific builder internally
- Q: How should ObjectBuilder handle deprecated methods like .strict(), .passthrough(), .merge()? → A: Keep methods, change generation based on zodVersion

### Architectural Decisions from Clarifications

1. **Zod Version Configuration**: Add a `zodVersion: 'v3' | 'v4'` configuration option (default: 'v4') to control code generation style. This allows users to:
   - Generate v3-compatible code for gradual migration
   - Generate v4-native code for new projects
   - Switch between versions without changing input JSON schemas

2. **StringBuilder Format Handling**: Implement hybrid builder approach:
   - StringBuilder methods like `.email()`, `.uuid()` remain in API
   - When format is set, internally switch to format-specific builder
   - In v4 mode: generates `z.email()`, `z.uuid()` (top-level)
   - In v3 mode: generates `z.string().email()`, `z.string().uuid()` (method chain)
   - Enables proper type inference and tree-shaking in v4

3. **ObjectBuilder Method Preservation**: Keep existing methods but change generation:
   - `.strict()` → generates `z.strictObject({...})` in v4, `z.object({...}).strict()` in v3
   - `.passthrough()` → generates `z.looseObject({...})` in v4, `z.object({...}).passthrough()` in v3
   - `.merge()` → generates `.extend()` in v4, `.merge()` in v3
   - API stays stable, only output changes based on version

## Motivation

### Current State Problems
**Code Smell(s)**:
- [X] Tech Debt - Using deprecated Zod v3 APIs
- [X] Primitive Obsession - String builders using deprecated format methods
- [X] API Misalignment - Not following Zod v4 conventions

**Concrete Examples**:
- `src/ZodBuilder/string.ts`: Uses deprecated `.email()`, `.uuid()`, etc. methods that should be top-level functions in Zod v4
- `src/ZodBuilder/object.ts`: Likely uses deprecated `.strict()`, `.passthrough()`, `.merge()` methods
- `src/ZodBuilder/nativeEnum.ts`: Uses deprecated `z.nativeEnum()` which is now just `z.enum()`
- `src/ZodBuilder/promise.ts`: Zod v4 deprecates `z.promise()` in favor of direct awaiting
- `src/ZodBuilder/function.ts`: Needs to use new `implementAsync()` for async functions
- Error handling: Uses `message` parameter instead of `error` parameter (deprecated)
- Number validation: May accept infinite values (no longer allowed in v4)
- Record builders: May use single-argument form (dropped in v4)

### Business/Technical Justification
[Why is this refactoring needed NOW?]
- [X] Blocking new features - Cannot use new Zod v4 features
- [X] Technical debt accumulation - Deprecated APIs will be removed
- [X] Developer velocity impact - Confusion between v3 and v4 patterns

**Justification**: Zod v4 introduces significant breaking changes including:
1. Error customization APIs changed (`message` → `error`)
2. String formats moved to top-level (e.g., `z.email()` instead of `z.string().email()`)
3. Many deprecated methods removed or changed
4. Performance improvements require new patterns
5. Type safety improvements require API changes

## Proposed Improvement

### Refactoring Pattern/Technique
**Primary Technique**: API Modernization + Adapter Pattern

**High-Level Approach**:
Update all ZodBuilder classes to support dual-mode generation (v3/v4) via configuration. Implement hybrid builder approach for string formats (internally switch to format-specific builders when format is detected). Keep existing builder methods but change output generation based on zodVersion config. Replace deprecated error handling (message → error in v4), and ensure all generated schemas follow version-specific conventions while preserving validation behavior.

**Files Affected**:
- **Modified**: 
  - `src/ZodBuilder/string.ts` - Implement hybrid format builder switching
  - `src/ZodBuilder/object.ts` - Version-aware generation for strict/loose/extend
  - `src/ZodBuilder/nativeEnum.ts` - Generate `z.enum()` in v4, `z.nativeEnum()` in v3
  - `src/ZodBuilder/number.ts` - Version-aware infinity handling
  - `src/ZodBuilder/record.ts` - Version-aware argument handling
  - `src/ZodBuilder/array.ts` - Update .nonempty() typing
  - `src/ZodBuilder/BaseBuilder.ts` - Add zodVersion config, update error parameter handling
  - `src/utils/withMessage.ts` - Version-aware error parameter (message vs error)
  - All test files to verify both v3 and v4 compatibility
- **Created**: 
  - Configuration/options type for zodVersion setting
  - Format-specific builder classes (EmailBuilder, UuidBuilder, etc.) for v4 mode
- **Deleted**: None
- **Moved**: None

### Design Improvements
**Before** (v3 only):
```
StringBuilder.email() → generates: z.string().email()
StringBuilder.uuid() → generates: z.string().uuid()
ObjectBuilder.strict() → generates: schema.strict()
withMessage(schema, "msg") → { message: "msg" }
z.nativeEnum(MyEnum) → generates string
Number accepts Infinity
Record with single argument
```

**After** (v4 mode with v3 fallback):
```
// With zodVersion: 'v4' (default)
StringBuilder.email() → generates: z.email()
StringBuilder.uuid() → generates: z.uuid()
ObjectBuilder.strict() → generates: z.strictObject({...})
withMessage(schema, "msg") → { error: "msg" }
z.enum(MyEnum) → generates string (unified API)
Number rejects Infinity
Record requires two arguments

// With zodVersion: 'v3' (compatibility)
StringBuilder.email() → generates: z.string().email()
StringBuilder.uuid() → generates: z.string().uuid()
ObjectBuilder.strict() → generates: z.object({...}).strict()
withMessage(schema, "msg") → { message: "msg" }
z.nativeEnum(MyEnum) → generates string
Number accepts Infinity
Record with single argument (where possible)
```

## Baseline Metrics
*Captured before refactoring begins - see metrics-before.md*

### Code Complexity
- **Cyclomatic Complexity**: To be measured
- **Cognitive Complexity**: To be measured
- **Lines of Code**: ~4000+ lines in src/ZodBuilder/
- **Function Length (avg/max)**: To be measured
- **Class Size (avg/max)**: To be measured
- **Duplication**: String format methods have similar patterns

### Test Coverage
- **Overall Coverage**: To be measured (run measure-metrics.sh)
- **Lines Covered**: To be measured
- **Branches Covered**: To be measured
- **Functions Covered**: To be measured

### Performance
- **Build Time**: To be measured
- **Bundle Size**: To be measured
- **Runtime Performance**: To be measured (code generation)
- **Memory Usage**: Not applicable (compile-time tool)

### Dependencies
- **Direct Dependencies**: To be counted from package.json
- **Total Dependencies**: To be measured
- **Zod Version**: Currently targeting v3 patterns
- **Outdated Dependencies**: To be measured

## Target Metrics
*Goals to achieve - measurable success criteria*

### Code Quality Goals
- **API Compatibility**: 100% Zod v4 compatible
- **Deprecated APIs**: Zero usage of deprecated Zod v3 patterns
- **Test Coverage**: Maintain or increase (must be 100% pass rate)
- **Code Clarity**: Improved by removing confusion between v3/v4 patterns
- **Duplication**: Reduce string format method duplication through refactoring

### Performance Goals
- **Build Time**: Maintain (no regression)
- **Bundle Size**: Potentially reduce with tree-shaking improvements from top-level functions
- **Runtime Performance**: Maintain (code generation speed, no regression > 5%)
- **Memory Usage**: Maintain

### Success Threshold
**Minimum acceptable improvement**: 
1. All builders support both v3 and v4 mode generation via configuration
2. Default v4 mode generates fully compatible Zod v4 code
3. V3 compatibility mode maintains current behavior
4. All existing tests pass without modification (behavior preserved)
5. New tests added for v4-specific features and v3 compatibility
6. Documentation updated to explain zodVersion option and migration path

## Behavior Preservation Guarantee
*CRITICAL: Refactoring MUST NOT change external behavior*

### External Contracts Unchanged
- [X] API: All builder methods maintain same signatures
- [X] Output: Generated Zod schema strings must validate same inputs
- [X] CLI: Command-line behavior unchanged
- [X] File formats: JSON Schema input format unchanged
- [X] Function signatures: Public API unchanged (or properly deprecated)

### Test Suite Validation
- [X] **All existing tests MUST pass WITHOUT modification**
- [X] Tests verify behavior (validation results), not implementation (exact string output)
- [X] If test checks string output, it's testing implementation detail and may need updating

### Behavioral Snapshot
**Key behaviors to preserve**:
1. **Input validation**: Same JSON schemas produce schemas that validate same data
2. **Error messages**: Validation errors contain equivalent information (though format may differ)
3. **Type inference**: TypeScript types inferred from generated schemas remain compatible
4. **Edge cases**: Null, undefined, empty string, infinity handling maintains same semantics
5. **Composition**: Combined schemas (union, intersection, etc.) behave identically

**Test**: Run full test suite before and after - all tests MUST pass

## Risk Assessment

### Risk Level Justification
**Why High Risk**:
1. **Widespread changes**: Affects all builder classes and many methods
2. **User-facing impact**: Generated code changes affect downstream users
3. **API changes**: Error handling parameter changes throughout codebase
4. **Version compatibility**: Must ensure Zod v4 compatibility
5. **Test coverage gaps**: May reveal untested edge cases

### Potential Issues
- **Risk 1**: String format builders generate incompatible code
  - **Mitigation**: Comprehensive test suite covering all format types
  - **Rollback**: Revert branch, tag baseline before changes

- **Risk 2**: Error message format changes break user code
  - **Mitigation**: Document error format changes, provide migration guide
  - **Rollback**: Quick revert via git

- **Risk 3**: Performance regression in code generation
  - **Mitigation**: Benchmark before/after
  - **Rollback**: Revert if >10% regression

- **Risk 4**: TypeScript type inference breaks
  - **Mitigation**: Test with tsc --noEmit, verify exported types
  - **Rollback**: Revert immediately

### Safety Measures
- [X] Incremental commits (can revert partially)
- [X] Peer review required
- [X] Full test suite must pass
- [ ] Feature flag - not applicable (library)
- [X] Tag baseline state: `pre-refactor-006`
- [X] Document breaking changes for users

## Rollback Plan

### How to Undo
1. `git reset --hard pre-refactor-006` (if tagged before starting)
2. `git revert <commit-range>` (if already merged)
3. Verify test suite passes after rollback
4. Notify users if already released

### Rollback Triggers
Revert if any of these occur:
- [X] Test suite failure (any test fails)
- [X] TypeScript compilation errors
- [X] Generated code doesn't validate expected inputs
- [X] Performance regression > 10%
- [X] User reports of breaking changes in generated schemas

### Recovery Time Objective
**RTO**: < 15 minutes (git revert + verify tests)

## Implementation Plan

### Phase 1: Baseline (Before Refactoring)
1. Run `.specify/extensions/workflows/refactor/measure-metrics.sh --before`
2. Document current test pass rate (should be 100%)
3. Create behavioral snapshot with example schemas
4. Tag current state: `git tag pre-refactor-006 -m "Baseline before Zod v4 updates"`

### Phase 2: Refactoring (Incremental)
**Step 1**: Add zodVersion configuration
- Add `zodVersion: 'v3' | 'v4'` option to configuration/options
- Thread configuration through BaseBuilder and all subclasses
- Add helper methods to check version in builders
- Update documentation to explain version option

**Step 2**: Update error handling infrastructure (version-aware)
- Update `withMessage` utility to use `error` parameter in v4, `message` in v3
- Update BaseBuilder to use version-appropriate error parameter
- Add tests for both v3 and v4 error handling

**Step 3**: Implement hybrid string format builders
- Create format-specific builder classes (EmailBuilder, UuidBuilder, etc.)
- Update StringBuilder to detect format and switch to format builder
- In v4 mode: generate top-level functions (`z.email()`)
- In v3 mode: generate method chains (`z.string().email()`)
- Add methods: ipv4, ipv6, cidrv4, cidrv6
- Use guid for lenient UUID in v3 compatibility mode

**Step 4**: Update object builders (version-aware)
- In v4: `.strict()` → `z.strictObject()`, `.passthrough()` → `z.looseObject()`, `.merge()` → `.extend()`
- In v3: Keep current generation (`z.object().strict()`, etc.)
- Handle `.default()` in optional fields based on version
- Add tests for both versions

**Step 5**: Update enum builders (version-aware)
- In v4: Generate `z.enum()` for all enums
- In v3: Generate `z.nativeEnum()` for native TypeScript enums
- Update enum access patterns

**Step 6**: Update other builders (version-aware)
- number.ts: Reject infinity in v4, allow in v3
- record.ts: Two-argument form in v4, handle single-argument in v3
- array.ts: Update .nonempty() return type (both versions)
- Update any other version-specific behaviors

**Step 7**: Update tests
- Add tests for v4 mode (default)
- Add tests for v3 mode (compatibility)
- Verify behavior preservation in both modes
- Test version switching

**Principle**: Each step should compile and pass tests in both v3 and v4 modes

### Phase 3: Validation
1. Run full test suite (MUST pass 100%)
2. Run `.specify/extensions/workflows/refactor/measure-metrics.sh --after`
3. Compare metrics (no regression in key areas)
4. Manual testing with real-world JSON schemas
5. Verify generated code works with Zod v4

### Phase 4: Deployment
1. Code review focused on behavior preservation
2. Update MIGRATION-GUIDE.md with Zod v4 changes
3. Update README.md with Zod v4 compatibility notes
4. Create release notes documenting changes
5. Consider semver implications (breaking change = major version)

## Verification Checklist

### Pre-Refactoring
- [X] Baseline metrics captured and documented
- [X] All tests passing (100% pass rate - 183/183 tests)
- [X] Behavioral snapshot created with example schemas
- [X] Git tag created: `pre-refactor-006`
- [X] Rollback plan understood

### During Refactoring
- [ ] Each commit compiles successfully
- [ ] Tests pass after each major change
- [ ] No new dependencies added
- [ ] Comments updated to match code changes
- [ ] JSDoc updated for changed methods

### Post-Refactoring
- [ ] All tests still passing (100% pass rate)
- [ ] No deprecated Zod v3 API usage
- [ ] Generated code works with Zod v4
- [ ] TypeScript compilation clean
- [ ] No performance regression
- [ ] Documentation updated (MIGRATION-GUIDE.md, README.md)

### Post-Deployment
- [ ] Release notes published
- [ ] Users notified of breaking changes (if any)
- [ ] Monitor GitHub issues for problem reports
- [ ] Update examples to use Zod v4 patterns

## Related Work

### Blocks
- Full Zod v4 feature support
- Using new Zod v4 performance optimizations
- Modern error handling patterns

### Enables
- Future refactorings to leverage Zod v4 features
- Cleaner code generation with top-level functions
- Better tree-shaking for users
- Potential performance improvements from Zod v4

### Dependencies
- This builds on refactor-003 (fluent paradigms) and refactor-004 (fluent API)
- Should coordinate with any pending feature work on builders

---
*Refactor spec created using `speckit.refactor` workflow - See .specify/extensions/workflows/refactor/*
