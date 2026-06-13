"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Fantascope.module.css";

/* ------------------------------------------------------------------ *
 * VALEURS À TUNER (regroupées en tête)
 * ------------------------------------------------------------------ */
const CFG = {
  pinEnd: 7000, // longueur du pin (px)
  scrub: 1.1, // douceur du scrub
  zoomA: 3.4, // 1er palier du zoom (le trou devient un grand cercle)
  zoomB: 13, // 2e palier (le noir avale tout)
  punchScale: 1.55, // scale final de la punchline (F9)
  exitMargin: 0.46, // marge de sortie (≈ rayon visible du disque, en fraction de sa hauteur)
  miniSpin: 7, // vitesse du mini-disque inline (s)
  heroWeight: 560, // graisse de départ du titre hero
};

// scale initial du disque (F1) — la position est calculée depuis le viewport
const DISC_INIT = { scale: 1.85 };

// durées relatives de chaque phase sur la timeline (tunables)
const DUR = {
  heroHold: 0.4,
  center: 1.2, // F2
  spin: 1.7, // F3 (~3 tours)
  zoom1: 0.8, // F4a
  zoom2: 1.0, // F4b
  reveal: 1.3, // F5
  holdNoir: 0.7, // F6
  paraOut: 0.4, // F7a
  dezoom: 1.0, // F7b
  remontee: 0.9, // F7c
  punchIn: 0.5, // F8
  sortie: 1.1, // F9
};

const PARA_TEXT =
  "On essaie des choses pour voir ce qu'elles donnent. Ce qui marche, on le garde, on l'affine, on s'en sert pour de vrai. Et le travail pour de vrai nous apprend quoi essayer ensuite. Une chose appelle l'autre, sans fin.";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ------------------------------------------------------------------ *
 * PLACEHOLDER DISQUE — à remplacer plus tard par 12 frames du sloughi
 * disposées radialement (i × 30°). Isolé : ne touche pas la mécanique.
 * ------------------------------------------------------------------ */
function buildDisc(): ReactNode {
  const C = 500;
  const ringRadii = [205, 255, 305, 355, 400];
  const ringCounts = [18, 22, 26, 30, 34];
  const dots: { x: number; y: number; r: number }[] = [];
  ringRadii.forEach((R, i) => {
    const n = ringCounts[i];
    const step = 360 / n;
    const offset = i % 2 ? step / 2 : 0; // décalage angulaire alterné
    for (let j = 0; j < n; j++) {
      const a = ((j * step + offset) * Math.PI) / 180;
      dots.push({ x: C + R * Math.cos(a), y: C + R * Math.sin(a), r: 8.5 });
    }
  });
  // marqueur unique près du bord (lit la rotation)
  const ma = (-90 * Math.PI) / 180;
  const marker = { x: C + 400 * Math.cos(ma), y: C + 400 * Math.sin(ma) };

  return (
    <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx={C} cy={C} r={440} fill="var(--fanta-ring)" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="var(--fanta-dot)" />
      ))}
      <circle cx={marker.x} cy={marker.y} r={22} fill="var(--fanta-dot)" />
      {/* trou central = couleur du fond → zoom seamless */}
      <circle cx={C} cy={C} r={150} fill="var(--fanta-bg)" />
    </svg>
  );
}

function buildMiniDisc(): ReactNode {
  const C = 50;
  const n = 8;
  const step = 360 / n;
  const dots = Array.from({ length: n }, (_, j) => {
    const a = ((j * step) * Math.PI) / 180;
    return { x: C + 31 * Math.cos(a), y: C + 31 * Math.sin(a) };
  });
  const ma = (-90 * Math.PI) / 180;
  return (
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx={C} cy={C} r={44} fill="var(--fanta-ring)" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={3} fill="var(--fanta-dot)" />
      ))}
      <circle cx={C + 44 * Math.cos(ma)} cy={C + 44 * Math.sin(ma)} r={5} fill="var(--fanta-dot)" />
      <circle cx={C} cy={C} r={17} fill="var(--fanta-bg)" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
