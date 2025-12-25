# Implementation Plan: Zod v4 Builder Updates

**Refactor ID**: refactor-006
**Created**: 2025-12-25
**Status**: Planning Complete

## Overview

Update all ZodBuilder classes to support dual-mode generation (Zod v3/v4) while maintaining backward compatibility. Implement hybrid builder approach for string formats, version-aware object methods, and configurable code generation.

## Architecture Overview

```
Configuration Layer
    ↓
BaseBuilder (zodVersion aware)
    ↓
├── StringBuilder → Format Builders (EmailBuilder, UuidBuilder, etc.)
├── ObjectBuilder (version-aware strict/loose/extend)
├── EnumBuilder (version-aware enum/nativeEnum)
├── NumberBuilder (version-aware infinity handling)
├── RecordBuilder (version-aware argument handling)
└── Other Builders

Output: v3-compatible OR v4-native code based on config
```

## Phase 1: Configuration Infrastructure

### 1.1 Add zodVersion to Options Type
**File**: `src/Types.ts`

```typescript
export type ZodVersion = 'v3' | 'v4';

export type Options = {
  // ...existing options
  /** Zod version to target for generated code (default: 'v4') */
  zodVersion?: ZodVersion;
};
```

**Tasks**:
- Add `ZodVersion` type export
- Add `zodVersion` property to existing Options type
- Document version option behavior with JSDoc
- Default handled at usage site (v4)

**Tests**:
- Type checking compiles
- zodVersion property is optional

### 1.2 Thread Configuration Through BaseBuilder
**File**: `src/ZodBuilder/BaseBuilder.ts`

```typescript
import type { Options, ZodVersion } from '../Types.js';

export abstract class ZodBuilder<T = string> {
  protected options?: Options;

  constructor(options?: Options) {
    this.options = options;
  }

  protected get zodVersion(): ZodVersion {
    return this.options?.zodVersion || 'v4';
  }

  protected isV4(): boolean {
    return this.zodVersion === 'v4';
  }

  protected isV3(): boolean {
    return this.zodVersion === 'v3';
  }

  protected withErrorMessage(message?: string): string {
    if (!message) return '';
    const param = this.isV4() ? 'error' : 'message';
    return `, { ${param}: ${JSON.stringify(message)} }`;
  }
}
```

**Tasks**:
- Add options parameter to constructor
- Add helper methods for version checking
- Update all builder subclasses to accept options
- Pass options to child builders when creating them

**Tests**:
- Version detection works correctly
- Options propagate to child builders
- Default version is 'v4'

### 1.3 Thread Options Through Parser Integration
**File**: `src/JsonSchema/toZod.ts` and parser files

```typescript
// In toZod.ts
export function toZod(schema: JsonSchema, options?: Options): string {
  const builder = parseSchema(schema, options);
  return builder.text();
}

// In parsers - pass options to builders
function parseString(schema: JsonSchemaObject, options?: Options): StringBuilder {
  const builder = new StringBuilder(options);
  // apply constraints
  return builder;
}
```

**Tasks**:
- Add options parameter to all factory functions
- Pass options to builder constructors
- Update exports

**Tests**:
- Factory functions accept options
- Options propagate correctly

## Phase 2: Error Handling Updates

### 2.1 Update withMessage Utility
**File**: `src/utils/withMessage.ts`

```typescript
export function withMessage(
  value: string | undefined,
  zodVersion: ZodVersion = 'v4'
): string {
  if (!value) return '';

  if (zodVersion === 'v4') {
    return `, { error: ${JSON.stringify(value)} }`;
  } else {
    return `, { message: ${JSON.stringify(value)} }`;
  }
}
```

**Tasks**:
- Add zodVersion parameter
- Return `error` for v4, `message` for v3
- Update all usages to pass version

**Tests**:
- v4 mode generates `error` parameter
- v3 mode generates `message` parameter
- Undefined values return empty string

