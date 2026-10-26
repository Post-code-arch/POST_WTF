"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";

/**
 * Colonne de texte « collante » : elle reste à l'écran pendant que les
 * visuels de sa section défilent. Si elle est plus haute que l'écran, elle
 * se cale par le bas (top négatif) pour que la fin du texte reste lisible.
 */
export default function StickyAside({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const HAUT = 110; // sous la nav fixe
    const BAS = 32;
    const place = () => {
      const libre = window.innerHeight - HAUT - BAS;
      const h = el.offsetHeight;
      el.style.top = `${h <= libre ? HAUT : window.innerHeight - h - BAS}px`;
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(el);
    window.addEventListener("resize", place);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", place);
    };
  }, []);

  return (
    <aside ref={ref} className={className}>
      {children}
    </aside>
  );
}
