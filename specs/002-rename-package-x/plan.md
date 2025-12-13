# Implementation Plan: Rename package + introduce JsonSchema/ZodBuilder namespaces

**Branch**: `002-rename-package-x` | **Date**: 2025-12-12 | **Spec**: `specs/002-rename-package-x/refactor-spec.md`

## Summary

Refactor the library internals to clarify responsibilities: `JsonSchema` owns schema traversal and conversion orchestration; `ZodBuilder` owns Zod string generation rules (base types + modifier chains + error-message integration). Preserve behavior exactly: the generated strings (including newlines, spacing, modifier ordering) must remain identical for all existing inputs, and the CLI must accept the same flags and produce identical stdout.

This refactor also changes the published package name to `x-to-zod` while preserving consumer compatibility where possible via re-exports/shims.

## Technical Context

**Language/Version**: TypeScript (strict)
**Project Type**: Single library + CLI tool
**Behavior Contract**: Output strings are treated as snapshots (byte-for-byte equality)
**Constraints**:
- No changes to runtime behavior or output strings
- No changes to CLI flags/behavior
- Preserve existing `jsonSchemaToZod` export and default export via shims

## Constitution Check

✅ **PASS** - No violations detected (refactor is internal re-organization + explicit boundaries; behavior preserved by tests)

---

## Project Structure (Target)

```text
src/
├── cli.ts
├── index.ts
├── jsonSchemaToZod.ts              # becomes facade/shim over JsonSchema
├── Types.ts
├── JsonSchema/
│   ├── index.ts                    # JsonSchema namespace entry (or JsonSchema.ts)
│   └── ...                         # traversal/orchestration helpers (if extracted)
├── ZodBuilder/
│   ├── index.ts                    # builder entry point
│   └── modifiers/                  # optional: extracted modifier helpers
└── parsers/                        # parsers remain but delegate generation
    └── *.ts
```

**Structure Decision**: Prefer minimal churn. Do not rename/move existing parsers unless it clearly reduces coupling. Introduce `JsonSchema`/`ZodBuilder` modules and migrate logic gradually.

---

## Implementation Phases

### Phase 0: Baseline Capture & Validation

**Goal**: Establish a baseline before any refactoring.

**Tasks**:
1. Run tests and ensure 100% pass rate
2. Capture baseline metrics into `metrics-before.md`
3. Create a git tag for baseline state
4. Confirm behavioral snapshot “before” outputs match documented examples

**Commands**:
```bash
npm test

.specify/extensions/workflows/refactor/measure-metrics.sh --before --dir "specs/002-rename-package-x"

git tag pre-refactor-002 -m "Baseline before refactor-002: package rename + JsonSchema/ZodBuilder namespaces"
```

**Gate**: Tests pass; baseline metrics captured; baseline tag created.

---

### Phase 1: Package Rename Surface (No Behavior Change)

**Goal**: Rename the published package name to `x-to-zod` while keeping runtime behavior and exports stable.

**Tasks**:
1. Update `package.json`:
   - `name`: `x-to-zod`
   - Preserve existing `exports`/entrypoints and dual-module output
2. Update `README.md` usage examples (package name only)
3. Ensure `src/index.ts` continues exporting the same runtime symbols

**Verification**:
- `npm test` passes
- No generated output changes

**Gate**: Tests pass; CLI tests pass; export surface unchanged (except package name).

---

### Phase 2: Introduce `ZodBuilder` (Additive)

**Goal**: Create a centralized module that constructs Zod strings and applies modifiers/messages without changing output.

**Approach**:
- Implement builder helpers that operate on the existing string-building style (string concatenation) but isolate rules.
- Start with the most sensitive, well-specified behavior: number modifiers like `parseNumber`.

**Initial scope**:
- Base type factories: `number()`, `string()`, etc. (only as needed)
- Modifier helpers:
  - `.int()` decisions
  - `.multipleOf()`
  - `.gt/.gte/.lt/.lte` decisions for min/max + exclusive variants
  - Preserve error-message integration behavior (through `withMessage` or a delegated equivalent)

**Verification**:
- Focus tests:
  - `test/parsers/parseNumber.test.ts`
  - `test/jsonSchemaToZod.test.ts`

**Gate**: `parseNumber` output is byte-identical for all tests and for the behavioral snapshot example.

---

### Phase 3: Introduce `JsonSchema` Namespace (Facade)

**Goal**: Make schema traversal/orchestration explicit without changing the public API.

**Tasks**:
1. Create `src/JsonSchema/index.ts` exposing a `JsonSchema` namespace-like object (or named exports) that wraps the existing orchestration.
2. Update `src/jsonSchemaToZod.ts` to delegate to `JsonSchema` while preserving:
   - existing default export
   - `jsonSchemaToZod` named export
   - exact output formatting
3. Update `src/index.ts` exports as needed, ensuring existing imports keep working.

**Verification**:
- `npm test`
- Behavioral Snapshot Behavior 1 output unchanged

**Gate**: All tests pass; `jsonSchemaToZod({ type: 'string' }, { module: 'esm' })` output remains identical.

---

### Phase 4: Parser Delegation (Incremental)

**Goal**: Move Zod string generation logic out of `src/parsers/*` and into `ZodBuilder`, one parser at a time.

**Rules**:
- Keep modifier order identical.
- Preserve message attachment logic and keyword precedence.
- Prefer one-parser-per-commit, with tests run after each.

**Suggested order**:
1. `parseNumber` (already guarded by snapshot)
2. `parseString`
3. `parseArray`
4. `parseObject`
5. Remaining parsers

**Gate**: Tests pass after each parser migration; no output drift.

---

### Phase 5: Validation & Cleanup

**Goal**: Confirm behavior preservation and document metrics.

**Tasks**:
1. Run full test suite
2. Fill in “after” section of behavioral snapshot
3. Capture “after” metrics
4. Ensure documentation reflects new package name and (optional) new namespaces without changing old entrypoints

**Commands**:
```bash
npm test

.specify/extensions/workflows/refactor/measure-metrics.sh --after --dir "specs/002-rename-package-x"
```

**Gate**: Tests pass; behavioral snapshot verified; metrics captured.

---

## Behavior Preservation Checklist (Must Hold Throughout)

- Output strings are byte-identical (including whitespace and newlines)
- `parseNumber` example output matches exactly:
  `z.number().int("ayy").multipleOf(2, "lmao").gt(0, "deez").lte(2, "nuts")`
- CLI flags and behavior unchanged
- Existing exports remain available (default + `jsonSchemaToZod`)

## Rollback Strategy

If any step causes output drift or export breakage, revert the last atomic commit and re-run:
```bash
npm test
```

---
