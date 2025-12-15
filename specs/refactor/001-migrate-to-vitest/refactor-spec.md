# Refactor Spec: Migrate to Vitest, Oxfmt/Oxlint, and Ts-morph

**Refactor ID**: refactor-001
**Branch**: `refactor/001-migrate-to-vitest`
**Created**: 2025-12-11
**Type**: ☑ Maintainability | ☑ Tech Debt
**Impact**: ☑ Medium Risk
**Status**: ☐ Planning | ☑ Baseline Captured | ☐ In Progress | ☐ Validation | ☐ Complete

## Input

User description: "migrate to vitest, oxfmt and oxlint and use ts-morph for code generation"

## Motivation

### Current State Problems

**Code Smell(s)**:

- ☑ Outdated testing framework (Jest/ts-jest vs modern Vitest ecosystem)
- ☑ Manual code generation script (`createIndex.ts`) using raw filesystem API instead of AST-based approach
- ☑ No consistent formatting enforcement (Prettier removed pre-v2; no replacement configured)
- ☑ No linting configuration (TypeScript compiler warnings only)
- ☑ Inconsistent with user's stated technology preferences (ts.instructions.md specifies vitest, oxlint, oxfmt)

**Concrete Examples**:

- `jest.config.js`: Still uses deprecated preset-based jest configuration
- `createIndex.ts` (lines 1-33): Hand-rolled string concatenation for code generation; no AST safety
- `test/index.ts`: Manual test import aggregation; difficult to maintain as tests grow
- No `.oxfmtrc.json` or `.oxlintrc.json`: Formatting and linting left to manual effort

### Business/Technical Justification

**Why NOW**:

- ☑ Blocking full alignment with constitution principles (Section: Technology Stack Requirements mandates vitest, oxlint, oxfmt)
- ☑ Developer velocity impact: Manual formatting overhead; no IDE hints for linting issues
- ☑ ts-morph adoption unlocks safer code generation patterns for future parser enhancements
- ☑ Vitest improves DX: faster test runs, better IDE integration, native ESM support
- ☑ Oxlint/oxfmt: Rust-based tooling provides 10-100x speed improvement vs JavaScript alternatives

## Proposed Improvement

### Refactoring Pattern/Technique

**Primary Technique**: Framework Replacement + Tool Migration + AST-Based Code Generation

**High-Level Approach**:

1. **Testing Framework**: Migrate from Jest/ts-jest to Vitest with native TypeScript support and ESM-first design
2. **Code Generation**: Rewrite `createIndex.ts` using ts-morph's AST builders for type-safe, maintainable index generation
3. **Formatting/Linting**: Replace missing formatter + add oxlint; create configuration files aligned with user preferences
4. **Test Structure**: Convert test runner from manual imports to Vitest's glob discovery pattern

**Files Affected**:

- **Modified**:
  - `package.json` (update scripts, dependencies)
  - `createIndex.ts` (rewrite with ts-morph)
  - `tsconfig.json` (optional: add test-specific settings if needed)
- **Created**:
  - `.oxfmtrc.json` (formatting rules: 2-space indent, single quotes, no trailing commas)
  - `.oxlintrc.json` (linting rules)
  - `vitest.config.ts` (test runner configuration)
- **Deleted**:
  - `jest.config.js` (no longer needed)
  - `test/index.ts` (replaced by Vitest glob discovery)

### Design Improvements

**Before**:

```
createIndex.ts (string concat) → index.ts (manual exports)
jest.config.js (preset-based) → test runner (ts-jest transpilation)
no formatting tool
no linting tool
test/index.ts (manual imports) → test runner
```

**After**:

```
createIndex.ts (ts-morph AST builder) → index.ts (generated with safety)
vitest.config.ts (native ESM + TS support) → test runner (native execution)
.oxfmtrc.json (formatting rules) → automated formatting
.oxlintrc.json (linting rules) → IDE integration + CI checks
vitest glob discovery → automatic test discovery
```

### Dependency Changes

**To Add**:

- `vitest`: ^1.0.0 (test framework)
- `ts-morph`: ^21.0.0 (AST manipulation)

**To Remove**:

- `ts-jest`: (no longer needed)

**To Keep**:

- `typescript`: (required for ts-morph source file operations)
- `zod`: (required for actual validation schemas)

## Baseline Metrics

_Captured before refactoring begins - see metrics-before.md_

### Code Complexity

- **Test Files**: 17 test files in `test/` directory
- **Duplication**: Manual imports in `test/index.ts` and `src/index.ts` partially duplicated logic
- **Code Generation**: `createIndex.ts` is 33 lines of string manipulation

### Test Coverage

- **Test Framework**: Jest/ts-jest (baseline will be captured before migration)
- **Test Count**: ~30+ test cases across parser tests
- **Execution Time**: Baseline will be measured before migration

### Build/Tool Performance

