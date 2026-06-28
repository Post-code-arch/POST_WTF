"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { Work } from "@/lib/works";
import styles from "./Home.module.css";

const EASE = [0.16, 1, 0.3, 1] as const;
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const DECODE_MS = 480;

function scrambleAt(text: string, progress: number) {
  const lockedCount = Math.floor(progress * text.length);
  return text
    .split("")
    .map((ch, i) =>
      ch === " " || i < lockedCount
        ? ch
        : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
    )
    .join("");
}

/** Titre qui se décode (scramble -> texte final) à l'activation du survol. */
function DecipherTitle({ text, active, skip }: { text: string; active: boolean; skip: boolean }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    if (skip || !active) {
      setDisplay(text);
      return;
    }
    let frame: number;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / DECODE_MS);
      setDisplay(progress >= 1 ? text : scrambleAt(text, progress));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, text, skip]);

  return <>{display}</>;
}

/**
 * Grille work (accueil) — variante interactive : curseur custom en "+" qui
 * suit la souris et pivote à 90° au survol d'une carte (couleur inversée via
 * mix-blend-mode, lisible sur n'importe quel fond), et titre qui se décode
 * au survol. Curseur désactivé sur tactile / pointeur grossier / reduced
 * motion (fallback : curseur natif) ; le décodage est lui aussi coupé sous
 * reduced motion (le titre s'affiche directement).
 */
export default function WorkGrid({ items }: { items: Work[] }) {
  const gridRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll<HTMLElement>("[data-work-item]"));
    const cardHandlers = cards.map((el, i) => {
      const onEnter = () => setHoveredIndex(i);
      const onLeave = () => setHoveredIndex((cur) => (cur === i ? null : cur));
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
      return { el, onEnter, onLeave };
    });

    const onMove = (e: MouseEvent) => {
      cx.set(e.clientX);
      cy.set(e.clientY);
    };
    if (enabled) grid.addEventListener("mousemove", onMove);

    return () => {
      if (enabled) grid.removeEventListener("mousemove", onMove);
      cardHandlers.forEach(({ el, onEnter, onLeave }) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, [enabled, cx, cy]);

  const active = hoveredIndex !== null;

  return (
    <div
      className={styles.workGrid}
      ref={gridRef}
      data-cursor={enabled ? "on" : undefined}
    >
      {items.map((w, i) => (
        <div key={w.slug} className={styles.workItem} data-work-item>
          <Link href={`/travaux/${w.slug}`} style={{ display: "block" }}>
            <div className={styles.workThumb}>
              <div
                className={styles.workMedia}
                style={w.image ? { backgroundImage: `url(${w.image})` } : undefined}
              />
            </div>
            <div className={styles.workCap}>
              <span className={styles.workName} aria-label={w.title}>
                <DecipherTitle text={w.title} active={hoveredIndex === i} skip={!!reduced} />
              </span>
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
