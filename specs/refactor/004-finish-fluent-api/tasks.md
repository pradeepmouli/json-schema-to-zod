# Tasks: Fluent Builder API Refactoring (refactor-004)

**Refactor ID**: refactor-004 | **Branch**: refactor/004-finish-fluent-api | **Spec**: [refactor-spec.md](refactor-spec.md) | **Plan**: [plan.md](plan.md)

**Overview**: Complete fluent builder API implementation through 3-phase incremental refactoring. All phases keep tests passing continuously via reordered execution: Phase 3+4 (parsers + top-level) → Phase 2 (builders) → Phase 1 (new types).

**Total Tasks**: 72 | **Implementation Strategy**: MVD-first (Phase 3+4 provides immediate value), incremental validation after each phase

---

## Phase 0: Setup & Baseline Validation (Prerequisite)

- [x] T001 [P] Verify baseline test suite passes: Run `npm test` and confirm 104 tests passing
- [x] T002 Verify TypeScript compilation succeeds: Run `npm run build`
- [x] T003 [P] Document baseline generated output: Run test schemas through current parser and save outputs to `specs/refactor/004-finish-fluent-api/baseline-outputs/` directory for later comparison
- [x] T004 [P] Confirm git status clean: `git status` shows no uncommitted changes on refactor/004 branch

**Gate**: All 4 tasks must pass before proceeding to Phase 3+4

---

## Phase 3+4 Combined: Update Parsers & Top-Level Functions

**Goal**: Transform parsers to emit builders while top-level functions call `.text()`, ensuring tests pass immediately

**Independent Test Criteria**:
- Tests pass after each file modification
- Generated output identical to baseline
- No TypeScript compilation errors
- No new `any` types introduced

### Phase 3+4.1: Update Types (Foundation)

- [x] T005 Update `ParserSelector` type in src/Types.ts: Change return type from `string` to `BaseBuilder`
- [x] T006 Verify Types.ts compiles: Run `npm run build` and check for type errors in parser implementations

**Gate**: src/Types.ts updated, TypeScript compilation succeeds

### Phase 3+4.2: Update parseSchema Core Logic

- [x] T007 [P] Modify `addDescribes()` in src/parsers/parseSchema.ts: Replace string concat with `builder.describe(description)` call
- [x] T008 [P] Modify `addDefaults()` in src/parsers/parseSchema.ts: Replace string concat with `builder.default(value)` call
- [x] T009 [P] Modify `addAnnotations()` in src/parsers/parseSchema.ts: Replace string concat with `builder.readonly()` call
- [x] T010 Update parseSchema return type from `string` to `BaseBuilder` in src/parsers/parseSchema.ts
- [x] T011 Remove `.text()` calls from parseSchema's selectParser results (return builders, not strings)
- [x] T012 [P] Verify parseSchema tests pass: Run `npm test -- parseSchema.test.ts`

**Gate**: parseSchema tests pass, modifier logic validated

### Phase 3+4.3: Update Individual Parsers (16 files)

**Parsers returning basic builders (currently call `.text()`, remove those calls)**:
- [x] T013 [P] Update src/parsers/parseString.ts: Change `return builder.text();` to `return builder;` (line 45)
- [x] T014 [P] Update src/parsers/parseNumber.ts: Change `return builder.text();` to `return builder;` (line 53)
- [x] T015 [P] Update src/parsers/parseBoolean.ts: Change final return from `.text()` to return builder directly
- [x] T016 [P] Update src/parsers/parseNull.ts: Change final return from `.text()` to return builder directly
- [x] T017 [P] Update src/parsers/parseEnum.ts: Change final return from `.text()` to return builder directly
- [x] T018 [P] Update src/parsers/parseConst.ts: Change final return from `.text()` to return builder directly

