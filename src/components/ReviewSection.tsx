"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { CircleChevronLeft, CircleChevronRight } from "lucide-react";
import styles from "./ReviewSection.module.css";

type ReviewFromDb = {
  _id: string;
  name: string;
  message: string;
  messageFr?: string;
  messageNl?: string;
};

export default function ReviewsSection() {
  const t = useTranslations("reviews");
  const swiperRef = useRef<SwiperType | null>(null);

  const pathname = usePathname();
  const locale = useMemo(() => pathname.split("/")[1] || "en", [pathname]);

  const [reviews, setReviews] = useState<ReviewFromDb[]>([]);

  useEffect(() => {
    fetch("/api/reviews")
      .then((res) => res.json())
      .then((data: ReviewFromDb[]) => setReviews(Array.isArray(data) ? data : []))
      .catch(() => setReviews([]));
  }, []);

  const getLocalizedMessage = (r: ReviewFromDb) => {
    // If FR/NL exists use it, otherwise show EN.
    if (locale === "fr") return r.messageFr?.trim() || r.message;
    if (locale === "nl") return r.messageNl?.trim() || r.message;
    return r.message;
  };

  return (
    <section className={styles.section}>
      <div className={styles.outer}>
        <p className={`${styles.headline} font-varela`}>{t("headline")}</p>

        <h2 className={`${styles.title} font-ramillas-mediumItalic`}>
          {t("title")}
        </h2>

        <div className={styles.sliderWrap}>
          <button
            type="button"
            aria-label="Previous review"
            onClick={() => swiperRef.current?.slidePrev()}
            className={styles.reviewsArrowBtn}
          >
            <CircleChevronLeft className={styles.reviewsArrowIcon} size={46} />
          </button>

          <button
            type="button"
            aria-label="Next review"
            onClick={() => swiperRef.current?.slideNext()}
            className={styles.reviewsArrowBtn}
          >
            <CircleChevronRight className={styles.reviewsArrowIcon} size={46} />
          </button>

          <Swiper
            modules={[Navigation]}
            navigation={false}
            loop={reviews.length > 1}
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
              <SwiperSlide key={r._id}>
                <div className={styles.card}>
                  <p className={`${styles.cardText} font-ramillas-mediumItalic`}>
                    {getLocalizedMessage(r)}
                  </p>

                  <div className={styles.cardFooter}>
                    <span className={`${styles.name} font-worksans`}>
                      {r.name}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            ))}

            {reviews.length === 0 && (
              <SwiperSlide key="empty">
                <div className={styles.card}>
                  <p className={`${styles.cardText} font-ramillas-mediumItalic`}>
                    —
                  </p>
                  <div className={styles.cardFooter}>
                    <span className={`${styles.name} font-worksans`}>
                      {t("empty", { default: "No reviews yet." })}
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            )}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
