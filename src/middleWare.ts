// src/middleware.ts
import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "../i18n";

export default createMiddleware({
  locales,
  defaultLocale,
});

export const config = {
  // Match all pathnames except specific assets
  matcher: ["/", "/(en|fr|nl)/:path*"],
};
