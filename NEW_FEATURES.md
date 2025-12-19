# New Zod Functions and Modifiers

This document describes the newly implemented Zod functions and modifiers added to the json-schema-to-zod library.

## Core Type Builders

### Primitive Types

#### `build.void()`
Creates a void type schema.
```typescript
const schema = build.void();
// Output: z.void()
```

#### `build.undefined()`
Creates an undefined type schema.
```typescript
const schema = build.undefined();
// Output: z.undefined()
```

#### `build.nan()`
Creates a NaN type schema.
```typescript
const schema = build.nan();
// Output: z.nan()
```

#### `build.symbol()`
Creates a symbol type schema.
```typescript
const schema = build.symbol();
// Output: z.symbol()
```

### Date Builder

#### `build.date()`
Creates a date schema with optional min/max constraints.
```typescript
const schema = build.date()
  .min(new Date('2024-01-01'))
  .max(new Date('2024-12-31'));
// Output: z.date().min(new Date("2024-01-01T00:00:00.000Z")).max(new Date("2024-12-31T00:00:00.000Z"))
```

### BigInt Builder

#### `build.bigint()`
Creates a bigint schema with optional constraints.
```typescript
const schema = build.bigint()
  .min(0n)
  .max(1000000n)
  .multipleOf(10n);
// Output: z.bigint().gte(0n).lte(1000000n).multipleOf(10n)
```

**Methods:**
- `min(value: bigint, exclusive?: boolean, errorMessage?: string)`: Set minimum value
- `max(value: bigint, exclusive?: boolean, errorMessage?: string)`: Set maximum value
- `multipleOf(value: bigint, errorMessage?: string)`: Require multiple of specified value

## Advanced String Validators

All string validators are methods on `StringBuilder` (returned by `build.string()`).

### URL Validators

#### `url(errorMessage?: string)`
```typescript
const schema = build.string().url();
// Output: z.string().url()
```

#### `httpUrl(errorMessage?: string)`
Validates HTTP or HTTPS URLs only.
```typescript
const schema = build.string().httpUrl();
// Output: z.string().httpUrl()
```

#### `hostname(errorMessage?: string)`
```typescript
const schema = build.string().hostname();
// Output: z.string().hostname()
```

### Network Validators

#### `ipv4(errorMessage?: string)`
```typescript
const schema = build.string().ipv4();
// Output: z.string().ip({ version: "v4" })
```

#### `ipv6(errorMessage?: string)`
```typescript
const schema = build.string().ipv6();
// Output: z.string().ip({ version: "v6" })
```

#### `mac(errorMessage?: string)`
Validates MAC addresses.
```typescript
const schema = build.string().mac();
// Output: z.string().mac()
```

#### `cidrv4(errorMessage?: string)`
Validates IPv4 CIDR blocks.
```typescript
const schema = build.string().cidrv4();
// Output: z.string().cidrv4()
```

#### `cidrv6(errorMessage?: string)`
Validates IPv6 CIDR blocks.
```typescript
const schema = build.string().cidrv6();
// Output: z.string().cidrv6()
```

### Encoding Validators

#### `base64url(errorMessage?: string)`
```typescript
const schema = build.string().base64url();
// Output: z.string().base64url()
```

#### `hex(errorMessage?: string)`
```typescript
const schema = build.string().hex();
// Output: z.string().hex()
```

### Token Validators

#### `jwt(errorMessage?: string)`
```typescript
const schema = build.string().jwt();
// Output: z.string().jwt()
```

#### `nanoid(errorMessage?: string)`
```typescript
const schema = build.string().nanoid();
// Output: z.string().nanoid()
```

#### `cuid(errorMessage?: string)`
```typescript
const schema = build.string().cuid();
// Output: z.string().cuid()
```

#### `cuid2(errorMessage?: string)`
```typescript
const schema = build.string().cuid2();
// Output: z.string().cuid2()
```

#### `ulid(errorMessage?: string)`
```typescript
const schema = build.string().ulid();
// Output: z.string().ulid()
```

### UUID Validators

#### `uuidv4(errorMessage?: string)`
```typescript
const schema = build.string().uuidv4();
// Output: z.string().uuid({ version: "v4" })
```

#### `uuidv6(errorMessage?: string)`
```typescript
const schema = build.string().uuidv6();
// Output: z.string().uuid({ version: "v6" })
```

#### `uuidv7(errorMessage?: string)`
```typescript
const schema = build.string().uuidv7();
// Output: z.string().uuid({ version: "v7" })
```

### Hash Validator

#### `hash(algorithm: 'sha256' | 'sha1' | 'sha384' | 'sha512' | 'md5', errorMessage?: string)`
```typescript
const schema = build.string().hash('sha256');
// Output: z.string().hash("sha256")
```