### 2.2 Update BaseBuilder Error Methods
**File**: `src/ZodBuilder/BaseBuilder.ts`

```typescript
protected withErrorMessage(message?: string): string {
  return withMessage(message, this.zodVersion);
}
```

**Tasks**:
- Add helper method that uses instance version
- Update all subclasses to use this method

**Tests**:
- Error messages respect zodVersion
- Both v3 and v4 generate valid code

## Phase 3: String Format Builders (Hybrid Approach)

### 3.1 Create Format-Specific Builders
**New Files**:
- `src/ZodBuilder/email.ts`
- `src/ZodBuilder/uuid.ts`
- `src/ZodBuilder/url.ts`
- `src/ZodBuilder/ipv4.ts`
- `src/ZodBuilder/ipv6.ts`
- etc.

```typescript
// email.ts
export class EmailBuilder extends ZodBuilder<'email'> {
  readonly typeKind = 'email' as const;
  _errorMessage?: string;

  build(): string {
    if (this.isV4()) {
      return `z.email()${this.withErrorMessage(this._errorMessage)}`;
    } else {
      return `z.string().email()${this.withErrorMessage(this._errorMessage)}`;
    }
  }
}

// uuid.ts
export class UuidBuilder extends ZodBuilder<'uuid'> {
  readonly typeKind = 'uuid' as const;
  _errorMessage?: string;
  _lenient?: boolean; // for v3 compatibility

  build(): string {
    if (this.isV4()) {
      // Use guid() for lenient mode in v4
      const func = this._lenient ? 'guid' : 'uuid';
      return `z.${func}()${this.withErrorMessage(this._errorMessage)}`;
    } else {
      return `z.string().uuid()${this.withErrorMessage(this._errorMessage)}`;
    }
  }
}
```

**Tasks**:
- Create builder class for each format type
- Implement dual-mode build() method
- Handle format-specific options (like UUID lenient mode)
- Export all format builders

**Tests**:
- v4 mode generates top-level functions
- v3 mode generates string methods
- Error messages work in both modes

### 3.2 Update StringBuilder to Detect Format
**File**: `src/ZodBuilder/string.ts`

```typescript
export class StringBuilder extends ZodBuilder<'string'> {
  readonly typeKind = 'string' as const;
  _format?: { format: string; errorMessage?: string };
  _pattern?: { pattern: string; errorMessage?: string };
  _minLength?: { value: number; errorMessage?: string };
  _maxLength?: { value: number; errorMessage?: string };

  /**
   * Set email format - returns EmailBuilder in v4 mode
   */
  email(errorMessage?: string): EmailBuilder | this {
    if (this.isV4() && !this.hasStringConstraints()) {
      // Switch to EmailBuilder
      const emailBuilder = new EmailBuilder(this.options);
      emailBuilder._errorMessage = errorMessage;
      return emailBuilder;
    } else {
      // Keep as StringBuilder for v3 or when constraints exist
      this._format = { format: 'email', errorMessage };
      return this;
    }
  }

  uuid(errorMessage?: string): UuidBuilder | this {
    if (this.isV4() && !this.hasStringConstraints()) {
      const uuidBuilder = new UuidBuilder(this.options);
      uuidBuilder._errorMessage = errorMessage;
      return uuidBuilder;
    } else {
      this._format = { format: 'uuid', errorMessage };
      return this;
    }
  }

  private hasStringConstraints(): boolean {
    return !!(this._minLength || this._maxLength || this._pattern);
  }

  build(): string {
    let schema = 'z.string()';

    // Add format if in v3 mode or has constraints
    if (this._format) {
      schema += `.${this._format.format}()${this.withErrorMessage(this._format.errorMessage)}`;
    }

    // Add other string constraints
    if (this._minLength) {
      schema += `.min(${this._minLength.value}${this.withErrorMessage(this._minLength.errorMessage)})`;
    }
    if (this._maxLength) {
      schema += `.max(${this._maxLength.value}${this.withErrorMessage(this._maxLength.errorMessage)})`;
    }
    if (this._pattern) {
      schema += `.regex(/${this._pattern.pattern}/${this.withErrorMessage(this._pattern.errorMessage)})`;
    }

    return schema;
  }
}
```