- **Build Time**: Baseline to be captured
- **No formatting/linting**: Currently manual process

### Dependencies

- **Test Dependencies**: ts-jest, @types/jest (if present), jest
- **Build Dependencies**: typescript, tsx
- **Runtime Dependencies**: zod, @types/json-schema, @types/node (dev)

## Target Metrics

_Goals to achieve - measurable success criteria_

### Code Quality Goals

- ☑ All 17+ test files automatically discovered and executed by Vitest
- ☑ `createIndex.ts` rewritten with ts-morph AST builders (type-safe index generation)
- ☑ Formatting rules codified in `.oxfmtrc.json`
- ☑ Linting rules codified in `.oxlintrc.json`
- ☑ Consistent import ordering and code style enforced
- ☑ Test file count remains ≥17 (no tests removed)
- ☑ All tests pass without modification to test assertions

### Performance Goals

- ☑ Build time: Maintain or improve (Vitest typically 2-5x faster than Jest for TS projects)
- ☑ Test execution: Expect 20-40% speedup via Vitest's native ESM + parallelization
- ☑ Code generation: createIndex.ts execution time maintained or improved

### Success Threshold

**Minimum acceptable improvement**:

- ✓ All existing tests pass unmodified in Vitest
- ✓ `npm run gen` produces identical output to current implementation
- ✓ Code formatting and linting rules are consistently applied
- ✓ Build process completes without errors
- ✓ No breaking changes to CLI or programmatic API

## Behavior Preservation Guarantee

_CRITICAL: Refactoring MUST NOT change external behavior_

### External Contracts Unchanged

- ☑ API functions return same output (jsonSchemaToZod() behavior identical)
- ☑ CLI arguments and flags unchanged (`--input`, `--output`, `--name`, etc.)
- ☑ CLI output format unchanged (generated TypeScript code quality equivalent)
- ☑ Module exports unchanged (ESM and CJS exports identical)
- ☑ Package.json exports field unchanged (dual entry points preserved)

### Test Suite Validation

- ☑ **All existing tests MUST pass WITHOUT modification to assertions**
- ☑ Test discovery must be automatic (Vitest glob pattern)
- ☑ Test execution order independent (no hidden test dependencies)
- ☑ Test output format may change (Vitest reporter vs Jest) but results identical

### Behavioral Snapshot

**Key behaviors to preserve**:

1. `jsonSchemaToZod(schema, options)` produces identical TypeScript code strings for all inputs
2. CLI invocation `json-schema-to-zod -i input.json -o output.ts` generates identical output files
3. Piped input `cat schema.json | json-schema-to-zod` produces identical results
4. Module exports (both ESM and CJS) export identical set of functions and types
5. `npm run gen` produces identical `src/index.ts` file (idempotent)

**Test**:

- Run all tests before/after refactoring; output diff must show zero functional differences
- Generate same schema with both pre/post-refactor builds; generated code must match
- Verify CLI output identical for test cases

## Risk Assessment

### Risk Level Justification

**Why Medium Risk**:

- **Positive factors** (lower risk):
  - ✓ Test-first approach ensures behavior preservation
  - ✓ Vitest is stable, well-adopted (drop-in Jest replacement)
  - ✓ ts-morph is mature library (used by TypeScript ecosystem tools)
  - ✓ No runtime behavior changes; pure tooling/build layer
  - ✓ ESM support in Vitest aligns with existing tsconfig targets

- **Negative factors** (increase risk):
  - ✗ createIndex.ts rewrite: if ts-morph AST generation differs, output may change
  - ✗ Test discovery pattern changes: must verify all test files are discovered
  - ✗ Tool configuration new to project: oxlint/oxfmt not yet in use
  - ✗ Dual ESM/CJS exports: must verify Vitest handles both correctly

### Mitigation Strategy

1. **Verify test discovery**: Run `vitest --list` before/after to confirm all tests found
2. **Compare generated output**: Byte-for-byte diff of `src/index.ts` before/after `npm run gen`
3. **Integration test**: Rebuild both versions; diff compiled CLI output on standard test inputs
4. **Incremental validation**: Migrate test framework first, then code generation, then tools
5. **Rollback plan**: Keep git history; if major issues, revert to last stable commit

## Next Steps

1. **Capture baseline metrics** (before any code changes):

   ```bash
   .specify/extensions/workflows/refactor/measure-metrics.sh --before
   ```

2. **Create implementation plan**:

   ```bash
   /speckit.plan
   ```

3. **Break down into granular tasks**:

   ```bash
   /speckit.tasks
   ```

4. **Execute refactoring** in order:

   ```bash
   /speckit.implement
   ```

5. **Validate behavior preservation**:
   - Run full test suite
   - Generate schema and diff output
   - Verify CLI on test data
   - Commit with message: `refactor: migrate to vitest, oxfmt/oxlint, ts-morph`

---

**Status**: Ready for baseline metrics capture and planning phase
