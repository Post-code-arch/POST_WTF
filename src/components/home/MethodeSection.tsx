"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Methode.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
}

interface Stage {
  num: string;
  title: string;
  text: string;
}

const STAGES: Stage[] = [
  {
    num: "01",
    title: "Lecture.",
    text: "Avant de proposer quoi que ce soit, on regarde. Le terrain, le marché, les concurrents, l'histoire qu'on nous raconte et celle qu'on ne nous dit pas. On lit ce qui est déjà là — parce qu'une marque existe rarement à partir de rien, et que le travail commence par le comprendre.",
  },
  {
    num: "02",
    title: "Direction.",
    text: "On choisit un angle, et on le défend. Pas un éventail d'options pour se couvrir — une piste, parfois deux, jamais cinq. C'est le moment des décisions : ce qu'on garde, ce qu'on écarte, la direction qu'on assume avant de fabriquer.",
  },
  {
    num: "03",
    title: "Fabrication.",
    text: "C'est ici que passe la moitié du temps, et ce n'est pas un hasard. Une bonne idée mal exécutée ne vaut rien. On fait les choses jusqu'au bout — l'identité, le web, les objets, les images — avec l'attention d'un atelier, pas d'une usine.",
  },
  {
    num: "04",
    title: "Application.",
    text: "On livre, et on s'assure que ça tienne sans nous. Les fichiers, les règles, ce qu'il faut pour continuer seul. Le bon travail ne crée pas de dépendance — il laisse le client autonome pour la suite.",
  },
];

/* ── Trame progressive du sloughi ──────────────────────────────────────
   Une seule image source, tramée en temps réel sur un <canvas> : le
   dithering ordonné (matrice de Bayer) est appliqué image par image au
   fil du scroll. En haut de section le chien est entièrement tramé
   (pointillé), et il se résout en encre nette à mesure qu'on descend —
   transition continue, sans crossfade ni palier. */
const SLOUGHI_SRC = "/home/methode/sloughi.webp";
const DITHER_CELL = 5; // taille du bloc de trame (plus grand = trame plus grosse)
const CANVAS_W = 520; // résolution interne du canvas
const INK = [14, 14, 14] as const;
const CREAM = [242, 239, 230] as const;

/** matrice de Bayer 8×8, seuils normalisés 0..1 */
const BAYER8: number[][] = (() => {
  const build = (n: number): number[][] => {
    if (n === 1) return [[0]];
    const s = build(n / 2);
    const k = s.length;
    const out = Array.from({ length: k * 2 }, () => new Array(k * 2).fill(0));
    for (let y = 0; y < k; y++)
      for (let x = 0; x < k; x++) {
        const v = s[y][x];
        out[y][x] = 4 * v;
        out[y][x + k] = 4 * v + 2;
        out[y + k][x] = 4 * v + 3;
        out[y + k][x + k] = 4 * v + 1;
      }
    return out;
  };
  return build(8).map((row) => row.map((v) => (v + 0.5) / 64));
})();

const EASE = [0.16, 1, 0.3, 1] as const;

/* trois animations distinctes — num en "punch" d'échelle, titre en glissé
   latéral flouté, texte en simple fondu vertical — pour que chaque zone
   se lise comme un mouvement propre plutôt que la même translation
   recopiée avec un délai. */
const numVariant: Variants = {
  hidden: { opacity: 0, scale: 0.82 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.42, ease: EASE } },
  exit: { opacity: 0, scale: 1.1, transition: { duration: 0.22, ease: EASE } },
};
const titleVariant: Variants = {
  hidden: { opacity: 0, x: -28, filter: "blur(4px)" },
  visible: { opacity: 1, x: 0, filter: "blur(0px)", transition: { duration: 0.42, ease: EASE, delay: 0.15 } },
  exit: { opacity: 0, x: 18, filter: "blur(3px)", transition: { duration: 0.22, ease: EASE } },
};
const textVariant: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE, delay: 0.32 } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2, ease: EASE } },
};
function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function Topbar({ index }: { index: number }) {
  return (
    <div className={styles.topbar}>
      <span>Process</span>
      <span>
        {pad2(index + 1)}/{pad2(STAGES.length)}
      </span>
    </div>
  );
}

/**
 * Section Méthode (accueil) — cadre pinné (GSAP ScrollTrigger) pendant ~4
 * écrans de scroll, sur mobile comme sur desktop : le layout reste fixe,
 * seul le contenu (numéro / titre / texte + image du sloughi) se
 * substitue à chaque palier (Framer Motion). Seul prefers-reduced-motion
 * désactive le pin : les 4 paliers s'affichent alors empilés normalement,
 * sloughi net pour tous.
 */
