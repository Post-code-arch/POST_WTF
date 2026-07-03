"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useAnimationFrame } from "framer-motion";
import Nav from "@/components/Nav";
import type { Work } from "@/lib/works";
import styles from "./Work.module.css";

type GridHover = { key: string; proj: number } | null;

function cVar(color: string): CSSProperties {
  return { ["--c" as string]: color } as CSSProperties;
}

/**
 * Index des travaux — vue GRILLE uniquement : rangée horizontale infinie
 * (molette + avance auto), survol = aperçu plein écran + désaturation des
 * autres cartes. (Plus de toggle Liste ni de phrase d'intro.)
 */
export default function WorkPage({ works }: { works: Work[] }) {
  const [gridHover, setGridHover] = useState<GridHover>(null);
  const [bg, setBg] = useState<Work | null>(null);
  const [filter, setFilter] = useState<string | null>(null);

  // liste ordonnée des disciplines présentes dans les projets — sert de
  // barre de filtres (« Tous » + chaque discipline rencontrée, dans l'ordre
  // de première apparition dérivé de la taxonomie de projects.ts).
  const filters = (() => {
    const seen: string[] = [];
    for (const w of works)
      for (const d of w.disciplines) if (!seen.includes(d)) seen.push(d);
    return seen;
  })();

  const visible = filter
    ? works.filter((w) => w.disciplines.includes(filter))
    : works;

  const hgridRef = useRef<HTMLDivElement>(null);
  const htrackRef = useRef<HTMLDivElement>(null);
  const grid = useRef({ pos: 0, vel: 0, unit: 0, pause: false });

  const measure = () => {
    if (htrackRef.current) grid.current.unit = htrackRef.current.scrollWidth / 3;
  };

  // le jeu de cartes change avec le filtre : on remet la piste à zéro et on
  // recalcule l'unité de boucle.
  useEffect(() => {
    grid.current.pos = 0;
    grid.current.vel = 0;
    measure();
  }, [filter]);

  useEffect(() => {
    const hg = hgridRef.current;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      grid.current.vel += (e.deltaY + e.deltaX) * 0.18;
    };
    let tx = 0;
    const onTS = (e: TouchEvent) => (tx = e.touches[0].clientX);
    const onTM = (e: TouchEvent) => {
      const x = e.touches[0].clientX;
      grid.current.vel += (tx - x) * 0.5;
      tx = x;
    };
    hg?.addEventListener("wheel", onWheel, { passive: false });
    hg?.addEventListener("touchstart", onTS, { passive: true });
    hg?.addEventListener("touchmove", onTM, { passive: true });
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    measure();

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      hg?.removeEventListener("wheel", onWheel);
      hg?.removeEventListener("touchstart", onTS);
      hg?.removeEventListener("touchmove", onTM);
      window.removeEventListener("resize", onResize);
      document.body.style.overflow = prev;
    };
  }, []);

  useAnimationFrame(() => {
    const G = grid.current;
    G.vel *= 0.9;
    const auto = G.pause ? 0 : 0.5;
    G.pos += auto + G.vel;
    if (!G.unit) measure();
    if (G.unit) {
      while (G.pos >= G.unit) G.pos -= G.unit;
      while (G.pos < 0) G.pos += G.unit;
    }
    if (htrackRef.current)
      htrackRef.current.style.transform = `translateX(${-G.pos}px)`;
  });

  const enterCard = (key: string, projIdx: number) => {
    grid.current.pause = true;
    setBg(visible[projIdx]);
    setGridHover({ key, proj: projIdx });
  };
  const leaveCard = () => {
    grid.current.pause = false;
    setGridHover(null);
  };

  const sets = [0, 1, 2];
  const catLine = (categories: string[]) =>
    categories.map((c, i) => (
      <span key={c}>
        {i > 0 && <span className={styles.sep}>،</span>}
        {c}
      </span>
    ));

  const bgStyle: CSSProperties | undefined = bg
    ? bg.image
      ? { backgroundImage: `url(${bg.image})` }
      : { backgroundColor: bg.color }
    : undefined;

  return (
    <div className={styles.work}>
      <Nav />

      {/* filtre par type de projet — liste éditoriale (l'actif est estompé) */}
      <div className={styles.filters}>
        <span className={styles.filterHead}>Type</span>
        <ul className={styles.filterList}>
          <li>
            <button
              type="button"
              className={`${styles.opt} ${filter === null ? styles.optActive : ""}`}
              onClick={() => setFilter(null)}
            >
              Tous
            </button>
          </li>
          {filters.map((f) => (
            <li key={f}>
              <button
                type="button"
                className={`${styles.opt} ${filter === f ? styles.optActive : ""}`}
                onClick={() => setFilter((cur) => (cur === f ? null : f))}
              >
                {f}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* aperçu plein écran au survol */}
      <div
        className={`${styles.gridBg} ${gridHover ? styles.on : ""}`}
        style={bgStyle}
        aria-hidden
      />

      <div
        ref={hgridRef}
        className={`${styles.hgrid} ${styles.on} ${
          gridHover ? styles.hovering : ""
        }`}
      >
        <div ref={htrackRef} className={styles.htrack}>
          {sets.map((s) =>
            visible.map((w, i) => {
              const key = `${s}-${i}`;
              const dim = gridHover != null && gridHover.key !== key;
              return (
                <Link
                  key={key}
                  href={`/travaux/${w.slug}`}
                  className={`${styles.hcard} ${dim ? styles.dim : ""}`}
                  style={cVar(w.color)}
                  onMouseEnter={() => enterCard(key, i)}
                  onMouseLeave={leaveCard}
                >
                  <div className={styles.thumb}>
                    {w.image ? (
                      <img src={w.image} alt={w.title} />
                    ) : (
                      <span>{w.title}</span>
                    )}
                  </div>
                  <div className={styles.meta}>
                    <span className={styles.t}>{w.title}</span>
                    <span className={styles.c}>{catLine(w.categories)}</span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