**Tasks**:
- Add format detection logic
- Return format-specific builder in v4 when appropriate
- Fall back to StringBuilder when string constraints exist
- Update all format methods (email, uuid, url, etc.)
- Add new format methods (ipv4, ipv6, cidrv4, cidrv6)

**Tests**:
- v4 mode switches to format builders
- v3 mode stays in StringBuilder
- String with constraints stays in StringBuilder (both modes)
- All format types work correctly

## Phase 4: Object Builder Updates

### 4.1 Version-Aware Object Methods
**File**: `src/ZodBuilder/object.ts`

```typescript
export class ObjectBuilder extends ZodBuilder<'object'> {
  _strict?: boolean;
  _passthrough?: boolean;
  _properties: Record<string, ZodBuilder>;

  strict(): this {
    this._strict = true;
    return this;
  }

  passthrough(): this {
    this._passthrough = true;
    return this;
  }

  merge(other: ObjectBuilder): this {
    // Merge logic
    return this;
  }

  build(): string {
    const props = Object.entries(this._properties)
      .map(([key, builder]) => `${key}: ${builder.build()}`)
      .join(', ');

    if (this.isV4()) {
      // v4 mode: use top-level functions
      if (this._strict) {
        return `z.strictObject({ ${props} })`;
      } else if (this._passthrough) {
        return `z.looseObject({ ${props} })`;
      } else {
        return `z.object({ ${props} })`;
      }
    } else {
      // v3 mode: use methods
      let schema = `z.object({ ${props} })`;
      if (this._strict) {
        schema += '.strict()';
      } else if (this._passthrough) {
        schema += '.passthrough()';
      }
      return schema;
    }
  }

  // For merge, generate .extend() in v4, .merge() in v3
  buildMerge(other: ObjectBuilder): string {
    if (this.isV4()) {
      return `${this.build()}.extend(${other.buildProperties()})`;
    } else {
      return `${this.build()}.merge(${other.build()})`;
    }
  }
}
```

