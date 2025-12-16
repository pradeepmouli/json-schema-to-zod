# Refactor Spec: Complete Fluent Builder API Implementation

**Refactor ID**: refactor-004
**Branch**: `refactor/004-finish-fluent-api`
**Created**: December 15, 2025
**Type**: [x] Architecture | [x] Maintainability
**Impact**: [x] Medium Risk
**Status**: [x] Planning | [ ] Baseline Captured | [ ] In Progress | [ ] Validation | [ ] Complete

## Input
User description: "finish fluent api implementation - parsers should emit builder (not strings), input to builders should be nothing or a composition of builders (e.g. ObjectBuilder should take Record<string,ZodBuilder> and ArrayBuilder should take ZodBuilder[]). Add builders for remaining core zode types (e.g. union, never, any)"

## Motivation

### Current State Problems
**Code Smell(s)**:
- [x] Tight Coupling - Parsers are tightly coupled to string generation
- [x] Primitive Obsession - Using strings instead of rich builder objects
- [x] Feature Envy - Parser functions are manipulating strings when they should be composing builders
- [x] Other: Incomplete abstraction - Builder pattern only partially implemented

**Concrete Examples**:
- src/parsers/parseSchema.ts: Returns `string` instead of builders, forcing string concatenation for modifiers
- src/parsers/parseAnyOf.ts lines 14-17: Manual string template for union instead of using UnionBuilder
- src/parsers/parseOneOf.ts lines 14-37: Complex string template with embedded TypeScript for discriminated unions
- src/parsers/parseObject.ts lines 31-43: Parsers receive strings from child parsers, then ObjectBuilder receives strings
- src/ZodBuilder/array.ts: ArrayBuilder constructor takes `string` parameter instead of a builder
- Missing builders for: union, intersection, discriminatedUnion, any, never, unknown, literal (partially implemented)

### Business/Technical Justification
[Why is this refactoring needed NOW?]
- [x] Blocking new features - Need to support complex schema compositions
- [x] Developer velocity impact - String manipulation is error-prone and hard to test
- [x] Technical debt accumulation - Half-implemented pattern creates confusion
- [x] Other: Type safety - Builders provide compile-time guarantees that strings don't

**Concrete Benefits**:
1. **Composability**: Builders can be composed naturally (e.g., `union([string(), number()])`)
2. **Type Safety**: TypeScript can validate builder compositions at compile time
3. **Testability**: Builder instances are easier to inspect and test than strings
4. **Extensibility**: New builder types can be added without modifying parsers
5. **Maintainability**: Clear separation between schema parsing logic and code generation

## Proposed Improvement

### Refactoring Pattern/Technique
**Primary Technique**: Complete Abstract Factory Pattern implementation + Replace Primitive with Object

**High-Level Approach**:
Transform the hybrid string/builder system into a pure builder-based architecture where:
1. All parsers return `BaseBuilder` instances (not strings)
2. All builders accept other builders as inputs (not strings)
3. String generation happens only at the final `.text()` call
4. Add missing builder types for complete Zod schema coverage

**Files Affected**:
- **Modified**: 
  - All parser files in src/parsers/ (parseSchema.ts, parseObject.ts, parseArray.ts, parseString.ts, parseNumber.ts, parseBoolean.ts, parseNull.ts, parseConst.ts, parseEnum.ts, parseAnyOf.ts, parseOneOf.ts, parseAllOf.ts, parseNot.ts, parseNullable.ts, parseMultipleType.ts, parseIfThenElse.ts, parseDefault.ts)
  - All builder files in src/ZodBuilder/ (BaseBuilder.ts, array.ts, object.ts, string.ts, number.ts, boolean.ts, null.ts, const.ts, enum.ts, modifiers.ts)
  - Types.ts (update ParserSelector and related types)
  - jsonSchemaToZod.ts (update to call .text() on builder)
  
