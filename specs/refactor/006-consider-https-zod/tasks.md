# Tasks: Zod v4 Builder Updates (Dual-Mode Support)

**Refactor ID**: refactor-006
**Input**: plan.md, spec.md from `/specs/refactor/006-consider-https-zod/`
**Organization**: Tasks grouped by implementation phase for incremental refactoring

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

---

## Phase 1: Configuration Infrastructure

**Purpose**: Add zodVersion configuration support to enable dual-mode generation

- [X] T001 Add `ZodVersion` type ('v3' | 'v4') to src/Types.ts
- [X] T002 Add `zodVersion?: ZodVersion` property to Options type in src/Types.ts with JSDoc
- [X] T003 Update BaseBuilder constructor in src/ZodBuilder/BaseBuilder.ts to accept Options parameter
- [X] T004 Add `zodVersion` getter to BaseBuilder in src/ZodBuilder/BaseBuilder.ts (returns options?.zodVersion || 'v4')
- [X] T005 [P] Add `isV4()` helper method to BaseBuilder in src/ZodBuilder/BaseBuilder.ts
- [X] T006 [P] Add `isV3()` helper method to BaseBuilder in src/ZodBuilder/BaseBuilder.ts
- [X] T007 Add `withErrorMessage(message?: string)` method to BaseBuilder in src/ZodBuilder/BaseBuilder.ts that generates `error` param for v4, `message` param for v3
- [X] T008 Update StringBuilder constructor in src/ZodBuilder/string.ts to accept and pass Options to parent
- [X] T009 [P] Update ObjectBuilder constructor in src/ZodBuilder/object.ts to accept and pass Options to parent
- [X] T010 [P] Update NumberBuilder constructor in src/ZodBuilder/number.ts to accept and pass Options to parent
- [X] T011 [P] Update ArrayBuilder constructor in src/ZodBuilder/array.ts to accept and pass Options to parent
- [X] T012 [P] Update other builder constructors (enum, record, tuple, etc.) in src/ZodBuilder/ to accept and pass Options to parent
- [X] T013 Update all parser functions in src/JsonSchema/parsers/ to pass options to builder constructors
- [X] T014 Verify options propagate from jsonSchemaToZod entry point through toZod to builders

**Checkpoint**: Configuration infrastructure complete - builders can detect zodVersion

---

## Phase 2: Error Message Handling

**Purpose**: Update error message generation to use correct parameter name per version

- [X] T015 Update all builder `.text()` methods in src/ZodBuilder/ to use `withErrorMessage()` instead of direct string concatenation
- [X] T016 Test error messages generate `{ error: "..." }` in v4 mode
- [X] T017 Test error messages generate `{ message: "..." }` in v3 mode

**Checkpoint**: Error handling respects zodVersion across all builders

---

## Phase 3: String Format Builders (Hybrid Approach)

**Purpose**: Implement format-specific builders and hybrid switching logic

### 3a: Create Basic Format Builders

- [X] T018 [P] Create EmailBuilder class in src/ZodBuilder/email.ts extending BaseBuilder
- [X] T019 [P] Create UrlBuilder class in src/ZodBuilder/url.ts extending BaseBuilder
- [X] T020 [P] Create UuidBuilder class in src/ZodBuilder/uuid.ts extending BaseBuilder (with guid/uuid support)
- [X] T021 [P] Create DatetimeBuilder class in src/ZodBuilder/datetime.ts extending BaseBuilder

### 3b: Create Additional Format Builders

- [X] T022 [P] Create DateBuilder class in src/ZodBuilder/date.ts extending BaseBuilder
- [X] T023 [P] Create TimeBuilder class in src/ZodBuilder/time.ts extending BaseBuilder
- [X] T024 [P] Create DurationBuilder class in src/ZodBuilder/duration.ts extending BaseBuilder
- [X] T025 [P] Create IpBuilder class in src/ZodBuilder/ip.ts extending BaseBuilder (with v4/v6/cidrv4/cidrv6 support)

### 3c: Create Specialized Format Builders

