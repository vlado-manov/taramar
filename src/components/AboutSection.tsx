// src/components/AboutSection.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import IngredientSlider from "./IngredientSlider";
import Image from "next/image";
import { useTranslations } from "next-intl";
import styles from "./AboutSection.module.css";

const ingredientItems = [
  { id: 1, title: "Lupine", image: "/images/ingredients/lupine.jpg" },
  { id: 2, title: "Mosi", image: "/images/ingredients/mosi.jpg" },
  { id: 3, title: "Viola", image: "/images/ingredients/viola.jpg" },
  { id: 4, title: "Mariustakur", image: "/images/ingredients/mariustakur.jpg" },
  { id: 5, title: "Arctic Flower", image: "/images/ingredients/arctic.jpg" },
  { id: 6, title: "Sea Kelp", image: "/images/ingredients/kelp.jpg" },
  { id: 7, title: "Wild Thyme", image: "/images/ingredients/thyme.jpg" },
  { id: 8, title: "Bilberry", image: "/images/ingredients/bilberry.jpg" },
  { id: 9, title: "Angelica", image: "/images/ingredients/angelica.jpg" },
  { id: 10, title: "Iceland Moss", image: "/images/ingredients/iceland-moss.jpg" },
];

const VISIBLE_SLIDES = 4;

export default function AboutSection() {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);

  // Autoplay
  useEffect(() => {
    const maxIndex = Math.max(0, ingredientItems.length - VISIBLE_SLIDES);

    const id = window.setInterval(() => {
      setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 3000);

    return () => window.clearInterval(id);
  }, []);

  // Apply scroll when index changes
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const slideWidth = slider.clientWidth / VISIBLE_SLIDES;
    slider.scrollTo({
      left: slideWidth * index,
      behavior: "smooth",
    });
  }, [index]);

  const handlePrev = () => {
    const maxIndex = Math.max(0, ingredientItems.length - VISIBLE_SLIDES);
    setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    const maxIndex = Math.max(0, ingredientItems.length - VISIBLE_SLIDES);
    setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const t = useTranslations("about");
  const tr = useTranslations("aboutIngredients");
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

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        {/* Top row: text left, image right */}
        <div className={styles.topRow}>
          <div className={styles.topLeft}>
            <p className={`${styles.headline} font-varela`}>{t("headline")}</p>

            <h2 className={`${styles.title} font-ramillas-mediumItalic`}>
              {t("title")}
            </h2>

            <p className={`${styles.subtitle} font-worksans`}>{t("subtitle")}</p>

            <p className={`${styles.descHeadline} font-varela`}>
              {t("descHeadline")}
            </p>

            <p className={`${styles.desc} font-worksans`}>{t("desc")}</p>
          </div>

          <div className={styles.topRight}>
            <div className={styles.endorsedWrap}>
              {/* Replace with your own <Image /> in Next if needed */}
              <img
                src="/images/endorsed_by.jpg"
                alt="Dagny enjoying a quiet moment with Taramar"
                className={styles.endorsedImg}
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

        {/* Divider */}
        <hr className={styles.divider} />

        {/* Second row: bottle image + philosophy text + slider */}
        <div className={styles.secondRow}>
          {/* Left: product image */}
          {/* Left: product image */}
          <div className={styles.productOuter}>
            <div className={styles.productInner}>
              <img
                src="/images/about_ingredients.jpg"
                alt="Taramar product in hand"
                className={styles.productImg}
              />
            </div>
          </div>

          {/* Right: text + slider */}
          <div className={styles.textRightSide}>
            <p className={`${styles.ingredientsHeadline} font-varela`}>
              {tr("headline")}
            </p>

            <h3 className={`${styles.ingredientsTitle} font-ramillas-medium`}>
              {tr("title_line1")}
            </h3>
            <h3 className={`${styles.ingredientsTitle} font-ramillas-medium`}>
              {tr("title_line2")}
            </h3>

            <IngredientSlider />

            <p className={`${styles.ingredientsDesc} font-worksans`}>
              {renderWithBold(tr("desc"))}
            </p>
            <p className={`${styles.ingredientsDesc2} font-worksans`}>
              {renderWithBold(tr("desc2"))}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}