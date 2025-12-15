// src/components/NewsletterSection.tsx
"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import styles from "./NewsletterSection.module.css";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const t = useTranslations("newsletter");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    alert(`Subscribed: ${email}`);
    setEmail("");
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* LEFT */}
        <div className={styles.left}>
          <div className={`${styles.title} font-ramillas-mediumItalic`}>
            {t("title")}
          </div>

          <div className={`${styles.subtitle} font-varela`}>{t("subtitle")}</div>

          <p className={`${styles.desc} font-worksans`}>{t("desc")}</p>
        </div>

        {/* RIGHT */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("placeholder")}
            type="email"
            className={`${styles.input} font-varela`}
          />

          <button type="submit" className={`${styles.button} font-varela`}>
            {t("cta")}
          </button>
        </form>
      </div>
    </section>
  );
}