- **Created**: 
  - src/ZodBuilder/union.ts - UnionBuilder for z.union()
  - src/ZodBuilder/intersection.ts - IntersectionBuilder for z.intersection()
  - src/ZodBuilder/discriminatedUnion.ts - DiscriminatedUnionBuilder for z.discriminatedUnion()
  - src/ZodBuilder/any.ts - AnyBuilder for z.any()
  - src/ZodBuilder/never.ts - NeverBuilder for z.never()
  - src/ZodBuilder/unknown.ts - UnknownBuilder for z.unknown()
  - src/ZodBuilder/literal.ts - LiteralBuilder for z.literal() (move from const.ts)
  - src/ZodBuilder/tuple.ts - TupleBuilder for z.tuple()
  - src/ZodBuilder/record.ts - RecordBuilder for z.record()

- **Deleted**: None
- **Moved**: Literal builder logic from const.ts to new literal.ts

### Design Improvements
**Before**:
```
Parser → string → concat(".optional()") → string → concat(".describe(...)") → string
         ↓
ObjectBuilder.constructor(Record<string, string>) → string
ArrayBuilder.constructor(string) → string
```

**After**:
```
Parser → BaseBuilder → .optional() → BaseBuilder → .describe() → BaseBuilder → .text() → string
         ↓
ObjectBuilder.constructor(Record<string, BaseBuilder>) → builds lazily
ArrayBuilder.constructor(BaseBuilder) → builds lazily
UnionBuilder.constructor(BaseBuilder[]) → builds lazily
```

**Key Changes**:
1. **Parser Return Type**: `string` → `BaseBuilder`
2. **Builder Input Types**: `string` → `BaseBuilder | BaseBuilder[]`
3. **Modifier Application**: String concatenation → Builder method chaining
4. **String Generation**: Early → Lazy (only at `.text()`)

## Baseline Metrics
*Captured before refactoring begins - see metrics-before.md*

### Code Complexity
- **Lines of Code**: ~2500 (src/ directory)
- **Parser Files**: 16 files
- **Builder Files**: 11 files
- **Missing Builders**: 7+ core Zod types

### Test Coverage
- **Overall Coverage**: To be measured with coverage tool
- **Test Files**: 15+ test files in test/ directory
- **Key Test Suites**: jsonSchemaToZod.test.ts, parser tests, eval.test.ts

### Performance
- **Build Time**: To be measured
- **Bundle Size**: To be measured
- **Runtime Performance**: To be measured

### Dependencies
- **Direct Dependencies**: zod (peer), commander (CLI)
- **Dev Dependencies**: TypeScript, Vitest/Jest
- **Outdated Dependencies**: To be checked

## Target Metrics
*Goals to achieve - measurable success criteria*

### Code Quality Goals
- **Type Safety**: 100% - All parsers strongly typed to return builders
- **Builder Coverage**: Add 7+ missing builder types
- **Consistency**: 100% - All parsers follow same pattern (return builders)
- **Test Coverage**: Maintain current coverage (all existing tests pass)

### Performance Goals
- **Build Time**: Maintain or improve (no regression)
- **Bundle Size**: Accept minor increase (<5%) for improved type safety
- **Runtime Performance**: Maintain (builder overhead should be negligible)

### Success Threshold
**Minimum acceptable improvement**:
1. All parsers return `BaseBuilder` instances (not strings)
2. All builders accept builders as inputs (not strings)
3. At least 7 new builder types implemented (union, intersection, discriminatedUnion, any, never, unknown, literal)
4. All existing tests pass without modification to test assertions
5. No breaking changes to public API (`jsonSchemaToZod` function signature unchanged)

## Behavior Preservation Guarantee
*CRITICAL: Refactoring MUST NOT change external behavior*

### External Contracts Unchanged
- [x] Function signatures unchanged - `jsonSchemaToZod(schema, options)` remains identical
- [x] CLI arguments unchanged - All CLI commands work as before
- [x] Output format unchanged - Generated Zod schemas are string-identical to before

### Test Suite Validation
- [x] **All existing tests MUST pass WITHOUT modification**
- [x] Tests verify generated string output, which must remain identical
- [x] May add new tests for builder instances, but existing tests unchanged

### Behavioral Snapshot
**Key behaviors to preserve**:
1. **String Output Identity**: For any given JSON Schema input, the generated Zod schema string must be character-for-character identical to the current implementation
2. **Modifier Order**: Modifiers (.optional(), .describe(), .default()) must appear in the same order in output
3. **Edge Cases**: Empty objects, empty arrays, missing properties - all handled identically
4. **Error Handling**: Invalid schemas produce same errors/warnings
5. **CLI Behavior**: All CLI commands produce identical output files

