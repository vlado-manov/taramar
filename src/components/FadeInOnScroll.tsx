// src/components/FadeInOnScroll.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";

type FadeInOnScrollProps = {
  children: React.ReactNode;
  /** extra delay per section if you want to stagger */
  delayMs?: number;
};

export default function FadeInOnScroll({
  children,
  delayMs = 0,
}: FadeInOnScrollProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px", // trigger a bit before fully in view
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        ref={ref}
        className={`fade-section ${visible ? "fade-section--visible" : ""}`}
        style={{ transitionDelay: `${delayMs}ms` }}
      >
        {children}
      </div>

      <style jsx>{`
        .fade-section {
          opacity: 0;
          transform: translateY(32px);
          filter: blur(6px);
          transition:
            opacity 700ms ease-out,
            transform 700ms ease-out,
            filter 700ms ease-out;
          will-change: opacity, transform, filter;
        }

        .fade-section--visible {
          opacity: 1;
          transform: translateY(0);
          filter: blur(0);
        }
      `}</style>
    </>
  );
}
