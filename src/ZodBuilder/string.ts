/**
 * Build a base Zod string schema string.
 */
export function buildString(): string {
  return "z.string()";
}

/**
 * Apply format constraint to a string schema.
 */
export function applyFormat(zodStr: string, format: string, errorMessage?: string): string {
  switch (format) {
    case "email":
      return errorMessage
        ? `${zodStr}.email(${JSON.stringify(errorMessage)})`
        : `${zodStr}.email()`;
    case "ip":
      return errorMessage
        ? `${zodStr}.ip(${JSON.stringify(errorMessage)})`
        : `${zodStr}.ip()`;
    case "ipv4":
      return errorMessage
        ? `${zodStr}.ip({ version: "v4", message: ${JSON.stringify(errorMessage)} })`
        : `${zodStr}.ip({ version: "v4" })`;
    case "ipv6":
      return errorMessage
        ? `${zodStr}.ip({ version: "v6", message: ${JSON.stringify(errorMessage)} })`
        : `${zodStr}.ip({ version: "v6" })`;
    case "uri":
      return errorMessage
        ? `${zodStr}.url(${JSON.stringify(errorMessage)})`
        : `${zodStr}.url()`;
    case "uuid":
      return errorMessage
        ? `${zodStr}.uuid(${JSON.stringify(errorMessage)})`
        : `${zodStr}.uuid()`;
    case "date-time":
      return errorMessage
        ? `${zodStr}.datetime({ offset: true, message: ${JSON.stringify(errorMessage)} })`
        : `${zodStr}.datetime({ offset: true })`;
    case "time":
      return errorMessage
        ? `${zodStr}.time(${JSON.stringify(errorMessage)})`
        : `${zodStr}.time()`;
    case "date":
      return errorMessage
        ? `${zodStr}.date(${JSON.stringify(errorMessage)})`
        : `${zodStr}.date()`;
    case "binary":
      return errorMessage
        ? `${zodStr}.base64(${JSON.stringify(errorMessage)})`
        : `${zodStr}.base64()`;
    case "duration":
      return errorMessage
        ? `${zodStr}.duration(${JSON.stringify(errorMessage)})`
        : `${zodStr}.duration()`;
    default:
      return zodStr;
  }
}

/**
 * Apply regex pattern constraint to a string schema.
 */
export function applyPattern(zodStr: string, pattern: string, errorMessage?: string): string {
  return errorMessage
    ? `${zodStr}.regex(new RegExp(${JSON.stringify(pattern)}), ${JSON.stringify(errorMessage)})`
    : `${zodStr}.regex(new RegExp(${JSON.stringify(pattern)}))`;
}

/**
 * Apply minLength constraint to a string schema.
 */
export function applyMinLength(zodStr: string, value: number, errorMessage?: string): string {
  return errorMessage
    ? `${zodStr}.min(${JSON.stringify(value)}, ${JSON.stringify(errorMessage)})`
    : `${zodStr}.min(${JSON.stringify(value)})`;
}

/**
 * Apply maxLength constraint to a string schema.
 */
export function applyMaxLength(zodStr: string, value: number, errorMessage?: string): string {
  return errorMessage
    ? `${zodStr}.max(${JSON.stringify(value)}, ${JSON.stringify(errorMessage)})`
    : `${zodStr}.max(${JSON.stringify(value)})`;
}

/**
 * Apply base64 encoding constraint to a string schema.
 */
export function applyBase64(zodStr: string, errorMessage?: string): string {
  return errorMessage
    ? `${zodStr}.base64(${JSON.stringify(errorMessage)})`
    : `${zodStr}.base64()`;
}

/**
 * Apply JSON transform to a string schema.
 * Note: The transform function always uses "Invalid JSON" as the internal error message.
 * The errorMessage parameter becomes the second argument to .transform() for Zod's error handling.
 */
export function applyJsonTransform(zodStr: string, errorMessage?: string): string {
  const transformPart = `(str, ctx) => { try { return JSON.parse(str); } catch (err) { ctx.addIssue({ code: "custom", message: "Invalid JSON" }); }}`;

  if (errorMessage) {
    return `${zodStr}.transform(${transformPart}, ${JSON.stringify(errorMessage)})`;
  }
  return `${zodStr}.transform(${transformPart})`;
}/**
 * Apply pipe with parsed content schema.
 */
export function applyPipe(zodStr: string, contentSchemaZod: string, errorMessage?: string): string {
  return errorMessage
    ? `${zodStr}.pipe(${contentSchemaZod}, ${JSON.stringify(errorMessage)})`
    : `${zodStr}.pipe(${contentSchemaZod})`;
}
