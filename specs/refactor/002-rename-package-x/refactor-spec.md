# Refactor Spec: Rename package + introduce `JsonSchema`/`ZodBuilder` namespaces

**Refactor ID**: refactor-002
**Branch**: `refactor/002-rename-package-x`
**Created**: 2025-12-12
**Type**: [ ] Performance | [x] Maintainability | [ ] Security | [x] Architecture | [x] Tech Debt
**Impact**: [ ] High Risk | [x] Medium Risk | [ ] Low Risk
**Status**: [x] Planning | [x] Baseline Captured | [x] In Progress | [x] Validation | [x] Complete

## Input

User description: "rename package x-to-zod; move existing functionality (jsonSchemaToZod) under a JsonSchema namespace; add a ZodBuilder namespace containing all logic to generate Zod types and modifiers (e.g., number parsing/modifiers like in src/parsers/parseNumber.ts)."

## Motivation

### Current State Problems

**Code Smell(s)**:

- [ ] Duplication (DRY violation)
- [x] God Object/Class (too many responsibilities)
- [ ] Long Method (too complex)
- [ ] Feature Envy (accessing other object's data)
- [x] Primitive Obsession
- [ ] Dead Code
- [x] Magic Numbers/Strings
- [x] Tight Coupling
- [x] Other: unclear API surface boundaries (schema traversal vs Zod generation)

**Concrete Examples**:

- `src/jsonSchemaToZod.ts`: central conversion logic also decides how Zod code is emitted (string concatenation concerns are interleaved with schema semantics).
- `src/parsers/*`: each parser both interprets JSON Schema keywords and constructs Zod output strings directly; e.g. `src/parsers/parseNumber.ts` appends modifiers like `.int()`, `.multipleOf()`, `.gt()/.gte()`, `.lt()/.lte()`.
- Modifiers and error-message handling are spread across parsers, making it harder to reason about consistent Zod generation rules.

### Business/Technical Justification

This refactor clarifies the public API, reduces coupling, and makes future feature work (new keywords/formats/modifiers) safer and faster by centralizing Zod-generation rules.

- [ ] Blocking new features
- [ ] Performance degradation
- [ ] Security vulnerability
- [ ] Causing frequent bugs
- [x] Developer velocity impact
- [x] Technical debt accumulation
- [x] Other: package rename aligns published artifact name with intended branding (`x-to-zod`) while keeping behavior identical.

## Proposed Improvement

### Refactoring Pattern/Technique

**Primary Technique**: Extract Module / Introduce Facade (namespacing) + Extract Functions (builder/modifiers)

**High-Level Approach**:
Introduce two explicit namespaces: `JsonSchema` (schema-facing API and traversal) and `ZodBuilder` (Zod type construction and modifier application). Keep external behavior stable by preserving current exports and output strings, while reorganizing internals so parsers delegate Zod string building to `ZodBuilder`.

**Files Affected**:

- **Modified**: `package.json`, `README.md`, `src/index.ts`, `src/jsonSchemaToZod.ts`, `src/cli.ts`, `src/parsers/*`
- **Created**: (likely) `src/JsonSchema/index.ts` (or `src/JsonSchema.ts`), `src/ZodBuilder/index.ts` (or `src/ZodBuilder.ts`), plus any helper modules extracted from parsers
- **Deleted**: none expected
- **Moved**: optional (only if it materially improves boundaries; otherwise prefer re-exports to minimize churn)

### Design Improvements

**Before**:

```
JsonSchema traversal + keyword interpretation + Zod string building
  └─ scattered across `src/jsonSchemaToZod.ts` and `src/parsers/*`
```

**After**:

```
JsonSchema (schema-facing)
  └─ converts/traverses JSON Schema, chooses builder operations

ZodBuilder (zod-facing)
  └─ owns string generation rules for base Zod types + modifiers/messages
```

## Baseline Metrics

_Captured before refactoring begins - see metrics-before.md_

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

_Goals to achieve - measurable success criteria_

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

_CRITICAL: Refactoring MUST NOT change external behavior_

### External Contracts Unchanged

- [ ] API endpoints return same responses
- [x] Function signatures unchanged (or properly deprecated)
- [ ] Component props unchanged
- [x] CLI arguments unchanged
- [ ] Database schema unchanged
- [ ] File formats unchanged

Notes:

- The published package name will change to `x-to-zod` (intentional). Runtime behavior, output strings, and CLI flags must remain identical.
- Backward compatibility should be preserved where possible by re-exporting the existing default export and `jsonSchemaToZod` symbol as shims over the new `JsonSchema` namespace.

### Test Suite Validation

- [ ] **All existing tests MUST pass WITHOUT modification**
- [ ] If test needs changing, verify it was testing implementation detail, not behavior
- [ ] Do NOT weaken assertions to make tests pass

### Behavioral Snapshot

**Key behaviors to preserve**:

1. `jsonSchemaToZod({ type: "string" }, { module: "esm" })` emits identical ESM output (import line + `export default` + trailing newline).
2. Numeric keyword handling remains identical; e.g. `parseNumber` output for integer/multipleOf/min/max/exclusive\* and `errorMessage` is unchanged.
3. CLI behavior remains identical: args parsing, piping behavior, and stdout/file output.

**Test**: Run before and after refactoring, outputs MUST be identical

## Risk Assessment

### Risk Level Justification

**Why Medium Risk**:
Touches the public packaging surface (`package.json` name, exports) and reorganizes internal modules across many files. Tests provide good coverage of output strings, but any accidental change to formatting, newlines, or export locations would be user-visible.

### Potential Issues

- **Risk 1**: Breaking consumer imports due to renamed/moved exports
  - **Mitigation**: Keep existing entrypoints and export names; add re-exports/shims (`jsonSchemaToZod` and default export) that delegate to `JsonSchema`.
  - **Rollback**: Revert refactor commits; keep package name unchanged.

- **Risk 2**: Output string drift (spacing/newlines/order of chained modifiers)
  - **Mitigation**: Run the full test suite after each incremental step; use the behavioral snapshot as a spot-check.
  - **Rollback**: Revert the last step that changes emission order/formatting.

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

_Refactor spec created using `/refactor` workflow - See .specify/extensions/workflows/refactor/_
