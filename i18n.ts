// i18n.ts (root)
export const locales = ["en", "fr", "nl"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

// Landing page titles per locale
export const landingPageTitles: Record<Locale, string> = {
  en: "Taramar – Natural Skin Care for Every Day",
  fr: "Taramar – Soin de la peau naturel au quotidien",
  nl: "Taramar – Natuurlijke huidverzorging voor elke dag",
};

// Admin titles (we’ll keep them English; you can translate if you want)
export const adminTitles = {
  products: "Admin | Products",
  stores: "Admin | Stores",
} as const;
