# Tasks: Rename package + introduce `JsonSchema`/`ZodBuilder` namespaces

**Refactor ID**: refactor-002
**Branch**: `002-rename-package-x`
**Input**: `specs/002-rename-package-x/refactor-spec.md`, `specs/002-rename-package-x/plan.md`, `specs/002-rename-package-x/behavioral-snapshot.md`

---

## Phase 0: Baseline Capture & Validation

**Purpose**: Establish a behavior and metrics baseline before any code moves.

- [x] T001 Verify dependencies install cleanly

  ```bash
  npm install
  ```

  **File**: `package.json` (verification only)

- [x] T002 Verify all tests pass (baseline)

  ```bash
  npm test
  ```

  **File**: N/A (verification only)

- [x] T003 Capture baseline metrics (before)

  ```bash
  .specify/extensions/workflows/refactor/measure-metrics.sh --before --dir "specs/002-rename-package-x"
  ```

  **File**: `specs/002-rename-package-x/metrics-before.md`

- [x] T004 Capture baseline library output for snapshot Behavior 1

  ```bash
  npx tsx -e "import { jsonSchemaToZod } from './src/jsonSchemaToZod.ts'; console.log(jsonSchemaToZod({ type: 'string' }, { module: 'esm' }));"
  ```

  **File**: `specs/002-rename-package-x/behavioral-snapshot.md` (reference only)

- [x] T005 Capture baseline CLI output (spot-check)

  ```bash
  echo '{"type":"string"}' > /tmp/refactor-002.schema.json
  npx tsx src/cli.ts -i /tmp/refactor-002.schema.json
  ```

  **File**: `src/cli.ts` (verification only)

- [x] T006 Create git baseline tag

  ```bash
  git tag pre-refactor-002 -m "Baseline before refactor-002: package rename + JsonSchema/ZodBuilder namespaces"
  ```

  **File**: Git tag (repository state)

- [x] T007 Confirm behavioral snapshot "before" sections are accurate
  - Ensure Behavior 1 “Actual Output (before)” matches current output formatting
  - Ensure Behavior 2 “Actual Output (before)” matches current `parseNumber` formatting
    **File**: `specs/002-rename-package-x/behavioral-snapshot.md`

**Gate**: `npm test` passes; `metrics-before.md` populated; tag created.

---

## Phase 1: Package Rename Surface (No Behavior Change)

**Purpose**: Rename published artifact to `x-to-zod` without changing runtime exports or behavior.

- [x] T008 Update package name
  - Set `name` to `x-to-zod`
    **File**: `package.json`

- [x] T009 Verify `exports`/entrypoints remain equivalent
  - Confirm existing ESM/CJS exports map to the same runtime API
    **File**: `package.json`

- [x] T010 Update README install/import examples (package name only)
      **File**: `README.md`

- [x] T011 Verify tests after rename

  ```bash
  npm test
  ```

  **File**: N/A (verification only)

- [x] T012 Verify CLI behavior unchanged
  ```bash
  tsx src/cli.ts -i /tmp/refactor-002.schema.json
  ```
  **File**: `src/cli.ts` (verification only)

**Gate**: All tests pass; CLI output unchanged.

---

## Phase 2: Introduce `ZodBuilder` (Additive)

**Purpose**: Centralize Zod-string construction rules and modifier application.

- [x] T013 Create `ZodBuilder` module scaffold
  - Create directory and entrypoint
    **File**: `src/ZodBuilder/index.ts`

- [x] T014 Add number builder API (minimum viable)
  - Implement helpers that can reproduce `parseNumber` output exactly
    **File**: `src/ZodBuilder/number.ts` (new)

- [x] T015 Add `ZodBuilder` re-exports
  - Keep internal-only until later phases unless explicitly exported
    **File**: `src/ZodBuilder/index.ts`

- [x] T016 Refactor `parseNumber` to delegate string building to `ZodBuilder`
  - Preserve modifier order, message wiring, and keyword precedence
    **File**: `src/parsers/parseNumber.ts`

- [x] T017 Run focused number parser tests

  ```bash
  npm test -- test/parsers/parseNumber.test.ts
  ```

  **File**: `test/parsers/parseNumber.test.ts`

- [x] T018 Run integration suite that exercises number generation

  ```bash
  npm test -- test/jsonSchemaToZod.test.ts
  ```

  **File**: `test/jsonSchemaToZod.test.ts`

- [x] T019 Verify behavioral snapshot Behavior 2 (after)
  - Fill “Actual Output (after)” with identical output string
    **File**: `specs/002-rename-package-x/behavioral-snapshot.md`

**Gate**: `parseNumber` output is byte-identical; snapshot Behavior 2 verified.

---

## Phase 3: Introduce `JsonSchema` Namespace (Facade)

**Purpose**: Make schema traversal/orchestration explicit while preserving the public API.

- [x] T020 Create `JsonSchema` entrypoint facade
  - Add a namespace-like module that can host orchestration
    **File**: `src/JsonSchema/index.ts`

- [x] T021 Move orchestration implementation behind `JsonSchema`
  - Keep implementation initially as thin delegation (no behavior change)
    **File**: `src/JsonSchema/jsonSchemaToZod.ts` (new)

- [x] T022 Convert `src/jsonSchemaToZod.ts` into a shim over `JsonSchema`
  - Preserve default export
  - Preserve named export `jsonSchemaToZod`
  - Preserve exact formatting (imports/newlines)
    **File**: `src/jsonSchemaToZod.ts`

- [x] T023 Ensure `src/index.ts` keeps current exports stable
  - Avoid breaking imports; re-export shims if needed
    **File**: `src/index.ts`

