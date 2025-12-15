"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./FullscreenProductModal.module.css";
import { X, type LucideIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";

type Product = {
  _id: string;
  pid: string;

  name: string;
  nameFr?: string;
  nameNl?: string;

  headline?: string;
  headlineFr?: string;
  headlineNl?: string;

  summary?: string;
  summaryFr?: string;
  summaryNl?: string;

  description?: string;
  descriptionFr?: string;
  descriptionNl?: string;

  bulletPoints: string[];
  images: string[];

  price?: number;
  visible: boolean;
};

type LocalizableKey = "name" | "headline" | "summary" | "description";

type FullscreenProductModalProps = {
  isOpen: boolean;
  isClosing: boolean;
  onClose: () => void;

  product: Product | null;

  // icon picked by pid in ProductsSection
  Icon: LucideIcon;

  // for localization
  locale: "en" | "fr" | "nl";
};

export default function FullscreenProductModal({
  isOpen,
  isClosing,
  onClose,
  product,
  Icon,
  locale,
}: FullscreenProductModalProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  const getLocalized = useMemo(() => {
    return (p: Product, field: LocalizableKey): string | undefined => {
      if (locale === "fr") {
        if (field === "name") return p.nameFr ?? p.name;
        if (field === "headline") return p.headlineFr ?? p.headline;
        if (field === "summary") return p.summaryFr ?? p.summary;
        if (field === "description") return p.descriptionFr ?? p.description;
      }

      if (locale === "nl") {
        if (field === "name") return p.nameNl ?? p.name;
        if (field === "headline") return p.headlineNl ?? p.headline;
        if (field === "summary") return p.summaryNl ?? p.summary;
        if (field === "description") return p.descriptionNl ?? p.description;
      }

      return p[field];
    };
  }, [locale]);

  // Scroll lock + ESC close
  useEffect(() => {
    if (!isOpen) return;
    if (typeof window === "undefined") return;

    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.paddingRight = prevPaddingRight;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;
  if (typeof document === "undefined") return null;

  const name = getLocalized(product, "name") ?? product.name;
  const headline = getLocalized(product, "headline");
  const bodyText =
    getLocalized(product, "description") ??
    getLocalized(product, "summary") ??
    product.description ??
    product.summary;

  const firstImage = product.images?.[0];

  return createPortal(
    <div
      className={[
        styles.overlay,
        isClosing ? styles.overlayExit : styles.overlayEnter,
      ].join(" ")}
      role="dialog"
      aria-label={`${name} details`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={cardRef}
        className={[
          styles.card,
          isClosing ? styles.cardExit : styles.cardEnter,
        ].join(" ")}
      >
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close product details"
        >
          <X color="black" size={40} />
        </button>

        <div className={styles.inner}>
          {/* LEFT */}
          <div className={styles.media}>
            {firstImage ? (
              <img
                src={firstImage}
                alt={name}
                className={styles.image}
                loading="eager"
              />
            ) : (
              <div className={styles.fallbackBox} />
            )}
          </div>

          {/* RIGHT */}
          <div className={styles.text}>
            <div className={styles.topIcon}>
              <Icon size={48} color="#187E73" className={styles.icon} />
            </div>

            <h3 className={`${styles.title} font-varela`}>{name}</h3>

            {headline ? (
              <p className={`${styles.headline} font-worksans-semiBold`}>{headline}</p>
            ) : null}

{product.bulletPoints?.length ? (
  <ul className={`${styles.bullets} font-worksans`}>
    {product.bulletPoints.map((bp, idx) => (
      <li key={`${product._id}-bp-${idx}`}>{bp}</li>
    ))}
  </ul>
) : null}
{bodyText ? (
  <div className={`${styles.body} ${styles.productModalBody} font-worksans`}>
    <ReactMarkdown>{bodyText}</ReactMarkdown>
  </div>
) : null}


          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