**Parsers with composition (parseObject, parseArray currently use builders; parseAnyOf, parseOneOf use string templates)**:
- [x] T019 [P] Update src/parsers/parseObject.ts: Change `build.object(properties).text()` to `build.object(properties)` (line 66); handle JSDoc branch similarly
- [x] T020 [P] Update src/parsers/parseArray.ts: Change final return from `builder.text()` to `builder`; itemSchema already comes from parseSchema (returns builder after T010)
- [x] T021 **NO CHANGE NEEDED**: parseAnyOf.ts already returns string template (no `.text()` call). Phase 1 will replace template with `new UnionBuilder([...])`
- [x] T022 **NO CHANGE NEEDED**: parseOneOf.ts already returns string template (superRefine logic). May remain string-based due to complexity (not a simple builder)

**Remaining parsers**:
- [x] T023 [P] Update src/parsers/parseNot.ts: Return builder instead of string
- [x] T024 [P] Update src/parsers/parseNullable.ts: Return builder instead of string
- [x] T025 [P] Update src/parsers/parseAllOf.ts: Return intersection string template for now (Phase 1 will create IntersectionBuilder)
- [x] T026 [P] Update src/parsers/parseMultipleType.ts: Return builder from recursive parseSchema calls
- [x] T027 [P] Update src/parsers/parseIfThenElse.ts: Return builder composition (may need special handling)
- [x] T028 [P] Update src/parsers/parseDefault.ts: Return builder instead of string

**Gate**: All parser tests pass individually: `npm test -- test/parsers/`

### Phase 3+4.4: Update Top-Level Functions

- [x] T029 Update src/jsonSchemaToZod.ts main function: Call `.text()` on parseSchema result before returning
- [x] T030 Update src/cli.ts: Handle parseSchema returning builder, call `.text()` on result
- [x] T031 Update src/JsonSchema/jsonSchemaToZod.ts: Call `.text()` on builder result
- [x] T031a [P] **CLI Validation (Constitution Principle III)**: Test CLI with file I/O: `npm run build && npm run cli -- --input test/all.json --output /tmp/refactor-test-output.ts` and verify output matches baseline (use comparable flags like `--module none --noImport` if baseline has no wrapper).
- [x] T032 [P] Verify integration tests pass: Run `npm test -- jsonSchemaToZod.test.ts`

**Gate**: Full test suite passes: `npm test` shows 104 tests passing

### Phase 3+4.5: Comprehensive Validation

- [X] T033 Run full test suite: `npm test` - must show 0 failures
- [x] T034 Verify TypeScript strict mode: `npm run build` - must succeed with no errors
- [x] T035 Verify behavior preservation: Compare generated outputs to baseline using `diff -r specs/refactor/004-finish-fluent-api/baseline-outputs/ <new_output_dir>` (should show zero differences). Note: diff must be run with comparable CLI options (e.g. `--module none --noImport`) to match baseline output format.
- [ ] T036 [P] Commit Phase 3+4 changes: `git commit -m "refactor: parsers emit builders, top-level functions call .text()"`

**Gate**: All tests pass, TypeScript strict mode succeeds, behavior preserved

---

## Phase 2: Update Builders to Accept Union Types

**Goal**: Builders accept `BaseBuilder | string` for backward compatibility during transition

**Independent Test Criteria**:
- Builders work with both builder and string inputs
- Tests continue passing (100% pass rate)
- Type safety maintained via union types
- No `any` types introduced

### Phase 2.1: Update ObjectBuilder

- [x] T037 [P] Update src/ZodBuilder/object.ts constructor: Change `Record<string, string>` to `Record<string, BaseBuilder | string>`
- [x] T038 Update buildObject helper: Add logic to convert builders to strings: `const val = typeof v === 'string' ? v : v.text()`
- [x] T039 [P] Update buildRecord helper: Accept union types and handle conversion
- [x] T040 [P] Verify object builder tests pass: `npm test -- test/parsers/parseObject.test.ts`

### Phase 2.2: Update ArrayBuilder

- [x] T041 [P] Update src/ZodBuilder/array.ts constructor: Change `string` to `BaseBuilder | string`
- [x] T042 Update buildArray helper: Extract string from builder if needed
- [x] T043 Update buildTuple helper: Accept `(BaseBuilder | string)[]` and handle conversion
- [x] T044 [P] Verify array builder tests pass: `npm test -- test/parsers/parseArray.test.ts`

### Phase 2.3: Update Other Builders & Modifiers

