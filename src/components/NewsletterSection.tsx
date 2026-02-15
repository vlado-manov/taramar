"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useState } from "react";
import styles from "./NewsletterSection.module.css";

type State = "idle" | "loading" | "success" | "error";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");
  const t = useTranslations("newsletter");
  const params = useParams<{ locale: string }>();
  const locale = params?.locale ?? "en";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setState("loading");
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, locale }),
      });

      if (res.ok) {
        setState("success");
        setEmail("");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.thankYou}>
            <div className={styles.thankYouIcon}>✓</div>
            <h2 className={`${styles.thankYouTitle} font-ramillas-mediumItalic`}>
              {t("thankYouTitle")}
            </h2>
            <p className={`${styles.thankYouDesc} font-worksans`}>
              {t("thankYouDesc")}
            </p>
          </div>
        </div>
      </section>
    );
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
            disabled={state === "loading"}
          />

          <button
            type="submit"
            className={`${styles.button} font-varela`}
            disabled={state === "loading"}
          >
            {state === "loading" ? "..." : t("cta")}
          </button>

          {state === "error" && (
            <p className={styles.errorMsg}>{t("errorMsg")}</p>
          )}
        </form>
      </div>
    </section>
  );
}
