# Quickstart: Fluent Builders

## Goal

Use fluent, Zod-like builders internally to generate identical Zod code strings.

## Usage (internal)

```ts
import { build } from '../src/ZodBuilder';

// Number example
const num = build.number().int().max(10).optional().done();
// Expect: 'z.number().int().max(10).optional()'

// String example
const str = build.string().min(2).max(5).done();
// Expect: 'z.string().min(2).max(5)'

// Array example
const arr = build.array().items('z.number()').min(1).done();
// Expect: 'z.array(z.number()).min(1)'
```

## Parser Integration

- Replace `apply*` calls by chaining builder methods in the same order, then call `.done()`.
- Keep parsers pure: compute decisions from schema → apply builder chains → return final code string.

## Testing

- Run existing tests; add wrapper parity tests only if necessary (no assertion weakening).

```bash
npm test
```