- [x] T045 [P] Update src/ZodBuilder/modifiers.ts: Update helper functions to accept union types where needed
- [x] T046 [P] Verify all builder tests pass: `npm test -- test/parsers/`

**Gate**: All tests pass, union types correctly handled

### Phase 2.4: Final Phase 2 Validation

- [x] T047 Run full test suite: `npm test` - must show 0 failures
- [x] T048 [P] Commit Phase 2 changes: `git commit -m "refactor: builders accept BaseBuilder | string union types"`

**Gate**: Tests pass, ready for Phase 1

---

## Phase 1: Add Missing Builder Types

**Goal**: Create 9 new builder types for complete Zod schema coverage

**Independent Test Criteria**:
- Each builder compiles without errors
- `.text()` output is valid Zod code
- Tests continue passing (100% pass rate)

### Phase 1.1: Simple Builders (no composition)

- [x] T049 Create src/ZodBuilder/any.ts: `class AnyBuilder extends BaseBuilder { constructor() { super('z.any()'); } }`
- [x] T050 Create src/ZodBuilder/never.ts: `class NeverBuilder extends BaseBuilder { constructor() { super('z.never()'); } }`
- [x] T051 Create src/ZodBuilder/unknown.ts: `class UnknownBuilder extends BaseBuilder { constructor() { super('z.unknown()'); } }`
- [x] T052 Create src/ZodBuilder/literal.ts: `class LiteralBuilder extends BaseBuilder { constructor(value) { super(...); } }`

**Validation**: Each builder instantiates and `.text()` returns valid Zod code

### Phase 1.2: Composition Builders (accept builders or strings)

- [x] T053 [P] Create src/ZodBuilder/union.ts: UnionBuilder accepting `(BaseBuilder | string)[]`
- [x] T054 [P] Create src/ZodBuilder/intersection.ts: IntersectionBuilder accepting `(BaseBuilder | string)[]`
- [x] T055 Create src/ZodBuilder/discriminatedUnion.ts: DiscriminatedUnionBuilder with discriminator and options
- [x] T056 [P] Create src/ZodBuilder/tuple.ts: TupleBuilder accepting `(BaseBuilder | string)[]`
- [x] T057 Create src/ZodBuilder/record.ts: RecordBuilder accepting key and value builders/strings

**Validation**: Each builder handles both input types correctly

### Phase 1.3: Export & Integration

- [x] T058 Update src/ZodBuilder/index.ts: Export all 9 new builders
- [x] T059 [P] Verify new builders are importable: Test `import { UnionBuilder, ... } from 'src/ZodBuilder'`
- [x] T060 Update src/parsers/parseAnyOf.ts: Return `UnionBuilder` instead of template string
- [x] T061 Update src/parsers/parseOneOf.ts: Return `DiscriminatedUnionBuilder` instead of template string (if applicable)
- [x] T062 Update src/parsers/parseAllOf.ts: Return `IntersectionBuilder` instead of template string

### Phase 1.4: Final Phase 1 Validation

- [x] T063 Run full test suite: `npm test` - must show 0 failures
- [x] T064 Verify TypeScript strict mode: `npm run build` - must succeed
- [x] T065 Verify behavior preservation: All generated outputs still identical to baseline
- [x] T066 [P] Commit Phase 1 changes: Done as part of consolidated commit `b60bfc5`

**Gate**: Tests pass, new builders integrated, behavior preserved

---

## Post-Implementation Validation

- [x] T067 Run final comprehensive test suite: `npm test` with coverage reporting
- [x] T068 Verify bundle size impact: Record bundle artifact sizes (e.g. `dist/` and packed tarball) and note any material change (measured: `dist/`=676KB, `npm pack` tarball=224KB)
- [x] T069 Verify no performance regression: Record `npm test` and `npm run build` execution times and note any material change (measured: `npm test` real=2.37s, `npm run build:types` real=0.53s)
- [x] T070 [P] Update CHANGELOG.md: Document builder API changes and new types
- [x] T071 Push branch: `git push origin refactor/004-finish-fluent-api`

**Gate**: All validation passes, ready for PR review

---

## Dependency Graph & Parallel Execution

