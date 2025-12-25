# Tasks: Replace Custom JsonSchema Types with json-schema-typed

**Refactor ID**: refactor-005
**Branch**: refactor/005-replace-usage-custom
**Status**: Ready for Implementation

---

## Phase 1: Setup & Type Replacement

### Baseline & Setup
- [X] T001 Verify current tests pass: `npm test`
- [X] T002 Create git tag: `git tag pre-refactor-005 -m "Baseline before refactor-005"`
- [X] T003 [P] Install json-schema-typed: `pnpm add json-schema-typed@^8.0.0`
- [X] T004 Verify package.json lists json-schema-typed in dependencies

### Update Type Definitions in src/Types.ts
- [X] T005 Import JSONSchema from json-schema-typed/draft-2020-12 in src/Types.ts
- [X] T006 Create JsonSchema type alias: `export type JsonSchema = JSONSchema`
- [X] T007 Create JsonSchemaObject with extensions in src/Types.ts:
  ```typescript
  export type JsonSchemaObject = JSONSchema.Interface & {
    errorMessage?: { [key: string]: string | undefined };
    nullable?: boolean;
  };
  ```
- [X] T008 Remove old custom JsonSchema and JsonSchemaObject type definitions from src/Types.ts
- [X] T009 Keep Serializable type unchanged (from type-fest)
- [X] T010 Run TypeScript compilation: `npm run build:types`
- [X] T011 Fix any TypeScript compilation errors
- [X] T012 Run linter: `npm run lint`

---

## Phase 2: Test Schema Updates

### Audit Test Schemas
- [X] T013 Audit test/parsers/parseObject.test.ts for draft-2020-12 compatibility
- [X] T014 Audit test/parsers/parseArray.test.ts for draft-2020-12 compatibility
- [X] T015 Audit test/parsers/parseString.test.ts for draft-2020-12 compatibility
- [X] T016 Audit test/parsers/parseNumber.test.ts for draft-2020-12 compatibility
- [X] T017 Audit test/parsers/parseEnum.test.ts for draft-2020-12 compatibility
- [X] T018 Audit test/parsers/parseConst.test.ts for draft-2020-12 compatibility
- [X] T019 Audit test/parsers/parseAllOf.test.ts for draft-2020-12 compatibility
- [X] T020 Audit test/parsers/parseAnyOf.test.ts for draft-2020-12 compatibility
- [X] T021 Audit test/parsers/parseOneOf.test.ts for draft-2020-12 compatibility
- [X] T022 Audit test/parsers/parseNot.test.ts for draft-2020-12 compatibility
- [X] T023 Audit test/parsers/parseNullable.test.ts for draft-2020-12 compatibility
- [X] T024 Audit test/parsers/parseMultipleType.test.ts for draft-2020-12 compatibility
- [X] T025 Audit test/parsers/parseSchema.test.ts for draft-2020-12 compatibility

### Update Test Schemas
- [X] T026 [P] Update test/parsers/parseObject.test.ts schemas to draft-2020-12 if needed
- [X] T027 [P] Update test/parsers/parseArray.test.ts schemas to draft-2020-12 if needed
- [X] T028 [P] Update test/parsers/parseString.test.ts schemas to draft-2020-12 if needed
- [X] T029 [P] Update test/parsers/parseNumber.test.ts schemas to draft-2020-12 if needed
- [X] T030 [P] Update test/parsers/parseEnum.test.ts schemas to draft-2020-12 if needed
- [X] T031 [P] Update test/parsers/parseConst.test.ts schemas to draft-2020-12 if needed
- [X] T032 [P] Update test/parsers/parseAllOf.test.ts schemas to draft-2020-12 if needed
- [X] T033 [P] Update test/parsers/parseAnyOf.test.ts schemas to draft-2020-12 if needed
- [X] T034 [P] Update test/parsers/parseOneOf.test.ts schemas to draft-2020-12 if needed
- [X] T035 [P] Update test/parsers/parseNot.test.ts schemas to draft-2020-12 if needed
- [X] T036 [P] Update test/parsers/parseNullable.test.ts schemas to draft-2020-12 if needed
- [X] T037 [P] Update test/parsers/parseMultipleType.test.ts schemas to draft-2020-12 if needed
- [X] T038 [P] Update test/parsers/parseSchema.test.ts schemas to draft-2020-12 if needed