- [x] T024 Run focused tests for library output formatting

  ```bash
  npm test -- test/jsonSchemaToZod.test.ts
  ```

  **File**: `test/jsonSchemaToZod.test.ts`

- [x] T025 Verify behavioral snapshot Behavior 1 (after)
  - Fill “Actual Output (after)” with identical output
    **File**: `specs/002-rename-package-x/behavioral-snapshot.md`

**Gate**: `jsonSchemaToZod({ type: 'string' }, { module: 'esm' })` output unchanged.

---

## Phase 4: Parser Delegation (Incremental)

**Purpose**: Move Zod string generation rules out of parsers and into `ZodBuilder` one parser at a time.

- [x] T026 Add `ZodBuilder` scaffolding for shared primitives
  - Create shared helpers only as needed to keep output identical
    **File**: `src/ZodBuilder/shared.ts` (new)

- [x] T027 Migrate `parseString` to `ZodBuilder`
      **File**: `src/parsers/parseString.ts`

- [x] T028 Run `parseString` tests

  ```bash
  npm test -- test/parsers/parseString.test.ts
  ```

  **File**: `test/parsers/parseString.test.ts`

- [x] T029 Migrate `parseArray` to `ZodBuilder`
      **File**: `src/parsers/parseArray.ts`

- [x] T030 Run `parseArray` tests

  ```bash
  npm test -- test/parsers/parseArray.test.ts
  ```

  **File**: `test/parsers/parseArray.test.ts`

- [x] T031 Migrate `parseObject` to `ZodBuilder`
      **File**: `src/parsers/parseObject.ts`

- [x] T032 Run `parseObject` tests

  ```bash
  npm test -- test/parsers/parseObject.test.ts
  ```

  **File**: `test/parsers/parseObject.test.ts`

- [x] T033 Migrate `parseEnum` to `ZodBuilder`
      **File**: `src/parsers/parseEnum.ts`

- [x] T034 Run `parseEnum` tests

  ```bash
  npm test -- test/parsers/parseEnum.test.ts
  ```

  **File**: `test/parsers/parseEnum.test.ts`

- [x] T035 Migrate `parseConst` to `ZodBuilder`
      **File**: `src/parsers/parseConst.ts`

- [x] T036 Run `parseConst` tests

  ```bash
  npm test -- test/parsers/parseConst.test.ts
  ```

  **File**: `test/parsers/parseConst.test.ts`

- [x] T037 Migrate combinator parsers (`parseAllOf`, `parseAnyOf`, `parseOneOf`) to `ZodBuilder`
      **Files**: `src/parsers/parseAllOf.ts`, `src/parsers/parseAnyOf.ts`, `src/parsers/parseOneOf.ts`

- [x] T038 Run combinator parser tests

  ```bash
  npm test -- test/parsers/parseAllOf.test.ts
  npm test -- test/parsers/parseAnyOf.test.ts
  npm test -- test/parsers/parseOneOf.test.ts
  ```

  **Files**: `test/parsers/parseAllOf.test.ts`, `test/parsers/parseAnyOf.test.ts`, `test/parsers/parseOneOf.test.ts`

- [x] T039 Migrate `parseMultipleType` and `parseNullable` to `ZodBuilder`
      **Files**: `src/parsers/parseMultipleType.ts`, `src/parsers/parseNullable.ts`

- [x] T040 Run multi-type/nullable tests

  ```bash
  npm test -- test/parsers/parseMultipleType.test.ts
  npm test -- test/parsers/parseNullable.test.ts
  ```

  **Files**: `test/parsers/parseMultipleType.test.ts`, `test/parsers/parseNullable.test.ts`

- [x] T041 Migrate `parseNot` to `ZodBuilder`
      **File**: `src/parsers/parseNot.ts`

- [x] T042 Run `parseNot` tests

  ```bash
  npm test -- test/parsers/parseNot.test.ts
  ```

  **File**: `test/parsers/parseNot.test.ts`

- [x] T043 Keep `parseSchema` orchestration stable while delegating builder calls
  - Ensure parser selection and recursion behavior unchanged
    **File**: `src/parsers/parseSchema.ts`

- [x] T044 Run `parseSchema` tests

  ```bash
  npm test -- test/parsers/parseSchema.test.ts
  ```

  **File**: `test/parsers/parseSchema.test.ts`

- [x] T045 Run full suite after parser migrations
  ```bash
  npm test
  ```
  **File**: N/A (verification only)

**Gate**: Tests pass after each migration; full suite passes at the end of the phase.

---

## Phase 5: Final Validation & Metrics

**Purpose**: Close the loop on behavior preservation and record metrics.

- [x] T046 Run full test suite (final)

  ```bash
  npm test
  ```

  **File**: N/A (verification only)

- [x] T047 Capture metrics (after)

  ```bash
  .specify/extensions/workflows/refactor/measure-metrics.sh --after --dir "specs/002-rename-package-x"
  ```

  **Files**: `specs/002-rename-package-x/metrics-after.md`, `specs/002-rename-package-x/metrics-before.md`

- [x] T048 Complete behavioral snapshot checklist
  - Check all verification boxes
  - Paste “after” outputs for Behavior 1 and Behavior 2
    **File**: `specs/002-rename-package-x/behavioral-snapshot.md`

- [x] T049 Update refactor spec status checkboxes
  - Mark Baseline Captured / In Progress / Validation / Complete as appropriate
    **File**: `specs/002-rename-package-x/refactor-spec.md`

**Gate**: Snapshot verified; metrics captured; tests passing.

---
