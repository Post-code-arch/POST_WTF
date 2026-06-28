"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { Work } from "@/lib/works";
import styles from "./Home.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Grille work (accueil) — variante interactive : curseur custom en "+" qui
 * suit la souris et pivote à 90° au survol d'une carte. Désactivé sur
 * tactile / pointeur grossier / prefers-reduced-motion (fallback : curseur
 * natif, le reste de l'effet — désaturation, lift — reste 100% CSS).
 */
export default function WorkGrid({ items }: { items: Work[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);

  const cx = useMotionValue(0);
  const cy = useMotionValue(0);
  const springX = useSpring(cx, { damping: 28, stiffness: 320, mass: 0.5 });
  const springY = useSpring(cy, { damping: 28, stiffness: 320, mass: 0.5 });

  useEffect(() => {
    if (reduced) return;
    setEnabled(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, [reduced]);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid || !enabled) return;

    const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-work-item]"));
    const onMove = (e: MouseEvent) => {
      cx.set(e.clientX);
      cy.set(e.clientY);
    };
    const onEnter = () => setActive(true);
    const onLeave = () => setActive(false);

    grid.addEventListener("mousemove", onMove);
    cards.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      grid.removeEventListener("mousemove", onMove);
      cards.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [enabled, cx, cy]);

  return (
    <div
      className={styles.workGrid}
      ref={gridRef}
      data-cursor={enabled ? "on" : undefined}
    >
      {items.map((w) => (
        <div key={w.slug} className={styles.workItem} data-work-item>
          <Link href={`/travaux/${w.slug}`} style={{ display: "block" }}>
            <div className={styles.workThumb}>
              <div
                className={styles.workMedia}
                style={w.image ? { backgroundImage: `url(${w.image})` } : undefined}
              />
            </div>
            <div className={styles.workCap}>
              <span className={styles.workName}>{w.title}</span>
              <span className={styles.workDisc}>{w.categories[0]}</span>
            </div>
          </Link>
        </div>
      ))}

      {enabled && (
        <motion.div
          className={styles.cursorPlus}
          style={{ x: springX, y: springY }}
          animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.4, rotate: active ? 90 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          aria-hidden
        />
      )}
    </div>
  );
}
