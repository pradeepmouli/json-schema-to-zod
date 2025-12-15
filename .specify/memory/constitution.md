# json-schema-to-zod Constitution

## Core Principles

### I. Parser Architecture
Every schema transformation SHALL be implemented as a discrete parser module. Each parser is independently testable, handles a specific JSON schema construct, and integrates into `parseSchema.ts` via function composition. Parsers MUST NOT have side effects, MUST accept schema and options parameters, and MUST return TypeScript code strings or z-expressions.

### II. Dual-Module Export (ESM/CJS)
The library MUST support both ES Module and CommonJS exports simultaneously. All TypeScript source compiles to separate `dist/esm` and `dist/cjs` targets via dedicated tsconfigs. Post-build scripts (`postesm.js`, `postcjs.js`) MUST ensure correct export syntax for each target. CLI binary MUST work identically regardless of module system.

### III. CLI-First Contract
Every programmatic API MUST have a corresponding CLI interface. The CLI MUST support piped JSON input, file I/O via `--input`/`--output` flags, and produce human-readable TypeScript output or structured error messages. Options like `--name`, `--module`, `--type`, and `--withJsdocs` MUST work identically in both contexts.

### IV. Test-First Development (NON-NEGOTIABLE)
TDD is mandatory: Test cases MUST be written and approved before implementation. Parser tests live in `test/parsers/` mirroring `src/parsers/` structure. Integration tests validate full schema→code flows. All tests run via `tsx test/index.ts`. Red-Green-Refactor cycle is strictly enforced.

### V. Type Safety & Zod Correctness
All generated Zod schemas MUST be valid TypeScript that compiles and runs without errors. Type inference and validation behavior MUST match the input JSON schema semantics. Generated code MUST leverage Zod's full type system (generics, inference helpers, custom validation). JSDoc generation (`--withJsdocs`) MUST preserve semantic meaning from schema `description` fields.

## Technology Stack Requirements

All development MUST follow the [User-Level Copilot Instructions](vscode-userdata:/Users/pmouli/Library/Application%20Support/Code/User/prompts/ts.instructions.md):

- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm
- **Testing**: vitest (migrated from tsx-based test runner)
- **Linting**: oxlint (configuration TBD if not present)
- **Formatting**: oxfmt (configuration TBD if not present)
- **Build Output**: Separate ESM/CJS distributions via TypeScript compiler + post-build scripts
- **CLI Framework**: Node.js native (no external CLI library required; custom argument parsing in `cli.ts`)
- **Code Style**: PascalCase for files/types, camelCase for functions/variables, 2-space indentation, single quotes, no trailing commas

## Code Organization Standards

- **Parsers**: `src/parsers/*.ts` — One parser per JSON schema keyword/construct; stateless pure functions
- **Utils**: `src/utils/*.ts` — Shared utilities (JSDoc generation, object manipulation, etc.); reusable across parsers
- **Types**: `src/Types.ts` — Centralized type definitions for schema options and internal structures
- **CLI**: `src/cli.ts` — Argument parsing, file I/O, error formatting; programmatic API available via `index.ts`
- **Tests**: `test/parsers/*.ts` + `test/index.ts` — Comprehensive coverage of parser logic and CLI workflows
- **Index Generation**: `createIndex.ts` — Auto-generates parser index exports (run via `npm run gen`)

## Governance

### Constitution Authority
This constitution supersedes all other development practices, style guides, and informal conventions. All PRs and issues MUST verify compliance with principles and standards herein before approval.

### Amendment Process
1. Open an issue describing the proposed amendment with rationale
2. Link to this constitution and identify which section(s) require change
3. Propose updated text and version bump (MAJOR/MINOR/PATCH per semver rules)
4. Approval MUST be obtained before amending
5. Update version line and `LAST_AMENDED_DATE` upon completion
6. Review `.specify/templates/*` files to propagate breaking changes

### Compliance Review
- **Code Review**: Reviewer SHALL verify parser architecture, test coverage, dual-module correctness, and type safety
- **Automated Gates**: TypeScript strict mode MUST pass; test suite MUST pass; all parsers MUST follow naming convention
- **Runtime Guidance**: Reference `.specify/memory/development-guide.md` (if present) for day-to-day workflows; this constitution defines non-negotiable rules

### Version Bumping Rules
- **MAJOR**: Principle removal/redefinition, breaking parser API, removal of CLI options, export format changes
- **MINOR**: New parser added, new principle, substantial clarification or expansion of guidance
- **PATCH**: Typos, wording clarifications, reorganization without semantic change

## Development Workflow

### Core Workflow (Feature Development)
1. Feature request initiates with `/specify <description>`
2. Clarification via `/clarify` to resolve ambiguities
3. Technical planning with `/plan` to create implementation design
4. Task breakdown using `/tasks` for execution roadmap
5. Implementation via `/implement` following task order

### Extension Workflows
- **Bugfix**: `/bugfix "<description>"` → bug-report.md + tasks.md with regression test requirement
- **Modification**: `/modify <feature_num> "<description>"` → modification.md + impact analysis + tasks.md
- **Refactor**: `/refactor "<description>"` → refactor.md + baseline metrics + incremental tasks.md
- **Hotfix**: `/hotfix "<incident>"` → hotfix.md + expedited tasks.md + post-mortem.md (within 48 hours)
- **Deprecation**: `/deprecate <feature_num> "<reason>"` → deprecation.md + dependency scan + phased tasks.md

### Workflow Selection
Development activities SHALL use the appropriate workflow type based on the nature of the work. Each workflow enforces specific quality gates and documentation requirements tailored to its purpose:

