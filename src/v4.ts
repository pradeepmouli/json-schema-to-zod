/**
 * Zod v4 specific entry point
 * 
 * Import from 'x-to-zod/v4' to get:
 * - build object with full v4 API including v4-only methods
 * - TypeScript types enforce full v4 API surface
 * 
 * Note: This provides the full v4 API surface but does not automatically set
 * zodVersion option. When using jsonSchemaToZod or other functions that
 * accept a zodVersion option, you still need to pass it explicitly.
 * 
 * @example
 * ```typescript
 * import { build } from 'x-to-zod/v4';
 * 
 * // All builders available including v4-only features
 * const schema = build.string();
 * const promiseSchema = build.promise(build.string());
 * const lazySchema = build.lazy('() => mySchema');
 * ```
 */

import { buildV4 } from './ZodBuilder/index.js';
import type { V4BuildAPI } from './ZodBuilder/versions.js';

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

// Export build with v4 type signature (full API)
export const build: V4BuildAPI = buildV4 as V4BuildAPI;
