// src/components/Navbar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const pathname = usePathname(); // e.g. /en or /en#stores
  const locale = pathname.split("/")[1] || "en";

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        {/* Left spacer (keeps logo centered) */}
        <div className={styles.spacer} />

        {/* Logo */}
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/images/taramar_wlogo.png"
            alt="Taramar skincare textures"
            width={306}
            height={40}
            className={styles.logo}
            priority
          />
        </Link>

        {/* Language switcher */}
        <div className={styles.localeSwitcher}>
          <Link className={styles.localeLink} href="/nl">
            {locale === "nl" ? <strong>NL</strong> : "NL"}
          </Link>
          <span className={styles.separator}>|</span>
          <Link className={styles.localeLink} href="/fr">
            {locale === "fr" ? <strong>FR</strong> : "FR"}
          </Link>
          <span className={styles.separator}>|</span>
          <Link className={styles.localeLink} href="/en">
            {locale === "en" ? <strong>EN</strong> : "EN"}
          </Link>
        </div>
      </nav>
    </header>
  );
}
