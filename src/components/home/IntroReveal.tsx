"use client";

import { Fragment, useEffect, useRef } from "react";
import { typo } from "@/lib/typo";
import styles from "./IntroReveal.module.css";

/** texte A — deux paragraphes, révélés d'une seule vague */
const PARAGRAPHS = [
  "En Algérie, beaucoup d'institutions et d'entreprises valent mieux que ce qu'elles montrent. Leurs équipes, leurs infrastructures et leur savoir-faire dépassent ce que leur image laisse percevoir. Or c'est sur cette image qu'on les juge, avant même qu'elles prennent la parole.",
  "post_ corrige cet écart. Identité, site, film : nous concevons et fabriquons l'ensemble sous un même toit, avec une seule direction, pour des outils qui tiennent des années.",
].map((p) => typo(p).split(" "));

/**
 * Intro de l'accueil (deux paragraphes). Révélation accentuée mot à mot : au scroll,
 * chaque mot passe de flou + estompé + abaissé à net + pleine encre, en
 * cascade de gauche à droite à mesure que la section traverse le viewport.
 * reduced-motion : texte plein d'emblée.
 */
export default function IntroReveal() {
  const ref = useRef<HTMLDivElement>(null);

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
    <div ref={ref}>
      {PARAGRAPHS.map((words, pi) => (
        <p key={pi} className={styles.fill}>
          {pi === 0 && <span className={styles.sq} />}
          {words.map((word, i) => (
            <Fragment key={i}>
              <span className={styles.word}>{word}</span>
              {i < words.length - 1 ? " " : ""}
            </Fragment>
          ))}
        </p>
      ))}
    </div>
  );
}
