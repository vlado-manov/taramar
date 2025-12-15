// src/app/[locale]/layout.tsx
import "@/styles/globals.css";
import { NextIntlClientProvider } from "next-intl";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/../i18n";
import "swiper/css";
import "swiper/css/navigation";

export const dynamic = "force-dynamic";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

async function getMessages(locale: Locale) {
  try {
    return (await import(`@/messages/${locale}.json`)).default;
  } catch {
    notFound();
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Narrow string -> Locale safely
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const typedLocale = locale as Locale;
  const messages = await getMessages(typedLocale);

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
