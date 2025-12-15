"use client";

import Image from "next/image";
import styles from "./Footer.module.css";
import { useTranslations } from "next-intl";
import Link from "next/link";

type FooterItem = {
  key: "product_q1" | "product_q2" | "product_q3" | "product_q4" | "product_q5" | "product_q6";
  icon: string;
  alt: string;
};

function renderWithNewlines(text: string) {
  return text.split("[[newline]]").map((part, idx) => (
    <span key={idx}>
      {part}
      {idx < text.split("[[newline]]").length - 1 ? <br /> : null}
    </span>
  ));
}

export default function Footer() {
  const t = useTranslations("footer");

  const items: FooterItem[] = [
    { key: "product_q1", icon: "/images/footer/notoxics.png", alt: "No toxics" },
    { key: "product_q2", icon: "/images/footer/pure.png", alt: "Pure" },
    { key: "product_q3", icon: "/images/footer/bpa-free.png", alt: "BPA-free" },
    { key: "product_q4", icon: "/images/footer/vegan.png", alt: "Vegan" },
    { key: "product_q5", icon: "/images/footer/hand-crafter.png", alt: "Hand-crafted" },
    { key: "product_q6", icon: "/images/footer/non-gmo.png", alt: "Non-GMO" },
  ];

  const links = (t.raw("links") as string[]) ?? [];
  const hrefs = ["/en/terms", "/en/privacy", "/en/contact"];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Title */}
        <h3 className={styles.title}>{t("title")}</h3>

        {/* Icon grid */}
        <div className={styles.grid}>
          {items.map((item) => {
            const text = t(item.key);
            return (
              <div key={item.key} className={styles.card}>
                <div className={styles.iconWrap}>
                  <Image
                    src={item.icon}
                    alt={item.alt}
                    width={120}
                    height={120}
                    className={styles.icon}
                    priority={false}
                  />
                </div>

                <p className={styles.cardText}>{renderWithNewlines(text)}</p>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className={styles.divider} />

        {/* Bottom row */}
        <div className={styles.bottom}>
            <Link href="/">
          <div className={styles.brand}>
                <span className={styles.brandMark} aria-hidden="true" />
                <span className={styles.brandName}>TARAMAR</span>
          </div>
            </Link>

          <div className={styles.copyright}>
            {t("copyright")}
          </div>

          <nav className={styles.links} aria-label="Footer links">
            {links.map((label, idx) => (
              <Link
                key={`${label}-${idx}`}
                href={hrefs[idx] ?? "/"}
                className={styles.link}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
