# Enhancement: Update Lazy Builder to Accept Builder Input

**Enhancement ID**: enhance-001
**Branch**: `enhance/001-update-lazy-builder`
**Created**: 2025-12-26
**Priority**: [x] High | [ ] Medium | [ ] Low
**Component**: src/ZodBuilder/lazy.ts
**Status**: [ ] Planned | [ ] In Progress | [x] Complete

## Input
User description: "Update lazy builder to take another builder as input (instead of a string) and return `() => ${input.text()}`"

## Overview
Refactor the `LazyBuilder` class to accept a `ZodBuilder` instance instead of a raw string, enabling type-safe lazy schema construction. The builder will automatically wrap the input builder's text output in an arrow function format.

## Motivation
Currently, the lazy builder accepts a string like `'() => z.string()'`, requiring users to manually construct the function wrapper. By accepting a builder directly, we can:
- Provide better type safety and IDE support
- Simplify the API by automatically wrapping the builder's output
- Enable composition with other builders in a more natural way
- Reduce manual string construction and potential syntax errors

## Proposed Changes
Modify the `LazyBuilder` class to accept `ZodBuilder` instead of `string`:
- Update constructor parameter from `getter: string` to `input: ZodBuilder`
- Store the builder instance internally
- Modify `base()` method to return `z.lazy(() => ${input.text()})`
- Update the factory function in `index.ts` to accept `ZodBuilder` parameter

**Files to Modify**:
- src/ZodBuilder/lazy.ts - Update class constructor and base() method
- src/ZodBuilder/index.ts - Update lazy factory function signature (line ~246)
- test/newBuilders.test.ts - Update lazy builder tests (lines ~288-296)
- test/versionTypes.test.ts - Update lazy builder tests (lines ~50, 60)
- test/versionedImports.test.ts - Update lazy builder tests (lines ~83-84)

**Breaking Changes**: [x] Yes | [ ] No
This is a breaking change as the lazy builder signature changes from accepting a string to accepting a ZodBuilder. Users will need to pass builders instead of strings: `build.lazy(build.string())` instead of `build.lazy('() => z.string()')`.

## Implementation Plan

**Phase 1: Implementation**

**Tasks**:
1. [x] Update `LazyBuilder` class in `src/ZodBuilder/lazy.ts` to accept `ZodBuilder` input and generate `() => ${input.text()}` format
2. [x] Update the lazy factory function in `src/ZodBuilder/index.ts` to match the new signature
3. [x] Update all test files that use `build.lazy()` to pass builder instances instead of strings
4. [x] Run tests to verify all lazy builder tests pass with new API
5. [x] Run lint to ensure code style compliance

**Acceptance Criteria**:
- [x] LazyBuilder accepts ZodBuilder instance and generates correct output format
- [x] Factory function `build.lazy()` has updated type signature
- [x] All existing tests updated and passing
- [x] Generated code matches format: `z.lazy(() => <inner_schema>)`
- [x] No linting errors

## Testing
- [x] Unit tests added/updated
- [x] Integration tests pass
- [x] Manual testing complete
- [x] Edge cases verified

## Verification Checklist
- [x] Changes implemented as described
- [x] Tests written and passing
- [x] No regressions in existing functionality
- [ ] Documentation updated (if needed)
- [x] Code reviewed (if appropriate)

## Notes
The enhancement improves type safety and API consistency by treating lazy builders like other wrapper builders (e.g., promise, preprocess) that accept builder inputs. This aligns with the fluent builder pattern used throughout the codebase.

---
*Enhancement created using `/enhance` workflow - See .specify/extensions/workflows/enhance/*
