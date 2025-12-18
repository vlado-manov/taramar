// src/app/[locale]/layout.tsx
import "@/styles/globals.css";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/../i18n";
import "swiper/css";
import "swiper/css/navigation";

import { connectToDatabase } from "@/lib/db";
import { TranslationOverride, type TranslationOverrideDoc } from "@/models/TranslationOverride";
import { applyOverrides, type JsonObject } from "@/lib/i18nOverrides";

export const dynamic = "force-dynamic";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

async function getBaseMessages(locale: Locale): Promise<JsonObject> {
  try {
    return (await import(`@/messages/${locale}.json`)).default as JsonObject;
  } catch {
    notFound();
  }
}

async function getOverrides(locale: Locale): Promise<Record<string, string>> {
  await connectToDatabase();

  const rows = await TranslationOverride.find(
    { locale },
    { _id: 0, key: 1, value: 1 }
  ).lean<Array<Pick<TranslationOverrideDoc, "key" | "value">>>();

  const map: Record<string, string> = {};
  for (const r of rows) {
    map[r.key] = r.value;
  }

  return map;
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;

  const base = await getBaseMessages(typedLocale);
  const overrides = await getOverrides(typedLocale);
  const messages = applyOverrides(base, overrides);

  return (
    <html lang={typedLocale}>
      <body>
        <NextIntlClientProvider locale={typedLocale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
