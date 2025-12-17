// src/components/DagnyRitualSection.tsx
"use client";

import { useTranslations } from "next-intl";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import FullscreenVideoModal from "./FullscreenVideoModal";
import styles from "./DagnyRitualSection.module.css";

export default function DagnyRitualSection() {
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname(); // e.g. /en, /nl, /fr
  const locale = pathname.split("/")[1] || "en";

  const videoSrcByLocale: Record<string, string> = {
    en: "/videos/taramar-en-subs.mov",
    nl: "/videos/taramar-nl-subs.mov",
    fr: "/videos/taramar-fr-subs.mov",
  };

  const videoSrc = videoSrcByLocale[locale] ?? videoSrcByLocale.en;

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

      <FullscreenVideoModal
        isOpen={isOpen}
        onClose={closeModal}
        src={videoSrc}
        ariaLabel="Dagny's ritual video"
      />
    </>
  );
}
