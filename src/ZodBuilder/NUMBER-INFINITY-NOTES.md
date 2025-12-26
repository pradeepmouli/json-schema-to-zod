/**
 * NumberBuilder - Zod v3 and v4 Compatibility Notes
 *
 * INFINITY HANDLING:
 *
 * Zod v3: Numbers accept Infinity and -Infinity by default
 * - z.number() accepts Infinity, -Infinity, and NaN values without error
 *
 * Zod v4: Numbers reject Infinity and -Infinity by default
 * - z.number() now rejects Infinity and -Infinity by default
 * - Must use .allowInfinity() to explicitly permit infinite values: z.number().allowInfinity()
 * - NaN is handled differently and requires explicit handling
 *
 * IMPACT ON JSON SCHEMA CONVERSION:
 *
 * When converting from JSON Schema (which allows numbers without infinity restrictions):
 *
 * v3 mode: Generated code accepts Infinity naturally
 *   const schema = z.number();
 *   schema.parse(Infinity);  // Success: Infinity
 *
 * v4 mode: Generated code rejects Infinity by default
 *   const schema = z.number();
 *   schema.parse(Infinity);  // Error: number must be finite
 *
 * MIGRATION NOTES:
 *
 * If your JSON Schema allows numeric Infinity values and you're migrating to v4:
 * 1. Option A: Use zodVersion: 'v3' to generate v3-compatible code
 * 2. Option B: Manually add .allowInfinity() to number schemas in v4 mode
 * 3. Option C: Update validation to reject Infinity before passing to Zod
 *
 * This is a BUILT-IN Zod v4 behavior and not controlled by json-schema-to-zod.
 */
