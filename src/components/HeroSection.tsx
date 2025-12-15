"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import styles from "./HeroSection.module.css";

export default function HeroSection() {
  const t = useTranslations("hero");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

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

      if (progress < 1) requestAnimationFrame(animationFrame);
    }

    requestAnimationFrame(animationFrame);
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onReady = () => {
      setIsVideoReady(true);
    };

    video.addEventListener("canplaythrough", onReady);

    // If cached and already ready, trigger the same callback async (satisfies eslint rule)
    if (video.readyState >= 4) {
      queueMicrotask(onReady);
      // If you prefer maximum compatibility, replace with:
      // setTimeout(onReady, 0);
    }

    return () => {
      video.removeEventListener("canplaythrough", onReady);
    };
  }, []);

  return (
    <section id="home" className={styles.hero}>
      <video
        ref={videoRef}
        className={styles.video}
        src="/videos/heroMini.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      <div
        className={`${styles.overlay} ${
          isVideoReady ? styles.ready : styles.notReady
        }`}
      />

      <div
        className={`${styles.contentWrap} ${
          isVideoReady ? styles.ready : styles.notReady
        }`}
      >
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.left}>
              <h1 className={`${styles.title} font-varela force-uppercase`}>
                {t("title")}
              </h1>

              <p className={`${styles.subtitle} font-worksans`}>
                {t("subtitle")}
              </p>

              <button
                type="button"
                onClick={() => scrollToSection("products")}
                className={`${styles.buttonPrimary} font-varela force-uppercase`}
              >
                {t("ctaProducts")}
              </button>

              <button
                type="button"
                onClick={() => scrollToSection("stores")}
                className={`${styles.buttonSecondary} font-varela force-uppercase`}
              >
                {t("ctaStores")}
              </button>
            </div>

            <div className={styles.rightSpacer} />
          </div>
        </div>
      </div>
    </section>
  );
}
