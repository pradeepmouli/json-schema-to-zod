# Implementation Plan: Fluent Builder API Refactoring

**Branch**: `refactor/004-finish-fluent-api` | **Date**: December 15, 2025 | **Spec**: [refactor-spec.md](refactor-spec.md)
**Input**: Refactoring specification for fluent builder API completion - parsers emit builders, builders compose builders, lazy string generation

## Summary

Complete the fluent builder API by transforming the hybrid string/builder system into a pure builder-based architecture. All parsers will emit `BaseBuilder` instances (not strings), all builders will compose other builders (not string concatenation), and string generation will be deferred to the final `.text()` call. This eliminates tight coupling, enables proper composition, and provides type safety for schema transformations.

**Key Decisions from Clarification Session**:
- Q1: Modifiers applied at BaseBuilder level in parseSchema via method chaining
- Q2: Phase 2/3 transition via union types `BaseBuilder | string` for backward compatibility
- Q3: Phases reordered (3+4 combined first) to keep tests passing throughout refactoring

## Technical Context

**Language/Version**: TypeScript 5.x with strict mode
**Primary Dependencies**: Zod (peer), Commander (CLI), no new dependencies added
**Testing**: Vitest 4.0+ (migrated from tsx test runner)
**Target Platform**: Node.js 18+, dual ESM/CJS exports
**Project Type**: Dual-module library (ESM + CJS) with CLI
**Performance Goals**: No regression in build/test times, bundle size <5% increase acceptable for type safety
**Constraints**: All existing tests must pass without modification, generated output must be byte-identical to baseline
**Scale/Scope**: 27 files affected (16 parsers + 11 builders), 9 new builders to create, ~100 tests to validate

## Constitution Check

✅ **Parser Architecture**: Parsers remain discrete modules (returns BaseBuilder instead of string)
✅ **Dual-Module Export**: No changes to build system (builders work with both ESM/CJS)
✅ **CLI-First Contract**: CLI behavior unchanged (top-level .text() call handles conversion)
✅ **Test-First Development**: All tests pass without modification during refactoring
✅ **Type Safety & Zod Correctness**: **ENHANCED** - This refactoring strengthens Principle V by enabling compile-time type validation of builder compositions. TypeScript can now validate that builders compose correctly (e.g., ObjectBuilder accepts Record<string, BaseBuilder>) whereas string concatenation had no type safety.
✅ **Technology Stack**: TypeScript strict mode, vitest, no new dependencies
✅ **Code Organization**: Builders stay in `src/ZodBuilder/`, parsers in `src/parsers/`

**Gate Status**: ✅ PASS - No constitutional violations. Refactoring strengthens type safety (Principle V enhancement) and code organization.

## Project Structure

### Documentation (this feature)

```text
specs/refactor/004-finish-fluent-api/
├── spec.md              # ✅ Refactoring specification (complete)
├── refactor-spec.md     # ✅ Full refactor spec with phases (complete)
├── plan.md              # ✅ This file (implementation plan)
├── research.md          # ⏭️ To be created (Phase 0)
├── data-model.md        # ⏭️ To be created (Phase 1)
├── quickstart.md        # ⏭️ To be created (Phase 1)
├── metrics-before.md    # ✅ Baseline metrics (captured)
├── behavioral-snapshot.md # ✅ Behavior preservation checklist (created)
└── contracts/           # ⏭️ To be created (Phase 1)
```

### Source Code (repository root)

