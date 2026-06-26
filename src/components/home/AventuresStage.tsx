"use client";

import { useEffect, useRef } from "react";
import styles from "./Aventures.module.css";

/**
 * Section Aventures — composition d'images dispersées (calquée sur le
 * référent fourni) avec une légère interaction « follow mouse » : chaque
 * cliché se décale d'une amplitude différente selon sa profondeur, créant
 * une parallaxe douce au mouvement du curseur. Respecte reduced-motion.
 */
const PHOTOS = [
  { src: "/home/aventures/av-2.webp", cls: "p1", depth: 14 }, // haut-gauche large
  { src: "/home/aventures/av-5.webp", cls: "p2", depth: 26 }, // portrait haut-centre
  { src: "/home/aventures/av-3.webp", cls: "p3", depth: 10 }, // chat, déborde à droite
  { src: "/home/aventures/av-1.webp", cls: "p4", depth: 20 }, // LA MEUF QUI DORT — pièce maîtresse
  { src: "/home/aventures/av-7.webp", cls: "p5", depth: 16 }, // caméra, derrière
  { src: "/home/aventures/av-10.webp", cls: "p6", depth: 34 }, // portrait, déborde à droite
  { src: "/home/aventures/av-6.webp", cls: "p7", depth: 22 }, // clap, bas-centre (chaud)
  { src: "/home/departements/studio.webp", cls: "p8", depth: 30 }, // moniteur de montage, bas-droite
  { src: "/home/aventures/av-8.webp", cls: "p9", depth: 8 }, // four, en retrait gauche
  { src: "/home/aventures/av-4.webp", cls: "p10", depth: 38 }, // bas-gauche
];

export default function AventuresStage() {
  const secRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = secRef.current;
    if (!sec) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    const onMove = (e: MouseEvent) => {
      const r = sec.getBoundingClientRect();
      // -0.5 .. 0.5 autour du centre de la section
      tx = (e.clientX - r.left) / r.width - 0.5;
      ty = (e.clientY - r.top) / r.height - 0.5;
      if (!raf)
        raf = requestAnimationFrame(() => {
          sec.style.setProperty("--mx", tx.toFixed(3));
          sec.style.setProperty("--my", ty.toFixed(3));
          raf = 0;
        });
    };
    const onLeave = () => {
      sec.style.setProperty("--mx", "0");
      sec.style.setProperty("--my", "0");
    };
    sec.addEventListener("mousemove", onMove);
    sec.addEventListener("mouseleave", onLeave);
    return () => {
      sec.removeEventListener("mousemove", onMove);
      sec.removeEventListener("mouseleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={secRef} className={styles.adv} data-theme="dark">
      <div className={styles.stage}>
        {PHOTOS.map((p) => (
          <div
            key={p.cls}
            className={`${styles.photo} ${styles[p.cls]}`}
            style={{ ["--d" as string]: p.depth }}
          >
            <img src={p.src} alt="" loading="lazy" />
          </div>
        ))}
      </div>
      <div className={styles.label}>
        <span className={styles.sq} />
        AVENTURES
      </div>
    </section>
  );
}