**Tasks**:
- Update build() to generate version-appropriate code
- Handle strict: `z.strictObject()` vs `.strict()`
- Handle passthrough: `z.looseObject()` vs `.passthrough()`
- Handle merge: `.extend()` vs `.merge()`
- Handle defaults in optional fields (v4 applies, v3 doesn't)

**Tests**:
- v4 generates top-level strict/loose functions
- v3 generates method chains
- Merge generates extend in v4, merge in v3
- Default behavior correct in both versions

## Phase 5: Enum Builder Updates

### 5.1 Version-Aware Enum Generation
**File**: `src/ZodBuilder/nativeEnum.ts`

```typescript
export class NativeEnumBuilder extends ZodBuilder<'nativeEnum'> {
  _values: any;

  constructor(values: any, options?: BuilderOptions) {
    super(options);
    this._values = values;
  }

  build(): string {
    if (this.isV4()) {
      return `z.enum(${JSON.stringify(this._values)})`;
    } else {
      return `z.nativeEnum(${JSON.stringify(this._values)})`;
    }
  }
}
```

**Tasks**:
- Update to generate `z.enum()` in v4
- Keep `z.nativeEnum()` in v3
- Handle enum value access patterns

**Tests**:
- v4 generates unified enum
- v3 generates nativeEnum
- Both validate same values

## Phase 6: Other Builder Updates

### 6.1 Number Builder - Infinity Handling
**File**: `src/ZodBuilder/number.ts`

```typescript
export class NumberBuilder extends ZodBuilder<'number'> {
  build(): string {
    let schema = 'z.number()';

    if (this.isV4()) {
      // v4 rejects infinity by default - no change needed
      // Add validation if needed
    } else {
      // v3 accepts infinity - maintain current behavior
    }

    // Add min/max/etc
    return schema;
  }
}
```

**Tasks**:
- Document that v4 rejects infinity (built-in)
- Maintain v3 behavior (accepts infinity)
- No code changes needed unless explicit handling required

**Tests**:
- v4 rejects Infinity/-Infinity
- v3 accepts Infinity/-Infinity

### 6.2 Record Builder - Argument Handling
**File**: `src/ZodBuilder/record.ts`

```typescript
export class RecordBuilder extends ZodBuilder<'record'> {
  _keySchema?: ZodBuilder;
  _valueSchema: ZodBuilder;

  build(): string {
    if (this.isV4()) {
      // v4 requires two arguments
      const key = this._keySchema ? this._keySchema.build() : 'z.string()';
      return `z.record(${key}, ${this._valueSchema.build()})`;
    } else {
      // v3 allows single argument
      if (this._keySchema) {
        return `z.record(${this._keySchema.build()}, ${this._valueSchema.build()})`;
      } else {
        return `z.record(${this._valueSchema.build()})`;
      }
    }
  }
}
```

**Tasks**:
- Always provide two arguments in v4
- Allow single argument in v3
- Handle enum keys (exhaustive in v4, partial in v3)

**Tests**:
- v4 always has two arguments
- v3 can have one or two arguments
- Enum key handling correct

### 6.3 Array Builder - .nonempty() Type
**File**: `src/ZodBuilder/array.ts`

```typescript
export class ArrayBuilder extends ZodBuilder<'array'> {
  _minItems?: number;

  nonempty(errorMessage?: string): this {
    this._minItems = 1;
    return this;
  }

  build(): string {
    let schema = `z.array(${this._elementSchema.build()})`;

    if (this._minItems === 1) {
      schema += `.nonempty()${this.withErrorMessage(this._errorMessage)}`;
    }

    // Note: Type inference changes in v4 (array vs tuple)
    // but validation behavior is same
    return schema;
  }
}
```

**Tasks**:
- Keep .nonempty() method (same in both versions)
- Document type inference difference
- Validation behavior identical

**Tests**:
- Both versions reject empty arrays
- Both versions accept non-empty arrays

## Phase 7: Testing Strategy

### 7.1 Dual-Mode Test Suite
**Files**: All test files in `test/`

```typescript
describe('StringBuilder (v4 mode)', () => {
  const builder = new StringBuilder({ zodVersion: 'v4' });

  it('generates top-level email function', () => {
    const result = builder.email().build();
    expect(result).toBe('z.email()');
  });
});

describe('StringBuilder (v3 mode)', () => {
  const builder = new StringBuilder({ zodVersion: 'v3' });

  it('generates string method chain', () => {
    const result = builder.email().build();
    expect(result).toBe('z.string().email()');
  });
});
```

**Tasks**:
- Add v4 mode tests for all builders
- Add v3 mode tests for all builders
- Test version switching
- Test default version (v4)
- Test edge cases in both modes

**Tests**:
- All builders work in v4 mode
- All builders work in v3 mode
- Generated code is valid for respective Zod version
- Behavior preserved (validation same)

### 7.2 Integration Tests
**File**: `test/integration.test.ts`

```typescript
describe('End-to-end schema generation', () => {
  it('generates v4 schema from JSON Schema', () => {
    const jsonSchema = { type: 'string', format: 'email' };
    const result = jsonSchemaToZod(jsonSchema, { zodVersion: 'v4' });
    expect(result).toBe('z.email()');
  });

  it('generates v3 schema from JSON Schema', () => {
    const jsonSchema = { type: 'string', format: 'email' };
    const result = jsonSchemaToZod(jsonSchema, { zodVersion: 'v3' });
    expect(result).toBe('z.string().email()');
  });
});
```

**Tasks**:
- Test full JSON Schema → Zod conversion in both modes
- Test complex nested schemas
- Verify validation behavior preserved
- Test CLI with version flag

## Phase 8: Documentation

### 8.1 Update README
**File**: `README.md`

Add section on Zod version support:
```markdown
## Zod Version Support

This library supports generating schemas for both Zod v3 and v4:

```typescript
// Generate Zod v4 code (default)
const schemaV4 = jsonSchemaToZod(schema, { zodVersion: 'v4' });
// Output: z.email()

// Generate Zod v3 code (compatibility)
const schemaV3 = jsonSchemaToZod(schema, { zodVersion: 'v3' });
// Output: z.string().email()
```

### Key Differences:
- **String formats**: v4 uses top-level functions, v3 uses methods
- **Objects**: v4 uses `z.strictObject()`, v3 uses `.strict()`
- **Enums**: v4 uses unified `z.enum()`, v3 uses `z.nativeEnum()`
- **Errors**: v4 uses `error` param, v3 uses `message` param
```

**Tasks**:
- Document zodVersion option
- Show examples for both versions
- List key differences
- Provide migration guide

### 8.2 Update MIGRATION-GUIDE
**File**: `MIGRATION-GUIDE.md`

Add section on version selection:
```markdown
## Choosing Zod Version

### When to use v4 mode (default)
- New projects starting with Zod v4
- Want latest features and performance
- Ready to adopt v4 breaking changes

### When to use v3 mode
- Existing projects on Zod v3
- Gradual migration to v4
- Need v3 compatibility

### Migration Path
1. Start with `zodVersion: 'v3'`
2. Test generated schemas
3. Switch to `zodVersion: 'v4'` when ready
4. Update consuming code for v4 changes
```

### 8.3 Add JSDoc Comments
**Files**: All builder files

```typescript
/**
 * Creates a string builder for generating Zod string schemas.
 *
 * @param options - Builder options including zodVersion
 * @returns StringBuilder instance
 *
 * @example
 * // v4 mode (default)
 * const schema = string().email(); // generates: z.email()
 *
 * @example
 * // v3 mode
 * const schema = string({ zodVersion: 'v3' }).email(); // generates: z.string().email()
 */
export function string(options?: BuilderOptions): StringBuilder {
  return new StringBuilder(options);
}
```

**Tasks**:
- Add JSDoc to all public functions
- Include examples for both versions
- Document version-specific behavior

## Implementation Order

1. ✅ **Phase 1**: Configuration (foundation for everything)
2. **Phase 2**: Error handling (affects all builders)
3. **Phase 3**: String formats (most complex, high impact)
4. **Phase 4**: Object builders (moderate complexity)
5. **Phase 5**: Enum builders (simple)
6. **Phase 6**: Other builders (various)
7. **Phase 7**: Testing (throughout, but comprehensive at end)
8. **Phase 8**: Documentation (can be done in parallel)

## Success Criteria

- [ ] All builders support zodVersion configuration
- [ ] v4 mode generates Zod v4-compatible code
- [ ] v3 mode generates Zod v3-compatible code
- [ ] All 183 existing tests pass in both modes
- [ ] New tests added for version-specific behavior
- [ ] Documentation complete with examples
- [ ] No performance regression (< 5%)
- [ ] TypeScript compilation clean
- [ ] Code review approved

## Rollback Plan

If issues arise:
1. Revert to `pre-refactor-006` tag
2. Isolate problematic phase
3. Fix issues in isolation
4. Re-run tests
5. Continue implementation

## Timeline Estimate

- Phase 1 (Config): 2-3 hours
- Phase 2 (Errors): 2-3 hours
- Phase 3 (Strings): 6-8 hours (most complex)
- Phase 4 (Objects): 3-4 hours
- Phase 5 (Enums): 1-2 hours
- Phase 6 (Others): 2-3 hours
- Phase 7 (Tests): 4-6 hours
- Phase 8 (Docs): 2-3 hours

**Total**: 22-32 hours estimated

---
*Implementation plan for refactor-006 - Dual-mode Zod v3/v4 support*