```text
src/
├── parsers/             # 16 existing parser files (all return BaseBuilder in Phase 3+4)
│   ├── parseSchema.ts        # Central router + modifier application
│   ├── parseObject.ts        # Returns ObjectBuilder
│   ├── parseArray.ts         # Returns ArrayBuilder
│   ├── parseAnyOf.ts         # Returns UnionBuilder (after Phase 1)
│   ├── parseOneOf.ts         # Returns DiscriminatedUnionBuilder (after Phase 1)
│   └── ... (10 more parsers)
│
├── ZodBuilder/          # Builders: 11 existing + 9 new to create
│   ├── BaseBuilder.ts        # Abstract base (enhanced in Phase 2)
│   ├── object.ts             # ObjectBuilder (accepts Record<string, BuilderInput> in Phase 2)
│   ├── array.ts              # ArrayBuilder (accepts BuilderInput in Phase 2)
│   ├── string.ts             # StringBuilder
│   ├── number.ts             # NumberBuilder
│   ├── boolean.ts            # BooleanBuilder
│   ├── null.ts               # NullBuilder
│   ├── const.ts              # ConstBuilder
│   ├── enum.ts               # EnumBuilder
│   ├── modifiers.ts          # Modifier helpers
│   ├── index.ts              # Exports
│   │
│   ├── union.ts              # ⏭️ NEW: UnionBuilder (Phase 1)
│   ├── intersection.ts       # ⏭️ NEW: IntersectionBuilder (Phase 1)
│   ├── discriminatedUnion.ts # ⏭️ NEW: DiscriminatedUnionBuilder (Phase 1)
│   ├── any.ts                # ⏭️ NEW: AnyBuilder (Phase 1)
│   ├── never.ts              # ⏭️ NEW: NeverBuilder (Phase 1)
│   ├── unknown.ts            # ⏭️ NEW: UnknownBuilder (Phase 1)
│   ├── literal.ts            # ⏭️ NEW: LiteralBuilder (Phase 1)
│   ├── tuple.ts              # ⏭️ NEW: TupleBuilder (Phase 1)
│   └── record.ts             # ⏭️ NEW: RecordBuilder (Phase 1)
│
├── Types.ts             # ParserSelector type updates (Phase 3+4)
├── jsonSchemaToZod.ts   # Top-level function (.text() call in Phase 3+4)
├── index.ts             # Main export
├── cli.ts               # CLI handling
└── JsonSchema/
    └── jsonSchemaToZod.ts # JSON Schema-specific wrapper

test/
├── parsers/             # Parser tests (all pass throughout)
├── jsonSchemaToZod.test.ts
├── cli.test.ts
├── eval.test.ts         # Validates generated code works
└── ... (15 test files total, 104 tests)
```

**Structure Decision**: The existing single-project structure is retained. This is a **refactoring** (code restructuring, not feature addition), so no new project directories are created. All changes are localized within `src/parsers/` and `src/ZodBuilder/` with updates to `src/Types.ts` and entry points.

## Parser→Builder Mapping Table

This table defines which parsers will use which builder types after all phases complete:

| Parser | Current Return Type | Phase 3+4 Target | Phase 1 Final Target | Notes |
|--------|---------------------|------------------|---------------------|-------|
| parseString | `builder.text()` (string) | `builder` (StringBuilder) | Same | Remove `.text()` call |
| parseNumber | `builder.text()` (string) | `builder` (NumberBuilder) | Same | Remove `.text()` call |
| parseBoolean | `builder.text()` (string) | `builder` (BooleanBuilder) | Same | Remove `.text()` call |
| parseNull | `builder.text()` (string) | `builder` (NullBuilder) | Same | Remove `.text()` call |
| parseEnum | `builder.text()` (string) | `builder` (EnumBuilder) | Same | Remove `.text()` call |
| parseConst | `builder.text()` (string) | `builder` (ConstBuilder) | Same | Remove `.text()` call |
| parseObject | `build.object().text()` (string) | `build.object()` (ObjectBuilder) | Same | Remove `.text()` call |
| parseArray | `builder.text()` (string) | `builder` (ArrayBuilder) | Same | Remove `.text()` call |
| **parseAnyOf** | String template | String template | **UnionBuilder** | Phase 1 replaces template |
| **parseOneOf** | String template | String template | **Custom superRefine** | Complex validation, may not use builder |
| **parseAllOf** | String template | String template | **IntersectionBuilder** | Phase 1 replaces template |
| parseNot | `builder.text()` (string) | `builder` (BaseBuilder) | Same | Remove `.text()` call |
| parseNullable | `builder.text()` (string) | `builder.nullable()` | Same | Modifier application |
| parseMultipleType | Recursive parseSchema | Recursive → builder | Same | Inherits from recursive call |
| parseIfThenElse | String template | String template | **Conditional builder** | Complex logic, custom handling |
| parseDefault | `builder.text()` (string) | `builder.default()` | Same | Modifier application |

