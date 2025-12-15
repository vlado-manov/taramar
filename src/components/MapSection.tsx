// src/components/MapSection.tsx
"use client";

import dynamic from "next/dynamic";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import FullscreenMapModal from "./FullscreenMapModal";
import { useTranslations } from "next-intl";
import styles from "./MapSection.module.css";

type Store = {
  _id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  lat: number;
  lng: number;
  visible: boolean;
};

const MapInner = dynamic(() => import("./MapInner"), {
  ssr: false,
  loading: () => (
    <div className={styles.mapLoading}>
      Loading map...
    </div>
  ),
});

export default function MapSection() {
  const t = useTranslations("stores");
  const tr = useTranslations("mapModal");
  const locations = t.raw("locations") as string[];

  const [stores, setStores] = useState<Store[]>([]);
  const [nearest, setNearest] = useState<Store | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetch("/api/stores")
      .then((res) => res.json())
      .then((data: Store[]) => setStores(data.filter((s) => s.visible)));
  }, []);

  const locationsLine = useMemo(() => {
    return locations.join(" · ");
  }, [locations]);

  function distanceInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!search.trim()) return;

    setIsSearching(true);
    try {
      const geoRes = await fetch(`/api/geocode?q=${encodeURIComponent(search)}`);
      if (!geoRes.ok) return alert("Could not find address.");

      const { lat, lng } = await geoRes.json();

      let nearestStore: Store | null = null;
      let bestDist = Infinity;

      for (const store of stores) {
        const d = distanceInKm(lat, lng, store.lat, store.lng);
        if (d < bestDist) {
          bestDist = d;
          nearestStore = store;
        }
      }

      setNearest(nearestStore);
      setIsOverlayOpen(false);
    } finally {
      setIsSearching(false);
    }
  }

  return (
    <section id="stores" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {/* LEFT */}
          <div className={styles.left}>
            <h2 className={`${styles.headline} font-varela`}>{t("headline")}</h2>

            <p className={`${styles.desc} font-worksans`}>{t("desc")}</p>

            <p className={`${styles.locations} font-ramillas-mediumItalic`}>
              {locationsLine}
            </p>

            <p className={`${styles.desc2} font-worksans`}>{t("desc2")}</p>

            <div className={styles.ctaWrap}>
              <button
                type="button"
                onClick={() => setIsOverlayOpen(true)}
                className={`${styles.ctaButton} font-varela`}
              >
                {t("cta")}
              </button>
            </div>

            {nearest && (
              <p className={`${styles.nearest} font-worksans`}>
                Nearest store: <strong>{nearest.name}</strong> ({nearest.city})
              </p>
            )}
          </div>

          {/* RIGHT */}
          <Suspense fallback={<div>Loading…</div>}>
            <MapInner stores={stores} nearest={nearest} />
          </Suspense>
        </div>
      </div>

      {/* ✅ Fullscreen portal modal (separated from section layout) */}
      <FullscreenMapModal
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        title="Enter your address"
        subtitle="We’ll show you the closest INNO store."
        ariaLabel="Find nearest store"
      >
        <form onSubmit={handleSearch} className={styles.modalForm}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="1000 Brussels"
            autoFocus
            className={`${styles.modalInput} font-worksans`}
          />

          <button
            type="submit"
            disabled={isSearching}
            className={`${styles.modalButton} font-varela`}
            style={{ opacity: isSearching ? 0.6 : 1 }}
          >
            {isSearching ? tr("ctaSearch") : tr('cta')}
          </button>

          <p className={`${styles.modalTip} font-worksans`}>
            {tr('tip')}
          </p>
        </form>
      </FullscreenMapModal>
    </section>
  );
}
