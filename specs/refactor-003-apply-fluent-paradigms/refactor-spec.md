# Refactor Spec: Apply fluent paradigms to make ZodBuilder surface more like Zod

**Refactor ID**: refactor-003
**Branch**: `refactor/003-apply-fluent-paradigms`
**Created**: 2025-12-13
**Completed**: 2025-12-14
**Type**: [ ] Performance | [x] Maintainability | [ ] Security | [x] Architecture | [x] Tech Debt
**Impact**: [ ] High Risk | [x] Medium Risk | [ ] Low Risk
**Status**: [ ] Planning | [ ] Baseline Captured | [ ] In Progress | [ ] Validation | [x] Complete

## Input
User description: "apply fluent paradigms to make the ZodBuilder surface more like Zod. e.g.  build.number() maps to z.number() and returns a wrapper for the source text + methods like .int(), .optional(), .max() which would function like applyInt(), applyOptional(), applyMax() did."

## Motivation

### Current State Problems
**Code Smell(s)**:
- [x] Tight Coupling (procedural `apply*` modifiers scattered across builder/parsers)
- [x] Long Method (accumulating string transformations in imperative flows)
- [x] Primitive Obsession (manipulating source text strings directly rather than cohesive abstractions)
- [ ] Duplication (DRY violation)
- [ ] God Object/Class (too many responsibilities)
- [ ] Feature Envy
- [ ] Dead Code
- [ ] Magic Numbers/Strings
- [ ] Other: —

**Concrete Examples**:
- `applyInt()`, `applyOptional()`, `applyMax()` style utilities operating on builder text rather than fluent method chaining
- Parsers needing to know specific modifier application order, increasing coupling and cognitive load

### Business/Technical Justification
- [x] Developer velocity impact: Fluent, Zod-like API improves discoverability and reduces friction
- [x] Technical debt accumulation: Moves from procedural string mods to cohesive builder wrappers
- [x] Architecture: Aligns internal API with Zod chaining semantics for clearer mapping from JSON Schema
- [ ] Blocking new features
- [ ] Performance degradation
- [ ] Security vulnerability
- [ ] Causing frequent bugs

## Proposed Improvement

### Refactoring Pattern/Technique
**Primary Technique**: Introduce Fluent Interface + Extract Class; Replace Procedural Modifiers with Method Chaining

**High-Level Approach**:
Introduce Zod-like fluent wrappers around the builder’s source text. Example: `build.number()` returns a `NumberBuilder` wrapper exposing `.int()`, `.optional()`, `.max(n)`, etc., which apply the same transformations previously implemented by `applyInt()`, `applyOptional()`, `applyMax()`. Each wrapper encapsulates both the underlying source text and the modifier methods, producing identical final output as before. Parsers switch to using fluent builders rather than invoking `apply*` helpers directly. Unwrapping is explicit via `.done()` which returns the final code string, avoiding accidental coercion and improving testability.

## Clarifications

### Session 2025-12-13
- Q: What is the unwrapping contract for fluent builders? → A: Use explicit `.done()` to return the final code string.

**Files Affected**:
- **Modified**:
  - src/ZodBuilder/number.ts (added `NumberBuilder` class with `.int()`, `.max()`, `.min()`, `.multipleOf()`, etc.)
  - src/ZodBuilder/string.ts (added `StringBuilder` class with `.min()`, `.max()`, `.regex()`, `.email()`, `.uuid()`, `.base64()`, `.json()`, `.pipe()`, etc.)
  - src/ZodBuilder/array.ts (added `ArrayBuilder` class with `.min()`, `.max()`, etc.)
  - src/ZodBuilder/object.ts (added `ObjectBuilder` class with `.strict()`, `.catchall()`, `.loose()`, `.superRefine()`, `.and()`, etc.)
  - src/ZodBuilder/boolean.ts (added `BooleanBuilder` class)
  - src/ZodBuilder/null.ts (added `NullBuilder` class)
  - src/ZodBuilder/enum.ts (added `EnumBuilder` class with string enum optimization)
  - src/ZodBuilder/const.ts (added `ConstBuilder` class for literal values)
  - src/ZodBuilder/index.ts (added `build` factory object with Zod-like API and `BaseBuilder` export)
  - src/parsers/parseNumber.ts (integrated `build.number()` fluent API)
  - src/parsers/parseString.ts (integrated `build.string()` fluent API)
  - src/parsers/parseArray.ts (integrated `build.array()` fluent API)
  - src/parsers/parseObject.ts (integrated `build.object()` and `ObjectBuilder.fromCode()` fluent API)
  - src/parsers/parseBoolean.ts (integrated `build.boolean()` fluent API)
  - src/parsers/parseNull.ts (integrated `build.null()` fluent API)
  - src/parsers/parseEnum.ts (integrated `build.enum()` fluent API)
  - src/parsers/parseConst.ts (integrated `build.literal()` fluent API)
