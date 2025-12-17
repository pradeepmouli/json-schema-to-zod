import { build } from '../src/ZodBuilder';

/**
 * Comprehensive examples demonstrating all newly implemented Zod functions and modifiers
 */

// Core Type Builders
const voidSchema = build.void();
const undefinedSchema = build.undefined();
const dateSchema = build.date().min(new Date('2024-01-01')).max(new Date('2024-12-31'));
const bigintSchema = build.bigint().min(0n).max(1000000n).multipleOf(10n);
const symbolSchema = build.symbol();
const nanSchema = build.nan();

// Advanced String Validators
const urlSchema = build.string().url();
const httpUrlSchema = build.string().httpUrl();
const hostnameSchema = build.string().hostname();
const ipv4Schema = build.string().ipv4();
const ipv6Schema = build.string().ipv6();
const macSchema = build.string().mac();
const cidrv4Schema = build.string().cidrv4();
const cidrv6Schema = build.string().cidrv6();
const base64urlSchema = build.string().base64url();
const hexSchema = build.string().hex();
const jwtSchema = build.string().jwt();
const nanoidSchema = build.string().nanoid();
const cuidSchema = build.string().cuid();
const cuid2Schema = build.string().cuid2();
const ulidSchema = build.string().ulid();
const uuidv4Schema = build.string().uuidv4();
const uuidv6Schema = build.string().uuidv6();
const uuidv7Schema = build.string().uuidv7();
const hashSchema = build.string().hash('sha256');
const isoDateSchema = build.string().isoDate();
const isoTimeSchema = build.string().isoTime();
const isoDatetimeSchema = build.string().isoDatetime();
const isoDurationSchema = build.string().isoDuration();
const emojiSchema = build.string().emoji();

// Collection Builders
const setSchema = build.set(build.string()).min(1).max(10);
const mapSchema = build.map(build.string(), build.number()).min(1);

// Object Utility Methods
const extendedObjectSchema = build.object({ name: build.string() }).extend('{ age: z.number() }');
const mergedObjectSchema = build.object({ name: build.string() }).merge('otherSchema');
const pickedObjectSchema = build.object({ name: build.string(), age: build.number() }).pick(['name']);
const omittedObjectSchema = build.object({ name: build.string(), age: build.number() }).omit(['age']);

// Additional Modifiers
const metaSchema = build.string().meta({ description: 'A custom field' });
const transformSchema = build.string().transform('(val) => val.toUpperCase()');

// Custom Builder
const customSchema = build.custom('(val) => typeof val === "string"');

export {
voidSchema,
undefinedSchema,
dateSchema,
bigintSchema,
symbolSchema,
nanSchema,
urlSchema,
httpUrlSchema,
hostnameSchema,
ipv4Schema,
ipv6Schema,
macSchema,
cidrv4Schema,
cidrv6Schema,
base64urlSchema,
hexSchema,
jwtSchema,
nanoidSchema,
cuidSchema,
cuid2Schema,
ulidSchema,
uuidv4Schema,
uuidv6Schema,
uuidv7Schema,
hashSchema,
isoDateSchema,
isoTimeSchema,
isoDatetimeSchema,
isoDurationSchema,
emojiSchema,
setSchema,
mapSchema,
extendedObjectSchema,
mergedObjectSchema,
pickedObjectSchema,
omittedObjectSchema,
metaSchema,
transformSchema,
customSchema,
};
