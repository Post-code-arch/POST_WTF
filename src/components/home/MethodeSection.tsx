"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Methode.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
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

const numVariant: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: EASE } },
  exit: { opacity: 0, y: -16, filter: "blur(6px)", transition: { duration: 0.35, ease: EASE } },
};
const titleVariant: Variants = {
  hidden: { opacity: 0, y: 22, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: EASE, delay: 0.08 } },
  exit: { opacity: 0, y: -14, filter: "blur(4px)", transition: { duration: 0.3, ease: EASE } },
};
const textVariant: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE, delay: 0.16 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: EASE } },
};
const imageVariant: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.4, ease: EASE } },
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
 * écrans de scroll : le layout reste fixe, seul le contenu (numéro / titre
 * / texte + image du sloughi) se substitue à chaque palier (Framer
 * Motion). Sur mobile et sous prefers-reduced-motion : pas de pin, les 4
 * paliers s'affichent empilés normalement (sloughi net pour tous sous
 * reduced motion).
 */
export default function MethodeSection() {
  const frameRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [pinEnabled, setPinEnabled] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    setPinEnabled(window.matchMedia("(min-width: 761px)").matches);
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
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 72px", // dégagement sous la nav globale fixe, voir --nav-clear
      end: "+=400%",
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const idx = Math.min(STAGES.length - 1, Math.floor(self.progress * STAGES.length));
        setActiveIndex((cur) => (cur === idx ? cur : idx));
      },
    });
    return () => trigger.kill();
  }, [pinEnabled]);

  if (!pinEnabled) {
    return (
      <section className={styles.methode} data-theme="light">
        {STAGES.map((s, i) => (
          <div className={styles.frame} key={s.num}>
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
            <AnimatePresence initial={false}>
              <motion.img
                key={stage.image}
                src={stage.image}
                alt="Sloughi au repos, à l'encre"
                className={styles.image}
                variants={imageVariant}
                initial="hidden"
                animate="visible"
                exit="exit"
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Cta />
    </section>
  );
}
