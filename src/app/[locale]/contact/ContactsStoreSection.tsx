"use client";

import dynamic from "next/dynamic";
import React, { Suspense, useEffect, useState } from "react";
import FullscreenMapModal from "@/components/FullscreenMapModal";
import styles from "./ContactStoresSection.module.css";

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

const MapInner = dynamic(() => import("@/components/MapInner"), {
  ssr: false,
  loading: () => <div className={styles.mapLoading}>Loading map…</div>,
});

export default function ContactStoresSection() {
  const [stores, setStores] = useState<Store[]>([]);
  const [nearest, setNearest] = useState<Store | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    fetch("/api/stores")
      .then((res) => res.json())
      .then((data: Store[]) => setStores(data.filter((s) => s.visible)))
      .catch(() => {});
  }, []);

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
    <>
      <div className={styles.mapCard}>
        <div className={styles.mapHeader}>
          <div className={styles.mapHeaderText}>
            <p className={`${styles.mapKicker} font-varela`}>Map</p>
            <p className={`${styles.mapTitle} font-worksans`}>
              Stores that sell Taramar
            </p>
          </div>

          <button
            type="button"
            className={`${styles.mapCta} font-varela`}
            onClick={() => setIsOverlayOpen(true)}
          >
            Find nearest store
          </button>
        </div>

        {nearest ? (
          <p className={`${styles.nearest} font-worksans`}>
            Nearest store: <strong>{nearest.name}</strong> ({nearest.city})
          </p>
        ) : null}

        <div className={styles.mapFrame}>
          <Suspense fallback={<div className={styles.mapLoading}>Loading…</div>}>
            <MapInner stores={stores} nearest={nearest} />
          </Suspense>
        </div>
      </div>

      <FullscreenMapModal
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        title="Enter your address"
        subtitle="We’ll show you the closest partner store."
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
            {isSearching ? "Searching…" : "Find closest store"}
          </button>

          <p className={`${styles.modalTip} font-worksans`}>
            Tip: enter a city, postal code, or full address.
          </p>
        </form>
      </FullscreenMapModal>
    </>
  );
}