- **Created**:
  - src/ZodBuilder/BaseBuilder.ts (abstract base class with shared modifiers: `.optional()`, `.nullable()`, `.default()`, `.describe()`, `.brand()`, `.readonly()`, `.catch()`, `.done()`)
- **Deleted**:
  - None (retained existing `build*` helper functions for backward compatibility)
- **Moved**:
  - None

### Design Improvements
**Before**:
```typescript
Parsers → applyInt/applyMax/applyOptional → mutate source text → return string
let code = buildNumber();
code = applyInt(code);
code = applyMax(code, 10);
code = applyOptional(code);
return code;
```

**After** (with lazy evaluation):
```typescript
Parsers → build.number() → NumberBuilder → .int()/.max() store metadata → .text() generates code → super.text() applies shared modifiers
const builder = build.number().int().max(10).optional();
// At this point, only metadata is stored: _int=true, _max={value:10}, _optional=true
return builder.text(); // Now code is generated: "z.number().int().max(10).optional()"

// Factory API matching Zod:
build.number()     → NumberBuilder
build.string()     → StringBuilder
build.boolean()    → BooleanBuilder
build.null()       → NullBuilder
build.array(item)  → ArrayBuilder
build.object(props) → ObjectBuilder
build.enum(values) → EnumBuilder
build.literal(val) → ConstBuilder

// Inheritance hierarchy:
BaseBuilder<T> (abstract)
├── NumberBuilder extends BaseBuilder<NumberBuilder>
├── StringBuilder extends BaseBuilder<StringBuilder>
├── ArrayBuilder extends BaseBuilder<ArrayBuilder>
├── ObjectBuilder extends BaseBuilder<ObjectBuilder>
├── BooleanBuilder extends BaseBuilder<BooleanBuilder>
├── NullBuilder extends BaseBuilder<NullBuilder>
├── EnumBuilder extends BaseBuilder<EnumBuilder>
└── ConstBuilder extends BaseBuilder<ConstBuilder>

// Shared modifiers (from BaseBuilder):
.optional()  .nullable()  .default(val)  .describe(str)
.brand(str)  .readonly()  .catch(val)    .text()

// Implementation Architecture:
NumberBuilder:
  - Stores: _int, _multipleOf, _min, _max
  - .text() applies type-specific constraints, then calls super.text()
  
StringBuilder:
  - Stores: _format, _pattern, _minLength, _maxLength, _base64, _json, _pipe
  - .text() applies string constraints, then calls super.text()
  
ArrayBuilder:
  - Stores: _minItems, _maxItems
  - .text() applies array constraints, then calls super.text()
  
ObjectBuilder:
  - Stores: _properties (Record<string, BaseBuilder<any>>)
  - .text() builds object from properties, then calls super.text()
  - .fromCode() static method for wrapping existing object schemas
  
BaseBuilder.text():
  - Applies shared modifiers: optional, nullable, default, describe, brand, readonly, catch
  - Child classes set this._baseText and call super.text() for final output
```

