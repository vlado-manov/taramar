// src/components/RitualSection.tsx
"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./RitualSection.module.css";

export default function RitualSection() {
  const t = useTranslations("experience");
  function scrollToSection(id: string) {
    if (typeof window === "undefined") return;

    const target = document.getElementById(id);
    if (!target) return;

    const startY = window.scrollY;
    const targetY = target.getBoundingClientRect().top + window.scrollY;
    const distance = targetY - startY;

    const duration = 1400; // slower and smoother (ms)

    // Easing function: easeOutCubic (smooth + natural)
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    let startTime: number | null = null;

    function animationFrame(currentTime: number) {
      if (startTime === null) startTime = currentTime;

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easedProgress = easeOutCubic(progress);
      window.scrollTo(0, startY + distance * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animationFrame);
      }
    }

    requestAnimationFrame(animationFrame);
  }
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Top row: text left, image right */}
        <div className={styles.topRow}>
          <div className={styles.left}>
            <p className={`${styles.headline} font-varela`}>{t("headline")}</p>

            <h2 className={`${styles.title} font-ramillas-mediumItalic`}>
              {t("title")}
            </h2>

            <p className={`${styles.location} font-varela`}>{t("location")}</p>

            <p className={`${styles.desc} font-worksans`}>{t("desc")}</p>

            <p className={`${styles.desc2} font-worksans`}>{t("desc2")}</p>

            <p className={`${styles.desc3} font-worksans`}>{t("desc3")}</p>

            <button
              className={`${styles.button} font-varela`}
              onClick={() => scrollToSection("stores")}
            >
              {t("cta")}
            </button>
          </div>

          <div className={styles.right}>
            <div className={styles.imageWrap}>
              {/* Replace with your own <Image /> in Next if needed */}
              <img
                src="/images/ritual.jpg"
                alt="Dagny enjoying a quiet moment with Taramar"
                className={styles.image}
              />
              {/* <Image
                          src="/images/endorsed_by.jpg"
                          alt="Taramar skincare textures"
                          width={306}
                          height={40}
                          className="object-cover"
                          priority // important for preload
                          /> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
