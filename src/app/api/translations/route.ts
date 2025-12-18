// src/app/api/translations/route.ts

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { flattenMessages, type JsonObject } from "@/lib/i18nOverrides";
import { TranslationOverride, type TranslationLocale, type TranslationOverrideDoc } from "@/models/TranslationOverride";

const LOCALES: TranslationLocale[] = ["en", "fr", "nl"];

function groupBySection(keys: string[]) {
  const groups: Record<string, string[]> = {};

  for (const k of keys) {
    const section = k.split(".")[0] || "root";
    if (!groups[section]) groups[section] = [];
    groups[section].push(k);
  }

  for (const arr of Object.values(groups)) arr.sort();

  return Object.keys(groups)
    .sort()
    .reduce((acc, section) => {
      acc[section] = groups[section];
      return acc;
    }, {} as Record<string, string[]>);
}

export async function GET() {
  await connectToDatabase();

  const baseEn = (await import("@/messages/en.json")).default as JsonObject;
  const baseFr = (await import("@/messages/fr.json")).default as JsonObject;
  const baseNl = (await import("@/messages/nl.json")).default as JsonObject;

  const flat = {
    en: flattenMessages(baseEn),
    fr: flattenMessages(baseFr),
    nl: flattenMessages(baseNl),
  };

  const keySet = new Set<string>([
    ...Object.keys(flat.en),
    ...Object.keys(flat.fr),
    ...Object.keys(flat.nl),
  ]);

  const allKeys = Array.from(keySet).sort();

  const overrides = await TranslationOverride.find(
    { locale: { $in: LOCALES } },
    { _id: 0, locale: 1, key: 1, value: 1 }
  ).lean<TranslationOverrideDoc[]>();

  const overrideMap: Record<TranslationLocale, Record<string, string>> = {
    en: {},
    fr: {},
    nl: {},
  };

  for (const row of overrides) {
    overrideMap[row.locale][row.key] = row.value;
  }

  const rows = allKeys.map((key) => {
    const section = key.split(".")[0] || "root";

    const enVal = overrideMap.en[key] ?? flat.en[key] ?? "";
    const frVal = overrideMap.fr[key] ?? flat.fr[key] ?? "";
    const nlVal = overrideMap.nl[key] ?? flat.nl[key] ?? "";

    return {
      key,
      section,
      values: { en: enVal, fr: frVal, nl: nlVal },
      isOverridden: {
        en: Object.prototype.hasOwnProperty.call(overrideMap.en, key),
        fr: Object.prototype.hasOwnProperty.call(overrideMap.fr, key),
        nl: Object.prototype.hasOwnProperty.call(overrideMap.nl, key),
      },
    };
  });

  const sections = groupBySection(allKeys);

  return NextResponse.json({ sections, rows });
}