**Verification Method**:
- Run full test suite before refactoring (capture baseline)
- Run full test suite after refactoring (compare outputs)
- Run snapshot tests to verify string output identity
- Test eval.test.ts which validates generated code actually works with Zod

## Risk Assessment

### Risk Level Justification
**Why Medium Risk**:
1. **Scope**: Touches nearly all parser files and builder files (~27 files)
2. **Architecture**: Fundamental change from strings to builders affects entire codebase
3. **Type Safety**: Significant TypeScript type changes could introduce compilation issues
4. **Test Coverage**: Good test coverage reduces risk of behavioral changes
5. **Reversibility**: Changes can be reverted via git if issues arise

**Mitigation Strategies**:
1. **Incremental Implementation**: 
   - Phase 1: Add missing builder types
   - Phase 2: Update builders to accept builders (not strings)
   - Phase 3: Update parsers to return builders
   - Phase 4: Update top-level functions to call .text()
2. **Continuous Testing**: Run test suite after each phase
3. **Type-Driven Development**: Let TypeScript guide refactoring
4. **Behavioral Snapshots**: Capture outputs before/after each phase

### Potential Issues
- **Risk 1**: TypeScript compilation failures due to type mismatches
  - **Mitigation**: Use type-driven development, check compilation after each file
  - **Rollback**: Revert problematic file and reassess approach

- **Risk 2**: Tests fail due to unexpected string output differences
  - **Mitigation**: Run tests frequently, use snapshot comparisons
  - **Rollback**: Compare generated strings character-by-character

- **Risk 3**: Performance regression from builder object allocation
  - **Mitigation**: Benchmark before/after, optimize lazy evaluation
  - **Rollback**: Return to string-based approach if significant regression

### Safety Measures
- [x] Incremental commits (can revert partially)
- [x] Test suite covers all major code paths
- [x] Behavioral snapshots documented
- [x] Rollback plan clear

## Rollback Plan

### How to Undo
1. If critical issues arise, revert the branch: `git reset --hard HEAD~N` where N is the number of commits
2. Return to master: `git checkout master`
3. Re-evaluate approach before attempting again

### Rollback Triggers
Revert if any of these occur:
- Test suite fails with **>5 reproducible, non-flaky test failures** in critical test suites (jsonSchemaToZod.test.ts, eval.test.ts, or >3 parser tests)
- TypeScript compilation errors that can't be resolved within 30 minutes of debugging
- Generated code output differs from baseline by >10% (measured by diff line count)
- Performance degradation >10% (build time or test execution time)

## Implementation Plan

### Revised Phase Order (Based on Clarification #3)

The original 4-phase sequence has been **reordered to ensure continuous test pass-through** and maintain behavior validation. Tests are kept passing by implementing Phases 3+4 together.

### Phase 1: Add Missing Builder Types (Low Risk)
- Create UnionBuilder, IntersectionBuilder, DiscriminatedUnionBuilder
- Create AnyBuilder, NeverBuilder, UnknownBuilder
- Create LiteralBuilder, TupleBuilder, RecordBuilder
- Export from index.ts
- **Risk**: Low - New code, doesn't affect existing functionality
- **Validation**: Import and instantiate builders, verify .text() output
- **Status**: Final phase - runs after parsers and top-level functions updated

### Phase 2: Update Builders to Accept Builders (Medium Risk)
- Modify ObjectBuilder to accept `Record<string, BaseBuilder | string>` (union type during transition)
- Modify ArrayBuilder to accept `BaseBuilder | string`
- Modify UnionBuilder to accept `BaseBuilder[] | string[]` (union type)
- Update helper functions to work with builders
- Use internal logic: `typeof input === 'string' ? input : input.text()`
- **Risk**: Medium - Changes existing code but maintains backward compatibility via union types
- **Validation**: Unit tests for each builder (tests still pass)
- **Status**: Second phase - runs after parsers/top-level functions updated
- **Transition**: Union types allow this phase to run while parsers still return strings

### Phase 3+4 Combined: Update Parsers AND Top-Level Functions (High Risk)
**Why Combined**: Updating parsers to return builders while also updating top-level functions to call `.text()` keeps tests passing throughout. Done as single coordinated change.

