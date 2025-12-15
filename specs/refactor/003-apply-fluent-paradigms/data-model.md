# Data Model: Fluent Builders

## Entities

### `NumberBuilder`

- Fields:
  - `code: string` — current Zod code string
- Relationships:
  - Delegates to number-related modifiers from `src/ZodBuilder/number.ts` and `src/ZodBuilder/modifiers.ts`
- State Transitions:
  - `.int()`, `.min(n)`, `.max(n)`, `.optional()` mutate `code` via helper delegation; `.done()` returns final string

### `StringBuilder`

- Fields:
  - `code: string`
- Relationships:
  - Delegates to string modifiers
- State Transitions:
  - `.min(n)`, `.max(n)`, `.regex()`, `.email()`, `.uuid()`, `.optional()`

### `ArrayBuilder`

- Fields:
  - `code: string`
- Relationships:
  - Holds inner item schema text; delegates to array modifiers
- State Transitions:
  - `.items(inner)`, `.min(n)`, `.max(n)`, `.nonempty()`, `.optional()`

### `ObjectBuilder`

- Fields:
  - `code: string`
- Relationships:
  - Delegates to object modifiers
- State Transitions:
  - `.partial()`, `.passthrough()`, `.optional()`

## Validation Rules

- Builders MUST produce identical code strings for given parser inputs compared to baseline.
- Chain order MUST reflect parser decision order; no normalization in Phase 1.

## Notes

- Builders are internal cohesion units; parsers remain pure and stateless.
