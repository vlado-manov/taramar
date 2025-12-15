// src/components/QuoteSection.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import styles from "./QuoteSection.module.css";

export default function QuoteSection() {
  const t = useTranslations("quote");

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Left: text */}
        <div className={styles.left}>
          <div className={styles.textWrap}>
            <p className={`${styles.openQuote} font-ramillas-medium`}>“</p>

            <p className={`${styles.quoteHead} font-ramillas-medium`}>
              {t("quoteHead")}
            </p>

            <p className={`${styles.quoteTitle} font-ramillas-mediumItalic`}>
              {t("quoteTitle")}
            </p>

            <p className={`${styles.author} font-varela`}>{t("author")}</p>
          </div>
        </div>

        {/* Right: fixed image */}
        <div className={styles.right}>
          <div className={styles.imageWrap}>
            <img
              src="/images/quote.jpg"
              alt="Dagny Rós with Taramar product"
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
