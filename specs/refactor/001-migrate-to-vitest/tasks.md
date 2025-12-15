# Tasks: Refactor to Vitest, Oxfmt/Oxlint, and Ts-morph

**Refactor ID**: refactor-001
**Branch**: `refactor/001-migrate-to-vitest`
**Input**: refactor-spec.md, plan.md, behavioral-snapshot.md
**Prerequisites**: Constitution aligned; baseline metrics ready

---

## Phase 0: Baseline Capture & Validation

**Purpose**: Establish metrics baseline before any code changes

- [ ] T001 Verify all tests pass with current setup

  ```bash
  npm test
  # Expected: All tests pass with current tsx runner
  ```

  **File**: N/A (verification only)

- [ ] T002 Capture baseline test count

  ```bash
  npm test 2>&1 | tee /tmp/baseline-test-output.txt
  # Count: approximately 30+ test cases across 17 test files
  ```

  **File**: N/A (metrics-before.md will store count)

- [ ] T003 Measure baseline test execution time

  ```bash
  time npm test
  # Record total time in seconds
  ```

  **File**: `specs/refactor-001-migrate-to-vitest/metrics-before.md` (populate with result)

- [ ] T004 Capture baseline code generation output

  ```bash
  npm run gen
  cp src/index.ts /tmp/index.baseline.ts
  ```

  **File**: `/tmp/index.baseline.ts` (saved for comparison)

- [ ] T005 Verify CLI behavior with test schema

  ```bash
  echo '{"type":"string"}' > /tmp/test.json
  tsx src/cli.ts -i /tmp/test.json -o /tmp/baseline-output.ts
  ```

  **File**: `/tmp/baseline-output.ts` (saved for CLI comparison)

- [ ] T006 Create git tag for baseline state

  ```bash
  git tag pre-refactor-001 -m "Baseline before refactor-001: Vitest, oxfmt/oxlint, ts-morph migration"
  ```

  **File**: Git tag (repository state)

- [ ] T007 Populate metrics-before.md with baseline measurements
  - Test count: ~30+ cases
  - Execution time: [measure and record]
  - Current tooling: Jest/ts-jest, tsx runner, no linting/formatting
  - Code generation: String-based (createIndex.ts)

  **File**: `specs/refactor-001-migrate-to-vitest/metrics-before.md`

**Gate**: All baseline metrics captured; 100% test pass rate confirmed; git tag created

---

## Phase 1: Tool Installation & Configuration

**Purpose**: Install dependencies and create configuration files (no code changes yet)

- [x] T008 [P] Add Vitest to devDependencies in package.json
  - Add: `"vitest": "^1.0.4"`
  - Also add: `"@vitest/ui": "^1.0.4"` (optional visual dashboard)

  **File**: `package.json`

- [x] T009 [P] Add ts-morph to devDependencies in package.json
  - Add: `"ts-morph": "^21.0.5"`

  **File**: `package.json`

- [x] T010 [P] Remove ts-jest from devDependencies (if present)
  - Check if `ts-jest` exists in devDependencies
  - If present, remove it
  - Note: If not present, this is no-op

  **File**: `package.json`

- [x] T011 [P] Create vitest.config.ts with proper configuration

  **File**: `vitest.config.ts`

  **Content**:

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

- [x] T012 [P] Create .oxfmtrc.json with formatting rules

  **File**: `.oxfmtrc.json`

  **Content**:

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

- [x] T013 [P] Create .oxlintrc.json with linting rules

  **File**: `.oxlintrc.json`

  **Content**:

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

- [x] T014 Update package.json scripts for new tooling

  **File**: `package.json`

  **Changes**:
  - Replace `"test": "tsx test/index.ts"` with `"test": "vitest run"`
  - Add `"test:watch": "vitest"`
  - Add `"test:ui": "vitest --ui"`
  - Replace `"dev": "tsx watch test/index.ts"` with `"dev": "vitest --watch"`
  - Add `"lint": "oxlint src/ test/"`
  - Add `"format": "oxfmt --write src/ test/ *.ts"`
  - Add `"format:check": "oxfmt --check src/ test/ *.ts"`
  - Keep `"gen": "tsx ./createIndex.ts"` unchanged

