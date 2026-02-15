import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "../i18n";

const COOKIE_NAME = "admin_session";

/** Verifies the HMAC-SHA256 session token using Web Crypto (Edge-compatible). */
async function verifyToken(token: string): Promise<boolean> {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;

  const dot = token.indexOf(".");
  if (dot === -1) return false;

  const timestamp = token.slice(0, dot);
  const signature = token.slice(dot + 1);

  const ts = parseInt(timestamp, 10);
  if (isNaN(ts) || Date.now() - ts > 86_400_000) return false;

  if (signature.length === 0 || signature.length % 2 !== 0) return false;

  try {
    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const sigBytes = new Uint8Array(signature.length / 2);
    for (let i = 0; i < sigBytes.length; i++) {
      sigBytes[i] = parseInt(signature.slice(i * 2, i * 2 + 2), 16);
    }
    return crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(timestamp));
  } catch {
    return false;
  }
}

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
});

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPath = /^\/(en|fr|nl)\/admin/.test(pathname);
  const isLoginPage = /\/admin\/login(\/|$)/.test(pathname);

  if (isAdminPath && !isLoginPage) {
    const token = req.cookies.get(COOKIE_NAME)?.value;
    const valid = token ? await verifyToken(token) : false;

    if (!valid) {
      const locale = pathname.split("/")[1] || "en";
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, req.url));
    }
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/", "/(en|fr|nl)/:path*"],
};
