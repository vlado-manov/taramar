// src/i18n/request.ts
import {getRequestConfig} from "next-intl/server";
import {notFound} from "next/navigation";
import {locales, defaultLocale, type Locale} from "@/../i18n";

export default getRequestConfig(async ({requestLocale}) => {
  // requestLocale is a Promise now → unwrap it
  const resolvedLocale = await requestLocale;

  // Determine final locale (fallback to default if missing)
  const locale = locales.includes(resolvedLocale as Locale)
    ? (resolvedLocale as Locale)
    : defaultLocale;

  // Load language file (must exist)
  const messages = (await import(`@/messages/${locale}.json`)).default;

  return {
    locale,
    messages
  };
});
