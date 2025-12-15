"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type FullscreenVideoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  src: string;
  ariaLabel?: string;
};

export default function FullscreenVideoModal({
  isOpen,
  onClose,
  src,
  ariaLabel = "Video modal",
}: FullscreenVideoModalProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Hard scroll lock + ESC close (while open)
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

    // prevent layout shift when scrollbar disappears
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

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

  // Reset + play on open, pause on close
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isOpen) {
      video.currentTime = 0;
      video.play().catch(() => {
        /* ignore autoplay issues */
      });
    } else {
      video.pause();
    }
  }, [isOpen]);

  // SSR guard
  if (!isOpen) return null;
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fv-overlay"
      onClick={onClose}
      role="dialog"
      aria-label={ariaLabel}
    >
      <div className="fv-shell" onClick={(e) => e.stopPropagation()}>
        <video
          ref={videoRef}
          src={src}
          controls
          playsInline
          className="fv-video"
        />
      </div>
    </div>,
    document.body
  );
}
