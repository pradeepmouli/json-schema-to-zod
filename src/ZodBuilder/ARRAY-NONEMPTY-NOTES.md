/**
 * ArrayBuilder - Zod v3 and v4 Compatibility Notes
 *
 * NONEMPTY() TYPE INFERENCE DIFFERENCES:
 *
 * In Zod v3 and v4, the .nonempty() method behaves DIFFERENTLY for type inference,
 * but the actual VALIDATION is identical.
 *
 * Zod v3: .nonempty() on arrays
 * - Type: After .nonempty(), TypeScript infers the array as [T, ...T[]]
 * - Validation: Rejects arrays with 0 length
 * - Method form: z.array(z.string()).nonempty()
 *
 * Zod v4: .nonempty() on arrays
 * - Type: After .nonempty(), TypeScript infers as [T, ...T[]] (same as v3)
 * - Validation: Rejects arrays with 0 length (SAME validation)
 * - Method form: z.array(z.string()).nonempty() (same syntax)
 *
 * CODE GENERATION IMPACT:
 *
 * json-schema-to-zod generates identical code for both v3 and v4:
 *   z.array(z.string()).min(1)  // v3 and v4 identical
 *
 * We use .min(1) instead of .nonempty() because:
 * 1. More explicit about the constraint
 * 2. Works identically in both v3 and v4
 * 3. Clearer in validation error messages
 *
 * VALIDATION EQUIVALENCE:
 *
 * These are functionally equivalent in BOTH v3 and v4:
 *   z.array(z.string()).min(1)
 *   z.array(z.string()).nonempty()
 *
 * However, .nonempty() provides better type inference:
 * - min(1) still types as T[]
 * - nonempty() types as [T, ...T[]]
 *
 * For code generated from JSON Schema (which doesn't express tuple constraints),
 * using .min(1) is appropriate and correct.
 *
 * MANUAL CODE IMPROVEMENT:
 *
 * If you want better type inference in generated code, you can manually
 * change:
 *   z.array(z.string()).min(1)
 * To:
 *   z.array(z.string()).nonempty()
 *
 * The validation behavior is identical, but type inference is improved.
 */