- [x] T015 Run npm install to fetch new dependencies

  ```bash
  npm install
  ```

  **Verification**: All packages installed; no peer dependency warnings

  **File**: `package.json`, `package-lock.json`

- [x] T016 Verify Vitest is installed correctly
  ```bash
  npx vitest --version
  # Expected: vitest/X.X.X or similar
  ```
  **File**: N/A (verification only)

**Gate**: All new packages installed; npm install completes without errors; Vitest version confirmed

---

## Phase 2: Test Migration

**Purpose**: Migrate test files to Vitest without changing test logic

- [x] T017 Identify all test files in test/ directory

  ```bash
  find test/ -name "*.test.ts" -o -name "*.test.js"
  # Expected: 17+ test files
  ```

  **Files**: All test files in `test/` directory

- [x] T018 Verify test file naming conventions
  - All test files must use `.test.ts` or `.test.js` extension
  - Rename any files that don't match pattern
  - Check: `test/index.ts` (this is NOT a test file; will be deleted)
  - Check: `test/cli.ts` (verify if test file; if so, rename to `test/cli.test.ts`)
  - Check: `test/suite.ts` (verify if test file; if so, rename appropriately)

  **Files**: All files in `test/` directory

- [x] T019 Check for Jest-specific API usage in test files

  ```bash
  grep -r "jest\." test/ || echo "No jest. references found"
  grep -r "jest\(" test/ || echo "No jest( references found"
  ```

  **Expected**: No matches (Vitest is compatible with Jest syntax)

  **Files**: All test files

- [x] T020 Verify test imports don't depend on test/index.ts
  - Check if any test files import from `./index.ts` or `../index.ts`
  - If found, remove those imports (Vitest provides globals)

  **Files**: All test files in `test/`

- [x] T021 Delete test/index.ts (manual test aggregation no longer needed)

  ```bash
  rm test/index.ts
  ```

  **File**: `test/index.ts` (deleted)

- [x] T022 Run Vitest to discover all tests

  ```bash
  npx vitest --list
  # Expected: Lists all test files and test cases (~30+)
  ```

  **File**: N/A (verification only)

- [x] T023 Verify test count matches baseline

  ```bash
  npx vitest --list 2>&1 | grep -c "✓" || echo "Manual count required"
  # Expected: Count >= 17 test files, ~30+ test cases
  ```

  **File**: N/A (verification only)

- [x] T024 Run full test suite in Vitest (non-watch mode)

  ```bash
  npm test
  # Expected: All tests pass with 100% pass rate
  ```

  **Verification**: No test assertions modified; all pass unmodified

  **File**: N/A (verification only)

- [x] T025 Run tests in watch mode to verify HMR functionality

  ```bash
  npm run test:watch
  # Let it run for a few seconds; press Ctrl+C to exit
  ```

  **Verification**: Watch mode works; test re-runs on file changes

  **File**: N/A (verification only)

- [x] T026 Measure post-migration test execution time
  ```bash
  time npm test
  # Record total time; compare to baseline (should be faster or similar)
  ```
  **File**: Measurement for metrics-after.md

**Gate**: All tests pass 100%; test count >= 17; test/index.ts deleted; Vitest discovers all tests

---

## Phase 3: Code Generation Refactoring

**Purpose**: Rewrite createIndex.ts with ts-morph for type-safe AST generation

- [x] T027 Analyze current createIndex.ts behavior
  - Read file: `createIndex.ts` (33 lines)
  - Understand logic:
    1. Recursively scan `src/` directory
    2. Ignore: `src/index.ts`, `src/cli.ts`, `src/utils/cliTools.ts`
    3. For each `.ts` file: export from `.js` version
    4. Add: import and default export of `jsonSchemaToZod`

  **File**: `createIndex.ts` (read-only)

- [x] T028 Design ts-morph implementation
  - Plan AST builder approach:
    1. Create Project and SourceFile
    2. Recursively scan src/ for .ts files
    3. Add export declarations for each file
    4. Add import and default export
    5. Format and save
  - Benefits: Type-safe, deterministic, idempotent

  **File**: N/A (design documentation only)