### ISO Date/Time Validators

#### `isoDate(errorMessage?: string)`
```typescript
const schema = build.string().isoDate();
// Output: z.string().iso.date()
```

#### `isoTime(errorMessage?: string)`
```typescript
const schema = build.string().isoTime();
// Output: z.string().iso.time()
```

#### `isoDatetime(errorMessage?: string)`
```typescript
const schema = build.string().isoDatetime();
// Output: z.string().iso.datetime()
```

#### `isoDuration(errorMessage?: string)`
```typescript
const schema = build.string().isoDuration();
// Output: z.string().iso.duration()
```

### Emoji Validator

#### `emoji(errorMessage?: string)`
Validates a single emoji character.
```typescript
const schema = build.string().emoji();
// Output: z.string().emoji()
```

## Collection Builders

### Set Builder

#### `build.set(itemSchema: BaseBuilder)`
Creates a set schema with optional size constraints.

```typescript
const schema = build.set(build.string())
  .min(1)
  .max(10)
  .size(5);
// Output: z.set(z.string()).min(1).max(10).size(5)
```

**Methods:**
- `min(value: number, errorMessage?: string)`: Set minimum size
- `max(value: number, errorMessage?: string)`: Set maximum size
- `size(value: number, errorMessage?: string)`: Set exact size

### Map Builder

#### `build.map(keySchema: BaseBuilder, valueSchema: BaseBuilder)`
Creates a map schema with optional size constraints.

```typescript
const schema = build.map(build.string(), build.number())
  .min(1)
  .size(10);
// Output: z.map(z.string(), z.number()).min(1).size(10)
```

**Methods:**
- `min(value: number, errorMessage?: string)`: Set minimum size
- `max(value: number, errorMessage?: string)`: Set maximum size
- `size(value: number, errorMessage?: string)`: Set exact size

## Object Utility Methods

New methods available on `ObjectBuilder` (returned by `build.object()`).

### `extend(extendSchemaZod: string)`
Extend an object schema with additional properties.

```typescript
const schema = build.object({ name: build.string() })
  .extend('{ age: z.number() }');
// Output: z.object({ "name": z.string() }).extend({ age: z.number() })
```

### `merge(mergeSchemaZod: string)`
Merge with another object schema.

```typescript
const schema = build.object({ name: build.string() })
  .merge('otherSchema');
// Output: z.object({ "name": z.string() }).merge(otherSchema)
```

### `pick(keys: string[])`
Select specific keys from the object schema.

```typescript
const schema = build.object({ 
  name: build.string(), 
  age: build.number(),
  email: build.string() 
}).pick(['name', 'email']);
// Output: z.object({ ... }).pick({ "name": true, "email": true })
```

### `omit(keys: string[])`
Exclude specific keys from the object schema.

```typescript
const schema = build.object({ 
  name: build.string(), 
  age: build.number() 
}).omit(['age']);
// Output: z.object({ ... }).omit({ "age": true })
```

## Additional Modifiers

New modifiers available on all builders via `BaseBuilder`.

### `meta(metadata: any)`
Attach metadata to a schema.

```typescript
const schema = build.string()
  .meta({ description: 'A custom field', version: 1 });
// Output: z.string().meta({"description":"A custom field","version":1})
```

### `transform(transformFn: string)`
Apply a transform function to a schema.

```typescript
const schema = build.string()
  .transform('(val) => val.toUpperCase()');
// Output: z.string().transform((val) => val.toUpperCase())
```

## Custom Builder

### `build.custom(validateFn?: string, params?: any)`
Create a custom validator.

```typescript
// Simple custom validator
const schema = build.custom('(val) => typeof val === "string"');
// Output: z.custom((val) => typeof val === "string")

// With parameters
const schema = build.custom(
  '(val) => val > 0',
  { message: 'Must be positive' }
);
// Output: z.custom((val) => val > 0, {"message":"Must be positive"})
```

## Complex Example

Here's a comprehensive example using multiple new features:

```typescript
const userSchema = build.object({
  id: build.string().uuidv4(),
  email: build.string().email().transform('(val) => val.toLowerCase()'),
  username: build.string().min(3).max(20),
  age: build.number().int().min(18).max(120).optional(),
  createdAt: build.date(),
  metadata: build.object({}).meta({ description: 'User metadata' }).optional(),
  roles: build.set(build.string()).min(1),
  permissions: build.map(build.string(), build.boolean()),
})
  .strict()
  .meta({ version: '1.0', entity: 'User' });
```

## Testing

All new features include comprehensive test coverage. See `test/newBuilders.test.ts` for examples.

Run tests with:
```bash
npm test
```

## Compatibility

These features are compatible with:
- Zod v4.x
- TypeScript (strict mode)
- All existing json-schema-to-zod functionality
