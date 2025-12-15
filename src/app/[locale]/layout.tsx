// src/app/[locale]/layout.tsx
import "@/styles/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/../i18n";
import "swiper/css";
import "swiper/css/navigation";
export const dynamic = "force-dynamic";

// Next.js 15+ now passes params as a promise inside async layout
type Props = {
  children: ReactNode;
  params: { locale: Locale } | Promise<{ locale: Locale }>;
};

async function getMessages(locale: Locale) {
  try {
    const messages = (await import(`@/messages/${locale}.json`)).default;
    return messages;
  } catch {
    notFound();
  }
}

export default async function LocaleLayout(props: Props) {
  const resolved = await props; // unwrap promise
  const { children } = resolved;

  // also unwrap params (can also be a promise)
  const { locale } = await resolved.params;

  if (!locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
