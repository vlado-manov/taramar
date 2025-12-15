// src/components/ReviewsSection.tsx
"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import React, { useRef } from "react";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import styles from "./ReviewSection.module.css";

type Review = {
  id: string;
  name: string;
  image: string; // /public path
  text: string;
};

export default function ReviewsSection() {
  const t = useTranslations("reviews");
  const swiperRef = useRef<SwiperType | null>(null);

  const reviews: Review[] = [
    {
      id: "r1",
      name: "Dagny B.",
      image: "/images/reviews/avatar-1.jpg",
      text: "“Absolutely love TARAMAR. The products are perfect for my dry skin.”",
    },
    {
      id: "r2",
      name: "Sigrun H.",
      image: "/images/reviews/avatar-2.jpg",
      text: "“I have sensitive skin and these products cause zero irritation. I recommend TARAMAR 100%.”",
    },
    {
      id: "r3",
      name: "Inga H.",
      image: "/images/reviews/avatar-3.jpg",
      text: "“After a few months my skin looks smoother, fuller, and healthier. I see a big difference.”",
    },
    {
      id: "r4",
      name: "Maria E.",
      image: "/images/reviews/avatar-4.jpg",
      text: "“After six months my skin feels balanced and I barely need makeup anymore.”",
    },
    {
      id: "r5",
      name: "Susan E.",
      image: "/images/reviews/avatar-5.jpg",
      text: "“Dry winter patches disappeared completely after using TARAMAR creams.”",
    },
    {
      id: "r6",
      name: "Skincare Awards",
      image: "/images/reviews/avatar-6.jpg",
      text: "“Light yet nourishing. Absorbs beautifully and leaves skin glowing overnight.”",
    },
    {
      id: "r7",
      name: "Klara S.",
      image: "/images/reviews/avatar-7.jpg",
      text: "“The sun oil transformed my dry, itchy skin and even helped my face tan naturally.”",
    },
  ];
  

  return (
    <section className={styles.section}>
      <div className={styles.outer}>
        <p className={`${styles.headline} font-varela`}>{t("headline")}</p>

        <h2 className={`${styles.title} font-ramillas-mediumItalic`}>
          {t("title")}
        </h2>

        {/* Slider wrapper: makes it easy to position custom arrows absolutely */}
        <div className={styles.sliderWrap}>
          {/* Custom arrows (absolute, outside swiper) */}
          <button
            type="button"
            aria-label="Previous review"
            onClick={() => swiperRef.current?.slidePrev()}
            className={styles.reviewsArrowBtn}
          >
            <CircleChevronLeft
              className={styles.reviewsArrowIcon}
              size={46}
            />
          </button>

          <button
            type="button"
            aria-label="Next review"
            onClick={() => swiperRef.current?.slideNext()}
            className={styles.reviewsArrowBtn}
          >
            <CircleChevronRight
              className={styles.reviewsArrowIcon}
              size={46}
            />
          </button>

          <Swiper
            modules={[Navigation]}
            // ✅ remove original swiper arrows
            navigation={false}
            loop
            slidesPerView={3}
            spaceBetween={22}
            speed={600}
            style={{ overflow: "hidden" }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            breakpoints={{
                0: { slidesPerView: 1, spaceBetween: 16 },
                640: { slidesPerView: 2, spaceBetween: 18 },
                960: { slidesPerView: 3, spaceBetween: 22 },
              }}
          >
            {reviews.map((r) => (
              <SwiperSlide key={r.id}>
                <div className={styles.card}>
                  <p className={`${styles.cardText} font-ramillas-mediumItalic`}>
                    {r.text}
                  </p>

                  <div className={styles.cardFooter}>
                    {/* <div className={styles.avatarWrap}>
                      <Image
                        src={r.image}
                        alt={r.name}
                        width={80}
                        height={80}
                        className={styles.avatarImg}
                      />
                    </div> */}

                    <span className={`${styles.name} font-worksans`}>
                      {r.name}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
