// src/components/FoundersSection.tsx
"use client";

import React from "react";
import { useTranslations } from "next-intl";
import styles from "./FoundersSection.module.css";

export default function FoundersSection() {
  const t = useTranslations("founders");
  function renderWithBold(text: string) {
    return text.split(/(\[\[bold\]\].*?\[\[\/bold\]\])/g).map((part, i) => {
      if (part.startsWith("[[bold]]")) {
        return (
          <span key={i} className="font-worksans-bold">
            {part.replace("[[bold]]", "").replace("[[/bold]]", "")}
          </span>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  }

  function renderText(text: string) {
    return text
      .split(/(\[\[bold\]\].*?\[\[\/bold\]\]|\[\[newline\]\])/g)
      .map((part, i) => {
        if (part === "[[newline]]") {
          return <br key={i} />;
        }

        if (part.startsWith("[[bold]]")) {
          return (
            <span key={i} className="font-worksans-bold">
              {part.replace("[[bold]]", "").replace("[[/bold]]", "")}
            </span>
          );
        }

        return <React.Fragment key={i}>{part}</React.Fragment>;
      });
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Right: fixed image */}
        <div className={styles.imageOuter}>
          <div className={styles.imageWrap}>
            <img
              src="/images/founders.jpg"
              alt="Dagny Rós with Taramar product"
              className={styles.image}
            />
          </div>
        </div>

        {/* Left: text */}
        <div className={styles.textOuter}>
          <div className={styles.textInner}>
            <p className={`${styles.headline} font-varela`}>{t("headline")}</p>

            <p className={`${styles.title} font-ramillas-medium`}>
              {renderText(t("title"))}
            </p>

            <p className={`${styles.desc} font-worksans`}>
              {renderWithBold(t("desc"))}
            </p>
            <p className={`${styles.desc2} font-worksans`}>
              {renderWithBold(t("desc2"))}
            </p>
            <p className={`${styles.desc3} font-worksans`}>
              {renderWithBold(t("desc3"))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
