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
  scaleBig: 1.85, // disque "énorme" : F1 (bas) et F7→F9 (haut)
  zoomA: 3.4, // 1er palier du zoom
  zoomB: 13, // 2e palier (le noir avale tout)
  punchScale: 1.55, // scale final de la punchline (F9)
  heroWeight: 420, // graisse de départ du titre hero (Clash, fin)
  discRadiusRatio: 0.44, // rayon du disque dans le viewBox (440/1000)
  // position = fraction du centre du disque depuis le HAUT du viewport
  frac: {
    hero: 1.0, // F1 : centre sur le bord bas → moitié haute visible
    lower: 0.15, // F7 : disque haut, trou + moitié basse visibles
    punchUnder: -0.04, // F8 : disque presque sorti, punchline dessous
    gone: -1.1, // F9 : disque entièrement sorti par le haut
  },
};

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
  punchIn: 0.6, // F8
  sortie: 1.1, // F9
};

// Paragraphe en deux tons : 1ère partie blanche, suite grise.
const PARA_WHITE =
  "On essaie des choses pour voir ce qu’elles donnent. Ce qui marche, on le garde, on l’affine, on s’en sert pour de vrai.";
const PARA_SOFT =
  "Et le travail pour de vrai nous apprend quoi essayer ensuite. Une chose appelle l’autre, sans fin.";

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ------------------------------------------------------------------ *
 * PLACEHOLDER DISQUE — donut lisse (conforme aux frames). Isolé : le
 * remplacement final = 12 frames du sloughi disposées radialement, sans
 * toucher la mécanique scale/rotation (accepté en prop `disc`).
 * ------------------------------------------------------------------ */
function buildDisc(): ReactNode {
  return (
    <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <circle cx={500} cy={500} r={440} fill="var(--fanta-ring)" />
      {/* trou central = couleur du fond → zoom seamless (ratio ≈ 0.24) */}
      <circle cx={500} cy={500} r={105} fill="var(--fanta-bg)" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
export default function Fantascope({ disc }: { disc?: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const posRef = useRef<HTMLDivElement>(null);
  const scaleRef = useRef<HTMLDivElement>(null);
  const rotRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLHeadingElement>(null);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const punchRef = useRef<HTMLParagraphElement>(null);
  const wordsRef = useRef<HTMLSpanElement[]>([]);

  const words = [
    ...PARA_WHITE.split(/\s+/).map((w) => ({ w, soft: false })),
    ...PARA_SOFT.split(/\s+/).map((w) => ({ w, soft: true })),
  ];

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

      // positions calculées depuis le viewport :
      // yPercent qui place le CENTRE du disque à `frac` (fraction depuis le haut).
      const vh = window.innerHeight;
      const discH = pos.offsetHeight || vh * 0.72;
      const yFor = (frac: number) => ((frac - 0.5) * vh) / discH * 100;

      // états initiaux (F1)
      gsap.set(pos, { yPercent: yFor(CFG.frac.hero) });
      gsap.set(scale, { scale: CFG.scaleBig });
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

      // F1 — HERO : maintien, disque énorme en bas (moitié haute), titre visible
      tl.to({}, { duration: DUR.heroHold });

      // F2 — CENTRAGE : le disque monte (centre→milieu) ET rétrécit (scale→1),
      //      le titre s'évapore, la rotation arrive lentement (tween 1).
      const tCenter = tl.duration();
      tl.to(pos, { yPercent: 0, ease: "power2.inOut", duration: DUR.center }, tCenter);
      tl.to(scale, { scale: 1, ease: "power2.inOut", duration: DUR.center }, tCenter);
      tl.to(
        hero,
        { opacity: 0, fontWeight: 200, letterSpacing: "0.09em", ease: "power2.in", duration: DUR.center },
        tCenter
      );
      tl.to(rot, { rotation: 160, ease: "power1.out", duration: DUR.center }, tCenter);

      // F3 — ROTATION SUR PLACE : hold centré, ~3 tours (rotation tween 2)
      const tSpin = tl.duration();
      tl.to(rot, { rotation: 1240, duration: DUR.spin }, tSpin);

      // F4 — ZOOM IN : scale 1 → 3.4 → 13 (on entre dans le trou central)
      const tZoom = tl.duration();
      tl.to(scale, { scale: CFG.zoomA, ease: "power1.in", duration: DUR.zoom1 }, tZoom);
      tl.to(scale, { scale: CFG.zoomB, ease: "power2.in", duration: DUR.zoom2 }, tZoom + DUR.zoom1);

      // F5 — REVEAL TEXTE : noir plein écran → mots révélés (opacity 0.14→1 +
      //      blur 3→0), deux tons (les gris gardent leur couleur).
      const tReveal = tl.duration();
      tl.set(para, { opacity: 1 }, tReveal);
      tl.to(
        wordEls,
        { opacity: 1, filter: "blur(0px)", duration: DUR.reveal / nWords, stagger: DUR.reveal / nWords },
        tReveal
      );

      // F6 — HOLD NOIR : le texte vit seul
      tl.to({}, { duration: DUR.holdNoir });

      // F7 — DÉZOOM + REMONTÉE : texte part, scale 13→1.85, le disque remonte
      //      (centre → 0.15) : moitié basse + trou visibles en haut.
      const tDe = tl.duration();
      tl.to(para, { opacity: 0, ease: "power1.out", duration: DUR.paraOut }, tDe);
      tl.to(scale, { scale: CFG.scaleBig, ease: "power2.inOut", duration: DUR.dezoom }, tDe + DUR.paraOut);
      tl.to(
        pos,
        { yPercent: yFor(CFG.frac.lower), ease: "power2.inOut", duration: DUR.remontee },
        tDe + DUR.paraOut + DUR.dezoom
      );

      // F8 — PUNCHLINE : le disque monte encore un peu, la punchline apparaît dessous
      const tPunch = tl.duration();
      tl.to(pos, { yPercent: yFor(CFG.frac.punchUnder), ease: "power1.inOut", duration: DUR.punchIn }, tPunch);
      tl.to(punch, { opacity: 1, ease: "power1.out", duration: DUR.punchIn }, tPunch);

      // F9 — SORTIE : disque sort par le haut, la punchline glisse au centre
      //      (top→50%) et grossit (scale→1.55).
      const tOut = tl.duration();
      tl.to(pos, { yPercent: yFor(CFG.frac.gone), ease: "power1.in", duration: DUR.sortie }, tOut);
      tl.to(punch, { top: "50%", scale: CFG.punchScale, ease: "power2.out", duration: DUR.sortie }, tOut);

      // ROTATION tween 3 : 1240 → 1750, couvre zoom + reveal + sortie
      const total = tl.duration();
      tl.to(rot, { rotation: 1750, duration: total - tZoom }, tZoom);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.stage}>
        {/* F1 — titre hero */}
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

        {/* F5/F6 — paragraphe révélé mot à mot, deux tons */}
        <p ref={paraRef} className={styles.para}>
          {words.map(({ w, soft }, i) => (
            <span
              key={i}
              ref={(el) => {
                if (el) wordsRef.current[i] = el;
              }}
              className={`${styles.word} ${soft ? styles.soft : ""}`}
            >
              {w}
            </span>
          ))}
        </p>

        {/* F8/F9 — punchline */}
        <p ref={punchRef} className={styles.punch}>
          C’est ce qu’on appelle un cercle vertueux
        </p>
      </div>
    </section>
  );
}
