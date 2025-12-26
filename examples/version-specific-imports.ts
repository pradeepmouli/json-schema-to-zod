/**
 * Example demonstrating version-specific imports
 *
 * This file shows how to use x-to-zod with version-specific imports
 * to ensure compatibility with your target Zod version.
 *
 * NOTE: This example shows the import syntax for end users.
 * When installed as a package, imports would be:
 * - import { build } from 'x-to-zod/v4';
 * - import { build } from 'x-to-zod/v3';
 */

// Example 1: Using Zod v4 (full feature set)
// In your app: import { build as buildV4 } from 'x-to-zod/v4';
import { build as buildV4 } from '../src/v4.js';

// All v4 features are available
const v4Examples = {
	// Core types work everywhere
	stringSchema: buildV4.string().text(),
	numberSchema: buildV4.number().text(),
	objectSchema: buildV4
		.object({
			name: buildV4.string(),
			age: buildV4.number(),
		})
		.text(),

	// V4-only features
	promiseSchema: buildV4.promise(buildV4.string()).text(),
	lazySchema: buildV4.lazy('() => UserSchema').text(),
	jsonSchema: buildV4.json().text(),
	fileSchema: buildV4.file().text(),
	nativeEnumSchema: buildV4.nativeEnum('MyEnum').text(),
	codecSchema: buildV4.codec(buildV4.string(), buildV4.number()).text(),
	functionSchema: buildV4.function().text(),
	templateLiteralSchema: buildV4.templateLiteral(['user-', 'id']).text(),
	xorSchema: buildV4.xor([buildV4.string(), buildV4.number()]).text(),
	keyofSchema: buildV4.keyof(buildV4.object({})).text(),
};

console.log('V4 Examples:');
console.log('Promise:', v4Examples.promiseSchema);
console.log('Lazy:', v4Examples.lazySchema);
console.log('JSON:', v4Examples.jsonSchema);
console.log('File:', v4Examples.fileSchema);
console.log('XOR:', v4Examples.xorSchema);

// Example 2: Using Zod v3 (backward compatibility)
// In your app: import { build as buildV3 } from 'x-to-zod/v3';
import { build as buildV3 } from '../src/v3.js';

// Only core features are available (v4-specific features excluded)
const v3Examples = {
	stringSchema: buildV3.string().text(),
	numberSchema: buildV3.number().text(),
	objectSchema: buildV3
		.object({
			name: buildV3.string(),
			age: buildV3.number(),
		})
		.text(),
	unionSchema: buildV3.union([buildV3.string(), buildV3.number()]).text(),
	arraySchema: buildV3.array(buildV3.string()).text(),

	// These would cause TypeScript errors if uncommented (v4-only):
	// promiseSchema: buildV3.promise(buildV3.string()).text(), // ❌ Error!
	// lazySchema: buildV3.lazy('() => Schema').text(), // ❌ Error!
	// jsonSchema: buildV3.json().text(), // ❌ Error!
};

console.log('\nV3 Examples:');
console.log('String:', v3Examples.stringSchema);
console.log('Number:', v3Examples.numberSchema);
console.log('Object:', v3Examples.objectSchema);

// Example 3: Default import (same as v4)
// In your app: import jsonSchemaToZod from 'x-to-zod';
import { jsonSchemaToZod } from '../src/index.js';

// The JSON schema converter uses the default zodVersion ('v4')
const zodSchema = jsonSchemaToZod({
	type: 'object',
	properties: {
		name: { type: 'string' },
		age: { type: 'number' },
	},
	required: ['name'],
});

console.log('\nJSON Schema to Zod (v4 by default):');
console.log(zodSchema);

// Example 4: Using buildV3 and buildV4 directly
// In your app: import { buildV3, buildV4 } from 'x-to-zod/builders';
import {
	buildV3 as coreBuilders,
	buildV4 as fullBuilders,
} from '../src/ZodBuilder/index.js';

const directExample = {
	v3String: coreBuilders.string().text(),
	v4Promise: fullBuilders.promise(fullBuilders.string()).text(),
};

console.log('\nDirect Import:');
console.log('V3 String:', directExample.v3String);
console.log('V4 Promise:', directExample.v4Promise);

// Type Safety Demonstration
// The following demonstrates compile-time type safety:

// ✅ This compiles - v4 has promise
buildV4.promise(buildV4.string());

// ❌ This would fail at compile-time - v3 doesn't have promise
// const invalidV3 = buildV3.promise(buildV3.string());

// ✅ Both have string
buildV3.string();
buildV4.string();

export { v4Examples, v3Examples, zodSchema, directExample };