### Must Execute Sequentially (Phase Dependencies)
1. **Phase 0** (baseline validation) → **Phase 3+4** (parsers + top-level)
2. **Phase 3+4** (tests passing with .text() calls) → **Phase 2** (builders)
3. **Phase 2** (union types ready) → **Phase 1** (new builders)

### Can Execute in Parallel Within Phase 3+4
- **Parser updates** (T013-T028): All independent, can run in parallel
  - Example parallel groups:
    - Group A: T013, T014, T015, T016 (simple parsers)
    - Group B: T017, T018, T023, T024 (enum/const/not/nullable)
    - Group C: T019, T020 (composition: object/array)
    - Group D: T021, T022, T025, T026, T027, T028 (complex: anyOf/oneOf/allOf/ifThenElse)

### Can Execute in Parallel Within Phase 2
- **Builder updates** (T037-T046): Independent, can parallelize
  - ObjectBuilder: T037, T038, T039
  - ArrayBuilder: T041, T042, T043

### Can Execute in Parallel Within Phase 1
- **Simple builders** (T049-T052): Fully independent
- **Composition builders** (T053-T057): Fully independent (once builders available)

---

## Implementation Notes

### Key Patterns

**Modifier Application (in parseSchema after Phase 3+4)**:
```typescript
const addDescribes = (schema: JsonSchemaObject, builder: BaseBuilder): BaseBuilder => {
  if (schema.description) {
    return builder.describe(schema.description);
  }
  return builder;
};
```

**Union Type Handling (in Phase 2 builders)**:
```typescript
class ObjectBuilder extends BaseBuilder {
  constructor(properties: Record<string, BaseBuilder | string> = {}) {
    super('');
    this._properties = properties;
  }

  text(): string {
    const props = Object.entries(this._properties)
      .map(([key, val]) => {
        const zodStr = typeof val === 'string' ? val : val.text();
        return `${JSON.stringify(key)}: ${zodStr}`;
      })
      .join(', ');
    // ... build and apply modifiers
  }
}
```

**New Builder Template (Phase 1)**:
```typescript
export class UnionBuilder extends BaseBuilder<UnionBuilder> {
  constructor(schemas: (BaseBuilder | string)[] = []) {
    const schemaStrings = schemas.map(s => typeof s === 'string' ? s : s.text());
    super(`z.union([${schemaStrings.join(', ')}])`);
  }
}
```

### Testing Strategy

**After Phase 3+4 completion**:
- `npm test` must show 104 passing tests
- Baseline output comparison: All generated strings must be byte-identical
- No test modifications allowed

**Rollback Condition**:
- If >5 tests fail, revert phase and debug before continuing
- If TypeScript strict mode fails, fix before proceeding

### TypeScript Strict Mode

All changes must pass `npm run build` with zero errors. No `any` types allowed.

---

## Task Summary by Complexity

| Complexity | Count | Tasks |
|-----------|-------|-------|
| Trivial (1-2 mins) | 6 | T001, T002, T003, T004, T032, T033 |
| Simple (5-10 mins) | 18 | T005, T006, T007-T009, T013-T018, T040, T047, T048 |
| Medium (15-30 mins) | 16 | T010-T012, T019-T020, T029-T031, T045-T046, T067 |
| Complex (30-60 mins) | 8 | T021-T025, T034, T035, T036 |

**Estimated Total Effort**: 24-30 hours (if executed sequentially with full testing)

---

## Success Checklist (Final Gate)

- [ ] ✅ All 104 tests passing (0 failures)
- [ ] ✅ TypeScript strict mode succeeds
- [ ] ✅ All 16 parsers return `BaseBuilder`
- [ ] ✅ All 11 existing builders accept `BaseBuilder | string`
- [ ] ✅ 9 new builders created and exported
- [ ] ✅ Generated output identical to baseline
- [ ] ✅ No performance regression
- [ ] ✅ Behavior snapshot matches
- [ ] ✅ Branch ready for PR review

---

*Tasks generated: December 15, 2025*
*Execution order: Phase 3+4 → Phase 2 → Phase 1*
*Ready for `/speckit.implement` to execute*
