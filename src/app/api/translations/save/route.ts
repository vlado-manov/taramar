// src/app/api/translations/save/route.ts

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { TranslationOverride, type TranslationLocale } from "@/models/TranslationOverride";

const LOCALES: TranslationLocale[] = ["en", "fr", "nl"];

type SavePayload = {
  key: string;
  values: Partial<Record<TranslationLocale, string>>;
};

export async function PUT(req: Request) {
  await connectToDatabase();

  const body = (await req.json()) as SavePayload;

  const key = String(body?.key || "").trim();
  if (!key) {
    return NextResponse.json({ error: "Missing key" }, { status: 400 });
  }

  const values = body?.values ?? {};

  const ops = LOCALES.map(async (locale) => {
    const raw = values[locale];
    const value = typeof raw === "string" ? raw.trim() : "";

    // empty => remove override (fallback to baseline json)
    if (!value) {
      await TranslationOverride.deleteOne({ locale, key });
      return;
    }

    await TranslationOverride.updateOne(
      { locale, key },
      { $set: { value } },
      { upsert: true }
    );
  });

  await Promise.all(ops);

  return NextResponse.json({ ok: true });
}
