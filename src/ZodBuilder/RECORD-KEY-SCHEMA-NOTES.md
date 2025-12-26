/**
 * RecordBuilder - Zod v3 and v4 Key Schema Handling
 *
 * RECORD KEY SCHEMA REQUIREMENT:
 *
 * Zod v3: z.record() supports both:
 * - Single argument: z.record(valueSchema)  // key defaults to z.string()
 * - Two arguments: z.record(keySchema, valueSchema)
 *
 * Zod v4: z.record() requires TWO arguments:
 * - z.record(keySchema, valueSchema)  // REQUIRED
 * - z.record(valueSchema) is NO LONGER VALID
 *
 * IMPLEMENTATION IN JSON-SCHEMA-TO-ZOD:
 *
 * RecordBuilder ALWAYS generates the two-argument form for compatibility:
 *   z.record(z.string(), z.string())  // v3 and v4 compatible
 *
 * This is the SAFEST approach because:
 * 1. It generates valid code for BOTH v3 and v4
 * 2. Explicit key schema is clearer and more maintainable
 * 3. Matches the v4 requirement exactly
 *
 * WHEN PARSING JSON SCHEMA PATTERNS:
 *
 * JSON Schema "additionalProperties" with type constraint:
 * {
 *   "type": "object",
 *   "additionalProperties": { "type": "string" }
 * }
 *
 * Generates:
 * - v3: z.record(z.string(), z.string())  // Two arguments
 * - v4: z.record(z.string(), z.string())  // Two arguments (REQUIRED)
 *
 * Both versions explicitly define the key schema as z.string(), which is
 * the sensible default for JavaScript objects and JSON.
 *
 * EDGE CASE: Record with arbitrary object keys
 *
 * For advanced use cases where you need record with non-string keys
 * (like Symbol), you would need to manually edit the generated code:
 * - z.record(z.union([z.string(), z.symbol()]), valueSchema)
 *
 * This is not auto-generated because JSON Schema doesn't support Symbol keys.
 */