- [X] T026 [P] Create Base64Builder class in src/ZodBuilder/base64.ts extending BaseBuilder
- [X] T027 [P] Create EmojiBuilder class in src/ZodBuilder/emoji.ts extending BaseBuilder
- [X] T028 [P] Create CuidBuilder class in src/ZodBuilder/cuid.ts extending BaseBuilder (with cuid/cuid2 support)
- [X] T029 [P] Create UlidBuilder class in src/ZodBuilder/ulid.ts extending BaseBuilder
- [X] T030 [P] Create NanoidBuilder class in src/ZodBuilder/nanoid.ts extending BaseBuilder

### 3d: Update StringBuilder

- [X] T031 Add `hasConstraints()` helper method to StringBuilder in src/ZodBuilder/string.ts checking for min/max/pattern/length
- [X] T032 Update `email()` method in StringBuilder to return EmailBuilder in v4 mode when no constraints exist, otherwise return this
- [X] T033 Update `url()` method in StringBuilder to return UrlBuilder in v4 mode when no constraints exist, otherwise return this
- [X] T034 Update `uuid()` method in StringBuilder to return UuidBuilder in v4 mode when no constraints exist, otherwise return this
- [X] T035 Update `datetime()` method in StringBuilder to return DatetimeBuilder in v4 mode when no constraints exist, otherwise return this
- [X] T036 Update `date()` method in StringBuilder to return DateBuilder in v4 mode when no constraints exist, otherwise return this
- [X] T037 Update `time()` method in StringBuilder to return TimeBuilder in v4 mode when no constraints exist, otherwise return this
- [X] T038 Update `duration()` method in StringBuilder to return DurationBuilder in v4 mode when no constraints exist, otherwise return this
- [X] T039 Update `ip()`, `ipv4()`, `ipv6()` methods in StringBuilder to return IpBuilder in v4 mode when no constraints exist
- [X] T040 Update `base64()` method in StringBuilder to return Base64Builder in v4 mode when no constraints exist
- [X] T041 Update remaining format methods (emoji, cuid, ulid, nanoid) in StringBuilder to return appropriate builders in v4 mode
- [X] T042 Update StringBuilder `.text()` method to handle remaining in-chain formats in v3 mode or when constraints exist
- [X] T043 Export all format builder classes from src/ZodBuilder/index.ts

**Checkpoint**: String formats generate top-level functions in v4, method chains in v3

---

## Phase 4: Object Builder Updates

**Purpose**: Update ObjectBuilder to generate version-appropriate code

- [X] T044 Update ObjectBuilder `.text()` method in src/ZodBuilder/object.ts to generate `z.strictObject({...})` in v4 when `_strict` is true
- [X] T045 Update ObjectBuilder `.text()` method to generate `z.looseObject({...})` in v4 when `_passthrough` is true
- [X] T046 Update ObjectBuilder `.text()` method to generate `z.object({...}).strict()` in v3 mode when `_strict` is true
- [X] T047 Update ObjectBuilder `.text()` method to generate `z.object({...}).passthrough()` in v3 mode when `_passthrough` is true
- [X] T048 Update ObjectBuilder merge handling to generate `.extend()` in v4 mode, `.merge()` in v3 mode
- [X] T049 Handle optional field defaults correctly for both v3 (not applied) and v4 (applied) - document behavior difference

**Checkpoint**: Object builders generate correct code per version

---

## Phase 5: Enum Builder Updates

**Purpose**: Update enum generation for Zod v4's unified API

- [X] T050 Update NativeEnumBuilder `.text()` method in src/ZodBuilder/nativeEnum.ts to generate `z.enum()` in v4 mode
- [X] T051 Update NativeEnumBuilder `.text()` method to generate `z.nativeEnum()` in v3 mode
- [X] T052 Verify enum value handling works correctly in both modes

**Checkpoint**: Enums generate unified API in v4, nativeEnum in v3

---

## Phase 6: Other Builder Updates

**Purpose**: Handle remaining builder-specific version differences

- [X] T053 [P] Document in NumberBuilder (src/ZodBuilder/number.ts) that v4 rejects Infinity by default (built-in behavior)
- [X] T054 [P] Update RecordBuilder `.text()` method in src/ZodBuilder/record.ts to always provide two arguments in v4 mode
- [X] T055 [P] Update RecordBuilder `.text()` method to allow single argument in v3 mode when key schema not provided
- [X] T056 [P] Document in ArrayBuilder (src/ZodBuilder/array.ts) that `.nonempty()` type inference differs but validation is identical

**Checkpoint**: All builders handle version-specific quirks correctly

