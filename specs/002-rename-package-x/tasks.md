# Tasks: Rename package + introduce `JsonSchema`/`ZodBuilder` namespaces

**Refactor ID**: refactor-002
**Branch**: `002-rename-package-x`
**Input**: `specs/002-rename-package-x/refactor-spec.md`, `specs/002-rename-package-x/plan.md`, `specs/002-rename-package-x/behavioral-snapshot.md`

---

## Phase 0: Baseline Capture & Validation

**Purpose**: Establish a behavior and metrics baseline before any code moves.

- [ ] T001 Verify dependencies install cleanly
  ```bash
  npm install
  ```
  **File**: `package.json` (verification only)

- [ ] T002 Verify all tests pass (baseline)
  ```bash
  npm test
  ```
  **File**: N/A (verification only)

- [ ] T003 Capture baseline metrics (before)
  ```bash
  .specify/extensions/workflows/refactor/measure-metrics.sh --before --dir "specs/002-rename-package-x"
  ```
  **File**: `specs/002-rename-package-x/metrics-before.md`

- [ ] T004 Capture baseline library output for snapshot Behavior 1
  ```bash
  node -e "import('./dist/esm/index.js').then(m=>console.log(m.default({type:'string'},{module:'esm'})))" || true
  ```
  **File**: `specs/refactor-002-rename-package-x/behavioral-snapshot.md` (reference only)

- [ ] T005 Capture baseline CLI output (spot-check)
  ```bash
  echo '{"type":"string"}' > /tmp/refactor-002.schema.json
  tsx src/cli.ts -i /tmp/refactor-002.schema.json
  ```
  **File**: `src/cli.ts` (verification only)

- [ ] T006 Create git baseline tag
  ```bash
  git tag pre-refactor-002 -m "Baseline before refactor-002: package rename + JsonSchema/ZodBuilder namespaces"
  ```
  **File**: Git tag (repository state)

- [ ] T007 Confirm behavioral snapshot “before” sections are accurate
  - Ensure Behavior 1 “Actual Output (before)” matches current output formatting
  - Ensure Behavior 2 “Actual Output (before)” matches current `parseNumber` formatting
  **File**: `specs/002-rename-package-x/behavioral-snapshot.md`

**Gate**: `npm test` passes; `metrics-before.md` populated; tag created.

---

## Phase 1: Package Rename Surface (No Behavior Change)

**Purpose**: Rename published artifact to `x-to-zod` without changing runtime exports or behavior.

- [ ] T008 Update package name
  - Set `name` to `x-to-zod`
  **File**: `package.json`

- [ ] T009 Verify `exports`/entrypoints remain equivalent
  - Confirm existing ESM/CJS exports map to the same runtime API
  **File**: `package.json`

- [ ] T010 Update README install/import examples (package name only)
  **File**: `README.md`

- [ ] T011 Verify tests after rename
  ```bash
  npm test
  ```
  **File**: N/A (verification only)

- [ ] T012 Verify CLI behavior unchanged
  ```bash
  tsx src/cli.ts -i /tmp/refactor-002.schema.json
  ```
  **File**: `src/cli.ts` (verification only)

**Gate**: All tests pass; CLI output unchanged.

---

## Phase 2: Introduce `ZodBuilder` (Additive)

**Purpose**: Centralize Zod-string construction rules and modifier application.

- [ ] T013 Create `ZodBuilder` module scaffold
  - Create directory and entrypoint
  **File**: `src/ZodBuilder/index.ts`

- [ ] T014 Add number builder API (minimum viable)
  - Implement helpers that can reproduce `parseNumber` output exactly
  **File**: `src/ZodBuilder/number.ts` (new)

- [ ] T015 Add `ZodBuilder` re-exports
  - Keep internal-only until later phases unless explicitly exported
  **File**: `src/ZodBuilder/index.ts`

- [ ] T016 Refactor `parseNumber` to delegate string building to `ZodBuilder`
  - Preserve modifier order, message wiring, and keyword precedence
  **File**: `src/parsers/parseNumber.ts`

- [ ] T017 Run focused number parser tests
  ```bash
  npm test -- test/parsers/parseNumber.test.ts
  ```
  **File**: `test/parsers/parseNumber.test.ts`

- [ ] T018 Run integration suite that exercises number generation
  ```bash
  npm test -- test/jsonSchemaToZod.test.ts
  ```
  **File**: `test/jsonSchemaToZod.test.ts`

- [ ] T019 Verify behavioral snapshot Behavior 2 (after)
  - Fill “Actual Output (after)” with identical output string
  **File**: `specs/002-rename-package-x/behavioral-snapshot.md`

**Gate**: `parseNumber` output is byte-identical; snapshot Behavior 2 verified.

---

## Phase 3: Introduce `JsonSchema` Namespace (Facade)

**Purpose**: Make schema traversal/orchestration explicit while preserving the public API.

- [ ] T020 Create `JsonSchema` entrypoint facade
  - Add a namespace-like module that can host orchestration
  **File**: `src/JsonSchema/index.ts`

- [ ] T021 Move orchestration implementation behind `JsonSchema`
  - Keep implementation initially as thin delegation (no behavior change)
  **File**: `src/JsonSchema/jsonSchemaToZod.ts` (new)

- [ ] T022 Convert `src/jsonSchemaToZod.ts` into a shim over `JsonSchema`
  - Preserve default export
  - Preserve named export `jsonSchemaToZod`
  - Preserve exact formatting (imports/newlines)
  **File**: `src/jsonSchemaToZod.ts`

- [ ] T023 Ensure `src/index.ts` keeps current exports stable
  - Avoid breaking imports; re-export shims if needed
  **File**: `src/index.ts`

