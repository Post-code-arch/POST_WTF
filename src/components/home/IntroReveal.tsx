"use client";

import { Fragment, useEffect, useRef } from "react";
import styles from "./IntroReveal.module.css";

const TEXT =
  "Une agence créative qui travaille la stratégie, l’identité, le web et la production avec la même attention. Une moitié du temps à comprendre ce qui est déjà là. L’autre à faire les choses jusqu’au bout, en laissant au client l’autonomie pour la suite.";

const WORDS = TEXT.split(" ");

/**
 * Paragraphe d'intro de l'accueil. Révélation accentuée mot à mot : au scroll,
 * chaque mot passe de flou + estompé + abaissé à net + pleine encre, en
 * cascade de gauche à droite à mesure que la section traverse le viewport.
 * reduced-motion : texte plein d'emblée.
 */
export default function IntroReveal() {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const words = Array.from(
      el.querySelectorAll<HTMLElement>(`.${styles.word}`)
    );
    const n = words.length;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      words.forEach((w) => w.style.setProperty("--w", "1"));
      return;
    }

    // étalement de la cascade : combien de « largeur de progression » sépare
    // le premier mot du dernier (plus c'est grand, plus la vague est étirée).
    const SPREAD = 0.55;

    let ticking = false;
    const update = () => {
      ticking = false;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.95; // entre par le bas
      const end = vh * 0.2; // fini près du haut
      const p = Math.min(Math.max((start - r.top) / (start - end), 0), 1);
      // chaque mot a son propre seuil ; la vague balaie de 0 à 1.
      for (let i = 0; i < n; i++) {
        const head = (i / n) * (1 - SPREAD);
        const w = Math.min(Math.max((p - head) / SPREAD, 0), 1);
        words[i].style.setProperty("--w", w.toFixed(3));
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <p ref={ref} className={styles.fill}>
      <span className={styles.sq} />
      {WORDS.map((word, i) => (
        <Fragment key={i}>
          <span className={styles.word}>{word}</span>
          {i < WORDS.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </p>
  );
}