---

## Phase 7: Testing

**Purpose**: Comprehensive test coverage for dual-mode support

### 7a: String Format Tests

- [ ] T057 [P] Add v4 mode tests for email format in test/parsers/parseString.test.ts verifying `z.email()` generation
- [ ] T058 [P] Add v4 mode tests for uuid format verifying `z.uuid()` or `z.guid()` generation
- [ ] T059 [P] Add v4 mode tests for url format verifying `z.url()` generation
- [ ] T060 [P] Add v4 mode tests for datetime, date, time, duration formats
- [ ] T061 [P] Add v4 mode tests for ip, emoji, base64, cuid, ulid, nanoid formats
- [ ] T062 [P] Add v3 mode tests for all string formats verifying `z.string().format()` generation
- [ ] T063 Test constraints-first behavior: string with minLength + email stays in StringBuilder in v4

### 7b: Object Tests

- [ ] T064 [P] Add v4 mode tests for ObjectBuilder strict in test/parsers/parseObject.test.ts verifying `z.strictObject()` generation
- [ ] T065 [P] Add v4 mode tests for ObjectBuilder passthrough verifying `z.looseObject()` generation
- [ ] T066 [P] Add v4 mode tests for ObjectBuilder merge verifying `.extend()` generation
- [ ] T067 [P] Add v3 mode tests for ObjectBuilder verifying `.strict()`, `.passthrough()`, `.merge()` generation

### 7c: Enum and Other Tests

- [ ] T068 [P] Add v4 mode tests for NativeEnumBuilder in test/parsers/parseEnum.test.ts verifying `z.enum()` generation
- [ ] T069 [P] Add v3 mode tests for NativeEnumBuilder verifying `z.nativeEnum()` generation
- [ ] T070 [P] Add tests for NumberBuilder infinity handling in both v3 and v4 modes
- [ ] T071 [P] Add tests for RecordBuilder argument handling in both v3 and v4 modes

### 7d: Integration Tests

- [ ] T072 [P] Add v4 integration tests in test/jsonSchemaToZod.test.ts for complete JSON Schema conversion
- [ ] T073 [P] Add v3 integration tests for complete JSON Schema conversion verifying backward compatibility
- [ ] T074 Test version switching: same schema generates different code in v3 vs v4 modes
- [ ] T075 Test default version is v4 when zodVersion not specified
- [ ] T076 Test options propagation through nested builders in complex schemas

### 7e: Error Message Tests

- [ ] T077 [P] Add tests verifying error messages use `{ error: "..." }` in v4 mode across all builder types
- [ ] T078 [P] Add tests verifying error messages use `{ message: "..." }` in v3 mode across all builder types

### 7f: Validation

- [ ] T079 Run full test suite (npm test) and verify all 183 existing tests pass without modification
- [ ] T080 Fix any test failures related to exact string output (implementation details vs behavior)

**Checkpoint**: Comprehensive test coverage confirms dual-mode support works correctly

---

## Phase 8: Documentation

**Purpose**: Document zodVersion option and migration guidance

- [ ] T081 [P] Add Zod Version Support section to README.md with zodVersion examples for both v3 and v4
- [ ] T082 [P] Document key differences between v3 and v4 generation in README.md
- [ ] T083 [P] Add version selection guidance to MIGRATION-GUIDE.md explaining when to use v3 vs v4 mode
- [ ] T084 [P] Add migration path steps to MIGRATION-GUIDE.md for transitioning from v3 to v4
- [ ] T085 [P] Add JSDoc comments to BaseBuilder class in src/ZodBuilder/BaseBuilder.ts with version examples
- [ ] T086 [P] Add JSDoc comments to all format builder classes with v3/v4 examples
- [ ] T087 [P] Add JSDoc comments to ObjectBuilder with v3/v4 strict/loose examples
- [ ] T088 [P] Update CLI documentation in src/cli.ts (if exists) to show zodVersion flag usage

**Checkpoint**: Documentation complete with clear migration guidance

---

## Phase 9: Quality & Polish

**Purpose**: Final validation and cleanup