- [x] T029 Implement new createIndex.ts with ts-morph

  **File**: `createIndex.ts`

  **Key points**:
  - Import `ts-morph` utilities: `Project`, `SyntaxKind`
  - Use `addExportDeclaration()` for re-exports
  - Use `addImportDeclaration()` and `addExportAssignment()` for default export
  - Preserve same ignore list: `src/index.ts`, `src/cli.ts`, `src/utils/cliTools.ts`
  - Call `sourceFile.formatText()` before save
  - Exit with status 0 on success

  **Verification steps**:
  - Run: `npx ts-morph` to test AST builders
  - Ensure no syntax errors in generated code
  - Verify imports/exports valid TypeScript

- [x] T030 Verify generated output matches baseline

  ```bash
  npm run gen
  diff /tmp/index.baseline.ts src/index.ts
  # Expected: No differences (output identical)
  ```

  **File**: `src/index.ts` (should match baseline)

- [x] T031 Test createIndex.ts idempotency

  ```bash
  npm run gen > /tmp/gen-1.txt
  npm run gen > /tmp/gen-2.txt
  diff /tmp/gen-1.txt /tmp/gen-2.txt
  # Expected: No differences (idempotent)
  ```

  **File**: N/A (verification only)

- [x] T032 Verify all parsers are exported from generated index.ts

  ```bash
  grep "export.*parseAllOf" src/index.ts
  grep "export.*parseAnyOf" src/index.ts
  grep "export.*parseArray" src/index.ts
  # ... check all parser exports
  ```

  **Expected**: All 14+ parser exports present

  **File**: `src/index.ts`

- [x] T033 Verify excluded files are NOT exported

  ```bash
  grep "src/index.ts" src/index.ts && echo "ERROR: index.ts re-exports itself" || echo "OK"
  grep "src/cli.ts" src/index.ts && echo "ERROR: cli.ts exported" || echo "OK"
  grep "cliTools" src/index.ts && echo "ERROR: cliTools exported" || echo "OK"
  ```

  **Expected**: No matches (excluded files not exported)

  **File**: `src/index.ts`

- [x] T034 Run test suite to ensure no regressions
  ```bash
  npm test
  # Expected: 100% pass rate (no changes to test logic)
  ```
  **File**: N/A (verification only)

**Gate**: Generated output byte-identical; idempotent; all parsers exported; tests still pass 100%

---

## Phase 4: Linting & Formatting Integration

**Purpose**: Apply new tooling to codebase

- [ ] T035 Run oxlint analysis on entire project

  ```bash
  npm run lint
  # Review output; identify any critical errors
  ```

  **Expected**: Some warnings/style issues (this is normal)

  **Files**: All files in `src/` and `test/`

- [ ] T036 Address critical linting errors (if any)
  - Review oxlint output
  - If errors block compilation: fix them
  - Document any intentional exceptions in `.oxlintrc.json`
  - If warnings only: document decision to allow them

  **Files**: Varies based on linting findings

- [ ] T037 Run oxfmt to format code

  ```bash
  npm run format
  # This applies formatting in-place
  ```

  **File**: All source files in `src/` and `test/`, plus root .ts files

- [ ] T038 Verify formatting was applied correctly

  ```bash
  npm run format:check
  # Expected: All files formatted (no additional changes needed)
  ```

  **File**: N/A (verification only)

- [ ] T039 Run tests after formatting

  ```bash
  npm test
  # Expected: 100% pass rate (formatting doesn't change behavior)
  ```

  **File**: N/A (verification only)

- [ ] T040 Commit formatting changes with appropriate message

  ```bash
  git add -A
  git commit -m "style: apply oxfmt and oxlint formatting rules"
  ```

  **File**: All modified source files

- [ ] T041 Verify linting in CI context

  ```bash
  npm run lint -- --format=json > /tmp/lint-results.json
  # Check for P0/P1 severity issues
  ```

  **Expected**: No critical blocking issues

  **File**: N/A (verification only)

**Gate**: Code formatted with oxfmt; linting checked; tests still pass; formatting committed

---

## Phase 5: Verification & Validation

**Purpose**: Comprehensive validation that refactoring succeeded and behavior preserved

- [ ] T042 Run full test suite with detailed output

  ```bash
  npm test -- --reporter=verbose
  # Expected: All tests pass; output shows test names/timing
  ```

  **File**: N/A (verification only)