**Key Improvements**:
1. **Zod-like factory API**: `build.number()` matches `z.number()` semantics
2. **Fluent method chaining**: All modifiers chainable with proper type inference
3. **DRY via inheritance**: BaseBuilder eliminates 154 lines of duplicated modifier code
4. **Lazy evaluation pattern**: Builders store constraint metadata and defer code generation to `.text()` method
5. **Smart constraint merging**: Multiple calls intelligently merge (e.g., keeps strictest min/max)
6. **Explicit unwrapping**: `.text()` returns final string, calling `super.text()` for shared modifiers
7. **Type-safe**: Generic self-type pattern ensures proper return types

## Baseline Metrics
*Captured before refactoring begins - see metrics-before.md*

### Code Complexity
- **Cyclomatic Complexity**: not measured
- **Cognitive Complexity**: not measured
- **Lines of Code**: not measured
- **Function Length (avg/max)**: not measured
- **Class Size (avg/max)**: not measured
- **Duplication**: not measured

### Test Coverage
- **Overall Coverage**: not measured
- **Lines Covered**: not measured
- **Branches Covered**: not measured
- **Functions Covered**: not measured

### Performance
- **Build Time**: not measured
- **Bundle Size**: not measured
- **Runtime Performance**: not measured
- **Memory Usage**: not measured

### Dependencies
- **Direct Dependencies**: not measured
- **Total Dependencies**: not measured
- **Outdated Dependencies**: not measured

## Target Metrics
*Goals to achieve - measurable success criteria*

### Code Quality Goals
- **Cyclomatic Complexity**: Maintain or reduce (vs baseline)
- **Lines of Code**: Acceptable if slightly increased for clarity; aim to reduce duplication
- **Duplication**: Reduce by consolidating modifier logic into fluent wrappers
- **Function Length**: Prefer smaller, cohesive methods on wrappers
- **Test Coverage**: Maintain or increase

### Performance Goals
- **Build Time**: Maintain (no regression)
- **Bundle Size**: Maintain (no regression)
- **Runtime Performance**: Maintain (no regression > 5%)
- **Memory Usage**: Maintain

### Success Threshold
**Minimum acceptable improvement**: Maintain identical external behavior and outputs; provide fluent Zod-like builder surface; reduce coupling between parsers and modifier helpers.

## Behavior Preservation Guarantee
*CRITICAL: Refactoring MUST NOT change external behavior*

### External Contracts Unchanged
- [x] CLI arguments unchanged
- [x] File formats unchanged (generated Zod code strings)
- [x] Function signatures for public entrypoints unchanged (or properly deprecated)

### Test Suite Validation
- [x] **All existing tests MUST pass WITHOUT modification**
- [x] If a test needs changing, verify it was testing implementation detail, not behavior
- [x] Do NOT weaken assertions to make tests pass

### Behavioral Snapshot
**Key behaviors to preserve**:
1. Given JSON Schema inputs, generated Zod output string remains identical
2. Modifier semantics: `.int()`, `.optional()`, `.max(n)` match prior `applyInt()`, `applyOptional()`, `applyMax()`
3. Order of chaining maintains same resulting output as previous logic

**Test**: Run before and after refactoring; outputs MUST be identical

## Risk Assessment

### Risk Level Justification
**Why Medium Risk**:
Touches core builder surfaces and parser integration. Blast radius includes many parsers and type builders. However, behavior is deterministic and validated by existing tests.

### Potential Issues
- **Risk 1**: Subtle change in chain ordering could alter output
  - **Mitigation**: Keep wrapper methods delegating to existing logic; add focused tests that compare outputs
  - **Rollback**: Revert wrapper integration and restore procedural helpers

- **Risk 2**: Missing parity across types (e.g., number has `.int()` while others lack expected methods)
  - **Mitigation**: Implement wrappers iteratively with parity checks; use test suite coverage for each parser
  - **Rollback**: Gate new wrappers behind internal use until parity achieved

### Safety Measures
- [x] Incremental commits (can revert partially)
- [x] Peer review required
- [x] Staging validation (local test suite)
- [x] Rollback plan (git revert)

## Rollback Plan

