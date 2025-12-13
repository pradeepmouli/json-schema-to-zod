# Implementation Plan: Migrate to Vitest, Oxfmt/Oxlint, and Ts-morph

**Branch**: `refactor/001-migrate-to-vitest` | **Date**: 2025-12-11 | **Spec**: `specs/refactor-001-migrate-to-vitest/refactor-spec.md`

## Summary

Refactor the project's tooling and build infrastructure to align with modern TypeScript/Node.js best practices and user's stated technology preferences. Migrate from Jest/ts-jest to Vitest for 2-5x faster test execution with native ESM support. Replace manual string-based code generation in `createIndex.ts` with ts-morph's AST builders for type-safe index generation. Codify formatting rules in `.oxfmtrc.json` and linting rules in `.oxlintrc.json` using Rust-based tools for 10-100x speed improvement. All changes preserve external behavior: CLI output, programmatic API, and module exports remain identical.

## Technical Context

**Language/Version**: TypeScript 5.2.2
**Primary Dependencies**: Zod 4.1.3, ts-morph 21.0.0, Vitest 1.0.0
**Storage**: N/A (pure transformation library)
**Testing**: Vitest (migrate from Jest/ts-jest)
**Target Platform**: Node.js (dual ESM/CJS exports)
**Project Type**: Single library + CLI tool
**Performance Goals**: Test execution 20-40% faster; build time maintained or improved
**Constraints**: No breaking changes to CLI or API; byte-identical generated code
**Scale/Scope**: 17 test files, ~30+ test cases, 14 parser modules

## Constitution Check

✅ **PASS** - No violations

The proposed refactoring is **fully aligned** with the json-schema-to-zod constitution:

### Core Principles Alignment
- **Principle I (Parser Architecture)**: ✅ No changes to parser structure; all parsers remain discrete, testable units
- **Principle II (Dual-Module Export)**: ✅ ESM/CJS structure preserved; Vitest supports both seamlessly
- **Principle III (CLI-First Contract)**: ✅ CLI behavior unchanged; Vitest can test both programmatic and CLI interfaces
- **Principle IV (Test-First)**: ✅ TDD enforced; all existing tests migrate as-is; Vitest is drop-in Jest replacement
- **Principle V (Type Safety)**: ✅ TypeScript strict mode maintained; ts-morph ensures type-safe AST generation

### Technology Stack Compliance
- **Language**: ✅ TypeScript (strict mode) maintained
- **Package Manager**: ✅ pnpm (no change needed)
- **Testing**: ✅ Jest → Vitest (explicit requirement from constitution + ts.instructions.md)
- **Linting**: ✅ None → oxlint (explicit requirement; constitution says oxlint MUST be used)
- **Formatting**: ✅ None → oxfmt (explicit requirement; constitution says oxfmt MUST be used)
- **Code Generation**: ✅ String concat → ts-morph (improves safety and maintainability)

### Code Organization Standards Compliance
- **Parsers**: ✅ `src/parsers/*.ts` unchanged; continue as pure, stateless functions
- **Utils**: ✅ `src/utils/*.ts` unchanged; continue as shared utilities
- **Types**: ✅ `src/Types.ts` unchanged; centralized type definitions preserved
- **CLI**: ✅ `src/cli.ts` unchanged; argument parsing unchanged
- **Tests**: ✅ Migrate `test/parsers/*.ts` to Vitest; glob discovery instead of manual imports
- **Index Generation**: ✅ `createIndex.ts` rewritten with ts-morph (safer, more maintainable)

### Governance Compliance
- **No principle violations**: All core principles remain satisfied
- **No external contract changes**: API, CLI, exports, schema generation unchanged
- **Behavior preservation**: Comprehensive behavioral snapshot documents key invariants

---

## Project Structure

### Documentation (this refactoring)

```text
specs/refactor-001-migrate-to-vitest/
├── refactor-spec.md          # Detailed refactor specification
├── behavioral-snapshot.md    # Key behaviors to preserve
├── metrics-before.md         # Baseline metrics (to be populated)
├── metrics-after.md          # Target metrics (to be populated)
└── plan.md                   # This file
```

### Source Code Changes

