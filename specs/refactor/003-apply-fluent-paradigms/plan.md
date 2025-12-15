# Implementation Plan: Fluent Zod-like Builders for ZodBuilder

**Branch**: `refactor/003-apply-fluent-paradigms` | **Date**: 2025-12-13 | **Completed**: 2025-12-14 | **Spec**: specs/refactor-003-apply-fluent-paradigms/refactor-spec.md
**Input**: Refactor specification to make ZodBuilder fluent and Zod-like

**Status**: ✅ COMPLETE - All builders implemented with BaseBuilder inheritance and Zod-like factory API

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Refactored internal builder surfaces to be fluent and match Zod chaining semantics. Implemented factory API (`build.number()`, `build.string()`, etc.) returning fluent builder instances that delegate to existing modifier logic. All builders extend `BaseBuilder<T>` for shared modifier methods. Parsers now use fluent builders instead of calling `apply*` helpers directly. All 107 tests passing with identical outputs - behavior completely preserved.

**Completed Implementation**:
- ✅ BaseBuilder<T> abstract class with 8 shared modifiers
- ✅ 8 concrete builder classes (Number, String, Array, Object, Boolean, Null, Enum, Const)
- ✅ Zod-like factory API: `build.number()`, `build.string()`, `build.array()`, etc.
- ✅ All parsers integrated with fluent builders
- ✅ 154 lines of duplicated code eliminated
- ✅ Lazy evaluation pattern: Builders store constraint metadata and defer code generation to `.text()` method
- ✅ Smart constraint merging: Multiple modifier calls intelligently merge (keeps strictest values)
- ✅ Explicit `.text()` unwrapping contract with `super.text()` delegation pattern
- ✅ ObjectBuilder.fromCode() for wrapping existing schemas

## Implementation Architecture

**Lazy Evaluation Pattern**:
All builders follow a consistent pattern where:
1. Constructor initializes `_baseText` with base schema (e.g., `"z.number()"`)
2. Modifier methods store constraint metadata in private fields (e.g., `_min`, `_max`, `_format`)
3. `.text()` method generates code by:
   - Applying type-specific constraints to `_baseText`
   - Updating `this._baseText` with result
   - Calling `super.text()` to apply shared modifiers from BaseBuilder
4. BaseBuilder.text() applies modifiers stored in its own fields (`_optional`, `_nullable`, etc.)

**Smart Constraint Merging**:
- Multiple calls to same modifier merge intelligently
- `.min(5).min(10)` → keeps strictest (10)
- `.max(20).max(15)` → keeps strictest (15)
- `.int().multipleOf(3)` → multipleOf implies int, no duplication

**Example Flow**:
```typescript
// User code:
build.number().int().max(10).optional()

// Step 1: build.number() creates NumberBuilder with _baseText="z.number()"
// Step 2: .int() sets _int=true, returns this
// Step 3: .max(10) sets _max={value:10, exclusive:false}, returns this
// Step 4: .optional() (from BaseBuilder) sets _optional=true, returns this
// Step 5: .text() called:
//   - NumberBuilder.text() applies _int and _max to "z.number()" → "z.number().int().max(10)"
//   - Sets this._baseText = "z.number().int().max(10)"
//   - Calls super.text()
//   - BaseBuilder.text() applies _optional → "z.number().int().max(10).optional()"
//   - Returns final string
```

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: TypeScript (strict mode)
**Primary Dependencies**: None at runtime; dev: vitest, oxlint; outputs target Zod API strings
**Storage**: N/A
**Testing**: vitest
**Target Platform**: Node.js library (ESM + CJS builds)
**Project Type**: Single library project
**Performance Goals**: Maintain current build and runtime performance (no regressions)
**Constraints**: Dual-module exports; CLI-first contract; behavior preservation
**Scale/Scope**: Internal refactor of builders and parser integration; broad parser coverage

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Parser Architecture: Preserve stateless parsers; builders used within parsers MUST NOT introduce side effects
- Dual-Module Export: No change to build outputs; ensure ESM/CJS remain identical
- CLI-First Contract: No CLI changes; outputs MUST remain identical
- Test-First Development: Baseline tests confirmed; add wrapper-specific tests if needed without changing assertions
- Type Safety & Zod Correctness: Generated code MUST remain valid and match JSON Schema semantics

**Status**: PASSED (Phase 0). Re-evaluate after Phase 1 design outputs.

Gates to enforce during implementation:
- Per-phase TDD: Before any code change in a phase, run tests and confirm green; after changes, rerun tests and compare outputs against snapshot
- ESM/CJS parity: Build both targets and verify `postesm.js`/`postcjs.js` outputs remain unchanged
- CLI parity: Run CLI with baseline sample schemas and verify outputs identical

## Project Structure

### Documentation (this feature)

```text
specs/refactor/003-apply-fluent-paradigms/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

**Implemented Structure**:

```text
src/
├── ZodBuilder/
│   ├── BaseBuilder.ts   # ✅ Abstract base class with shared modifiers
│   ├── index.ts         # ✅ Exports build factory + all builders
│   ├── number.ts        # ✅ NumberBuilder extends BaseBuilder<NumberBuilder>
│   ├── string.ts        # ✅ StringBuilder extends BaseBuilder<StringBuilder>
│   ├── array.ts         # ✅ ArrayBuilder extends BaseBuilder<ArrayBuilder>
│   ├── object.ts        # ✅ ObjectBuilder extends BaseBuilder<ObjectBuilder> + fromCode()
│   ├── boolean.ts       # ✅ BooleanBuilder extends BaseBuilder<BooleanBuilder>
│   ├── null.ts          # ✅ NullBuilder extends BaseBuilder<NullBuilder>
│   ├── enum.ts          # ✅ EnumBuilder extends BaseBuilder<EnumBuilder>
│   ├── const.ts         # ✅ ConstBuilder extends BaseBuilder<ConstBuilder>
│   └── modifiers.ts     # ✅ Shared modifier helpers (unchanged)
├── parsers/
│   ├── parseNumber.ts   # ✅ Uses build.number()
│   ├── parseString.ts   # ✅ Uses build.string()
│   ├── parseArray.ts    # ✅ Uses build.array()
│   ├── parseObject.ts   # ✅ Uses build.object() and ObjectBuilder.fromCode()
│   ├── parseBoolean.ts  # ✅ Uses build.boolean()
│   ├── parseNull.ts     # ✅ Uses build.null()
│   ├── parseEnum.ts     # ✅ Uses build.enum()
│   ├── parseConst.ts    # ✅ Uses build.literal()
│   └── ...
├── JsonSchema/
│   └── jsonSchemaToZod.ts
├── utils/
│   └── modifiers & helpers (unchanged)
└── index.ts

test/
├── parsers/
│   └── existing tests (all 107 tests passing unchanged)
└── integration/
    └── existing tests
```

**Structure Decision**: Single project; extend `src/ZodBuilder/*` to include fluent wrapper classes and update parsers to consume them while preserving outputs.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| N/A | — | — |