### Test Execution & Fixing
- [X] T039 Run test suite: `npm test`
- [X] T040 Document any test failures and behavioral differences
- [X] T041 Fix test expectations if draft-2020-12 changes behavior
- [X] T042 Verify all tests pass: `npm test`

---

## Phase 3: Validation & Documentation

### Full Build Validation
- [X] T043 Run full build: `npm run build`
- [X] T044 Verify all build targets succeed (types, cjs, esm)
- [X] T045 Run linter: `npm run lint`
- [X] T046 Verify no lint errors

### Documentation Updates
- [X] T047 Update CHANGELOG.md with breaking changes section:
  - Add entry for json-schema-typed adoption
  - Document draft-2020-12 migration
  - Note custom extensions (errorMessage, nullable)
  - List any behavioral differences from draft-07
  - Provide migration guidance for type unions vs nullable
- [X] T048 Update README.md with json-schema-typed attribution:
  - Add note about using json-schema-typed
  - Document draft-2020-12 compliance
  - Link to json-schema-typed repository
- [X] T049 Verify documentation accuracy (links work, examples correct)

### Final Checks
- [X] T050 Review git diff to ensure all changes are intentional
- [X] T051 Verify public API backward compatibility (type aliases)
- [X] T052 Run full test suite one final time: `npm test`
- [X] T053 Create commit with descriptive message
- [X] T054 Update refactor-spec.md status to "Complete"

---

## Task Dependencies

```
Setup Flow:
T001 → T002 → T003 → T004

Type Replacement Flow:
T004 → T005 → T006 → T007 → T008 → T009 → T010 → T011 → T012

Test Audit Flow (Parallel):
T012 → [T013, T014, T015, T016, T017, T018, T019, T020, T021, T022, T023, T024, T025]

Test Update Flow (Parallel):
[T013-T025] → [T026, T027, T028, T029, T030, T031, T032, T033, T034, T035, T036, T037, T038]

Test Validation Flow:
[T026-T038] → T039 → T040 → T041 → T042

Documentation Flow:
T042 → T043 → T044 → T045 → T046 → T047 → T048 → T049

Completion Flow:
T049 → T050 → T051 → T052 → T053 → T054
```

## Parallel Execution Opportunities

**Phase 1 - Type Updates**: Sequential (types must compile before testing)

**Phase 2 - Test Audits**: T013-T025 can run in parallel (read-only analysis)

**Phase 2 - Test Updates**: T026-T038 can run in parallel (different files)

**Phase 3 - Documentation**: T047-T048 can run in parallel (different files)

## Notes

- **[P]** indicates tasks that can be parallelized
- Test audit tasks (T013-T025) are quick read-only checks
- Test update tasks (T026-T038) may be no-ops if schemas already compliant
- All tests must pass before proceeding to documentation
- Incremental commits recommended after each phase

## Estimated Effort

| Phase | Tasks | Estimated Time |
|-------|-------|----------------|
| Phase 1 | T001-T012 | 1-2 hours |
| Phase 2 | T013-T042 | 2-4 hours |
| Phase 3 | T043-T054 | 1 hour |
| **Total** | **54 tasks** | **4-7 hours** |

## Success Metrics

- ✅ All 54 tasks completed
- ✅ TypeScript compilation: 0 errors
- ✅ Test suite: 100% pass rate
- ✅ Linter: 0 errors
- ✅ Build: All targets successful
- ✅ Documentation: Complete and accurate