```text
# Existing Structure (PRESERVED)
src/
├── cli.ts                    # CLI entry point (UNCHANGED)
├── index.ts                  # Module exports (REGENERATED, content same)
├── jsonSchemaToZod.ts        # Core API (UNCHANGED)
├── Types.ts                  # Type definitions (UNCHANGED)
├── parsers/                  # All parser modules (UNCHANGED)
│   ├── parseAllOf.ts
│   ├── parseAnyOf.ts
│   ├── parseArray.ts
│   ├── ... (all parsers)
│   └── parseSchema.ts
└── utils/                    # Utility modules (UNCHANGED)
    ├── cliTools.ts           # CLI utilities (UNCHANGED)
    ├── half.ts               # Utility function (UNCHANGED)
    ├── jsdocs.ts             # JSDoc generation (UNCHANGED)
    ├── omit.ts               # Object utility (UNCHANGED)
    └── withMessage.ts        # Message utility (UNCHANGED)

test/
├── parsers/                  # Parser tests (MIGRATED to Vitest)
│   └── *.test.ts
└── *.test.ts                 # Integration tests (MIGRATED to Vitest)
    # NO MORE test/index.ts - replaced by Vitest glob discovery

# New Files (CREATED)
.oxfmtrc.json                 # oxfmt configuration
.oxlintrc.json                # oxlint configuration
vitest.config.ts              # Vitest configuration

# Modified Files (UPDATED)
createIndex.ts                # Rewrite with ts-morph (same output, safer implementation)
package.json                  # Update scripts, dependencies
jest.config.js                # DELETE (no longer needed)
test/index.ts                 # DELETE (replaced by Vitest discovery)
```

**Structure Decision**: Single library + CLI tool structure preserved. All changes are tooling/infrastructure layer; no source code restructuring required.

## Implementation Phases

### Phase 0: Setup & Validation

**Goal**: Establish baseline and prepare for refactoring.

**Tasks**:
1. ✅ Create refactor specification (refactor-spec.md)
2. ✅ Document behavioral snapshot (behavioral-snapshot.md)
3. ✅ Create this implementation plan
4. ⏳ Capture baseline metrics:
   - Test count and execution time
   - Current code generation output
   - Current tooling status
5. ⏳ Verify all tests pass in current state
6. ⏳ Create git tag: `pre-refactor-001`

**Gate**: All baseline metrics captured; 100% test pass rate confirmed.

---

### Phase 1: Tool Installation & Configuration

**Goal**: Install new tools and create configuration files without changing source code.

**Tasks**:

#### 1.1: Update package.json Dependencies
- Add `vitest`: ^1.0.0
- Add `ts-morph`: ^21.0.0
- Remove `ts-jest` (if separate from jest)
- Keep `typescript`, `zod`, all others unchanged

#### 1.2: Create Vitest Configuration
**File**: `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['test/**/*.test.ts'],
    exclude: ['dist', 'node_modules'],
    typecheck: {
      enabled: true,
      checker: 'tsc',
    },
  },
});
```

Rationale:
- `globals: true`: Matches current test style (no explicit imports of describe/it)
- `environment: 'node'`: Appropriate for Node.js library
- `include` glob: Discovers all .test.ts files under test/ directory
- `typecheck: enabled`: Ensures types are correct during test run

#### 1.3: Create Oxfmt Configuration
**File**: `.oxfmtrc.json`

```json
{
  "indentation": "Space",
  "indent_width": 2,
  "line_width": 120,
  "quotes": "Single",
  "trailing_comma": "None",
  "semicolon": true,
  "arrow_parens": "Always",
  "print_width": 120
}
```

Rationale: Aligns with user preferences from ts.instructions.md (2-space indent, single quotes, no trailing commas, semicolons).

#### 1.4: Create Oxlint Configuration
**File**: `.oxlintrc.json`

```json
{
  "env": {
    "node": true,
    "es2022": true
  },
  "extends": ["oxlint/recommended"],
  "rules": {
    "typescript/naming-convention": [
      "error",
      {
        "selector": "default",
        "format": ["camelCase"]
      },
      {
        "selector": "variable",
        "format": ["camelCase", "UPPER_CASE"]
      },
      {
        "selector": "typeLike",
        "format": ["PascalCase"]
      },
      {
        "selector": "objectLiteralProperty",
        "format": ["camelCase", "PascalCase"]
      }
    ]
  }
}
```

Rationale: Enforce naming conventions from constitution (camelCase functions, PascalCase types, etc.).