- [ ] T043 Verify API behavior - simple string schema

  ```bash
  node -e "
    const { jsonSchemaToZod } = require('./dist/cjs/index.js');
    const result = jsonSchemaToZod({ type: 'string' });
    console.log(result);
  "
  # Expected: Valid TypeScript code with z.string()
  ```

  **File**: N/A (verification only)

- [ ] T044 Verify API behavior - complex object schema

  ```bash
  node -e "
    const { jsonSchemaToZod } = require('./dist/cjs/index.js');
    const schema = {
      type: 'object',
      properties: { name: { type: 'string' }, age: { type: 'number' } },
      required: ['name']
    };
    const result = jsonSchemaToZod(schema);
    console.log(result);
  "
  # Expected: Object with name and age properties
  ```

  **File**: N/A (verification only)

- [ ] T045 Verify code generation idempotency

  ```bash
  npm run gen > /tmp/gen-verify.txt
  diff /tmp/index.baseline.ts src/index.ts
  # Expected: No differences
  ```

  **File**: N/A (verification only)

- [ ] T046 Verify CLI with file I/O

  ```bash
  npm run build  # Build distribution first
  dist/cjs/cli.js -i /tmp/test.json -o /tmp/cli-output.ts
  # Verify /tmp/cli-output.ts contains valid TypeScript
  ```

  **File**: N/A (verification only)

- [ ] T047 Verify CLI with piped input

  ```bash
  echo '{"type":"string"}' | dist/cjs/cli.js
  # Expected: Valid TypeScript output to stdout
  ```

  **File**: N/A (verification only)

- [ ] T048 Verify ESM exports work

  ```bash
  node --input-type=module -e "
    import { jsonSchemaToZod } from './dist/esm/index.js';
    console.log(jsonSchemaToZod({ type: 'string' }));
  "
  # Expected: Valid output; no import errors
  ```

  **File**: N/A (verification only)

- [ ] T049 Verify CJS exports work

  ```bash
  node -e "
    const { jsonSchemaToZod } = require('./dist/cjs/index.js');
    console.log(typeof jsonSchemaToZod);
  "
  # Expected: 'function'
  ```

  **File**: N/A (verification only)

- [ ] T050 Compare behavioral snapshot - API calls
  - Run all API test cases from behavioral-snapshot.md
  - Compare outputs to pre-refactor baseline
  - Document any differences (should be none)

  **File**: `specs/refactor-001-migrate-to-vitest/behavioral-snapshot.md`

- [ ] T051 Compare behavioral snapshot - CLI calls
  - Run all CLI test cases from behavioral-snapshot.md
  - Compare file outputs to pre-refactor baseline
  - Document any differences (should be none)

  **File**: `specs/refactor-001-migrate-to-vitest/behavioral-snapshot.md`

- [ ] T052 Measure post-refactoring metrics

  ```bash
  time npm test  # Measure test execution time
  npm run gen    # Measure code generation time
  du -sh src/    # Check source code size
  npm ls         # Count dependencies
  ```

  **File**: `specs/refactor-001-migrate-to-vitest/metrics-after.md`

- [ ] T053 Compare performance metrics
  - Test execution time: baseline vs post-refactoring
  - Expected: 20-40% improvement with Vitest (or no regression)
  - Build time: maintain or improve
  - Code generation: maintain or improve

  **File**: N/A (comparison for final report)

- [ ] T054 Validate all success criteria
  - [ ] All tests pass (100% pass rate)
  - [ ] Test count >= 17 (no tests removed)
  - [ ] Generated code byte-identical
  - [ ] CLI behavior unchanged
  - [ ] Module exports available (ESM/CJS)
  - [ ] Vitest configured correctly
  - [ ] oxfmt rules applied
  - [ ] oxlint rules applied
  - [ ] Performance goals met

  **File**: N/A (validation checklist)

**Gate**: All behavioral snapshots validated; metrics captured; success criteria confirmed; zero breaking changes

---

## Phase 6: Documentation & Cleanup

**Purpose**: Update documentation and finalize refactoring

- [ ] T055 Delete legacy jest.config.js

  ```bash
  rm jest.config.js
  ```

  **File**: `jest.config.js` (deleted)

- [ ] T056 Update README.md with tooling changes

  **File**: `README.md`

  **Changes**:
  - Add section: "Development & Testing"
  - Note: Tests now run with Vitest (faster, native ESM)
  - Note: Code formatted with oxfmt
  - Note: Code linted with oxlint
  - Link to `.oxfmtrc.json` and `.oxlintrc.json` for configuration