### How to Undo
1. Revert commit range on `refactor/003-apply-fluent-paradigms`
2. Remove wrapper integrations from parsers and builders
3. Verify test suite returns to baseline outputs

### Rollback Triggers
Revert if any of these occur:
- [x] Test suite failure not attributable to implementation-detail changes
- [x] Output diff in generated Zod strings for covered schemas

### Recovery Time Objective
**RTO**: < 30 minutes

## Implementation Plan

### Phase 1: Baseline (Before Refactoring)
1. Capture all baseline metrics (run `.specify/extensions/workflows/refactor/measure-metrics.sh --before`)
2. Create behavioral snapshot (document current outputs)
3. Ensure 100% test pass rate
4. Tag current state in git: `git tag pre-refactor-003 -m "Baseline before refactor-003"`

### Phase 2: Refactoring (Incremental)
1. Introduce base fluent wrapper (`fluent.ts`) with shared chaining utilities
2. Implement `build.number()` → `NumberBuilder` with `.int()`, `.optional()`, `.max()`, `.min()`, `.nonnegative()`, etc.
3. Migrate parsers to use fluent number builder; validate outputs
4. Repeat for string/object/array/boolean/null/enum/const builders with parity

**Principle**: Each step compiles and passes tests

### Phase 3: Validation
1. Run full test suite (MUST pass 100%)
2. Re-measure all metrics
3. Compare behavioral snapshot (MUST be identical)
4. Manual inspection of representative outputs

### Phase 4: Deployment
1. Code review focused on behavior preservation
2. Merge once stable and equivalent

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
- Enables future deprecation of procedural `apply*` helpers once parity confirmed

### Enables
- Cleaner mapping between JSON Schema and Zod; easier future extensions

### Dependencies
- Ensure existing tests fully represent parser coverage; add tests only if needed to clarify behavior