- [ ] T024 Run focused tests for library output formatting
  ```bash
  npm test -- test/jsonSchemaToZod.test.ts
  ```
  **File**: `test/jsonSchemaToZod.test.ts`

- [ ] T025 Verify behavioral snapshot Behavior 1 (after)
  - Fill “Actual Output (after)” with identical output
  **File**: `specs/002-rename-package-x/behavioral-snapshot.md`

**Gate**: `jsonSchemaToZod({ type: 'string' }, { module: 'esm' })` output unchanged.

---

## Phase 4: Parser Delegation (Incremental)

**Purpose**: Move Zod string generation rules out of parsers and into `ZodBuilder` one parser at a time.

- [ ] T026 Add `ZodBuilder` scaffolding for shared primitives
  - Create shared helpers only as needed to keep output identical
  **File**: `src/ZodBuilder/shared.ts` (new)

- [ ] T027 Migrate `parseString` to `ZodBuilder`
  **File**: `src/parsers/parseString.ts`

- [ ] T028 Run `parseString` tests
  ```bash
  npm test -- test/parsers/parseString.test.ts
  ```
  **File**: `test/parsers/parseString.test.ts`

- [ ] T029 Migrate `parseArray` to `ZodBuilder`
  **File**: `src/parsers/parseArray.ts`

- [ ] T030 Run `parseArray` tests
  ```bash
  npm test -- test/parsers/parseArray.test.ts
  ```
  **File**: `test/parsers/parseArray.test.ts`

- [ ] T031 Migrate `parseObject` to `ZodBuilder`
  **File**: `src/parsers/parseObject.ts`

- [ ] T032 Run `parseObject` tests
  ```bash
  npm test -- test/parsers/parseObject.test.ts
  ```
  **File**: `test/parsers/parseObject.test.ts`

- [ ] T033 Migrate `parseEnum` to `ZodBuilder`
  **File**: `src/parsers/parseEnum.ts`

- [ ] T034 Run `parseEnum` tests
  ```bash
  npm test -- test/parsers/parseEnum.test.ts
  ```
  **File**: `test/parsers/parseEnum.test.ts`

- [ ] T035 Migrate `parseConst` to `ZodBuilder`
  **File**: `src/parsers/parseConst.ts`

- [ ] T036 Run `parseConst` tests
  ```bash
  npm test -- test/parsers/parseConst.test.ts
  ```
  **File**: `test/parsers/parseConst.test.ts`

- [ ] T037 Migrate combinator parsers (`parseAllOf`, `parseAnyOf`, `parseOneOf`) to `ZodBuilder`
  **Files**: `src/parsers/parseAllOf.ts`, `src/parsers/parseAnyOf.ts`, `src/parsers/parseOneOf.ts`

- [ ] T038 Run combinator parser tests
  ```bash
  npm test -- test/parsers/parseAllOf.test.ts
  npm test -- test/parsers/parseAnyOf.test.ts
  npm test -- test/parsers/parseOneOf.test.ts
  ```
  **Files**: `test/parsers/parseAllOf.test.ts`, `test/parsers/parseAnyOf.test.ts`, `test/parsers/parseOneOf.test.ts`

- [ ] T039 Migrate `parseMultipleType` and `parseNullable` to `ZodBuilder`
  **Files**: `src/parsers/parseMultipleType.ts`, `src/parsers/parseNullable.ts`

- [ ] T040 Run multi-type/nullable tests
  ```bash
  npm test -- test/parsers/parseMultipleType.test.ts
  npm test -- test/parsers/parseNullable.test.ts
  ```
  **Files**: `test/parsers/parseMultipleType.test.ts`, `test/parsers/parseNullable.test.ts`

- [ ] T041 Migrate `parseNot` to `ZodBuilder`
  **File**: `src/parsers/parseNot.ts`

- [ ] T042 Run `parseNot` tests
  ```bash
  npm test -- test/parsers/parseNot.test.ts
  ```
  **File**: `test/parsers/parseNot.test.ts`

- [ ] T043 Keep `parseSchema` orchestration stable while delegating builder calls
  - Ensure parser selection and recursion behavior unchanged
  **File**: `src/parsers/parseSchema.ts`

- [ ] T044 Run `parseSchema` tests
  ```bash
  npm test -- test/parsers/parseSchema.test.ts
  ```
  **File**: `test/parsers/parseSchema.test.ts`

- [ ] T045 Run full suite after parser migrations
  ```bash
  npm test
  ```
  **File**: N/A (verification only)

**Gate**: Tests pass after each migration; full suite passes at the end of the phase.

---

## Phase 5: Final Validation & Metrics

**Purpose**: Close the loop on behavior preservation and record metrics.

- [ ] T046 Run full test suite (final)
  ```bash
  npm test
  ```
  **File**: N/A (verification only)

- [ ] T047 Capture metrics (after)
  ```bash
  .specify/extensions/workflows/refactor/measure-metrics.sh --after --dir "specs/002-rename-package-x"
  ```
  **Files**: `specs/002-rename-package-x/metrics-after.md`, `specs/002-rename-package-x/metrics-before.md`

- [ ] T048 Complete behavioral snapshot checklist
  - Check all verification boxes
  - Paste “after” outputs for Behavior 1 and Behavior 2
  **File**: `specs/002-rename-package-x/behavioral-snapshot.md`

- [ ] T049 Update refactor spec status checkboxes
  - Mark Baseline Captured / In Progress / Validation / Complete as appropriate
  **File**: `specs/002-rename-package-x/refactor-spec.md`

**Gate**: Snapshot verified; metrics captured; tests passing.

---