- [ ] T089 [P] Run TypeScript compilation check (tsc --noEmit) and fix any type errors
- [ ] T090 [P] Run linter (npm run lint) and fix any code style issues
- [ ] T091 [P] Create performance benchmark comparing v3 vs v4 code generation speed
- [ ] T092 Verify no performance regression > 5% in code generation
- [ ] T093 Document performance results in metrics-after.md
- [ ] T094 Run .specify/extensions/workflows/refactor/measure-metrics.sh --after to capture final metrics
- [ ] T095 Compare metrics-after.md with metrics-before.md and document improvements/regressions
- [ ] T096 Update refactor-spec.md status to Complete and check off verification items
- [ ] T097 Create pull request with comprehensive description, migration guide, and test results

**Checkpoint**: Refactor complete, validated, and ready for review

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Configuration)**: MUST complete first - foundation for all other phases
- **Phase 2 (Error Handling)**: Depends on Phase 1 - can start after T007 complete
- **Phase 3 (String Formats)**: Depends on Phase 1 and 2 - largest phase
- **Phase 4 (Objects)**: Depends on Phase 1 and 2 - can proceed in parallel with Phase 3
- **Phase 5 (Enums)**: Depends on Phase 1 and 2 - can proceed in parallel with Phase 3 and 4
- **Phase 6 (Others)**: Depends on Phase 1 and 2 - can proceed in parallel with Phase 3-5
- **Phase 7 (Testing)**: Depends on Phases 1-6 completion - validates all changes
- **Phase 8 (Documentation)**: Can proceed in parallel with Phases 3-7
- **Phase 9 (Quality)**: Depends on all other phases - final validation

### Within Phase 3 (String Formats)

- T018-T030 (format builder creation) can all run in parallel [P]
- T031 (hasConstraints) must complete before T032-T042
- T032-T042 (StringBuilder updates) must wait for respective format builders to exist
- T043 (exports) must wait for all builders to be created

### Parallel Opportunities

- **Phase 1**: T005-T006 parallel, T009-T012 parallel
- **Phase 3**: All format builder creation tasks (T018-T030) parallel
- **Phase 4-6**: Can proceed simultaneously after Phase 1-2 complete
- **Phase 7**: Most test tasks within each subsection can run in parallel
- **Phase 8**: All documentation tasks can run in parallel
- **Phase 9**: T089-T090 can run in parallel

### Critical Path

1. Phase 1 configuration (T001-T014) → 2-3 hours
2. Phase 2 error handling (T015-T017) → 2-3 hours
3. Phase 3 string formats (T018-T043) → 6-8 hours (longest phase)
4. Phase 7 testing (T057-T080) → 4-6 hours
5. Phase 9 validation (T089-T097) → 2-3 hours

**Total Critical Path**: ~16-23 hours

### Recommended Execution Order

1. Complete Phase 1 fully (configuration foundation)
2. Complete Phase 2 fully (error handling affects all builders)
3. Proceed with Phases 3-6 in parallel (if team capacity allows), or sequentially: Phase 3 → 4 → 5 → 6
4. Begin Phase 8 (documentation) after Phase 3 starts (can document completed features)
5. Complete Phase 7 (testing) after Phases 3-6 complete
6. Complete Phase 9 (quality) after everything else done

---

## Task Summary

- **Total Tasks**: 97
- **Phase 1 (Configuration)**: 14 tasks
- **Phase 2 (Error Handling)**: 3 tasks
- **Phase 3 (String Formats)**: 26 tasks
- **Phase 4 (Objects)**: 6 tasks
- **Phase 5 (Enums)**: 3 tasks
- **Phase 6 (Others)**: 4 tasks
- **Phase 7 (Testing)**: 24 tasks
- **Phase 8 (Documentation)**: 8 tasks
- **Phase 9 (Quality)**: 9 tasks
- **Parallel Tasks**: 61 tasks marked [P]
- **Sequential Tasks**: 36 tasks

---

## Success Criteria

✅ All 97 tasks completed
✅ All builders support zodVersion configuration
✅ v4 mode generates Zod v4-compatible code (top-level formats, strictObject, unified enum)
✅ v3 mode generates Zod v3-compatible code (method chains, nativeEnum)
✅ All 183 existing tests pass in both modes
✅ New tests added for version-specific behavior
✅ Error messages use correct parameter name per version
✅ Documentation complete with migration guide
✅ No performance regression > 5%
✅ TypeScript compilation clean
✅ Linter clean
✅ Code review approved

---

*Generated from plan.md and spec.md - refactor-006*