**Key Insights**:
- **Phase 3+4**: Parsers that already use builders simply remove `.text()` calls
- **Phase 1**: Parsers with string templates (anyOf, allOf) get proper builders
- **Special cases**: parseOneOf uses complex superRefine validation, may remain string-based

## Implementation Phases (Reordered per Clarification #3)

### Phase 3+4 COMBINED: Update Parsers & Top-Level Functions (First)

**Why First**: Ensures tests pass immediately after changes. Parsers return builders, top-level functions call `.text()` on results.

**Changes**:
1. **src/Types.ts**:
   - Update `ParserSelector` type: `(schema: JsonSchema, refs: Refs) => BaseBuilder` (was `=> string`)

2. **src/parsers/parseSchema.ts** (Main refactoring):
   - Change return type: `BaseBuilder` (was `string`)
   - Update `addDescribes()`: call `builder.describe(description)` instead of concatenating string
   - Update `addDefaults()`: call `builder.default(value)` instead of concatenating string
   - Update `addAnnotations()`: call `builder.readonly()` instead of concatenating string
   - Return builder from parseSchema (no `.text()` call)

3. **src/parsers/*.ts** (All 15 parser files):
   - Each parser changed to return builder instead of string
   - Examples:
     - `parseString.ts`: return `builder.text()` → return `builder` (no .text())
     - `parseObject.ts`: return `build.object(properties).text()` → return `build.object(properties)`
     - `parseArray.ts`: return builder (not string)
     - `parseAnyOf.ts`: return `UnionBuilder` instead of template string

4. **src/jsonSchemaToZod.ts**:
   - Wrap result with `.text()`: `const result = parseSchema(...); return result.text();`

5. **src/cli.ts**:
   - Handle builder return from parseSchema with `.text()` call

6. **src/JsonSchema/jsonSchemaToZod.ts**:
   - Add `.text()` call on builder result

**Test Impact**: Tests pass immediately because top-level functions call `.text()`, converting builders back to strings.

### Phase 2: Update Builders to Accept Builders (Second)

**Why Second**: All parsers and top-level already updated. Now builders can be improved.

**Changes**:
1. **src/ZodBuilder/object.ts**:
   - Constructor: `properties: Record<string, BaseBuilder | string>`
   - buildObject helper: handle both types `typeof val === 'string' ? val : val.text()`

2. **src/ZodBuilder/array.ts**:
   - Constructor: `itemSchema: BaseBuilder | string`
   - Internal logic: `const baseText = typeof itemSchema === 'string' ? itemSchema : itemSchema.text()`

3. **src/ZodBuilder/union.ts** (if created in Phase 1):
   - Constructor: `schemas: (BaseBuilder | string)[]`
   - buildUnion: map over schemas and extract strings

4. **src/ZodBuilder/modifiers.ts**:
   - Update helper functions to accept union types

**Test Impact**: Tests continue passing. Union types allow backward compatibility while allowing parsers to start passing builders (which they now do from Phase 3+4).

### Phase 1: Add Missing Builder Types (Final)

**Why Final**: Infrastructure ready, all existing code updated. New builders integrate seamlessly.

**Create 9 New Builders**:
1. **src/ZodBuilder/union.ts**:
   ```typescript
   class UnionBuilder extends BaseBuilder<UnionBuilder> {
     constructor(schemas: (BaseBuilder | string)[] = []) { ... }
   }
   ```

2. **src/ZodBuilder/intersection.ts**:
   ```typescript
   class IntersectionBuilder extends BaseBuilder<IntersectionBuilder> {
     constructor(schemas: (BaseBuilder | string)[] = []) { ... }
   }
   ```

3. **src/ZodBuilder/discriminatedUnion.ts**:
   ```typescript
   class DiscriminatedUnionBuilder extends BaseBuilder<DiscriminatedUnionBuilder> {
     constructor(discriminator: string, options: Record<string, BaseBuilder | string>) { ... }
   }
   ```

4. **src/ZodBuilder/any.ts**:
   ```typescript
   class AnyBuilder extends BaseBuilder<AnyBuilder> {
     constructor() { super('z.any()'); }
   }
   ```

5. **src/ZodBuilder/never.ts**:
   ```typescript
   class NeverBuilder extends BaseBuilder<NeverBuilder> {
     constructor() { super('z.never()'); }
   }
   ```

6. **src/ZodBuilder/unknown.ts**:
   ```typescript
   class UnknownBuilder extends BaseBuilder<UnknownBuilder> {
     constructor() { super('z.unknown()'); }
   }
   ```

7. **src/ZodBuilder/literal.ts**:
   ```typescript
   class LiteralBuilder extends BaseBuilder<LiteralBuilder> {
     constructor(value: any) { super(`z.literal(${JSON.stringify(value)})`); }
   }
   ```

8. **src/ZodBuilder/tuple.ts**:
   ```typescript
   class TupleBuilder extends BaseBuilder<TupleBuilder> {
     constructor(items: (BaseBuilder | string)[]) { ... }
   }
   ```

9. **src/ZodBuilder/record.ts**:
   ```typescript
   class RecordBuilder extends BaseBuilder<RecordBuilder> {
     constructor(keySchema: BaseBuilder | string, valueSchema: BaseBuilder | string) { ... }
   }
   ```

**Update src/ZodBuilder/index.ts**: Export all 9 new builders

**Test Impact**: Tests pass. Parsers can now return proper builders (e.g., parseAnyOf returns UnionBuilder instead of template string).

## Research Phase (Phase 0)

**Deliverable**: `research.md` (to be created during execution)

**Topics to Research** (if any clarifications remain):
- ✅ Modifier application strategy (resolved: centralized in parseSchema)
- ✅ Union type transition (resolved: use BaseBuilder | string)
- ✅ Phase ordering (resolved: 3+4 first, then 2, then 1)

**No further research needed** - all critical decisions documented in refactor-spec.md Clarifications section.

## Design Phase (Phase 1 - Executed as Implementation)

**Deliverables**:
- ✅ `data-model.md` - Builder class hierarchy and interfaces (from refactor-spec.md Design Improvements)
- ✅ `contracts/` directory - Builder API contracts (from BaseBuilder definition)
- ✅ `quickstart.md` - Usage examples of new builder API

See refactor-spec.md for complete design.

## Validation Strategy

### Continuous Testing
- After each phase: `npm test` must show 0 failures
- After Phase 3+4: All 104 tests pass
- After Phase 2: All 104 tests pass
- After Phase 1: All 104 tests pass

### Behavior Preservation
- Generated Zod code strings must be byte-identical to baseline
- Modifier order preserved (.describe → .default → .readonly)
- Edge cases (empty objects, nullable, optional) handled identically

### Type Validation
- `npm run build` must succeed with TypeScript strict mode
- No `any` types introduced
- ParserSelector type correctly typed as `() => BaseBuilder`

## Rollback Triggers

Revert branch if:
- ❌ TypeScript compilation fails and can't be fixed
- ❌ >5 tests fail after any phase
- ❌ Generated code differs from baseline by >10%
- ❌ Performance degradation >10%

Otherwise: Accept changes and proceed to next phase.

## Success Criteria (Gate for Completion)

✅ All parsers return `BaseBuilder` (not string)
✅ All builders accept `BaseBuilder | string` inputs (union types)
✅ 9 new builders created and exported
✅ All 104 existing tests pass without modification
✅ Generated output strings identical to baseline
✅ TypeScript strict mode compilation succeeds
✅ No performance regression (build/test times stable)
✅ Behavior snapshot matches (all key behaviors preserved)

## Next Steps

1. ⏭️ Create `research.md` (none needed - clarifications complete)
2. ⏭️ Create `data-model.md` with builder class hierarchy
3. ⏭️ Create `contracts/builder-api.md` with interface specifications
4. ⏭️ Create `quickstart.md` with usage examples
5. ⏭️ Run `/speckit.tasks` to break down into concrete tasks
6. ⏭️ Run `/speckit.implement` to execute phases in order

---

*Implementation plan created: December 15, 2025*
*Reordered phases based on Clarification #3 (test validation strategy)*
*Ready for task generation and implementation*