#### 1.5: Update package.json Scripts
**Changes**:
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:ui": "vitest --ui",
    "gen": "tsx ./createIndex.ts",
    "dev": "vitest --watch",
    "lint": "oxlint src/ test/",
    "format": "oxfmt --write src/ test/ *.ts",
    "format:check": "oxfmt --check src/ test/ *.ts"
  }
}
```

Rationale:
- `test`: Vitest run command (non-watch mode for CI)
- `test:watch` & `dev`: Watch mode for development
- `test:ui`: Visual dashboard (optional but useful)
- `lint` & `format`: New tooling commands
- `gen`: Unchanged (still uses tsx to run TypeScript script)

#### 1.6: Verify npm install completes
```bash
npm install
```

**Verification Gate**: All new packages installed; no conflicts or peer dependency warnings.

---

### Phase 2: Test Migration

**Goal**: Migrate existing tests to Vitest while preserving all assertions.

**Tasks**:

#### 2.1: Remove test/index.ts
- Delete `test/index.ts` (manual test imports)
- Rationale: Vitest's glob pattern (`include: ['test/**/*.test.ts']`) replaces manual imports

#### 2.2: Verify All Test Files Use Correct Extensions
- All test files must use `.test.ts` extension (not `.test.js`)
- Files to check:
  - ✅ `test/jsonSchemaToZod.test.ts`
  - ✅ `test/eval.test.ts`
  - ✅ `test/cli.ts` → rename to `test/cli.test.ts` (if it's a test file)
  - ✅ `test/suite.ts` → check if should be test file (rename if needed)
  - ✅ All files in `test/parsers/*.test.ts`
  - ✅ All files in `test/utils/*.test.ts`

#### 2.3: Update Test Imports (if needed)
Vitest should auto-detect globals (`describe`, `it`, `expect`), but verify:
- No tests import from `jest` module
- No tests use Jest-specific APIs (e.g., `jest.mock`, `jest.spyOn`)
- If any Jest mocks present, migrate to Vitest equivalents

#### 2.4: Run Test Suite
```bash
npm test
```

**Expected**: All tests pass; output shows Vitest results instead of Jest results.

**Verification Gate**: 100% test pass rate; all test assertions identical to pre-refactor baseline.

---

### Phase 3: Code Generation Refactoring

**Goal**: Rewrite createIndex.ts using ts-morph for type-safe AST-based generation.

**Tasks**:

#### 3.1: Understand Current createIndex.ts Behavior
Current implementation (33 lines):
- Recursively scans `src/` directory
- Ignores specific files: `src/index.ts`, `src/cli.ts`, `src/utils/cliTools.ts`
- For each `.ts` file: generates `export * from "./path/to/file.js"`
- Appends default export: `import { jsonSchemaToZod } from "./jsonSchemaToZod.js"; export default jsonSchemaToZod`

Output to `src/index.ts`.

#### 3.2: Design ts-morph Implementation
```typescript
import { Project, SourceFileStructure, StatementStructures } from 'ts-morph';

const project = new Project();
const sourceFile = project.createSourceFile('src/index.ts', '', { overwrite: true });

const ignore = ['src/index.ts', 'src/cli.ts', 'src/utils/cliTools.ts'];

// Step 1: Recursively find all .ts files (excluding ignored)
const filesToExport = findTsFiles('src', ignore);

// Step 2: For each file, add export statement
filesToExport.forEach(file => {
  sourceFile.addExportDeclaration({
    moduleSpecifier: importPath(file),
  });
});

// Step 3: Add default export
sourceFile.addImportDeclaration({
  moduleSpecifier: './jsonSchemaToZod.js',
  namedImports: ['jsonSchemaToZod'],
});
sourceFile.addExportAssignment({
  expression: 'jsonSchemaToZod',
  isExportEquals: false,
});

// Step 4: Format and save
sourceFile.formatText();
project.saveSync();
```

Rationale:
- **Type Safety**: AST builders prevent syntax errors; final output guaranteed valid
- **Maintainability**: Code is clearer; intent obvious (not string concat)
- **Consistency**: Output formatted by ts-morph; consistent style
- **Deterministic**: Same AST → same formatted output (idempotent)

#### 3.3: Implement ts-morph version
- Create new `createIndex.ts` using ts-morph
- Preserve same logic and file ignore list
- Verify output is deterministic (run twice; diff output)

#### 3.4: Verify Output Matches Previous
```bash
npm run gen
# Compare src/index.ts to pre-refactor snapshot
diff <(pre-refactor-output) <(npm run gen | cat src/index.ts)
```

**Expected**: Zero differences; byte-identical output.

#### 3.5: Update createIndex.ts in src/index.ts ignore list (if already ignored)
- Verify `src/index.ts` still NOT exported by createIndex.ts

**Verification Gate**: Generated `src/index.ts` byte-identical to pre-refactor; idempotent (run twice, same output).

---

### Phase 4: Linting & Formatting Integration

**Goal**: Apply new tooling to codebase and configure automation.

**Tasks**:

#### 4.1: Run oxlint Analysis
```bash
npm run lint
```

Expected: Some warnings/errors (likely naming, import ordering, etc.).

#### 4.2: Fix Critical Issues
- Address any linting errors that block compilation
- Use `oxlint --fix` if available, or manual fixes

#### 4.3: Run oxfmt to Format Code
```bash
npm run format
```

Expected: Code reformatted to match `.oxfmtrc.json` rules.

#### 4.4: Verify Tests Still Pass After Formatting
```bash
npm test
```

**Expected**: 100% pass rate (formatting should not change behavior).

#### 4.5: Commit Formatting Changes
```bash
git add -A
git commit -m "style: apply oxfmt and oxlint formatting"
```

**Verification Gate**: All tests pass post-formatting; linting warnings addressed or justified.

---

### Phase 5: Verification & Validation

**Goal**: Ensure all refactoring goals achieved; behavior preserved.

**Tasks**:

#### 5.1: Comprehensive Test Suite Run
```bash
npm test
```

**Expected**:
- All 17+ tests pass
- Zero test modifications needed
- Vitest execution time 20-40% faster than Jest baseline

#### 5.2: API Behavior Verification
- Generate schema with test inputs
- Compare CLI output to pre-refactor baseline
- Verify ESM/CJS exports work

**Test Command**:
```bash
# Test API
node -e "const { jsonSchemaToZod } = require('./dist/cjs/index.js'); console.log(jsonSchemaToZod({ type: 'string' }))"
# Test ESM
node --input-type=module -e "import { jsonSchemaToZod } from './dist/esm/index.js'; console.log(jsonSchemaToZod({ type: 'string' }))"
```

#### 5.3: Code Generation Verification
```bash
npm run gen
# Diff against baseline
diff /tmp/index.baseline.ts src/index.ts
```

**Expected**: Zero differences.

#### 5.4: CLI Verification
```bash
# Test file I/O
echo '{"type":"string"}' > /tmp/test.json
npm run build  # Build distribution
node dist/cjs/cli.js -i /tmp/test.json -o /tmp/output.ts
# Verify /tmp/output.ts contains valid TypeScript
```

#### 5.5: Behavioral Snapshot Validation
- Re-run all behavioral snapshot tests
- Verify outputs match pre-refactor baseline
- Document any expected differences (should be none)

#### 5.6: Capture Post-Refactoring Metrics
```bash
# Measure test execution time
npm test -- --reporter=verbose
# Compare to baseline
```

**Expected metrics**:
- Test count: ≥17 (no tests removed)
- Test pass rate: 100%
- Execution time: 20-40% improvement over Jest baseline
- Generated code: byte-identical
- CLI output: identical

**Verification Gate**: All behavioral snapshots validated; metrics targets met; zero breaking changes.

---

### Phase 6: Documentation & Cleanup

**Goal**: Update documentation and finalize refactoring.

**Tasks**:

#### 6.1: Delete Legacy Files
```bash
rm jest.config.js
rm test/index.ts  # Already removed in Phase 2
```

#### 6.2: Update README (if needed)
- Note: Testing now uses Vitest instead of Jest
- Mention: Code formatted with oxfmt; linted with oxlint
- Link to `.oxfmtrc.json` and `.oxlintrc.json` for configuration details

#### 6.3: Update Contributing.md (if needed)
- Specify: `npm test` runs Vitest
- Specify: `npm run format` uses oxfmt
- Specify: `npm run lint` uses oxlint
- Add: `npm run gen` regenerates index.ts with ts-morph

#### 6.4: Populate metrics-after.md
Document final metrics:
- Test execution time post-refactoring
- Any performance improvements observed
- Dependency count changes
- Summary of changes made

#### 6.5: Final git Commit
```bash
git add -A
git commit -m "refactor: migrate to vitest, oxfmt/oxlint, ts-morph

- Replace Jest/ts-jest with Vitest for 2-5x faster tests
- Rewrite createIndex.ts with ts-morph AST builders
- Add .oxfmtrc.json and .oxlintrc.json for code quality
- Update package.json scripts for new tooling
- Migrate test discovery to Vitest glob patterns
- All behavior preserved: API, CLI, module exports unchanged
- Test execution now 20-40% faster
- Code generation now type-safe via AST

Fixes constitution alignment gap (refs: vitest, oxlint, oxfmt requirements)"
```

#### 6.6: Create Release Notes (if applicable)
- Summarize refactoring goals and achievements
- Note: No API changes; purely internal tooling improvement
- Recommend users update their local dev environment

**Verification Gate**: Documentation updated; all cleanup completed; git history clean.

---

## Risk Mitigation Strategies

### Risk: Vitest Test Discovery Incomplete
**Mitigation**:
- Run `vitest --list` to verify all tests discovered
- Compare count to pre-refactor (must be ≥17)
- If missing: verify `.test.ts` extension; check glob pattern

### Risk: ts-morph Output Differs from Original
**Mitigation**:
- Byte-for-byte diff before/after
- If differs: adjust AST builder options (formatting, sorting, etc.)
- Keep original createIndex.ts as fallback

### Risk: Vitest Compatibility with ESM/CJS Exports
**Mitigation**:
- Test both `import` and `require()` syntax in test files
- Use Vitest's `environment: 'node'` setting
- If issues: pin Vitest version; check release notes for ESM support

### Risk: Oxlint/Oxfmt Compatibility Issues
**Mitigation**:
- Start with recommended preset (oxlint/recommended)
- If conflicts: disable specific rules in .oxlintrc.json
- Verify all tests pass after formatting

### Risk: Performance Degradation
**Mitigation**:
- Measure baseline execution time before refactoring
- Measure post-refactoring execution time
- If degraded >5%: investigate Vitest configuration (may need thread pooling tuning)

---

## Success Criteria

✅ **ALL of the following must be true for refactoring to be complete**:

1. **Test Suite**:
   - All tests pass in Vitest (100% pass rate)
   - Test count ≥17 (no tests removed)
   - All assertions unmodified (no weakened or removed)

2. **Code Generation**:
   - `npm run gen` produces byte-identical `src/index.ts`
   - Output is deterministic (idempotent)
   - All parser exports present; no spurious exports

3. **API Behavior**:
   - `jsonSchemaToZod(schema, options)` returns identical code strings
   - CLI output identical to pre-refactor baseline
   - Piped input/output unchanged
   - ESM and CJS exports available

4. **Tooling**:
   - Vitest configuration complete and working
   - oxfmt rules codified in `.oxfmtrc.json`
   - oxlint rules codified in `.oxlintrc.json`
   - All linting rules pass (or exceptions documented)

5. **Performance**:
   - Test execution ≥20% faster (or no regression)
   - Build time maintained or improved
   - No memory regression

6. **Documentation**:
   - Refactor spec complete and reviewed
   - Behavioral snapshot validated
   - Metrics captured (before/after)
   - README/CONTRIBUTING updated
   - Git history clean with meaningful commits

---

## Timeline Estimate

| Phase | Task | Duration |
|-------|------|----------|
| Phase 0 | Setup & validation | 30 min |
| Phase 1 | Tool installation & config | 1-2 hours |
| Phase 2 | Test migration | 1-2 hours |
| Phase 3 | Code generation refactor | 2-3 hours |
| Phase 4 | Linting & formatting | 1-2 hours |
| Phase 5 | Verification & validation | 1-2 hours |
| Phase 6 | Documentation & cleanup | 30-45 min |
| **Total** | | **7-13 hours** |

*Note: Estimates assume no major blockers; actual time may vary based on discovered issues.*

---

## Implementation Order (Critical)

**Execute phases in this order**; do NOT skip or reorder:

1. ✅ Phase 0: Setup & Validation (establish baseline)
2. ⏳ Phase 1: Tool Installation & Configuration (infrastructure ready)
3. ⏳ Phase 2: Test Migration (verify tests work in new framework)
4. ⏳ Phase 3: Code Generation Refactoring (update build process)
5. ⏳ Phase 4: Linting & Formatting Integration (apply tools)
6. ⏳ Phase 5: Verification & Validation (ensure goals met)
7. ⏳ Phase 6: Documentation & Cleanup (finalize)

**Why this order**:
- Phase 0 captures baseline; all subsequent phases measured against it
- Phase 1 installs dependencies; later phases require them
- Phase 2 moves tests to new framework; Phase 3 refactors generation
- Phase 4 applies tooling after code is stable
- Phase 5 validates everything works together
- Phase 6 is final cleanup

---

## Next Steps

To proceed with implementation:

1. Run `/speckit.tasks` to break down each phase into granular, actionable tasks
2. Follow task execution order strictly
3. After each task: run tests and verify no regressions
4. Upon completion: run `/speckit.validate` to verify all success criteria met

---

**Status**: ✅ Plan complete and ready for task breakdown
**Last Updated**: 2025-12-11
**Plan Version**: 1.0
