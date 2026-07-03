"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import Nav from "@/components/Nav";
import KinayaLogo from "@/components/KinayaLogo";
import type { Service } from "@/lib/services";
import RippleImage from "./RippleImage";
import styles from "./Services.module.css";

const clamp = (v: number, a = 0, b = 1) => Math.min(Math.max(v, a), b);
const EASE = [0.16, 1, 0.3, 1] as const;

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
  exit: { opacity: 0, transition: { duration: 0.32, ease: EASE } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.24, ease: EASE } },
};
const mediaVar: Variants = {
  hidden: { opacity: 0, scale: 1.06 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: EASE } },
  exit: { opacity: 0, transition: { duration: 0.3, ease: EASE } },
};

function pad2(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function Meta({ s }: { s: Service }) {
  return (
    <>
      <motion.div className={styles.head} variants={item}>
        <span className={styles.num}>{s.num}</span>
        <h2 className={styles.title}>{s.name}</h2>
      </motion.div>
      <motion.p className={styles.line} variants={item}>
        {s.line}
      </motion.p>
      <motion.div className={styles.tags} variants={item}>
        <ul>
          {s.tagsLeft.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
        <ul>
          {s.tagsRight.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </motion.div>
    </>
  );
}

/**
 * Page Services — section épinglée (sticky) : le cadre reste fixe pendant
 * ~N écrans de scroll, et ses éléments (image 4:5 aérée en haut à droite +
 * chapitrage) se substituent d'un service à l'autre au fil du défilement.
 * prefers-reduced-motion : repli en liste statique empilée.
 */
export default function ServicesPage({ services }: { services: Service[] }) {
  const N = services.length;
  const stageRef = useRef<HTMLElement>(null);
  const [idx, setIdx] = useState(0);
  const reduced = useReducedMotion();
  const [pinned, setPinned] = useState(true);

  useEffect(() => {
    setPinned(!reduced);
  }, [reduced]);

  useEffect(() => {
    if (!pinned) return;
    const el = stageRef.current;
    if (!el) return;
    let ticking = false;
    const apply = () => {
      ticking = false;
      const r = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      const p = clamp(-r.top / scrollable, 0, 0.99999);
      const i = Math.min(N - 1, Math.floor(p * N));
      setIdx((cur) => (cur === i ? cur : i));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    apply();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pinned, N]);

  const cur = services[idx];

  const footer = (
    <footer className={styles.footer}>
      <div className={styles.footTop}>
        <div className={styles.l}>
          <span>
            <span className={styles.sq} />
            Instagram
          </span>
          <span>
            <span className={styles.sq} />
            Youtube
          </span>
        </div>
        <div className={styles.c}>
          +213 540 87 73 98
          <br />
          contact@kinaya.wtf
        </div>
        <div className={styles.r}>
          25 Rabah Bourbia,
          <br />
          El Biar, Alger
        </div>
      </div>
      <div className={styles.footLogo}>
        <KinayaLogo />
      </div>
    </footer>
  );

  // ----- repli statique (reduced-motion) : liste empilée -----
  if (!pinned) {
    return (
      <div className={styles.page}>
        <Nav />
        <div className={styles.list}>
          {services.map((s) => (
            <section key={s.num} className={styles.service}>
              <div className={styles.media}>
                {s.image && <RippleImage src={s.image} alt={s.name} />}
              </div>
              <div className={styles.meta}>
                <Meta s={s} />
              </div>
            </section>
          ))}
        </div>
        {footer}
      </div>
    );
  }

  // ----- section épinglée, éléments qui se substituent -----
  return (
    <div className={styles.page}>
      <Nav />
      <section
        ref={stageRef}
        className={styles.stage}
        style={{ height: `${N * 100}vh` }}
      >
        <div className={styles.sticky}>
          <div className={styles.frameTop}>
            <span className={styles.kicker}>(Nos services)</span>
            <span className={styles.counter}>
              {pad2(idx + 1)} — {pad2(N)}
            </span>
          </div>
          <div className={styles.inner}>
            <AnimatePresence initial={false}>
              <motion.div
                key={cur.num}
                className={styles.slide}
                variants={container}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                <motion.div className={styles.media} variants={mediaVar}>
                  {cur.image && <RippleImage src={cur.image} alt={cur.name} />}
                </motion.div>
                <div className={styles.meta}>
                  <Meta s={cur} />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>
      {footer}
    </div>
  );
}
