import { describe, it, expect } from 'vitest';
import { jsonSchemaToZod } from '../src/index.js';

describe('Zod Version Support', () => {
describe('Configuration', () => {
it('should accept zodVersion option', () => {
const schema = { type: 'string' as const };

// Should not throw
const v4Result = jsonSchemaToZod(schema, { zodVersion: 'v4' });
const v3Result = jsonSchemaToZod(schema, { zodVersion: 'v3' });

expect(v4Result).toBeTruthy();
expect(v3Result).toBeTruthy();
});

it('should default to v4 when zodVersion not specified', () => {
const schema = { type: 'string' as const };
const result = jsonSchemaToZod(schema);

// Default behavior should be same as v4
expect(result).toBe('z.string()');
});
});

describe('Error Message Parameters', () => {
// TODO: Implement once error message handling is version-aware
it.skip('should use error parameter in v4 mode', () => {
const schema = {
type: 'string' as const,
errorMessage: { type: 'Must be a string' }
};

const result = jsonSchemaToZod(schema, { zodVersion: 'v4' });
expect(result).toContain('error:');
expect(result).not.toContain('message:');
});

it.skip('should use message parameter in v3 mode', () => {
const schema = {
type: 'string' as const,
errorMessage: { type: 'Must be a string' }
};

const result = jsonSchemaToZod(schema, { zodVersion: 'v3' });
expect(result).toContain('message:');
expect(result).not.toContain('error:');
});
});
});
