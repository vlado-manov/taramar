// src/components/FullscreenMapModal.tsx
"use client";

import { useTranslations } from "next-intl";
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type FullscreenMapModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  ariaLabel?: string;
};

export default function FullscreenMapModal({
  isOpen,
  onClose,
  title = "Enter your address",
  subtitle = "We’ll show you the closest INNO store.",
  children,
  ariaLabel = "Map modal",
}: FullscreenMapModalProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
const t = useTranslations('mapModal');
  // Hard scroll lock + ESC close
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

  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fm-overlay"
      role="dialog"
      aria-label={ariaLabel}
      // close only when clicking the dimmed overlay
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="fm-card"
        ref={cardRef}
        // keep focus behavior passive (do not steal focus from inputs)
      >
        <button
          type="button"
          className="fm-close"
          onClick={onClose}
          aria-label="Close"
        >
          <span aria-hidden="true">✕</span>
        </button>

        <div className="fm-head">
          <h3 className="fm-title">{t('title')}</h3>
          {subtitle ? <p className="fm-subtitle">{t('subtitle')}</p> : null}
        </div>

        <div className="fm-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}
