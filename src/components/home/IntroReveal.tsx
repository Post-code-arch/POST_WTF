"use client";

import { useEffect, useRef } from "react";
import styles from "./IntroReveal.module.css";

/**
 * Paragraphe d'intro de l'accueil. Le texte se « remplit » au scroll via un
 * dégradé radial : l'encre apparaît depuis le centre vers l'extérieur à
 * mesure que la section traverse le viewport (--r : 0 → 1). reduced-motion :
 * texte plein d'emblée.
 */
export default function IntroReveal() {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--r", "1");
      return;
    }

    let ticking = false;
    const update = () => {
      ticking = false;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // remplissage lent : étalé sur quasi toute la traversée du viewport.
      const start = vh * 1.05; // commence dès l'entrée par le bas
      const end = vh * 0.1; // ne se termine que près du haut de l'écran
      const p = Math.min(Math.max((start - r.top) / (start - end), 0), 1);
      el.style.setProperty("--r", p.toFixed(3));
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
      Une agence créative qui travaille la stratégie, l&apos;identité, le web et
      la production avec la même attention. Une moitié du temps à comprendre ce
      qui est déjà là. L&apos;autre à faire les choses jusqu&apos;au bout, en
      laissant au client l&apos;autonomie pour la suite.
    </p>
  );
}