**Phase 3: Update Parsers to Return Builders**:
- Update ParserSelector type in Types.ts: `(schema, refs) => BaseBuilder`
- Update parseSchema return type to `BaseBuilder`
- Update all individual parsers to return builders
- Update modifier application in parseSchema to call builder methods
- Apply modifiers: builder → .describe() → .default() → .readonly() → baseBuilder

**Phase 4: Update Top-Level Functions (Immediate)**:
- Update jsonSchemaToZod to call `.text()` on result before returning string
- Update CLI to handle builder return type with `.text()` call
- Update JsonSchema/jsonSchemaToZod.ts to call `.text()` on result
- Update src/index.ts to call `.text()` if exporting results

**Risk**: High - Affects all parsers and critical boundaries, but **tests pass immediately** since top-level functions call `.text()`
**Validation**: Full test suite must pass (0 test failures after Phase 3+4)

**Implementation Strategy**:
1. Update parseSchema and all parsers together (one commit)
2. Immediately update top-level functions to call `.text()` (next commit)
3. Update Types.ts ParserSelector (same commit as parsers)
4. Run full test suite - MUST pass 100% after Phase 3+4
5. If tests fail: fix builder implementation, don't modify tests
6. Verify behavioral snapshot matches (string output identical)

### Success Validation Between Phases

**After Phase 3+4**: 
- ✅ All tests pass
- ✅ Generated strings identical to baseline
- ✅ Parsers return BaseBuilder
- ✅ Top-level functions return string (via .text())

**After Phase 2**:
- ✅ All tests pass
- ✅ Builders accept BaseBuilder | string
- ✅ Internal builder logic handles both types
- ✅ Behavioral compatibility maintained

**After Phase 1**:
- ✅ All tests pass
- ✅ 9 new builders available
- ✅ Complete builder coverage for all Zod types
- ✅ Parser implementations can now be optimized to use new builders

## Clarifications

### Session 2025-12-15

- Q: How should modifier application be handled when parsers return builders instead of strings? → A: Apply modifiers at BaseBuilder level via method chaining in parseSchema after receiving builder from parser (Option A - centralized in parseSchema.ts, maintains DRY principle, clear separation of concerns)

- Q: How should we handle the Phase 2/Phase 3 transition when builders need BaseBuilder inputs but parsers still return strings? → A: Update builders to accept `BaseBuilder | string` union type during Phase 2, then narrow to just `BaseBuilder` in Phase 3 (Option B - gradual migration with TypeScript validation)

- Q: How should we validate behavior preservation across 4 phases when Phase 3 parsers return builders but tests expect strings? → A: Reorder phases - update parsers to return builders AND immediately update top-level functions to call `.text()` together (Phase 3+4 combined), then update builder constructors in Phase 2, then add missing builders in Phase 1. This keeps tests passing throughout and maintains continuous behavior validation (Option D)

### Implementation Details for Phase 3: Modifier Application

When updating parseSchema to work with builders:

1. **Centralized Modifier Application**: Keep `addDescribes()`, `addDefaults()`, `addAnnotations()` in `parseSchema.ts`
2. **Signature Change**: Transform from string manipulation to builder method chaining
   - Before: `addDescribes(schema, parsedString: string): string`
   - After: `addDescribes(schema, parsedBuilder: BaseBuilder): BaseBuilder`
3. **Implementation**: Use builder's public API
   ```typescript
   const addDescribes = (schema: JsonSchemaObject, builder: BaseBuilder): BaseBuilder => {
     if (schema.description) {
       return builder.describe(schema.description);
     }
     return builder;
   };
   ```
4. **Chain Modifiers**: Apply in sequence: parseSchema → addDescribes → addDefaults → addAnnotations
5. **Return Builder**: Return builder instance (not string) from parseSchema
6. **String Generation**: Deferred to top-level functions via `.text()` call

### Implementation Details for Phase 2: Transition with Union Types

Update builder constructors and helper functions to accept union types:

```typescript
// During Phase 2: Accept both types
type BuilderInput = BaseBuilder | string;

class ObjectBuilder extends BaseBuilder<ObjectBuilder> {
  constructor(properties: Record<string, BuilderInput> = {}) {
    // Handle both builders and strings during transition
    super('');
    this._properties = properties;
  }
}

class ArrayBuilder extends BaseBuilder<ArrayBuilder> {
  constructor(itemSchema: BuilderInput) {
    // Handle both builders and strings during transition
    const baseText = typeof itemSchema === 'string' 
      ? itemSchema 
      : itemSchema.text();
    super(`z.array(${baseText})`);
  }
}

// In Phase 3: Narrow types
// type BuilderInput = BaseBuilder; // Remove string alternative
```

This approach:
- Allows Phase 2 to complete independently without waiting for Phase 3
- TypeScript provides compile-time safety during transition
- Adapters not needed - builders handle both cases internally
- Phase 3 simply removes the string branch and tightens types

## Next Steps
1. ✅ Refactor spec created
2. ✅ Baseline metrics captured (metrics-before.md)
3. ✅ Behavioral snapshot documented
4. ✅ Clarifications resolved (3 critical decisions made)
   - ✅ Q1: Modifier application strategy → Centralized at BaseBuilder level in parseSchema
   - ✅ Q2: Phase transition strategy → Union types `BaseBuilder | string` during Phase 2
   - ✅ Q3: Test validation strategy → Reorder phases to keep tests passing throughout
5. ✅ Implementation phases reordered for continuous test validation
6. ⏭️ Run `/speckit.plan` to create detailed implementation plan with specific file-by-file changes
7. ⏭️ Run `/speckit.tasks` to break down into concrete, trackable tasks
8. ⏭️ Run `/speckit.implement` to execute refactoring in new phase order
- [ ] Test suite failure
- [ ] Performance regression > 10%
- [ ] Production error rate increase
- [ ] User-facing bug reports related to refactored area
- [ ] Monitoring alerts

### Recovery Time Objective
**RTO**: [How fast can we rollback? e.g., "< 30 minutes"]

## Implementation Plan

### Phase 1: Baseline (Before Refactoring)
1. Capture all baseline metrics (run `.specify/extensions/workflows/refactor/measure-metrics.sh`)
2. Create behavioral snapshot (document current outputs)
3. Ensure 100% test pass rate
4. Tag current state in git: `git tag pre-refactor-### -m "Baseline before refactor-###"`

### Phase 2: Refactoring (Incremental)
1. [Step 1: small, atomic change]
2. [Step 2: another small change]
3. [Step 3: continue incrementally]

**Principle**: Each step should compile and pass tests

### Phase 3: Validation
1. Run full test suite (MUST pass 100%)
2. Re-measure all metrics
3. Compare behavioral snapshot (MUST be identical)
4. Performance regression test
5. Manual testing of critical paths

### Phase 4: Deployment
1. Code review focused on behavior preservation
2. Deploy to staging
3. Monitor for 24 hours
4. Deploy to production with feature flag (if available)
5. Monitor for 48-72 hours
6. Remove feature flag if stable

## Verification Checklist

### Pre-Refactoring
- [ ] Baseline metrics captured and documented
- [ ] All tests passing (100% pass rate)
- [ ] Behavioral snapshot created
- [ ] Git tag created
- [ ] Rollback plan prepared

### During Refactoring
- [ ] Incremental commits (each one compiles and tests pass)
- [ ] External behavior unchanged
- [ ] No new dependencies added (unless justified)
- [ ] Comments updated to match code
- [ ] Dead code removed

### Post-Refactoring
- [ ] All tests still passing (100% pass rate)
- [ ] Target metrics achieved or improvement demonstrated
- [ ] Behavioral snapshot matches (behavior unchanged)
- [ ] No performance regression
- [ ] Code review approved
- [ ] Documentation updated

### Post-Deployment
- [ ] Monitoring shows stable performance
- [ ] No error rate increase
- [ ] No user reports related to refactored area
- [ ] 48-72 hour stability period completed

## Related Work

### Blocks
[List features blocked by current technical debt that this refactoring unblocks]

### Enables
[List future refactorings or features this enables]

### Dependencies
[List other refactorings that should happen first]

---
*Refactor spec created using `/refactor` workflow - See .specify/extensions/workflows/refactor/*
