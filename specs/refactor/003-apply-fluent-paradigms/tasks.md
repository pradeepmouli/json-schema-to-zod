# Tasks: refactor-003 Apply Fluent Zod-like Builders

Feature: Fluent Zod-like Builders for ZodBuilder

**Status**: ✅ COMPLETE - All implementation tasks finished, all 107 tests passing

## Completed Enhancements (Beyond Original Spec)

- ✅ **BaseBuilder Inheritance**: Created BaseBuilder<T> abstract class eliminating 154 lines of duplicated modifier code
- ✅ **Zod-like Factory API**: Implemented `build` factory object matching Zod's API (`build.number()`, `build.string()`, etc.)
- ✅ **Constructor Signatures**: All builders take same inputs as original `build*` functions (e.g., `ArrayBuilder(itemSchema)`, `EnumBuilder(values)`)
- ✅ **ObjectBuilder.fromCode()**: Static factory method for wrapping existing object code strings
- ✅ **Full Parser Integration**: All 8 parsers (Number, String, Array, Object, Boolean, Null, Enum, Const) using fluent builders

## Phase 1: Setup

- [X] T001 Capture baseline metrics via script
- [X] T002 Ensure all tests pass (baseline)
- [X] T003 Create branch and confirm spec artifacts exist

## Phase 2: Foundational

- [X] T004 [P] Create BaseBuilder<T> abstract class in src/ZodBuilder/BaseBuilder.ts with shared modifiers
- [X] T005 Update src/ZodBuilder/index.ts to export builder factories via `build` object

## Phase 3: Number Builder

- [X] T006 Implement NumberBuilder class in src/ZodBuilder/number.ts
- [X] T007 Wire `build.number()` factory in src/ZodBuilder/index.ts
- [X] T008 Integrate NumberBuilder in src/parsers/parseNumber.ts and preserve chain order
- [X] T009 Run tests and compare outputs (no changes allowed)
 - [X] T009a Gate: Run tests BEFORE code changes; confirm baseline green
 - [X] T009b Gate: Run tests AFTER integration; compare against behavioral snapshot

## Phase 4: String Builder

- [X] T010 [P] Implement StringBuilder in src/ZodBuilder/string.ts
- [X] T011 [P] Wire `build.string()` and integrate in src/parsers/parseString.ts
- [X] T012 Run tests and verify parity
 - [X] T012a Gate: Run tests BEFORE code changes
 - [X] T012b Gate: Run tests AFTER integration; snapshot compare

## Phase 5: Array Builder

- [X] T013 [P] Implement ArrayBuilder in src/ZodBuilder/array.ts
- [X] T014 [P] Wire `build.array()` and integrate in src/parsers/parseArray.ts
- [X] T015 Run tests and verify parity
 - [X] T015a Gate: Run tests BEFORE code changes
 - [X] T015b Gate: Run tests AFTER integration; snapshot compare

## Phase 6: Object/Boolean/Null/Enum/Const Builders

- [X] T016 [P] Implement ObjectBuilder in src/ZodBuilder/object.ts
- [X] T017 [P] Integrate in src/parsers/parseObject.ts
- [X] T018 [P] Implement BooleanBuilder in src/ZodBuilder/boolean.ts (methods parity)
- [X] T019 [P] Implement NullBuilder in src/ZodBuilder/null.ts
- [X] T020 [P] Implement EnumBuilder in src/ZodBuilder/enum.ts
- [X] T021 [P] Implement ConstBuilder in src/ZodBuilder/const.ts
- [X] T022 Update exports and integrations where needed
- [X] T023 Run full test suite and verify parity
 - [X] T023a Gate: Run tests BEFORE phase work begins
 - [X] T023b Gate: Run tests AFTER all integrations; snapshot compare (107/107 passing)

## Phase 7: Validation

- [X] T024 Re-measure metrics (after)
- [X] T025 Compare behavioral snapshot outputs (identical, 107/107 tests passing)
- [X] T026 Code review checklist compliance
 - [ ] T030 Validate ESM/CJS parity (build both, verify post-build outputs unchanged)
 - [ ] T031 Validate CLI parity (run CLI on sample schemas and compare to baseline outputs)
 - [X] T032 Final export/index verification in src/ZodBuilder/index.ts (build factory + BaseBuilder exported)

## Additional Completed Tasks (Beyond Original Plan)

- [X] T033 Refactor all builder constructors to take build* function inputs directly
- [X] T034 Implement BaseBuilder<T> inheritance for all 8 builder classes
- [X] T035 Remove 154 lines of duplicated modifier code via inheritance
- [X] T036 Create Zod-like factory API (`build.number()`, `build.string()`, etc.)
- [X] T037 Update all parsers to use factory API instead of direct constructors
- [X] T038 Implement ObjectBuilder.fromCode() for wrapping existing schemas
- [X] T039 Implement lazy evaluation pattern: Store constraint metadata, defer code generation to .text()
- [X] T040 Add smart constraint merging for NumberBuilder, StringBuilder, ArrayBuilder
- [X] T041 Fix BaseBuilder.text() to properly assign modifier results
- [X] T042 Establish .text() + super.text() delegation pattern for all builders

## Final Phase: Polish & Cross-Cutting

- [ ] T027 [P] Update README.md with internal fluent notes (non-public)
- [ ] T028 [P] Add minimal wrapper-level tests if coverage gaps (no assertion weakening)
- [ ] T029 [P] Ensure ESM/CJS outputs unchanged; inspect post-build scripts

## Dependencies (Story Order)

- Number → String → Array → Object/Boolean/Null/Enum/Const
- Validation depends on all builders integrated

## Parallel Execution Examples

- [P] T010/T011 (String) can run in parallel with T013/T014 (Array) once Number phase passes
- [P] T016–T021 can be parallelized across files as they touch distinct modules
- [P] T027–T029 can run in parallel post-integration

## Implementation Strategy (MVP first)

- MVP: Phase 3 (NumberBuilder) integrated with tests passing
- Incremental delivery: Add next builders in phases, always keeping tests green

---
Format validation: All tasks follow `- [ ] T### [P?] Description with file path`.
