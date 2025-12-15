// src/app/[locale]/admin/(shell)/layout.tsx
"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { MapPinHouse, ShoppingCart } from "lucide-react";
import styles from "../AdminShellLayout.module.css";

type Props = {
  children: ReactNode;
};

export default function AdminShellLayout({ children }: Props) {
  const pathname = usePathname();
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "en";

  const isProducts = pathname?.includes("/admin/products");
  const isStores = pathname?.includes("/admin/stores");

  return (
    <section className={styles.adminShell}>
      <div className={styles.adminContainer}>
        {/* Top header / brand bar */}
        <header className={styles.adminHeader}>
          <div>
            <p className={styles.adminKicker}>Taramar</p>
            <h1 className={styles.adminTitle}>Admin Dashboard</h1>
            <p className={styles.adminSubtitle}>
              Manage products, stores and content for the Taramar landing page.
            </p>
          </div>

          <p className={styles.adminMeta}>
            Internal area · For team members only
          </p>
        </header>

        {/* Shell card */}
        <div className={styles.adminShellCard}>
          <div className={styles.adminShellInner}>
            {/* Sidebar */}
            <aside className={styles.adminSidebar}>
              <div className={styles.adminSidebarCard}>
                <div className={styles.adminSidebarHeader}>
                  <div>
                    <p className={styles.sidebarKicker}>Navigation</p>
                    <p className={styles.sidebarTitle}>Admin sections</p>
                  </div>
                  <span className={styles.sidebarAvatar}>TA</span>
                </div>

                <div className={styles.sidebarButtons}>
                  <p className={styles.sidebarSectionLabel}>Sections</p>

                  <Link
                    href={`/${locale}/admin/products`}
                    aria-current={isProducts ? "page" : undefined}
                    className={`${styles.navPill} ${
                      isProducts ? styles.navPillActive : ""
                    }`}
                  >
                    <span className={styles.navPillIcon}>
                      <ShoppingCart size={14} />
                    </span>
                    <span className={styles.navPillLabel}>Products</span>
                  </Link>

                  <Link
                    href={`/${locale}/admin/stores`}
                    aria-current={isStores ? "page" : undefined}
                    className={`${styles.navPill} ${
                      isStores ? styles.navPillActive : ""
                    }`}
                  >
                    <span className={styles.navPillIcon}>
                      <MapPinHouse size={14} />
                    </span>
                    <span className={styles.navPillLabel}>Stores</span>
                  </Link>
                </div>

                <div className={styles.sidebarFootnote}>
                  <p className={styles.sidebarFootnoteText}>
                    Changes here are synced with the public Taramar site after
                    publishing.
                  </p>
                </div>
              </div>
            </aside>

            {/* Main content */}
            <main className={styles.adminMain}>{children}</main>
          </div>
        </div>

        <footer className={styles.adminFooter}>
          Internal preview · Synced with the{" "}
          <span className={styles.adminFooterBrand}>Taramar</span> landing page.
        </footer>
      </div>
    </section>
  );
}
