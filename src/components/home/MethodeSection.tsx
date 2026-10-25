"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { typo } from "@/lib/typo";
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
    text: typo("Avant de proposer quoi que ce soit, on regarde. Le terrain, le marché, les concurrents, l'histoire qu'on nous raconte et celle qu'on ne nous dit pas. On lit ce qui est déjà là — parce qu'une marque existe rarement à partir de rien, et que le travail commence par le comprendre."),
  },
  {
    num: "02",
    title: "Direction.",
    text: typo("On choisit un angle, et on le défend. Une piste, parfois deux, jamais cinq. C'est le moment des décisions, prises avec la direction, avant de fabriquer quoi que ce soit."),
  },
  {
    num: "03",
    title: "Fabrication.",
    text: typo("C'est ici que passe la moitié du temps. Identité, site, film : tout est fabriqué sous une même direction, avec l'attention d'un atelier, pas d'une usine."),
  },
  {
    num: "04",
    title: "Application.",
    text: typo("On livre, et on s'assure que ça tienne sans nous. Les fichiers, les règles, ce qu'il faut pour continuer seul. Le bon travail ne crée pas de dépendance — il laisse le client autonome pour la suite."),
  },
];

/* ── Trame progressive du sloughi ──────────────────────────────────────
   Vrai tramage ordonné 1-bit (matrice de Bayer) : deux couleurs seulement,
   encre et crème, jamais de mélange avec l'image en niveaux de gris. Le
   canvas est rendu à la résolution réelle de l'écran (taille affichée ×
   devicePixelRatio) pour que chaque point de trame tombe sur des pixels
   physiques, sans agrandissement flou. La trame s'affine par paliers au fil
   du scroll, puis le dernier temps (Application) montre le dessin net. */
const SLOUGHI_SRC = "/home/methode/sloughi.webp";
/** taille des cellules de trame, en px CSS, de la plus grossière à la plus fine */
const DITHER_STEPS = [16, 12, 9, 7, 5, 4, 3, 2];
/** part du scroll consacrée à la trame ; au-delà (4e temps), dessin net */
const RESOLVE_END = 0.75;
const INK = [23, 23, 23] as const; // noir doux (jamais #000)
const CREAM = [242, 242, 242] as const; // blanc cassé neutre (jamais #fff)
// pixels RGBA empaquetés pour un Uint32Array (canaux égaux : endianness neutre)
const INK32 = (255 << 24) | (INK[2] << 16) | (INK[1] << 8) | INK[0];
const CREAM32 = (255 << 24) | (CREAM[2] << 16) | (CREAM[1] << 8) | CREAM[0];

/** bornes de luminance ramenées à 0..1 avant seuillage (encre ≈ 23, crème ≈ 242) */
const LUM_LO = 40;
const LUM_HI = 225;