- **Feature Development** (`/specify`): New functionality - requires full specification, planning, and TDD approach
- **Bug Fixes** (`/bugfix`): Defect remediation - requires regression test BEFORE applying fix
- **Modifications** (`/modify`): Changes to existing features - requires impact analysis and backward compatibility assessment
- **Refactoring** (`/refactor`): Code quality improvements - requires baseline metrics, behavior preservation guarantee, and incremental validation
- **Hotfixes** (`/hotfix`): Emergency production issues - expedited process with deferred testing and mandatory post-mortem
- **Deprecation** (`/deprecate`): Feature sunset - requires phased rollout (warnings → disabled → removed), migration guide, and stakeholder approvals

The wrong workflow SHALL NOT be used - features must not bypass specification, bugs must not skip regression tests, and refactorings must not alter behavior.

### Quality Gates by Workflow

**Feature Development**:
- Specification MUST be complete before planning
- Plan MUST pass constitution checks before task generation
- Tests MUST be written before implementation (TDD)
- Code review MUST verify constitution compliance

**Bugfix**:
- Bug reproduction MUST be documented with exact steps
- Regression test MUST be written before fix is applied
- Root cause MUST be identified and documented
- Prevention strategy MUST be defined

**Modification**:
- Impact analysis MUST identify all affected files and contracts
- Original feature spec MUST be linked
- Backward compatibility MUST be assessed
- Migration path MUST be documented if breaking changes

**Refactor**:
- Baseline metrics MUST be captured before any changes unless explicitly exempted
- Tests MUST pass after EVERY incremental change
- Behavior preservation MUST be guaranteed (tests unchanged)
- Target metrics MUST show measurable improvement unless explicitly exempted

**Hotfix**:
- Severity MUST be assessed (P0/P1/P2)
- Rollback plan MUST be prepared before deployment
- Fix MUST be deployed and verified before writing tests (exception to TDD)
- Post-mortem MUST be completed within 48 hours of resolution

**Deprecation**:
- Dependency scan MUST be run to identify affected code
- Migration guide MUST be created before Phase 1
- All three phases MUST complete in sequence (no skipping)
- Stakeholder approvals MUST be obtained before starting

**Version**: 1.0.0 | **Ratified**: 2025-12-11 | **Last Amended**: 2025-12-11


### VI. Development Workflow

### Core Workflow (Feature Development)
1. Feature request initiates with `/specify <description>`
2. Clarification via `/clarify` to resolve ambiguities
3. Technical planning with `/plan` to create implementation design
4. Task breakdown using `/tasks` for execution roadmap
5. Implementation via `/implement` following task order

### Extension Workflows
- **Bugfix**: `/bugfix "<description>"` → bug-report.md + tasks.md with regression test requirement
- **Modification**: `/modify <feature_num> "<description>"` → modification.md + impact analysis + tasks.md
- **Refactor**: `/refactor "<description>"` → refactor.md + baseline metrics + incremental tasks.md
- **Hotfix**: `/hotfix "<incident>"` → hotfix.md + expedited tasks.md + post-mortem.md (within 48 hours)
- **Deprecation**: `/deprecate <feature_num> "<reason>"` → deprecation.md + dependency scan + phased tasks.md

### Workflow Selection
Development activities SHALL use the appropriate workflow type based on the nature of the work. Each workflow enforces specific quality gates and documentation requirements tailored to its purpose:

- **Feature Development** (`/specify`): New functionality - requires full specification, planning, and TDD approach
- **Bug Fixes** (`/bugfix`): Defect remediation - requires regression test BEFORE applying fix
- **Modifications** (`/modify`): Changes to existing features - requires impact analysis and backward compatibility assessment
- **Refactoring** (`/refactor`): Code quality improvements - requires baseline metrics, behavior preservation guarantee, and incremental validation
- **Hotfixes** (`/hotfix`): Emergency production issues - expedited process with deferred testing and mandatory post-mortem
- **Deprecation** (`/deprecate`): Feature sunset - requires phased rollout (warnings → disabled → removed), migration guide, and stakeholder approvals

The wrong workflow SHALL NOT be used - features must not bypass specification, bugs must not skip regression tests, and refactorings must not alter behavior.

### Quality Gates by Workflow

**Feature Development**:
- Specification MUST be complete before planning
- Plan MUST pass constitution checks before task generation
- Tests MUST be written before implementation (TDD)
- Code review MUST verify constitution compliance

**Bugfix**:
- Bug reproduction MUST be documented with exact steps
- Regression test MUST be written before fix is applied
- Root cause MUST be identified and documented
- Prevention strategy MUST be defined

**Modification**:
- Impact analysis MUST identify all affected files and contracts
- Original feature spec MUST be linked
- Backward compatibility MUST be assessed
- Migration path MUST be documented if breaking changes

**Refactor**:
- Baseline metrics MUST be captured before any changes unless explicitly exempted
- Tests MUST pass after EVERY incremental change
- Behavior preservation MUST be guaranteed (tests unchanged)
- Target metrics MUST show measurable improvement unless explicitly exempted

**Hotfix**:
- Severity MUST be assessed (P0/P1/P2)
- Rollback plan MUST be prepared before deployment
- Fix MUST be deployed and verified before writing tests (exception to TDD)
- Post-mortem MUST be completed within 48 hours of resolution

**Deprecation**:
- Dependency scan MUST be run to identify affected code
- Migration guide MUST be created before Phase 1
- All three phases MUST complete in sequence (no skipping)
- Stakeholder approvals MUST be obtained before starting