---
*Refactor spec created using `/refactor` workflow - See .specify/extensions/workflows/refactor/*
# Refactor Spec: [IMPROVEMENT DESCRIPTION]

**Refactor ID**: refactor-###
**Branch**: `refactor/###-short-description`
**Created**: [DATE]
**Type**: [ ] Performance | [ ] Maintainability | [ ] Security | [ ] Architecture | [ ] Tech Debt
**Impact**: [ ] High Risk | [ ] Medium Risk | [ ] Low Risk
**Status**: [ ] Planning | [ ] Baseline Captured | [ ] In Progress | [ ] Validation | [ ] Complete

## Input
User description: "$ARGUMENTS"

## Motivation

### Current State Problems
**Code Smell(s)**:
- [ ] Duplication (DRY violation)
- [ ] God Object/Class (too many responsibilities)
- [ ] Long Method (too complex)
- [ ] Feature Envy (accessing other object's data)
- [ ] Primitive Obsession
- [ ] Dead Code
- [ ] Magic Numbers/Strings
- [ ] Tight Coupling
- [ ] Other: [describe]

**Concrete Examples**:
- [File1.ts lines XX-YY: duplicated logic in 3 places]
- [File2.tsx lines AA-BB: 200-line function doing too much]
- [Service.ts: direct database access instead of using repository]

### Business/Technical Justification
[Why is this refactoring needed NOW?]
- [ ] Blocking new features
- [ ] Performance degradation
- [ ] Security vulnerability
- [ ] Causing frequent bugs
- [ ] Developer velocity impact
- [ ] Technical debt accumulation
- [ ] Other: [explain]

## Proposed Improvement

### Refactoring Pattern/Technique
**Primary Technique**: [Extract Method | Extract Class | Introduce Parameter Object | Replace Conditional with Polymorphism | etc.]

**High-Level Approach**:
[2-3 sentences explaining the refactoring strategy]

**Files Affected**:
- **Modified**: [file1.ts, file2.tsx, file3.ts]
- **Created**: [new-file.ts - extracted logic]
- **Deleted**: [old-file.ts - no longer needed]
- **Moved**: [util.ts → lib/util.ts]

### Design Improvements
**Before**:
```
[Simple diagram or description of current structure]
ComponentA → DirectDatabaseAccess
ComponentB → DirectDatabaseAccess
ComponentC → DirectDatabaseAccess
```

**After**:
```
[Simple diagram or description of improved structure]
ComponentA → Repository → Database
ComponentB → Repository → Database
ComponentC → Repository → Database
```

## Baseline Metrics
*Captured before refactoring begins - see metrics-before.md*

### Code Complexity
- **Cyclomatic Complexity**: [number or "not measured"]
- **Cognitive Complexity**: [number or "not measured"]
- **Lines of Code**: [number]
- **Function Length (avg/max)**: [avg: X lines, max: Y lines]
- **Class Size (avg/max)**: [avg: X lines, max: Y lines]
- **Duplication**: [X% or "Y instances"]

### Test Coverage
- **Overall Coverage**: [X%]
- **Lines Covered**: [X/Y]
- **Branches Covered**: [X/Y]
- **Functions Covered**: [X/Y]

### Performance
- **Build Time**: [X seconds]
- **Bundle Size**: [X KB]
- **Runtime Performance**: [X ms for key operations]
- **Memory Usage**: [X MB]

### Dependencies
- **Direct Dependencies**: [count]
- **Total Dependencies**: [count including transitive]
- **Outdated Dependencies**: [count]

## Target Metrics
*Goals to achieve - measurable success criteria*

### Code Quality Goals
- **Cyclomatic Complexity**: Reduce to [target number] (from [baseline])
- **Lines of Code**: Reduce to [target] or acceptable if increased due to clarity
- **Duplication**: Eliminate [X instances] or reduce to [Y%]
- **Function Length**: Max [N lines], avg [M lines]
- **Test Coverage**: Maintain or increase to [X%]

### Performance Goals
- **Build Time**: Maintain or improve (no regression)
- **Bundle Size**: Reduce by [X KB] or maintain
- **Runtime Performance**: Maintain or improve (no regression > 5%)
- **Memory Usage**: Maintain or reduce

### Success Threshold
**Minimum acceptable improvement**: [Define what "success" means]
Example: "Reduce duplication by 50%, maintain test coverage, no performance regression"

## Behavior Preservation Guarantee
*CRITICAL: Refactoring MUST NOT change external behavior*

### External Contracts Unchanged
- [ ] API endpoints return same responses
- [ ] Function signatures unchanged (or properly deprecated)
- [ ] Component props unchanged
- [ ] CLI arguments unchanged
- [ ] Database schema unchanged
- [ ] File formats unchanged

### Test Suite Validation
- [ ] **All existing tests MUST pass WITHOUT modification**
- [ ] If test needs changing, verify it was testing implementation detail, not behavior
- [ ] Do NOT weaken assertions to make tests pass

### Behavioral Snapshot
**Key behaviors to preserve**:
1. [Behavior 1: specific observable output for given input]
2. [Behavior 2: specific side effect or state change]
3. [Behavior 3: specific error handling]

**Test**: Run before and after refactoring, outputs MUST be identical

## Risk Assessment

### Risk Level Justification
**Why [High/Medium/Low] Risk**:
[Explain based on: code touched, user impact, complexity, blast radius]

### Potential Issues
- **Risk 1**: [What could go wrong]
  - **Mitigation**: [How to prevent/detect]
  - **Rollback**: [How to undo if occurs]

- **Risk 2**: [Another potential issue]
  - **Mitigation**: [Prevention strategy]
  - **Rollback**: [Recovery plan]

### Safety Measures
- [ ] Feature flag available for gradual rollout
- [ ] Monitoring in place for key metrics
- [ ] Rollback plan tested
- [ ] Incremental commits (can revert partially)
- [ ] Peer review required
- [ ] Staging environment test required

## Rollback Plan

### How to Undo
1. [Step 1: revert commit range]
2. [Step 2: any manual cleanup needed]
3. [Step 3: verification steps]

### Rollback Triggers
Revert if any of these occur within 24-48 hours:
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
