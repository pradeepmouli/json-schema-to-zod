# Phase 0 Research: Fluent Zod-like Builders

## Unknowns and Resolutions

### Unknown: Wrapper location and design

- Decision: Implement per-type fluent wrappers in `src/ZodBuilder/*` (e.g., `NumberBuilder`, `StringBuilder`). Optionally add `fluent.ts` for a base class to encapsulate shared chaining utilities.
- Rationale: Keeps logic cohesive with existing builder modules; minimizes parser coupling.
- Alternatives considered: Central monolithic builder; rejected to avoid god-class and to keep type-specific semantics isolated.

### Unknown: Method parity and semantics

- Decision: Ensure parity with existing `apply*` helpers by delegating internally. Initial scope:
  - NumberBuilder: `.int()`, `.min(n)`, `.max(n)`, `.optional()`, `.nonnegative()`, `.positive()`, `.negative()`, `.finite()`
  - StringBuilder: `.min(n)`, `.max(n)`, `.regex(re)`, `.email()`, `.uuid()`
  - ArrayBuilder: `.min(n)`, `.max(n)`, `.nonempty()`
  - ObjectBuilder: `.partial()`, `.passthrough()` as applicable
- Rationale: Delegation ensures behavior identical to baseline; method set grows iteratively.
- Alternatives: Re-implement modifiers directly in wrappers; rejected due to higher risk of behavior drift.

### Unknown: Chaining order vs. output stability

- Decision: Preserve invocation order exactly as before by mapping parser decision points to wrapper method calls in the same sequence. No reordering optimization in Phase 1.
- Rationale: Guarantees identical outputs relative to baseline tests.
- Alternatives: Normalize ordering; rejected for Phase 1 to avoid potential diffs.

### Unknown: Return type and unwrapping

- Decision: Wrapper holds `code: string` and returns `this` for chaining. Expose `.done()` that returns the final `code` string for integration points that require a raw string.
- Rationale: Simple, chainable API; explicit unwrapping makes integration clear.
- Alternatives: Implicit `toString()`; deferred to later to reduce accidental coercion.

### Unknown: Parser integration

- Decision: Update parsers to call `build.<type>()` factory, chain modifiers, then `.done()` to get final code string.
- Rationale: Minimal code changes; centralizes modifier semantics in builders.
- Alternatives: Continue using `apply*` helpers directly; rejected by refactor goal.

## Best Practices

- Fluent interface pattern with immutable-seeming behavior (but internally string concat is acceptable as long as tests pass).
- Delegate to existing helpers to minimize risk and ensure parity.
- Add minimal wrapper-level tests if gaps exist, without altering existing assertions.

## Decision Summary

- Decision: Per-type fluent wrappers delegating to existing `apply*` functions.
- Rationale: Preserves behavior, reduces coupling, improves discoverability.
- Alternatives considered: Monolithic builder; direct re-implementation of modifiers; reordering of chains — all rejected for Phase 1.
