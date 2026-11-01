"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import POSTLogo from "./POSTLogo";
import { INTRO_KEY } from "@/lib/intro";
import styles from "./Intro.module.css";

/** les projets qui défilent au centre, le temps du chargement */
const PROJETS: [string, string][] = [
  ["IMLEAD", "/intro/01-imlead.webp"],
  ["MAG Agency", "/intro/02-mag.webp"],
  ["Fennec Café", "/intro/03-fennec.webp"],
  ["BANBIOM", "/intro/04-banbiom.webp"],
  ["Astarté Conseils", "/intro/05-astarte.webp"],
  ["Marpharmal", "/intro/06-marpharmal.webp"],
  ["Spoon Atelier", "/intro/07-spoon.webp"],
];

/** durée minimale de l'intro, même si la page est déjà en cache */
const MIN_MS = 1800;
/** cadence du défilement des projets */
const FLIP_MS = 150;

/**
 * Intro plein écran à l'arrivée sur le site : les projets défilent au
 * centre, le compteur monte et le grand logo POST_ se remplit de gauche à
 * droite à mesure que la page charge (événement `load`). À 100, l'écran se
 * lève et découvre la page.
 * Rendue dès le HTML (elle couvre la page avant l'hydratation) ; masquée
 * d'emblée par le script de tête si la session l'a déjà vue, et sur le
 * portfolio /kamil-grimes. Pas d'intro si l'utilisateur limite les animations.
 */
export default function Intro() {
  const ref = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [actif, setActif] = useState(0);

  useEffect(() => {
    const el = ref.current;
    const root = document.documentElement;
    if (!el || root.dataset.intro === "done") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.dataset.intro = "done";
      return;
    }

    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    let loaded = document.readyState === "complete";
    const onLoad = () => (loaded = true);
    if (!loaded) window.addEventListener("load", onLoad, { once: true });

    const flip = window.setInterval(
      () => setActif((i) => (i + 1) % PROJETS.length),
      FLIP_MS
    );

    // progression : avance vers 90 % tant que la page charge, puis vers
    // 100 % une fois chargée et la durée minimale écoulée
    const t0 = performance.now();
    let p = 0;
    let raf = 0;
    let exitTimer = 0;
    const tick = (now: number) => {
      const fini = loaded && now - t0 >= MIN_MS;
      const cible = fini ? 1 : Math.min(0.9, (now - t0) / MIN_MS);
      p += (cible - p) * (fini ? 0.12 : 0.08);
      if (fini && 1 - p < 0.004) p = 1;
      el.style.setProperty("--p", p.toFixed(4));
      if (countRef.current)
        countRef.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
      if (p < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      // 100 : on fige le défilement, puis l'écran se lève
      window.clearInterval(flip);
      el.classList.add(styles.exit);
      try {
        sessionStorage.setItem(INTRO_KEY, "1");
      } catch {}
      exitTimer = window.setTimeout(() => {
        root.dataset.intro = "done";
        root.style.overflow = prevOverflow;
      }, 1100);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(flip);
      window.clearTimeout(exitTimer);
      window.removeEventListener("load", onLoad);
      root.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <div ref={ref} className={styles.intro} style={{ "--p": 0 } as CSSProperties} aria-hidden>
      <div className={styles.top}>
        <span>(Chargement)</span>
        <span>Alger · 36.7°N</span>
        <span ref={countRef} className={styles.count}>
          000
        </span>
      </div>

      <figure className={styles.flip}>
        <div className={styles.frame}>
          {PROJETS.map(([nom, src], i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={src} src={src} alt="" className={i === actif ? styles.on : undefined} />
          ))}
        </div>
        <figcaption>
          <span>{String(actif + 1).padStart(2, "0")}</span>
          {PROJETS[actif][0]}
        </figcaption>
      </figure>

      {/* le logo se remplit avec la progression ; dessous, sa version estompée */}
      <div className={styles.logo}>
        <POSTLogo className={styles.logoGhost} />
        <POSTLogo className={styles.logoFill} />
      </div>
    </div>
  );
}
