import { describe, it, expect } from 'vitest';
import { build } from '../src/ZodBuilder/index.js';

describe('String Format Builders - Hybrid Approach', () => {
	describe('EmailBuilder - v4 mode', () => {
		it('should generate z.email() in v4 mode without constraints', () => {
			const email = build.string({ zodVersion: 'v4' }).email();
			expect(email.text()).toBe('z.email()');
		});

		it('should generate z.email({ error: "..." }) with error message in v4', () => {
			const email = build.string({ zodVersion: 'v4' }).email('Invalid email');
			expect(email.text()).toBe('z.email({ error: "Invalid email" })');
		});

		it('should stay in StringBuilder when constraints exist in v4', () => {
			const email = build
				.string({ zodVersion: 'v4' })
				.min(5)
				.email('Invalid email');
			expect(email.text()).toContain('z.string()');
			expect(email.text()).toContain('.min(5)');
			expect(email.text()).toContain('.email(');
		});
	});

	describe('EmailBuilder - v3 mode', () => {
		it('should generate z.string().email() in v3 mode', () => {
			const email = build.string({ zodVersion: 'v3' }).email();
			expect(email.text()).toBe('z.string().email()');
		});

		it('should generate z.string().email({ message: "..." }) in v3', () => {
			const email = build.string({ zodVersion: 'v3' }).email('Invalid email');
			expect(email.text()).toBe('z.string().email("Invalid email")');
		});
	});

	describe('UrlBuilder - v4 mode', () => {
		it('should generate z.url() in v4 mode without constraints', () => {
			const url = build.string({ zodVersion: 'v4' }).url();
			expect(url.text()).toBe('z.url()');
		});

		it('should stay in StringBuilder when min length exists', () => {
			const url = build.string({ zodVersion: 'v4' }).min(10).url();
			expect(url.text()).toContain('z.string()');
			expect(url.text()).toContain('.min(10)');
		});
	});

	describe('UuidBuilder - v4 mode', () => {
		it('should generate z.uuid() in v4 mode without constraints', () => {
			const uuid = build.string({ zodVersion: 'v4' }).uuid();
			expect(uuid.text()).toBe('z.uuid()');
		});

		it('should generate z.uuid({ error: "..." }) with error message', () => {
			const uuid = build.string({ zodVersion: 'v4' }).uuid('Invalid UUID');
			expect(uuid.text()).toBe('z.uuid({ error: "Invalid UUID" })');
		});
	});

	describe('UuidBuilder - v3 mode', () => {
		it('should generate z.string().uuid() in v3 mode', () => {
			const uuid = build.string({ zodVersion: 'v3' }).uuid();
			expect(uuid.text()).toBe('z.string().uuid()');
		});
	});

	describe('IpBuilder - v4 mode', () => {
		it('should generate z.ipv4() in v4 mode', () => {
			const ip = build.string({ zodVersion: 'v4' }).ipv4();
			expect(ip.text()).toBe('z.ipv4()');
		});

		it('should generate z.ipv6() in v4 mode', () => {
			const ip = build.string({ zodVersion: 'v4' }).ipv6();
			expect(ip.text()).toBe('z.ipv6()');
		});
	});

	describe('CuidBuilder - v4 mode', () => {
		it('should generate z.cuid() in v4 mode', () => {
			const cuid = build.string({ zodVersion: 'v4' }).cuid();
			expect(cuid.text()).toBe('z.cuid()');
		});

		it('should generate z.cuid2() in v4 mode', () => {
			const cuid2 = build.string({ zodVersion: 'v4' }).cuid2();
			expect(cuid2.text()).toBe('z.cuid2()');
		});
	});

	describe('UlidBuilder - v4 mode', () => {
		it('should generate z.ulid() in v4 mode', () => {
			const ulid = build.string({ zodVersion: 'v4' }).ulid();
			expect(ulid.text()).toBe('z.ulid()');
		});
	});

	describe('NanoidBuilder - v4 mode', () => {
		it('should generate z.nanoid() in v4 mode', () => {
			const nanoid = build.string({ zodVersion: 'v4' }).nanoid();
			expect(nanoid.text()).toBe('z.nanoid()');
		});
	});

	describe('EmojiBuilder - v4 mode', () => {
		it('should generate z.emoji() in v4 mode', () => {
			const emoji = build.string({ zodVersion: 'v4' }).emoji();
			expect(emoji.text()).toBe('z.emoji()');
		});
	});

	describe('Base64Builder - v4 mode', () => {
		it('should generate z.base64() in v4 mode', () => {
			const b64 = build.string({ zodVersion: 'v4' }).base64();
			expect(b64.text()).toBe('z.base64()');
		});

		it('should stay in StringBuilder when pattern exists', () => {
			const b64 = build
				.string({ zodVersion: 'v4' })
				.regex(/^[A-Za-z0-9+/=]+$/)
				.base64();
			expect(b64.text()).toContain('z.string()');
			expect(b64.text()).toContain('.regex(');
		});
	});

	describe('Constraints-first behavior', () => {
		it('should stay in StringBuilder when minLength comes first', () => {
			const result = build
				.string({ zodVersion: 'v4' })
				.min(10)
				.max(100)
				.email();
			expect(result.text()).toContain('z.string()');
			expect(result.text()).toContain('.min(10)');
			expect(result.text()).toContain('.max(100)');
			expect(result.text()).toContain('.email()');
		});

		it('should stay in StringBuilder when pattern exists', () => {
			const result = build
				.string({ zodVersion: 'v4' })
				.regex(/^[a-z]+$/)
				.uuid();
			expect(result.text()).toContain('z.string()');
			expect(result.text()).toContain('.regex(');
			expect(result.text()).toContain('.uuid()');
		});
	});

	describe('Modifier support on format builders', () => {
		it('should support .optional() on EmailBuilder', () => {
			const email = build.string({ zodVersion: 'v4' }).email().optional();
			expect(email.text()).toBe('z.email().optional()');
		});

		it('should support .nullable() on UuidBuilder', () => {
			const uuid = build.string({ zodVersion: 'v4' }).uuid().nullable();
			expect(uuid.text()).toBe('z.uuid().nullable()');
		});

		it('should support .describe() on UrlBuilder', () => {
			const url = build
				.string({ zodVersion: 'v4' })
				.url()
				.describe('A valid URL');
			expect(url.text()).toBe('z.url().describe("A valid URL")');
		});
	});
});
