// src/lib/apiAuth.ts
// Node.js runtime only (API routes). Do NOT import in middleware (Edge runtime).

import crypto from "crypto";

export const COOKIE_NAME = "admin_session";

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 86400, // 24 hours
  path: "/",
};

/** Creates a signed session token: `${timestamp}.${hmac_hex}` */
export function createAdminToken(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) throw new Error("ADMIN_SECRET is not set");
  const timestamp = String(Date.now());
  const sig = crypto
    .createHmac("sha256", secret)
    .update(timestamp)
    .digest("hex");
  return `${timestamp}.${sig}`;
}

/** Verifies a session token (signature + 24h expiry). */
export function verifyAdminToken(token: string): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;

  const dot = token.indexOf(".");
  if (dot === -1) return false;
  const timestamp = token.slice(0, dot);
  const signature = token.slice(dot + 1);

  const ts = parseInt(timestamp, 10);
  if (isNaN(ts) || Date.now() - ts > 86_400_000) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(timestamp)
    .digest("hex");

  try {
    const sigBuf = Buffer.from(signature, "hex");
    const expBuf = Buffer.from(expected, "hex");
    if (sigBuf.length !== expBuf.length) return false;
    return crypto.timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

/**
 * Reads the admin session cookie from a Request and verifies it.
 * Use this at the top of protected API route handlers.
 */
export function verifyAdminRequest(req: Request): boolean {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const match = cookieHeader.match(
    new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`)
  );
  if (!match) return false;
  return verifyAdminToken(decodeURIComponent(match[1]));
}