function levelForProgress(p: number) {
  if (p >= RESOLVE_END) return DITHER_STEPS.length;
  return Math.min(
    DITHER_STEPS.length - 1,
    Math.floor((p / RESOLVE_END) * DITHER_STEPS.length),
  );
}

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
  const renderRef = useRef<((level: number) => void) | null>(null);
  const levelRef = useRef(0);
  const reduced = useReducedMotion();
  const [pinEnabled, setPinEnabled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setPinEnabled(!reduced);
  }, [reduced]);

  // Charge le dessin, le prépare à la résolution réelle du canvas (luminance
  // lissée + table de sommes pour moyenner chaque cellule en O(1)), puis
  // expose render(level) : niveaux 0..n-1 = trame de plus en plus fine,
  // niveau n = dessin net. Recalculé si le canvas change de taille.
  useEffect(() => {
    if (!pinEnabled) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let cancelled = false;
    let img: HTMLImageElement | null = null;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let lum: Float32Array | null = null;
    let sat: Float64Array | null = null;
    let out: ImageData | null = null;
    let px: Uint32Array | null = null;
    let drawn = -1;

    // dégradé encre → crème, pour l'anticrénelage du dessin net
    const ramp = new Uint32Array(256);
    for (let v = 0; v < 256; v++) {
      const t = v / 255;
      const c = (k: 0 | 1 | 2) => Math.round(INK[k] + (CREAM[k] - INK[k]) * t);
      ramp[v] = (255 << 24) | (c(2) << 16) | (c(1) << 8) | c(0);
    }

    const prepare = () => {
      if (!img) return;
      const cs = getComputedStyle(canvas);
      const cw =
        canvas.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const ch =
        canvas.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      if (cw <= 0 || ch <= 0) return;
      const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = Math.max(1, Math.round(img.naturalWidth * scale * dpr));
      H = Math.max(1, Math.round(img.naturalHeight * scale * dpr));
      canvas.width = W;
      canvas.height = H;

      const off = document.createElement("canvas");
      off.width = W;
      off.height = H;
      const octx = off.getContext("2d", { willReadFrequently: true });
      if (!octx) return;
      octx.fillStyle = `rgb(${CREAM.join(",")})`;
      octx.fillRect(0, 0, W, H);
      octx.imageSmoothingQuality = "high";
      // léger flou d'un pixel source : efface le grain du scan, et donne des
      // bords d'encre propres une fois seuillés à grande taille
      octx.filter = `blur(${Math.max(0.6, scale * dpr * 0.9)}px)`;
      octx.drawImage(img, 0, 0, W, H);
      const d = octx.getImageData(0, 0, W, H).data;

      const n = W * H;
      const W1 = W + 1;
      lum = new Float32Array(n);
      sat = new Float64Array(W1 * (H + 1));
      for (let y = 0; y < H; y++) {
        let row = 0;
        for (let x = 0; x < W; x++) {
          const i = y * W + x;
          const j = i * 4;
          const l = d[j] * 0.299 + d[j + 1] * 0.587 + d[j + 2] * 0.114;
          lum[i] = l;
          row += l;
          sat[(y + 1) * W1 + x + 1] = sat[y * W1 + x + 1] + row;
        }
      }
      out = ctx.createImageData(W, H);
      px = new Uint32Array(out.data.buffer);
      drawn = -1;
    };

    const render = (level: number) => {
      if (!lum || !sat || !out || !px || level === drawn) return;
      drawn = level;
      const n = W * H;

      if (level >= DITHER_STEPS.length) {
        // dessin net : seuil étroit sur la luminance lissée (≈ encre pure,
        // avec juste un pixel de transition pour des bords non crénelés)
        for (let i = 0; i < n; i++) {
          const t = (lum[i] - 100) / 56;
          px[i] = ramp[t <= 0 ? 0 : t >= 1 ? 255 : (t * 255) | 0];
        }
      } else {
        // trame ordonnée 1-bit : chaque cellule prend la moyenne de son bloc
        // et la compare au seuil de Bayer → encre ou crème, rien entre les deux
        const c = Math.max(1, Math.round(DITHER_STEPS[level] * dpr));
        const W1 = W + 1;
        for (let by = 0, cy = 0; by < H; by += c, cy++) {
          const y1 = Math.min(H, by + c);
          const bRow = BAYER8[cy & 7];
          for (let bx = 0, cx = 0; bx < W; bx += c, cx++) {
            const x1 = Math.min(W, bx + c);
            const sum =
              sat[y1 * W1 + x1] - sat[by * W1 + x1] - sat[y1 * W1 + bx] + sat[by * W1 + bx];
            // normalise encre → 0, crème → 1 (avec marge) : un fond crème ne
            // doit jamais passer sous un seuil de Bayer et semer des points
            const avg = (sum / ((x1 - bx) * (y1 - by)) - LUM_LO) / (LUM_HI - LUM_LO);
            const col = avg > bRow[cx & 7] ? CREAM32 : INK32;
            for (let y = by; y < y1; y++) px.fill(col, y * W + bx, y * W + x1);
          }
        }
      }
      ctx.putImageData(out, 0, 0);
    };

    const redraw = () => {
      prepare();
      render(levelRef.current);
    };

    const image = new window.Image();
    image.src = SLOUGHI_SRC;
    image.onload = () => {
      if (cancelled) return;
      img = image;
      redraw();
      renderRef.current = render;
    };

    const ro = new ResizeObserver(() => {
      if (img) redraw();
    });
    ro.observe(canvas);

    return () => {
      cancelled = true;
      ro.disconnect();
      renderRef.current = null;
    };
  }, [pinEnabled]);

  useEffect(() => {
    if (!pinEnabled) return;
    const el = frameRef.current;
    if (!el) return;

    // Haut de section : trame la plus grossière. Elle s'affine par paliers
    // pendant Lecture → Fabrication, puis le dessin est net sur Application.
    const applyProgress = (self: ScrollTrigger) => {
      const p = self.progress;
      levelRef.current = levelForProgress(p);
      renderRef.current?.(levelRef.current);
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
