// src/lib/models/TranslationOverride.ts

import { Schema, model, models } from "mongoose";

export type TranslationLocale = "en" | "fr" | "nl";

export type TranslationOverrideDoc = {
  locale: TranslationLocale;
  key: string;   // e.g. "hero.title"
  value: string; // the override string
};

const TranslationOverrideSchema = new Schema<TranslationOverrideDoc>(
  {
    locale: { type: String, required: true, index: true },
    key: { type: String, required: true, index: true },
    value: { type: String, required: true },
  },
  { timestamps: true }
);

// one override per locale+key
TranslationOverrideSchema.index({ locale: 1, key: 1 }, { unique: true });

export const TranslationOverride =
  models.TranslationOverride ||
  model<TranslationOverrideDoc>("TranslationOverride", TranslationOverrideSchema);