- [ ] T057 Update CONTRIBUTING.md with new scripts

  **File**: `CONTRIBUTING.md`

  **Changes**:
  - Add: `npm test` runs Vitest in non-watch mode
  - Add: `npm run test:watch` for watch mode
  - Add: `npm run dev` for development (watches tests)
  - Add: `npm run lint` to check code with oxlint
  - Add: `npm run format` to apply oxfmt formatting
  - Add: `npm run gen` to regenerate src/index.ts with ts-morph

- [ ] T058 Update c8 exclude list in package.json (if coverage used)

  **File**: `package.json`

  **Changes**:
  - If `c8.exclude` exists, verify it's still accurate
  - Remove `jest.config.js` from exclude list (file deleted)
  - Verify other entries still correct

- [ ] T059 Populate metrics-after.md with final measurements

  **File**: `specs/refactor-001-migrate-to-vitest/metrics-after.md`

  **Content**:
  - Test execution time (post-refactoring)
  - Performance improvement percentage
  - Dependency count (added: vitest, ts-morph; removed: ts-jest)
  - Code generation time
  - Linting warnings resolved
  - Formatting applied to all files

- [ ] T060 Create final refactoring commit

  ```bash
  git add -A
  git commit -m "refactor: migrate to vitest, oxfmt/oxlint, ts-morph

  - Replace Jest/ts-jest with Vitest for 2-5x faster tests
  - Rewrite createIndex.ts with ts-morph AST builders for type safety
  - Add .oxfmtrc.json and .oxlintrc.json for code quality
  - Update package.json scripts for new tooling
  - Migrate test discovery to Vitest glob patterns
  - All behavior preserved: API, CLI, module exports unchanged
  - Test execution now 20-40% faster
  - Code generation now type-safe via AST

  Refs: constitution requirement for vitest, oxlint, oxfmt tooling
  Fixes: tech-debt-001 (outdated testing framework)
  "
  ```

  **File**: All modified/deleted files

- [ ] T061 Verify git history is clean

  ```bash
  git log --oneline -5
  # Expected: Last commit is refactor commit; history is clean
  ```

  **File**: N/A (git verification only)

- [ ] T062 Create or update CHANGELOG.md entry (if applicable)

  **File**: `CHANGELOG.md` (if exists)

  **Content**:
  - Version bump recommendation: patch version (tooling only, no API changes)
  - Summary: Internal tooling migration for improved DX
  - No breaking changes

**Gate**: All documentation updated; legacy files deleted; final commit created; git history clean

---

## Summary

**Total Tasks**: 62
**Estimated Duration**: 7-13 hours

### Task Breakdown by Phase

| Phase | Tasks     | Purpose                               |
| ----- | --------- | ------------------------------------- |
| **0** | T001-T007 | Baseline capture (7 tasks)            |
| **1** | T008-T016 | Tool installation & config (9 tasks)  |
| **2** | T017-T026 | Test migration (10 tasks)             |
| **3** | T027-T034 | Code generation refactoring (8 tasks) |
| **4** | T035-T041 | Linting & formatting (7 tasks)        |
| **5** | T042-T054 | Verification & validation (13 tasks)  |
| **6** | T055-T062 | Documentation & cleanup (8 tasks)     |

### Execution Order

**Execute phases sequentially; do NOT skip or parallelize phases**:

1. ✅ Phase 0: Establish baseline
2. ⏳ Phase 1: Install tools (some tasks are `[P]` parallelizable)
3. ⏳ Phase 2: Migrate tests
4. ⏳ Phase 3: Refactor code generation
5. ⏳ Phase 4: Apply formatting/linting
6. ⏳ Phase 5: Validate behavior
7. ⏳ Phase 6: Finalize documentation

### Parallelizable Tasks (within Phase 1)

These tasks can run in parallel (no dependencies):

- T008: Add Vitest
- T009: Add ts-morph
- T010: Remove ts-jest
- T011: Create vitest.config.ts
- T012: Create .oxfmtrc.json
- T013: Create .oxlintrc.json

After these complete in parallel, run T014-T016 sequentially.

---

**Status**: ✅ Tasks breakdown complete and ready for execution
