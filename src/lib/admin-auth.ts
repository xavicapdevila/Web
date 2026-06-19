import { createHmac, createHash, timingSafeEqual } from "node:crypto";

/**
 * Admin session auth.
 *
 * The cookie value is a signed, expiring token (`${expiryMs}.${hmac}`) instead
 * of a static string, so it cannot be forged without the server-side secret.
 * Fails closed: if no secret is configured, no session can be created or
 * verified (the admin simply shows the login form).
 */

export const ADMIN_COOKIE = "tvh_admin";
export const SESSION_MAX_AGE_S = 60 * 60 * 24 * 7; // 7 days

/**
 * Signing key. Prefer a dedicated SESSION_SECRET; fall back to ADMIN_PASSWORD
 * so the only hard requirement is a single secret in the environment.
 * Returns null when nothing is configured → auth fails closed.
 */
function signingSecret(): string | null {
  return process.env.SESSION_SECRET || process.env.ADMIN_PASSWORD || null;
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/** Build a signed, expiring session token. Throws if no secret is configured. */
export function createSession(): string {
  const secret = signingSecret();
  if (!secret) throw new Error("Auth no configurada: falta SESSION_SECRET / ADMIN_PASSWORD");
  const payload = String(Date.now() + SESSION_MAX_AGE_S * 1000);
  return `${payload}.${sign(payload, secret)}`;
}

/** Verify a session cookie value. Never throws; returns false on any problem. */
export function verifySession(value: string | undefined | null): boolean {
  const secret = signingSecret();
  if (!secret || !value) return false;
  const dot = value.lastIndexOf(".");
  if (dot <= 0) return false;
  const payload = value.slice(0, dot);
  const expected = sign(payload, secret);
  const a = Buffer.from(value.slice(dot + 1));
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
  const exp = Number(payload);
  return Number.isFinite(exp) && exp > Date.now();
}

/** Constant-time password check against ADMIN_PASSWORD. */
export function checkPassword(input: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || typeof input !== "string") return false;
  // Trim to tolerate stray whitespace/newlines pasted into the env var or form.
  const a = createHash("sha256").update(input.trim()).digest();
  const b = createHash("sha256").update(expected.trim()).digest();
  return timingSafeEqual(a, b);
}

/** Cookie options for the admin session. */
export function sessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    maxAge: SESSION_MAX_AGE_S,
    path: "/",
  };
}
