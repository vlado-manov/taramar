// src/components/ProductsSection.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import styles from "./ProductsSection.module.css";
import FullscreenProductModal from "./FullscreenProductModal";
import {
  Sun,
  Atom,
  Sparkles,
  Moon,
  Eye,
  Droplets,
  Flower,
  type LucideIcon,
} from "lucide-react";

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

const MODAL_EXIT_MS = 820;

// PID → icon mapping
const PRODUCT_ICON_BY_PID: Record<string, LucideIcon> = {
  "eye-treatment": Eye,
  "the-serum": Atom,
  "night-treatment": Moon,
  "day-treatment": Sun,
  "purifying-treatment": Sparkles,
  "rejuvenating-oil": Droplets,
  "arctic-flower-treatment": Flower,
};

export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isClosing, setIsClosing] = useState(false);

  const pathname = usePathname();
  const locale = useMemo(() => pathname.split("/")[1] || "en", [pathname]);
  const isEnglish = locale === "en";

  const tp = useTranslations("products");

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data: Product[]) => setProducts(data.filter((p) => p.visible)))
      .catch(() => {});
  }, []);

  const openProduct = (product: Product) => {
    if (!isEnglish) return;
    setIsClosing(false);
    setSelectedProduct(product);
  };

  const closeProduct = () => {
    if (!selectedProduct) return;
    setIsClosing(true);
    window.setTimeout(() => {
      setSelectedProduct(null);
      setIsClosing(false);
    }, MODAL_EXIT_MS);
  };

  const getLocalized = (
    product: Product,
    field: LocalizableKey
  ): string | undefined => {
    if (locale === "fr") {
      if (field === "name") return product.nameFr ?? product.name;
      if (field === "headline") return product.headlineFr ?? product.headline;
      if (field === "summary") return product.summaryFr ?? product.summary;
      if (field === "description")
        return product.descriptionFr ?? product.description;
    }

    if (locale === "nl") {
      if (field === "name") return product.nameNl ?? product.name;
      if (field === "headline") return product.headlineNl ?? product.headline;
      if (field === "summary") return product.summaryNl ?? product.summary;
      if (field === "description")
        return product.descriptionNl ?? product.description;
    }

    return product[field];
  };

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

  const selectedIcon = selectedProduct
    ? PRODUCT_ICON_BY_PID[selectedProduct.pid] ?? Sun
    : Sun;

  return (
    <section className={styles.section} id="products">
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2 className={`${styles.headline} font-varela`}>{tp("headline")}</h2>
          <p className={styles.subtitle}>{tp("subtitle")}</p>
        </div>

        <div className={styles.grid}>
          {products.map((p) => {
            const name = getLocalized(p, "name") ?? p.name;
            const desc =
              getLocalized(p, "summary") ?? getLocalized(p, "description");

            const firstImage = p.images?.[0];
            const Icon = PRODUCT_ICON_BY_PID[p.pid] ?? Sun;

            return (
              <div key={p._id} className={styles.card}>
                <div className={styles.productVisual}>
                  {firstImage ? (
                    <img
                      src={firstImage}
                      alt={name}
                      className={styles.productImage}
                      loading="lazy"
                    />
                  ) : (
                    <div className={styles.productVisualBox} />
                  )}
                </div>

                <Icon className={styles.productIcon} size={16} color="#187E73" />

                <p className={`${styles.productTitle} font-varela`}>{name}</p>

                {desc && (
                  <p className={`${styles.productDesc} font-worksans`}>{desc}</p>
                )}

                {/* ✅ SEE MORE — English only */}
                {isEnglish && (
                  <button
                    type="button"
                    className={`${styles.seeMoreButton} font-varela`}
                    onClick={() => openProduct(p)}
                  >
                    SEE MORE
                  </button>
                )}
              </div>
            );
          })}

          {products.length === 0 && (
            <p className={styles.empty}>No products available yet.</p>
          )}
        </div>

        <div className={styles.bottomCtaRow}>
          <button
            type="button"
            className={`${styles.bottomCta} font-varela`}
            onClick={() => scrollToSection("stores")}
          >
            {tp("cta")}
          </button>
        </div>
      </div>

      {/* ✅ Fullscreen portal modal */}
      <FullscreenProductModal
        isOpen={isEnglish && !!selectedProduct}
        isClosing={isClosing}
        onClose={closeProduct}
        product={selectedProduct}
        Icon={selectedIcon}
        locale={locale as "en" | "fr" | "nl"}
      />
    </section>
  );
}
