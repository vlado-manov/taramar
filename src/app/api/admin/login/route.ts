// src/app/api/admin/login/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { createAdminToken, COOKIE_NAME, COOKIE_OPTIONS } from "@/lib/apiAuth";

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  let body: { email?: unknown; password?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    // malformed JSON — treat as invalid credentials
  }

  const email = typeof body.email === "string" ? body.email : "";
  const password = typeof body.password === "string" ? body.password : "";

  const adminEmail = process.env.ADMIN_EMAIL ?? "";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";

  console.log("[LOGIN DEBUG] received email:", JSON.stringify(email), "len:", email.length);
  console.log("[LOGIN DEBUG] env email:", JSON.stringify(adminEmail), "len:", adminEmail.length);
  console.log("[LOGIN DEBUG] env password set:", adminPassword.length > 0);

  const valid = safeEqual(email, adminEmail) && safeEqual(password, adminPassword);

  if (!valid) {
    // Consistent delay prevents timing-based enumeration
    await new Promise((r) => setTimeout(r, 500));
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = createAdminToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, token, COOKIE_OPTIONS);
  return res;
}
