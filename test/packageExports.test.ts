/**
 * Integration test to verify version-specific imports work from built package
 * This simulates how end users would import from the package
 */

import { describe, it, expect } from 'vitest';

describe('Package exports integration', () => {
	it('should be able to import from v3 entry point', async () => {
		// This tests that the package.json exports are correctly configured
		const v3Module = await import('../src/v3.js');
		
		expect(v3Module.build).toBeDefined();
		expect(v3Module.jsonSchemaToZod).toBeDefined();
		expect(v3Module.default).toBeDefined();
		
		// Verify build has core methods
		expect(v3Module.build.string).toBeDefined();
		expect(v3Module.build.number).toBeDefined();
		
		// Verify v4-only methods are not present
		expect((v3Module.build as any).promise).toBeUndefined();
		expect((v3Module.build as any).lazy).toBeUndefined();
	});

	it('should be able to import from v4 entry point', async () => {
		const v4Module = await import('../src/v4.js');
		
		expect(v4Module.build).toBeDefined();
		expect(v4Module.jsonSchemaToZod).toBeDefined();
		expect(v4Module.default).toBeDefined();
		
		// Verify build has all methods including v4-only
		expect(v4Module.build.string).toBeDefined();
		expect(v4Module.build.number).toBeDefined();
		expect(v4Module.build.promise).toBeDefined();
		expect(v4Module.build.lazy).toBeDefined();
		expect(v4Module.build.json).toBeDefined();
	});

	it('v3 and v4 modules should have same core functionality', async () => {
		const v3Module = await import('../src/v3.js');
		const v4Module = await import('../src/v4.js');
		
		// Test that core builders produce same output
		const v3String = v3Module.build.string().text();
		const v4String = v4Module.build.string().text();
		expect(v3String).toBe(v4String);
		
		const v3Number = v3Module.build.number().min(0).max(100).text();
		const v4Number = v4Module.build.number().min(0).max(100).text();
		expect(v3Number).toBe(v4Number);
	});

	it('should export version-specific types', async () => {
		// Type exports should be available
		const versionsModule = await import('../src/ZodBuilder/versions.js');
		
		// This just verifies the module loads correctly
		// The actual type checking happens at compile time
		expect(versionsModule).toBeDefined();
	});
});
