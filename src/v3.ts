/**
 * Zod v3 specific entry point
 * 
 * Import from 'x-to-zod/v3' to get:
 * - build object with v3-compatible methods only
 * - TypeScript types enforce v3-only API surface
 * 
 * Note: This restricts the API surface but does not automatically set
 * zodVersion option. When using jsonSchemaToZod or other functions that
 * accept a zodVersion option, you still need to pass it explicitly.
 * 
 * @example
 * ```typescript
 * import { build } from 'x-to-zod/v3';
 * 
 * // This works - core builder available in v3
 * const schema = build.string();
 * 
 * // This will cause TypeScript error - promise is v4-only
 * const promiseSchema = build.promise(build.string()); // Error!
 * ```
 */

import { buildV3 } from './ZodBuilder/index.js';
import type { V3BuildAPI } from './ZodBuilder/versions.js';

// Re-export core functionality
export * from './JsonSchema/parsers/parseAllOf.js';
export * from './JsonSchema/parsers/parseAnyOf.js';
export * from './JsonSchema/parsers/parseArray.js';
export * from './JsonSchema/parsers/parseBoolean.js';
export * from './JsonSchema/parsers/parseConst.js';
export * from './JsonSchema/parsers/parseDefault.js';
export * from './JsonSchema/parsers/parseEnum.js';
export * from './JsonSchema/parsers/parseIfThenElse.js';
export * from './JsonSchema/parsers/parseMultipleType.js';
export * from './JsonSchema/parsers/parseNot.js';
export * from './JsonSchema/parsers/parseNull.js';
export * from './JsonSchema/parsers/parseNullable.js';
export * from './JsonSchema/parsers/parseNumber.js';
export * from './JsonSchema/parsers/parseObject.js';
export * from './JsonSchema/parsers/parseOneOf.js';
export * from './JsonSchema/parsers/parseSchema.js';
export * from './JsonSchema/parsers/parseString.js';
export * from './Types.js';

export { toZod as jsonSchemaToZod } from './JsonSchema/toZod.js';
export { toZod as default } from './JsonSchema/toZod.js';

export * as JsonSchema from './JsonSchema/index.js';
export * as ZodBuilder from './ZodBuilder/index.js';

// Export build with v3 type signature
export const build: V3BuildAPI = buildV3 as V3BuildAPI;
