import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { Subscriber } from "@/models/Subscriber";
import { verifyAdminRequest } from "@/lib/apiAuth";

export async function GET(req: Request) {
  if (!verifyAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const subscribers = await Subscriber.find().sort({ subscribedAt: -1 }).lean();
  return NextResponse.json(subscribers);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const locale = ["en", "fr", "nl"].includes(body?.locale) ? body.locale : "en";

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    await connectToDatabase();

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      // Already subscribed — still show success to the user
      return NextResponse.json({ ok: true });
    }

    await Subscriber.create({ email, locale });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