export default function Fantascope({
  disc,
  miniDisc,
}: {
  disc?: ReactNode;
  miniDisc?: ReactNode;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const posRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const rotRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const punchRef = useRef<HTMLParagraphElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  const words = PARA_TEXT.split(/\s+/);

  useIso(() => {
    const section = sectionRef.current;
    if (!section) return;

    // prefers-reduced-motion : pas de pin, tout statique
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.classList.add(styles.reduced);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const pos = posRef.current!;
      const scale = scaleRef.current!;
      const rot = rotRef.current!;
      const hero = heroRef.current!;
      const para = paraRef.current!;
      const punch = punchRef.current!;
      const wordEls = wordsRef.current.filter(Boolean);
      const nWords = wordEls.length || 1;

      // --- positions calculées depuis le viewport ---
      // « 50 % visible » = centre du disque pile sur un bord de l'écran.
      const vh = window.innerHeight;
      const discH = pos.offsetHeight || vh * 0.64;
      const Y_EDGE = ((vh / 2) / discH) * 100; // centre sur le bord bas (haut du disque visible)
      const Y_GONE = ((vh / 2 + discH * CFG.exitMargin) / discH) * 100; // disque entièrement sorti

      // états initiaux
      gsap.set(pos, { yPercent: Y_EDGE }); // F1 : on voit la moitié HAUTE
      gsap.set(scale, { scale: DISC_INIT.scale });
      gsap.set(rot, { rotation: 0 });
      gsap.set(hero, {
        opacity: 1,
        fontWeight: CFG.heroWeight,
        letterSpacing: "0em",
      });
      gsap.set(para, { opacity: 0 });
      gsap.set(wordEls, { opacity: 0.14, filter: "blur(3px)" });
      gsap.set(punch, { opacity: 0, yPercent: -50, scale: 1 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${CFG.pinEnd}`,
          pin: true,
          scrub: CFG.scrub,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // F1 — HERO : maintien, disque énorme en bas, titre visible
      tl.to({}, { duration: DUR.heroHold });

      // F2 — CENTRAGE : le disque monte (yPercent→0) ET rétrécit (scale→1),
      //      le titre s'évapore, la rotation arrive lentement (tween 1).
      const tCenter = tl.duration();
      tl.to(pos, { yPercent: 0, ease: "power2.inOut", duration: DUR.center }, tCenter);
      tl.to(scale, { scale: 1, ease: "power2.inOut", duration: DUR.center }, tCenter);
      tl.to(
        hero,
        {
          opacity: 0,
          fontWeight: 200,
          letterSpacing: "0.09em",
          ease: "power2.in",
          duration: DUR.center,
        },
        tCenter
      );
      tl.to(rot, { rotation: 160, ease: "power1.out", duration: DUR.center }, tCenter); // rotation tween 1

      // F3 — ROTATION SUR PLACE : hold centré, ~3 tours (rotation tween 2)
      const tSpin = tl.duration();
      tl.to(rot, { rotation: 1240, duration: DUR.spin }, tSpin); // rotation tween 2

      // F4 — ZOOM IN : scale 1 → 3.4 → 13 (on entre dans le trou central)
      const tZoom = tl.duration();
      tl.to(scale, { scale: CFG.zoomA, ease: "power1.in", duration: DUR.zoom1 }, tZoom);
      tl.to(scale, { scale: CFG.zoomB, ease: "power2.in", duration: DUR.zoom2 }, tZoom + DUR.zoom1);

      // F5 — REVEAL TEXTE : noir quasi plein écran → mots révélés en stagger
      //      (opacity 0.14→1 + blur 3px→0), stagger = durée/nb_mots.
      const tReveal = tl.duration();
      tl.set(para, { opacity: 1 }, tReveal);
      tl.to(
        wordEls,
        {
          opacity: 1,
          filter: "blur(0px)",
          duration: DUR.reveal / nWords,
          stagger: DUR.reveal / nWords,
        },
        tReveal
      );

      // F6 — HOLD NOIR : le texte vit seul
      tl.to({}, { duration: DUR.holdNoir });

      // F7 — DÉZOOM : le texte part, scale→1, puis le disque remonte (yPercent→-70)
      const tDe = tl.duration();
      tl.to(para, { opacity: 0, ease: "power1.out", duration: DUR.paraOut }, tDe);
      tl.to(scale, { scale: 1, ease: "power2.inOut", duration: DUR.dezoom }, tDe + DUR.paraOut);
      tl.to(
        pos,
        { yPercent: -Y_EDGE, ease: "power2.inOut", duration: DUR.remontee }, // F4 utilisateur : on voit la moitié BASSE (centre sur le bord haut)
        tDe + DUR.paraOut + DUR.dezoom
      );

      // F8 — PUNCHLINE : apparaît sous le disque (top ~61%)
      const tPunch = tl.duration();
      tl.to(punch, { opacity: 1, ease: "power1.out", duration: DUR.punchIn }, tPunch);

      // F9 — SORTIE : disque sort par le haut (yPercent→-195), la punchline
      //      glisse au centre (top→50%) et grossit (scale→1.55).
      const tOut = tl.duration();
      tl.to(pos, { yPercent: -Y_GONE, ease: "power1.in", duration: DUR.sortie }, tOut);
      tl.to(punch, { top: "50%", scale: CFG.punchScale, ease: "power2.out", duration: DUR.sortie }, tOut);

      // ROTATION tween 3 : 1240 → 1750, couvre zoom + reveal + sortie
      // (ajouté en dernier, calé à tZoom sur toute la durée restante).
      const total = tl.duration();
      tl.to(rot, { rotation: 1750, duration: total - tZoom }, tZoom);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.stage}>
        {/* titre hero (F1) */}
        <h1 ref={heroRef} className={styles.hero}>
          On expérimente, et on applique.
          <br />
          Puis on recommence.
        </h1>

        {/* disque : 3 wrappers de transform imbriqués et indépendants */}
        <div ref={posRef} className={styles.discPos}>
          <div ref={scaleRef} className={styles.discScale}>
            <div ref={rotRef} className={styles.discRot}>
              <div className={styles.disc}>{disc ?? buildDisc()}</div>
            </div>
          </div>
        </div>

        {/* paragraphe révélé mot à mot (F5/F6) */}
        <p ref={paraRef} className={styles.para}>
          {words.map((w, i) => (
            <span
              key={i}
              ref={(el) => {
                if (el) wordsRef.current[i] = el;
              }}
              className={styles.word}
            >
              {w}
            </span>
          ))}
        </p>

        {/* punchline (F8/F9) + mini-disque inline */}
        <p
          ref={punchRef}
          className={styles.punch}
          style={{ ["--mini-spin" as string]: `${CFG.miniSpin}s` } as React.CSSProperties}
        >
          C&apos;est ce qu&apos;on appelle un cercle vertueux
          <span className={styles.miniDisc}>{miniDisc ?? buildMiniDisc()}</span>
        </p>
      </div>
    </section>
  );
}