export default function MethodeSection() {
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderRef = useRef<((amount: number) => void) | null>(null);
  const amountRef = useRef(1);
  const reduced = useReducedMotion();
  const [pinEnabled, setPinEnabled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setPinEnabled(!reduced);
  }, [reduced]);

  // Prépare une fois les tables de trame (luminance + seuils de Bayer +
  // LUT encre/crème), puis expose un render(amount) qui recompose le
  // canvas en mélangeant le dégradé continu et le pointillé 1-bit.
  useEffect(() => {
    if (!pinEnabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let cancelled = false;
    const img = new window.Image();
    img.src = SLOUGHI_SRC;
    img.onload = () => {
      if (cancelled) return;
      const W = CANVAS_W;
      const H = Math.round((img.height / img.width) * W);
      canvas.width = W;
      canvas.height = H;

      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const octx = off.getContext("2d");
      if (!octx) return;
      octx.drawImage(img, 0, 0, W, H);
      const src = octx.getImageData(0, 0, W, H).data;

      const n = W * H;
      const cont = new Uint8ClampedArray(n); // dégradé continu (luminance)
      const bin = new Uint8ClampedArray(n); // pointillé ordonné 1-bit
      for (let i = 0; i < n; i++) {
        const j = i * 4;
        const lum = src[j] * 0.299 + src[j + 1] * 0.587 + src[j + 2] * 0.114;
        cont[i] = lum;
        const x = i % W;
        const y = (i / W) | 0;
        const thr =
          BAYER8[(((y / DITHER_CELL) | 0) % 8)][(((x / DITHER_CELL) | 0) % 8)] *
          255;
        bin[i] = lum > thr ? 255 : 0;
      }

      const lutR = new Uint8ClampedArray(256);
      const lutG = new Uint8ClampedArray(256);
      const lutB = new Uint8ClampedArray(256);
      for (let v = 0; v < 256; v++) {
        const t = v / 255;
        lutR[v] = INK[0] + (CREAM[0] - INK[0]) * t;
        lutG[v] = INK[1] + (CREAM[1] - INK[1]) * t;
        lutB[v] = INK[2] + (CREAM[2] - INK[2]) * t;
      }

      const out = ctx.createImageData(W, H);
      const od = out.data;
      for (let i = 0; i < n; i++) od[i * 4 + 3] = 255;

      renderRef.current = (amount: number) => {
        const a = amount;
        const ia = 1 - amount;
        for (let i = 0; i < n; i++) {
          const o = (cont[i] * ia + bin[i] * a) | 0;
          const j = i * 4;
          od[j] = lutR[o];
          od[j + 1] = lutG[o];
          od[j + 2] = lutB[o];
        }
        ctx.putImageData(out, 0, 0);
      };
      renderRef.current(amountRef.current);
    };
    return () => {
      cancelled = true;
      renderRef.current = null;
    };
  }, [pinEnabled]);

  useEffect(() => {
    if (!pinEnabled) return;
    const el = frameRef.current;
    if (!el) return;

    // La trame est scrubbée en continu sur la position de scroll : haut de
    // section = chien entièrement tramé (amount 1), bas = encre nette
    // (amount 0). Aucun palier, la trame se dissout au rythme du défilement.
    const applyProgress = (self: ScrollTrigger) => {
      const p = self.progress;
      amountRef.current = 1 - p;
      renderRef.current?.(amountRef.current);
      return Math.min(STAGES.length - 1, Math.floor(p * STAGES.length));
    };

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 72px", // dégagement sous la nav globale fixe, voir --nav-clear
      end: "+=400%",
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const idx = applyProgress(self);
        setActiveIndex((cur) => (cur === idx ? cur : idx));
      },
    });
    applyProgress(trigger);
    return () => trigger.kill();
  }, [pinEnabled]);

  if (!pinEnabled) {
    return (
      <section className={styles.methode} data-theme="light">
        {STAGES.map((s, i) => (
          <div className={`${styles.frame} ${styles.frameStatic}`} key={s.num}>
            <Topbar index={i} />
            <div className={styles.bodyGrid}>
              <div className={styles.left}>
                <div className={styles.zone}>
                  <span className={styles.num}>[{s.num}]</span>
                </div>
                <div className={styles.zone}>
                  <h3 className={styles.title}>{s.title}</h3>
                </div>
                <div className={styles.zone}>
                  <p className={styles.text}>{s.text}</p>
                </div>
              </div>
              <div className={styles.right}>
                <img
                  className={styles.image}
                  src={SLOUGHI_SRC}
                  alt="Sloughi au repos, à l'encre"
                />
              </div>
            </div>
          </div>
        ))}
      </section>
    );
  }

  const stage = STAGES[activeIndex];

  return (
    <section className={styles.methode} data-theme="light">
      <div className={`${styles.frame} ${styles.framePinned}`} ref={frameRef}>
        <Topbar index={activeIndex} />
        <div className={styles.bodyGrid}>
          <div className={styles.left}>
            <div className={styles.zone}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={`num-${stage.num}`}
                  className={styles.num}
                  variants={numVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  [{stage.num}]
                </motion.span>
              </AnimatePresence>
            </div>
            <div className={styles.zone}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.h3
                  key={`title-${stage.num}`}
                  className={styles.title}
                  variants={titleVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {stage.title}
                </motion.h3>
              </AnimatePresence>
            </div>
            <div className={styles.zone}>
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.p
                  key={`text-${stage.num}`}
                  className={styles.text}
                  variants={textVariant}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {stage.text}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>
          <div className={styles.right}>
            <canvas
              ref={canvasRef}
              className={styles.canvas}
              aria-label="Sloughi au repos, à l'encre"
              role="img"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
