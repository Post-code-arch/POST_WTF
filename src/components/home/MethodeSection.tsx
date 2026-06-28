"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Methode.module.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Phase {
  num: string;
  title: string;
  text: string;
}

const PHASES: Phase[] = [
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

const EASE = [0.16, 1, 0.3, 1] as const;

const phaseContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.16, delayChildren: 0.05 } },
};
const numVariant: Variants = {
  hidden: { opacity: 0, y: 40, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: EASE },
  },
};
const titleVariant: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.8, ease: EASE },
  },
};
const textVariant: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

/**
 * Section Méthode (accueil) — 4 phases empilées (30vh chacune). Chaque
 * phase s'accroche en haut de l'écran à son arrivée (GSAP ScrollTrigger,
 * pin court) le temps que son numéro/titre/texte se révèlent en cascade
 * (Framer Motion), puis se relâche normalement vers la phase suivante —
 * pas de scroll-jacking long, juste une tenue brève qui donne du poids.
 */
export default function MethodeSection() {
  const phaseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = useReducedMotion();
  const [revealed, setRevealed] = useState<boolean[]>(() => PHASES.map(() => false));

  useEffect(() => {
    if (reduced) {
      setRevealed(PHASES.map(() => true));
      return;
    }

    const triggers = phaseRefs.current.map((el, i) => {
      if (!el) return null;
      const reveal = () =>
        setRevealed((prev) => (prev[i] ? prev : prev.map((v, k) => (k === i ? true : v))));
      return ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "+=60%",
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        onEnter: reveal,
        onEnterBack: reveal,
      });
    });

    return () => triggers.forEach((t) => t?.kill());
  }, [reduced]);

  return (
    <section className={styles.methode} data-theme="light">
      {PHASES.map((p, i) => (
        <motion.div
          className={styles.phase}
          key={p.num}
          data-phase
          ref={(el) => {
            phaseRefs.current[i] = el;
          }}
          initial={reduced ? false : "hidden"}
          animate={revealed[i] ? "visible" : "hidden"}
          variants={phaseContainer}
        >
          <motion.span className={styles.num} variants={numVariant}>
            [{p.num}]
          </motion.span>
          <div className={styles.body}>
            <motion.h3 className={styles.title} variants={titleVariant}>
              {p.title}
            </motion.h3>
            <motion.p className={styles.text} variants={textVariant}>
              {p.text}
            </motion.p>
          </div>
        </motion.div>
      ))}
      <div className={styles.cta}>
        <Link href="/studio">→ La méthode en détail</Link>
      </div>
    </section>
  );
}
