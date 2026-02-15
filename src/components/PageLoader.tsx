"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import styles from "./PageLoader.module.css";

/**
 * Returns a promise that resolves once every <img> currently in the document
 * has finished loading (or errored). Images added after this call are ignored.
 */
function waitForImages(): Promise<void> {
  const imgs = Array.from(document.querySelectorAll<HTMLImageElement>("img"));
  const pending = imgs.filter((img) => !img.complete);
  if (pending.length === 0) return Promise.resolve();

  return Promise.all(
    pending.map(
      (img) =>
        new Promise<void>((resolve) => {
          img.addEventListener("load", () => resolve(), { once: true });
          img.addEventListener("error", () => resolve(), { once: true });
        })
    )
  ).then(() => undefined);
}

export default function PageLoader() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  const isAdmin = pathname?.includes("/admin");

  useEffect(() => {
    if (isAdmin) {
      setVisible(false);
      return;
    }

    let dismissed = false;

    function dismiss() {
      if (dismissed) return;
      dismissed = true;
      setFading(true);
      setTimeout(() => setVisible(false), 600);
    }

    // Safety net — never block longer than 7s
    const fallback = setTimeout(dismiss, 7000);

    async function onPageLoad() {
      // After window.load, wait for any images still pending
      // (client-rendered images below-fold may not be done yet)
      try {
        await Promise.race([
          waitForImages(),
          new Promise<void>((r) => setTimeout(r, 2500)), // max 2.5s extra
        ]);
      } finally {
        dismiss();
      }
    }

    if (document.readyState === "complete") {
      onPageLoad();
    } else {
      window.addEventListener("load", onPageLoad, { once: true });
    }

    return () => {
      window.removeEventListener("load", onPageLoad);
      clearTimeout(fallback);
    };
  }, [isAdmin]);

  if (!visible) return null;

  return (
    <div className={`${styles.overlay} ${fading ? styles.fading : ""}`}>
      <div className={styles.logoWrap}>
        <Image
          src="/images/taramar_wlogo.png"
          alt="Taramar"
          width={180}
          height={60}
          priority
          className={styles.logo}
        />
      </div>
    </div>
  );
}
