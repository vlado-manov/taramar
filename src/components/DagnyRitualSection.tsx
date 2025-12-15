// src/components/DagnyRitualSection.tsx
"use client";

import { useTranslations } from "next-intl";
import React, { useState } from "react";
import FullscreenVideoModal from "./FullscreenVideoModal";
import styles from "./DagnyRitualSection.module.css";

export default function DagnyRitualSection() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

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

  const t = useTranslations("videoSection");

  function scrollToSection(id: string) {
    if (typeof window === "undefined") return;

    const target = document.getElementById(id);
    if (!target) return;

    const startY = window.scrollY;
    const targetY = target.getBoundingClientRect().top + window.scrollY;
    const distance = targetY - startY;

    const duration = 1400;
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
    <>
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {/* Left: video thumbnail */}
            <div className="leftSide">
              <div className={styles.thumb}>
                <img
                  src="/images/videoThumbnail.jpg"
                  alt="Dagny applying skincare"
                  className={styles.thumbImg}
                />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal();
                  }}
                  aria-label="Play Dagny's ritual video"
                  className={styles.playButton}
                >
                  <span className={styles.playTriangle} />
                </button>
              </div>
            </div>

            {/* Right: quote and copy */}
            <div className={`rightSide ` + styles.right}>
              <div className={styles.rightInner}>
                <p className={`${styles.openQuote} font-ramillas-medium`}>“</p>

                <p className={`${styles.headline} font-ramillas-mediumItalic`}>
                  {t("headline1")}
                </p>
                <p className={`${styles.headline} font-ramillas-mediumItalic`}>
                  {t("headline2")}
                </p>

                <p className={`${styles.author} font-varela`}>{t("author")}</p>

                <p className={`${styles.desc} font-worksans`}>
                  {renderWithBold(t("desc"))}
                </p>

                <p className={`${styles.desc2} font-worksans`}>{t("desc2")}</p>

                <button
                  type="button"
                  className={`${styles.ctaButton} font-varela`}
                  onClick={(e) => {
                    e.stopPropagation();
                    openModal();
                  }}
                >
                  {t("cta")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ Real fullscreen portal modal */}
      <FullscreenVideoModal
        isOpen={isOpen}
        onClose={closeModal}
        src="/videos/hero.mov"
        ariaLabel="Dagny's ritual video"
      />
    </>
  );
}
