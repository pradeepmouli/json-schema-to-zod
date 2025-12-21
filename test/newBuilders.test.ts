import { describe, it, expect } from 'vitest';
import { build } from '../src/ZodBuilder';

describe('New Zod Builders', () => {
	describe('Core Type Builders', () => {
		it('void builder', () => {
			const schema = build.void();
			expect(schema.text()).toBe('z.void()');
		});

		it('undefined builder', () => {
			const schema = build.undefined();
			expect(schema.text()).toBe('z.undefined()');
		});

		it('date builder', () => {
			const schema = build.date();
			expect(schema.text()).toBe('z.date()');
		});

		it('date builder with min/max', () => {
			const minDate = new Date('2024-01-01');
			const maxDate = new Date('2024-12-31');
			const schema = build.date().min(minDate).max(maxDate);
			expect(schema.text()).toContain('z.date()');
			expect(schema.text()).toContain('.min(');
			expect(schema.text()).toContain('.max(');
		});

		it('bigint builder', () => {
			const schema = build.bigint();
			expect(schema.text()).toBe('z.bigint()');
		});

		it('bigint builder with constraints', () => {
			const schema = build.bigint().min(0n).max(100n);
			expect(schema.text()).toContain('z.bigint()');
			expect(schema.text()).toContain('.gte(0n)');
			expect(schema.text()).toContain('.lte(100n)');
		});

		it('symbol builder', () => {
			const schema = build.symbol();
			expect(schema.text()).toBe('z.symbol()');
		});

		it('nan builder', () => {
			const schema = build.nan();
			expect(schema.text()).toBe('z.nan()');
		});
	});

	describe('String Validators', () => {
		it('url validator', () => {
			const schema = build.string().url();
			expect(schema.text()).toBe('z.string().url()');
		});

		it('httpUrl validator', () => {
			const schema = build.string().httpUrl();
			expect(schema.text()).toBe('z.string().httpUrl()');
		});

		it('hostname validator', () => {
			const schema = build.string().hostname();
			expect(schema.text()).toBe('z.string().hostname()');
		});

		it('emoji validator', () => {
			const schema = build.string().emoji();
			expect(schema.text()).toBe('z.string().emoji()');
		});

		it('base64url validator', () => {
			const schema = build.string().base64url();
			expect(schema.text()).toBe('z.string().base64url()');
		});

		it('hex validator', () => {
			const schema = build.string().hex();
			expect(schema.text()).toBe('z.string().hex()');
		});

		it('jwt validator', () => {
			const schema = build.string().jwt();
			expect(schema.text()).toBe('z.string().jwt()');
		});

		it('nanoid validator', () => {
			const schema = build.string().nanoid();
			expect(schema.text()).toBe('z.string().nanoid()');
		});

		it('cuid validator', () => {
			const schema = build.string().cuid();
			expect(schema.text()).toBe('z.string().cuid()');
		});

		it('cuid2 validator', () => {
			const schema = build.string().cuid2();
			expect(schema.text()).toBe('z.string().cuid2()');
		});

		it('ulid validator', () => {
			const schema = build.string().ulid();
			expect(schema.text()).toBe('z.string().ulid()');
		});

		it('ipv4 validator', () => {
			const schema = build.string().ipv4();
			expect(schema.text()).toBe('z.string().ip({ version: "v4" })');
		});

		it('ipv6 validator', () => {
			const schema = build.string().ipv6();
			expect(schema.text()).toBe('z.string().ip({ version: "v6" })');
		});

		it('mac validator', () => {
			const schema = build.string().mac();
			expect(schema.text()).toBe('z.string().mac()');
		});

		it('cidrv4 validator', () => {
			const schema = build.string().cidrv4();
			expect(schema.text()).toBe('z.string().cidrv4()');
		});

		it('cidrv6 validator', () => {
			const schema = build.string().cidrv6();
			expect(schema.text()).toBe('z.string().cidrv6()');
		});

		it('hash validator with algorithm', () => {
			const schema = build.string().hash('sha256');
			expect(schema.text()).toBe('z.string().hash("sha256")');
		});

		it('isoDate validator', () => {
			const schema = build.string().isoDate();
			expect(schema.text()).toBe('z.string().iso.date()');
		});

		it('isoTime validator', () => {
			const schema = build.string().isoTime();
			expect(schema.text()).toBe('z.string().iso.time()');
		});

		it('isoDatetime validator', () => {
			const schema = build.string().isoDatetime();
			expect(schema.text()).toBe('z.string().iso.datetime()');
		});

		it('isoDuration validator', () => {
			const schema = build.string().isoDuration();
			expect(schema.text()).toBe('z.string().iso.duration()');
		});

		it('uuidv4 validator', () => {
			const schema = build.string().uuidv4();
			expect(schema.text()).toBe('z.string().uuid({ version: "v4" })');
		});

		it('uuidv6 validator', () => {
			const schema = build.string().uuidv6();
			expect(schema.text()).toBe('z.string().uuid({ version: "v6" })');
		});

		it('uuidv7 validator', () => {
			const schema = build.string().uuidv7();
			expect(schema.text()).toBe('z.string().uuid({ version: "v7" })');
		});
	});

	describe('Collection Builders', () => {
		it('set builder', () => {
			const schema = build.set(build.string());
			expect(schema.text()).toBe('z.set(z.string())');
		});

		it('set builder with constraints', () => {
			const schema = build.set(build.number()).min(1).max(10);
			expect(schema.text()).toContain('z.set(z.number())');
			expect(schema.text()).toContain('.min(1)');
			expect(schema.text()).toContain('.max(10)');
		});

		it('map builder', () => {
			const schema = build.map(build.string(), build.number());
			expect(schema.text()).toBe('z.map(z.string(), z.number())');
		});

		it('map builder with constraints', () => {
			const schema = build.map(build.string(), build.number()).min(1).size(5);
			expect(schema.text()).toContain('z.map(z.string(), z.number())');
			expect(schema.text()).toContain('.min(1)');
			expect(schema.text()).toContain('.size(5)');
		});
	});

	describe('Modifiers', () => {
		it('meta modifier', () => {
			const schema = build.string().meta({ custom: 'metadata' });
			expect(schema.text()).toBe('z.string().meta({"custom":"metadata"})');
		});

		it('transform modifier', () => {
			const schema = build.string().transform('(val) => val.toUpperCase()');
			expect(schema.text()).toBe(
				'z.string().transform((val) => val.toUpperCase())',
			);
		});
	});

	describe('Object Methods', () => {
		it('extend method', () => {
			const schema = build
				.object({ name: build.string() })
				.extend('{ age: z.number() }');
			expect(schema.text()).toContain('extend({ age: z.number() })');
		});

		it('merge method', () => {
			const schema = build
				.object({ name: build.string() })
				.merge('otherSchema');
			expect(schema.text()).toContain('.merge(otherSchema)');
		});

		it('pick method', () => {
			const schema = build
				.object({ name: build.string(), age: build.number() })
				.pick(['name']);
			expect(schema.text()).toContain('.pick({ "name": true })');
		});

		it('omit method', () => {
			const schema = build
				.object({ name: build.string(), age: build.number() })
				.omit(['age']);
			expect(schema.text()).toContain('.omit({ "age": true })');
		});
	});

	describe('Custom Builder', () => {
		it('custom builder without validation', () => {
			const schema = build.custom();
			expect(schema.text()).toBe('z.custom()');
		});

		it('custom builder with validation function', () => {
			const schema = build.custom('(val) => typeof val === "string"');
			expect(schema.text()).toBe('z.custom((val) => typeof val === "string")');
		});

		it('custom builder with validation and params', () => {
			const schema = build.custom('(val) => val.length > 5', {
				message: 'Too short',
			});
			expect(schema.text()).toBe(
				'z.custom((val) => val.length > 5, {"message":"Too short"})',
			);
		});
	});

	describe('Zod v4 Builders', () => {
		it('promise builder', () => {
			const schema = build.promise(build.string());
			expect(schema.text()).toBe('z.promise(z.string())');
		});

		it('promise builder with complex type', () => {
			const schema = build.promise(
				build.object({ name: build.string(), age: build.number() }),
			);
			expect(schema.text()).toContain('z.promise(');
			expect(schema.text()).toContain('z.object({');
		});

		it('promise builder with modifiers', () => {
			const schema = build.promise(build.number()).optional();
			expect(schema.text()).toBe('z.promise(z.number()).optional()');
		});

		it('lazy builder', () => {
			const schema = build.lazy('() => z.string()');
			expect(schema.text()).toBe('z.lazy(() => z.string())');
		});

		it('lazy builder for recursive schema', () => {
			const schema = build.lazy('() => nodeSchema');
			expect(schema.text()).toBe('z.lazy(() => nodeSchema)');
		});

		it('function builder without args', () => {
			const schema = build.function();
			expect(schema.text()).toBe('z.function()');
		});

		it('function builder with returns only', () => {
			const schema = build.function().returns(build.string());
			expect(schema.text()).toBe('z.function().returns(z.string())');
		});

		it('function builder with args only', () => {
			const schema = build.function().args(build.string(), build.number());
			expect(schema.text()).toBe('z.function().args(z.string(),z.number())');
		});

		it('function builder with args and returns', () => {
			const schema = build
				.function()
				.args(build.string())
				.returns(build.number());
			expect(schema.text()).toBe(
				'z.function().args(z.string()).returns(z.number())',
			);
		});

		it('function builder with modifiers', () => {
			const schema = build.function().returns(build.boolean()).optional();
			expect(schema.text()).toBe(
				'z.function().returns(z.boolean()).optional()',
			);
		});

		it('codec builder', () => {
			const schema = build.codec(build.string(), build.number());
			expect(schema.text()).toBe('z.codec(z.string(),z.number())');
		});

		it('codec builder with complex types', () => {
			const schema = build.codec(
				build.object({ raw: build.string() }),
				build.object({ parsed: build.number() }),
			);
			expect(schema.text()).toContain('z.codec(');
			expect(schema.text()).toContain('z.object({');
		});

		it('preprocess builder', () => {
			const fnStr = '(val) => val.trim()';
			const schema = build.preprocess(fnStr, build.string());
			expect(schema.text()).toBe(`z.preprocess(${fnStr},z.string())`);
		});

		it('preprocess builder with complex transformation', () => {
			const fnStr = '(val) => parseInt(val, 10)';
			const schema = build.preprocess(fnStr, build.number());
			expect(schema.text()).toBe(`z.preprocess(${fnStr},z.number())`);
		});

		it('pipe builder', () => {
			const schema = build.pipe(build.string(), build.number());
			expect(schema.text()).toBe('z.string().pipe(z.number())');
		});

		it('pipe builder with transformations', () => {
			const schema = build.pipe(
				build.string().transform('(val) => parseInt(val)'),
				build.number().min(0),
			);
			expect(schema.text()).toContain('.pipe(');
			expect(schema.text()).toContain('z.number()');
		});

		it('json builder', () => {
			const schema = build.json();
			expect(schema.text()).toBe('z.json()');
		});

		it('json builder with modifiers', () => {
			const schema = build.json().optional();
			expect(schema.text()).toBe('z.json().optional()');
		});

		it('file builder', () => {
			const schema = build.file();
			expect(schema.text()).toBe('z.file()');
		});

		it('file builder with modifiers', () => {
			const schema = build.file().nullable();
			expect(schema.text()).toBe('z.file().nullable()');
		});

		it('nativeEnum builder', () => {
			const schema = build.nativeEnum('MyEnum');
			expect(schema.text()).toBe('z.nativeEnum(MyEnum)');
		});

		it('nativeEnum builder with modifiers', () => {
			const schema = build.nativeEnum('Status').optional();
			expect(schema.text()).toBe('z.nativeEnum(Status).optional()');
		});

		it('templateLiteral builder with strings only', () => {
			const schema = build.templateLiteral(['prefix-', 'suffix']);
			expect(schema.text()).toBe('z.templateLiteral(["prefix-","suffix"])');
		});

		it('templateLiteral builder with mixed parts', () => {
			const schema = build.templateLiteral([
				'user-',
				build.string(),
				'-',
				build.number(),
			]);
			expect(schema.text()).toContain('z.templateLiteral([');
			expect(schema.text()).toContain('"user-"');
			expect(schema.text()).toContain('z.string()');
			expect(schema.text()).toContain('z.number()');
		});

		it('xor builder', () => {
			const schema = build.xor([build.string(), build.number()]);
			expect(schema.text()).toBe('z.xor([z.string(),z.number()])');
		});

		it('xor builder with complex types', () => {
			const schema = build.xor([
				build.object({ type: build.literal('a'), value: build.string() }),
				build.object({ type: build.literal('b'), value: build.number() }),
			]);
			expect(schema.text()).toContain('z.xor([');
			expect(schema.text()).toContain('z.object({');
		});
	});
});
