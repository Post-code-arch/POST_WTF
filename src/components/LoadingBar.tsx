"use client";

import { useEffect, useRef } from "react";
import { LOADING_BAR_KEY as KEY } from "@/lib/loadingBar";
import styles from "./LoadingBar.module.css";

/** durée minimale à l'écran, pour qu'elle se lise même sur une page en cache */
const MIN_MS = 700;

/**
 * Barre de chargement fine, en haut de l'écran, à l'arrivée sur le site.
 * Elle avance seule (animation CSS, donc dès le premier rendu, avant même
 * l'hydratation) jusqu'à 85 %, puis se complète et s'efface quand la page
 * a fini de charger (événement `load` : images comprises).
 * Masquée d'emblée (script en tête de page) si la session l'a déjà vue,
 * et sur le portfolio /kamil-grimes.
 */
export default function LoadingBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const root = document.documentElement;
    if (!el || root.dataset.pl === "done") return;

    let timer = 0;
    const finish = () => {
      timer = window.setTimeout(() => {
        // on fige la position atteinte par l'animation, puis on complète
        el.style.transform = getComputedStyle(el).transform;
        el.style.animation = "none";
        void el.offsetWidth;
        el.classList.add(styles.end);
        try {
          sessionStorage.setItem(KEY, "1");
        } catch {}
        timer = window.setTimeout(() => (root.dataset.pl = "done"), 1000);
      }, Math.max(0, MIN_MS - performance.now()));
    };

    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    return () => {
      window.removeEventListener("load", finish);
      window.clearTimeout(timer);
    };
  }, []);

  return <div ref={ref} className={styles.bar} aria-hidden />;
}

