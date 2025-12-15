// src/components/IngredientSlider.tsx
"use client";

import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useLocale } from "next-intl";
import styles from "./IngredientSlider.module.css";

const ingredientItems = [
  {
    id: 1,
    image: "/images/ingredients/Morgunfru.jpg",
    title: { en: "Morgunfru", fr: "Lupin", nl: "Lupine" },
  },
  {
    id: 2,
    image: "/images/ingredients/mosi.jpg",
    title: { en: "Mosi", fr: "Mosi", nl: "Mosi" },
  },
  {
    id: 3,
    image: "/images/ingredients/viola.jpg",
    title: { en: "Viola", fr: "Violette", nl: "Viooltje" },
  },
  {
    id: 4,
    image: "/images/ingredients/mariustakkur.jpg",
    title: { en: "Mariustakur", fr: "Mariustakur", nl: "Mariustakur" },
  },
  {
    id: 5,
    image: "/images/ingredients/arcticflower.jpg",
    title: { en: "Arctic Flower", fr: "Fleur arctique", nl: "Arctische bloem" },
  },
  {
    id: 6,
    image: "/images/ingredients/skufubang.jpg",
    title: { en: "Sea Kelp", fr: "Varech", nl: "Zeekelp" },
  },
  {
    id: 7,
    image: "/images/ingredients/berries.jpg",
    title: { en: "Berries", fr: "Thym sauvage", nl: "Wilde tijm" },
  }
] as const;

const VISIBLE_SLIDES = 4;

type LocaleKey = "en" | "fr" | "nl";

function getTitle(
  titles: { en: string; fr: string; nl: string },
  locale: string
) {
  const key = (locale?.split("-")[0] as LocaleKey) || "en";
  return titles[key] ?? titles.en;
}

export default function IngredientSlider() {
  const locale = useLocale();

  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      dragFree: false,
    },
    [
      Autoplay({
        delay: 3000,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  return (
    <div className={styles.root}>
      <div className={styles.embla} aria-label="Pure ingredients carousel">
        <div className={styles.viewport} ref={emblaRef}>
          <div className={styles.container}>
            {ingredientItems.map((item) => {
              const title = getTitle(item.title, locale);

              return (
                <div className={styles.slide} key={item.id}>
                  <div className={styles.card}>
                    <div className={styles.imageWrap}>
                      <img src={item.image} alt={title} />
                    </div>
                    <p className={styles.title}>{title}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
