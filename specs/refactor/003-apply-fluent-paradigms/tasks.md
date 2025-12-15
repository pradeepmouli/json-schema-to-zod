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

- [x] T001 Capture baseline metrics via script
- [x] T002 Ensure all tests pass (baseline)
- [x] T003 Create branch and confirm spec artifacts exist

## Phase 2: Foundational

- [x] T004 [P] Create BaseBuilder<T> abstract class in src/ZodBuilder/BaseBuilder.ts with shared modifiers
- [x] T005 Update src/ZodBuilder/index.ts to export builder factories via `build` object

## Phase 3: Number Builder

- [x] T006 Implement NumberBuilder class in src/ZodBuilder/number.ts
- [x] T007 Wire `build.number()` factory in src/ZodBuilder/index.ts
- [x] T008 Integrate NumberBuilder in src/parsers/parseNumber.ts and preserve chain order
- [x] T009 Run tests and compare outputs (no changes allowed)
- [x] T009a Gate: Run tests BEFORE code changes; confirm baseline green
- [x] T009b Gate: Run tests AFTER integration; compare against behavioral snapshot

## Phase 4: String Builder

- [x] T010 [P] Implement StringBuilder in src/ZodBuilder/string.ts
- [x] T011 [P] Wire `build.string()` and integrate in src/parsers/parseString.ts
- [x] T012 Run tests and verify parity
- [x] T012a Gate: Run tests BEFORE code changes
- [x] T012b Gate: Run tests AFTER integration; snapshot compare

## Phase 5: Array Builder

- [x] T013 [P] Implement ArrayBuilder in src/ZodBuilder/array.ts
- [x] T014 [P] Wire `build.array()` and integrate in src/parsers/parseArray.ts
- [x] T015 Run tests and verify parity
- [x] T015a Gate: Run tests BEFORE code changes
- [x] T015b Gate: Run tests AFTER integration; snapshot compare

## Phase 6: Object/Boolean/Null/Enum/Const Builders

- [x] T016 [P] Implement ObjectBuilder in src/ZodBuilder/object.ts
- [x] T017 [P] Integrate in src/parsers/parseObject.ts
- [x] T018 [P] Implement BooleanBuilder in src/ZodBuilder/boolean.ts (methods parity)
- [x] T019 [P] Implement NullBuilder in src/ZodBuilder/null.ts
- [x] T020 [P] Implement EnumBuilder in src/ZodBuilder/enum.ts
- [x] T021 [P] Implement ConstBuilder in src/ZodBuilder/const.ts
- [x] T022 Update exports and integrations where needed
- [x] T023 Run full test suite and verify parity
- [x] T023a Gate: Run tests BEFORE phase work begins
- [x] T023b Gate: Run tests AFTER all integrations; snapshot compare (107/107 passing)

## Phase 7: Validation

- [x] T024 Re-measure metrics (after)
- [x] T025 Compare behavioral snapshot outputs (identical, 107/107 tests passing)
- [x] T026 Code review checklist compliance
- [x] T030 Validate ESM/CJS parity (build both, verify post-build outputs unchanged)
- [x] T031 Validate CLI parity (run CLI on sample schemas and compare to baseline outputs)
- [x] T032 Final export/index verification in src/ZodBuilder/index.ts (build factory + BaseBuilder exported)

## Additional Completed Tasks (Beyond Original Plan)

- [x] T033 Refactor all builder constructors to take build\* function inputs directly
- [x] T034 Implement BaseBuilder<T> inheritance for all 8 builder classes
- [x] T035 Remove 154 lines of duplicated modifier code via inheritance
- [x] T036 Create Zod-like factory API (`build.number()`, `build.string()`, etc.)
- [x] T037 Update all parsers to use factory API instead of direct constructors
- [x] T038 Implement ObjectBuilder.fromCode() for wrapping existing schemas
- [x] T039 Implement lazy evaluation pattern: Store constraint metadata, defer code generation to .text()
- [x] T040 Add smart constraint merging for NumberBuilder, StringBuilder, ArrayBuilder
- [x] T041 Fix BaseBuilder.text() to properly assign modifier results
- [x] T042 Establish .text() + super.text() delegation pattern for all builders
- [x] T043 Fix ObjectBuilder to accept Record<string, string> instead of Record<string, BaseBuilder<any>>
- [x] T044 Fix duplicate export issue in src/index.ts preventing TypeScript builds

## Final Phase: Polish & Cross-Cutting

- [x] T027 [P] Update README.md with internal fluent notes (non-public) - Already comprehensive
- [x] T028 [P] Add minimal wrapper-level tests if coverage gaps (no assertion weakening) - Parsers have 98%+ coverage, builders tested through parsers
- [x] T029 [P] Ensure ESM/CJS outputs unchanged; inspect post-build scripts - Both build successfully with correct package.json

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
