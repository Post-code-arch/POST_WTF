"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
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
  image: string;
}

const STAGES: Stage[] = [
  {
    num: "01",
    title: "Lecture.",
    text: "Avant de proposer quoi que ce soit, on regarde. Le terrain, le marché, les concurrents, l'histoire qu'on nous raconte et celle qu'on ne nous dit pas. On lit ce qui est déjà là — parce qu'une marque existe rarement à partir de rien, et que le travail commence par le comprendre.",
    image: "/home/methode/sloughi-01.webp",
  },
  {
    num: "02",
    title: "Direction.",
    text: "On choisit un angle, et on le défend. Pas un éventail d'options pour se couvrir — une piste, parfois deux, jamais cinq. C'est le moment des décisions : ce qu'on garde, ce qu'on écarte, la direction qu'on assume avant de fabriquer.",
    image: "/home/methode/sloughi-02.webp",
  },
  {
    num: "03",
    title: "Fabrication.",
    text: "C'est ici que passe la moitié du temps, et ce n'est pas un hasard. Une bonne idée mal exécutée ne vaut rien. On fait les choses jusqu'au bout — l'identité, le web, les objets, les images — avec l'attention d'un atelier, pas d'une usine.",
    image: "/home/methode/sloughi-03.webp",
  },
  {
    num: "04",
    title: "Application.",
    text: "On livre, et on s'assure que ça tienne sans nous. Les fichiers, les règles, ce qu'il faut pour continuer seul. Le bon travail ne crée pas de dépendance — il laisse le client autonome pour la suite.",
    image: "/home/methode/sloughi-04.webp",
  },
];

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

function Cta() {
  return (
    <div className={styles.cta}>
      <Link href="/studio">→ La méthode en détail</Link>
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
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const grainRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [pinEnabled, setPinEnabled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setPinEnabled(!reduced);
  }, [reduced]);

  useEffect(() => {
    STAGES.forEach((s) => {
      const img = new window.Image();
      img.src = s.image;
    });
  }, []);

  useEffect(() => {
    if (!pinEnabled) return;
    const el = frameRef.current;
    if (!el) return;

    // Le morph du sloughi est scrubbé en continu sur la position de scroll
    // (opacité posée directement en DOM, hors React) : pas de cut figé sur
    // un seuil, le chien se transforme image par image au même rythme que
    // le défilement.
    const applyProgress = (self: ScrollTrigger) => {
      const raw = self.progress * STAGES.length;
      const idx = Math.min(STAGES.length - 1, Math.floor(raw));
      const frac = idx === STAGES.length - 1 ? 0 : raw - idx;
      imageRefs.current.forEach((img, i) => {
        if (!img) return;
        img.style.opacity = i === idx ? "1" : i === idx + 1 ? String(frac) : "0";
      });
      if (grainRef.current) {
        grainRef.current.style.opacity = String(Math.sin(frac * Math.PI) * 0.5);
      }
      return idx;
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
                  src={reduced ? STAGES[STAGES.length - 1].image : s.image}
                  alt="Sloughi au repos, à l'encre"
                />
              </div>
            </div>
          </div>
        ))}
        <Cta />
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
            {STAGES.map((s, i) => (
              <img
                key={s.image}
                ref={(el) => {
                  imageRefs.current[i] = el;
                }}
                src={s.image}
                alt="Sloughi au repos, à l'encre"
                className={styles.image}
              />
            ))}
            <div ref={grainRef} className={styles.grain} />
          </div>
        </div>
      </div>
      <Cta />
    </section>
  );
}
