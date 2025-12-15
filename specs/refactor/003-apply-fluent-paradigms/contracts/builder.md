# Contracts: Fluent Zod-like Builders

## Factory Surface

```ts
// Builder factories
export const build = {
  number(): NumberBuilder,
  string(): StringBuilder,
  array(item?: string): ArrayBuilder,
  object(): ObjectBuilder,
  boolean(): BooleanBuilder,
  null(): NullBuilder,
  enum(values: string[]): EnumBuilder,
  const(value: unknown): ConstBuilder,
};
```

## `NumberBuilder`

```ts
interface NumberBuilder {
  int(): this;
  min(n: number): this;
  max(n: number): this;
  nonnegative(): this;
  positive(): this;
  negative(): this;
  finite(): this;
  optional(): this;
  done(): string; // returns final Zod code string
}
```

## `StringBuilder`

```ts
interface StringBuilder {
  min(n: number): this;
  max(n: number): this;
  regex(re: RegExp | string): this;
  email(): this;
  uuid(): this;
  optional(): this;
  done(): string;
}
```

## `ArrayBuilder`

```ts
interface ArrayBuilder {
  items(inner: string): this; // sets inner element schema
  min(n: number): this;
  max(n: number): this;
  nonempty(): this;
  optional(): this;
  done(): string;
}
```

## `ObjectBuilder`

```ts
interface ObjectBuilder {
  partial(): this;
  passthrough(): this;
  optional(): this;
  done(): string;
}
```

## Notes

- All methods MUST delegate to existing `apply*` helpers to preserve behavior.
- `.done()` returns a string identical to current outputs for equivalent parser flows.
