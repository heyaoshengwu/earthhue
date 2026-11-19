import crypto from "node:crypto";
import type { NextRequest } from "next/server";

/**
 * Server-side credentials for the admin panel and the content write APIs.
 *
 * Nothing here is hard-coded: the secrets live in `.env.local`, which is
 * git-ignored, so they never reach the repository. The legacy password that
 * used to sit in the client bundle is no longer accepted from the browser —
 * the browser now only proves it knows the password, the server decides.
 */

const TOKEN_TTL_SECONDS = 60 * 60 * 12; // 12 hours

function env(name: string): string {
  return (process.env[name] || "").trim();
}

/** Constant-time string comparison. */
export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a, "utf8");
  const bb = Buffer.from(b, "utf8");
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

/** Password the admin panel prompts for. */
export function adminPassword(): string {
  return env("ADMIN_PASSWORD") || env("ADMIN_LOGIN_PASSWORD");
}

/** Key used to sign session tokens. */
export function adminSecret(): string {
  return env("ADMIN_SECRET") || env("ADMIN_TOKEN_SECRET");
}

/** Shared secret the GEO publishing system pushes articles with. */
export function articlePushSecret(): string {
  return env("ARTICLE_PUSH_SECRET");
}

function sign(payload: string, secret: string): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

/** Mint a short-lived session token for the admin panel. */
export function issueAdminToken(now = Date.now()): string {
  const secret = adminSecret();
  if (!secret) throw new Error("ADMIN_SECRET is not configured");
  const expires = now + TOKEN_TTL_SECONDS * 1000;
  const payload = String(expires);
  return `${payload}.${sign(payload, secret)}`;
}

/** Validate a session token. */
export function verifyAdminToken(token: string | null | undefined, now = Date.now()): boolean {
  if (!token) return false;
  const secret = adminSecret();
  if (!secret) return false;
  const idx = token.lastIndexOf(".");
  if (idx <= 0) return false;
  const payload = token.slice(0, idx);
  const mac = token.slice(idx + 1);
  const expected = sign(payload, secret);
  if (mac.length !== expected.length) return false;
  if (!crypto.timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return false;
  const expires = Number(payload);
  if (!Number.isFinite(expires) || expires < now) return false;
  return true;
}

/**
 * Authorisation for the content write APIs: either an admin session token or
 * the article-push secret used by the GEO publishing system.
 */
export function isWriteAuthorized(req: NextRequest): boolean {
  if (verifyAdminToken(req.headers.get("x-admin-token"))) return true;
  const pushSecret = articlePushSecret();
  if (pushSecret) {
    const supplied = req.headers.get("x-article-secret") || "";
    if (supplied && safeEqual(supplied, pushSecret)) return true;
  }
  return false;
}

/**
 * Authorisation for reading inquiries. Deliberately narrower than
 * `isWriteAuthorized`: the publishing system may publish articles, but it
 * has no business reading the sales inbox.
 */
export function isAdminAuthorized(req: NextRequest): boolean {
  return verifyAdminToken(req.headers.get("x-admin-token"));
}
