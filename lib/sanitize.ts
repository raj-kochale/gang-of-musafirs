/**
 * Input sanitisation & validation helpers.
 *
 * Prevents NoSQL injection ($-prefixed keys), XSS (strips HTML tags),
 * and enforces field-level constraints (phone, email, name, etc.).
 */

/* ── Sanitisation ── */

/** Strip HTML tags and trim whitespace */
export function stripHtml(str: string): string {
    return str.replace(/<[^>]*>/g, "").trim();
}

/**
 * Remove MongoDB operator keys like `$gt`, `$ne`, `$regex`, etc.
 * Works on strings — if someone passes `{"$gt":""}` as a field it
 * becomes a harmless empty string.
 */
export function sanitizeString(input: unknown): string {
    if (typeof input !== "string") return "";
    // Remove null bytes
    let s = input.replace(/\0/g, "");
    // Strip HTML tags
    s = stripHtml(s);
    // Limit length to 1000 chars (prevent oversized payloads)
    s = s.slice(0, 1000);
    return s;
}

/**
 * Recursively sanitise an object — removes any keys that start with `$`
 * (MongoDB operator injection) and sanitises all string values.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sanitizeObject(obj: Record<string, any>): Record<string, any> {
    const clean: Record<string, unknown> = {};
    for (const key of Object.keys(obj)) {
        // Block MongoDB operators
        if (key.startsWith("$")) continue;
        const val = obj[key];
        if (typeof val === "string") {
            clean[key] = sanitizeString(val);
        } else if (typeof val === "number" || typeof val === "boolean") {
            clean[key] = val;
        } else if (val && typeof val === "object" && !Array.isArray(val)) {
            clean[key] = sanitizeObject(val);
        } else {
            clean[key] = val;
        }
    }
    return clean;
}

/* ── Validation ── */

const PHONE_RE = /^\+?\d{10,15}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_RE = /^[A-Za-z\u0900-\u097F\s'.,-]{2,100}$/; // Latin + Devanagari

export function isValidPhone(phone: string): boolean {
    // Strip spaces, dashes, parens for validation
    const digits = phone.replace(/[\s\-().]/g, "");
    return PHONE_RE.test(digits);
}

export function isValidEmail(email: string): boolean {
    return EMAIL_RE.test(email) && email.length <= 254;
}

export function isValidName(name: string): boolean {
    return NAME_RE.test(name);
}

export function isValidDate(dateStr: string): boolean {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;
    // Must be today or in the future
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d >= today;
}

export function isValidTravelers(n: unknown): boolean {
    const num = Number(n);
    return Number.isInteger(num) && num >= 1 && num <= 100;
}

/**
 * Normalise a phone number: keep only `+` prefix and digits.
 */
export function normalizePhone(phone: string): string {
    return phone.replace(/[^\d+]/g, "");
}
