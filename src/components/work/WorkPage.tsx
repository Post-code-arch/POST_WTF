"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useAnimationFrame } from "framer-motion";
import KinayaLogo from "@/components/KinayaLogo";
import type { Work } from "@/lib/works";
import styles from "./Work.module.css";

type View = "list" | "grid";
type GridHover = { key: string; proj: number } | null;

/** style inline portant la couleur de placeholder --c */
function cVar(color: string): CSSProperties {
  return { ["--c" as string]: color } as CSSProperties;
}

export default function WorkPage({ works }: { works: Work[] }) {
  const [view, setView] = useState<View>("grid"); // vue par défaut : Grille
  const [active, setActive] = useState<number>(-1); // projet survolé (liste)
  const [gridHover, setGridHover] = useState<GridHover>(null); // carte survolée (grille)
  const [bg, setBg] = useState<Work | null>(null); // dernier aperçu (persiste pour le fondu)

  const viewRef = useRef<View>("grid");
  viewRef.current = view;

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const hgridRef = useRef<HTMLDivElement>(null);
  const htrackRef = useRef<HTMLDivElement>(null);
  const floatRefs = useRef<(HTMLDivElement | null)[]>([]);

  // état d'animation (hors cycle React)
  const list = useRef({ pos: 0, vel: 0, unit: 0, lastMove: 0 });
  const grid = useRef({ pos: 0, vel: 0, unit: 0, pause: false });
  const cursor = useRef({ mx: 0, my: 0, fx: 0, fy: 0, active: -1 });

  const measureList = () => {
    if (trackRef.current) list.current.unit = trackRef.current.scrollHeight / 3;
  };
  const measureGrid = () => {
    if (htrackRef.current) grid.current.unit = htrackRef.current.scrollWidth / 3;
  };

  // listeners natifs (wheel non-passif pour preventDefault, touch, resize, move)
  useEffect(() => {
    const vp = viewportRef.current;
    const hg = hgridRef.current;
    if (typeof window !== "undefined") {
      cursor.current.mx = window.innerWidth / 2;
      cursor.current.my = window.innerHeight / 2;
    }

    const onMove = (e: MouseEvent) => {
      cursor.current.mx = e.clientX;
      cursor.current.my = e.clientY;
      list.current.lastMove = performance.now();
    };
    window.addEventListener("mousemove", onMove);

    const onWheelList = (e: WheelEvent) => {
      e.preventDefault();
      list.current.vel += e.deltaY * 0.18;
    };
    let ty = 0;
    const onTouchStartList = (e: TouchEvent) => (ty = e.touches[0].clientY);
    const onTouchMoveList = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      list.current.vel += (ty - y) * 0.5;
      ty = y;
    };

    const onWheelGrid = (e: WheelEvent) => {
      e.preventDefault();
      grid.current.vel += (e.deltaY + e.deltaX) * 0.18;
    };
    let tx = 0;
    const onTouchStartGrid = (e: TouchEvent) => (tx = e.touches[0].clientX);
    const onTouchMoveGrid = (e: TouchEvent) => {
      const x = e.touches[0].clientX;
      grid.current.vel += (tx - x) * 0.5;
      tx = x;
    };

    vp?.addEventListener("wheel", onWheelList, { passive: false });
    vp?.addEventListener("touchstart", onTouchStartList, { passive: true });
    vp?.addEventListener("touchmove", onTouchMoveList, { passive: true });
    hg?.addEventListener("wheel", onWheelGrid, { passive: false });
    hg?.addEventListener("touchstart", onTouchStartGrid, { passive: true });
    hg?.addEventListener("touchmove", onTouchMoveGrid, { passive: true });

    const onResize = () => {
      measureList();
      measureGrid();
    };
    window.addEventListener("resize", onResize);

    measureList();
    measureGrid();

    // pas de scroll de page sur cette vue
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      vp?.removeEventListener("wheel", onWheelList);
      vp?.removeEventListener("touchstart", onTouchStartList);
      vp?.removeEventListener("touchmove", onTouchMoveList);
      hg?.removeEventListener("wheel", onWheelGrid);
      hg?.removeEventListener("touchstart", onTouchStartGrid);
      hg?.removeEventListener("touchmove", onTouchMoveGrid);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // re-mesure la piste qui (re)devient visible
  useEffect(() => {
    if (view === "grid") measureGrid();
    else measureList();
  }, [view]);

  // boucles infinies + suivi curseur (Framer Motion)
  useAnimationFrame(() => {
    // ---- marquee vertical ----
    const L = list.current;
    L.vel *= 0.9;
    const moving = performance.now() - L.lastMove < 120;
    const auto = moving ? 0.4 : 0; // avance de base seulement quand la souris bouge
    L.pos += auto + L.vel;
    if (!L.unit) measureList();
    if (L.unit) {
      while (L.pos >= L.unit) L.pos -= L.unit;
      while (L.pos < 0) L.pos += L.unit;
    }
    if (trackRef.current)
      trackRef.current.style.transform = `translateY(${-L.pos}px)`;

    // ---- suivi curseur (lissage) ----
    const C = cursor.current;
    C.fx += (C.mx - C.fx) * 0.18;
    C.fy += (C.my - C.fy) * 0.18;
    if (C.active >= 0) {
      const f = floatRefs.current[C.active];
      if (f) {
        f.style.left = `${C.fx}px`;
        f.style.top = `${C.fy}px`;
      }
    }

    // ---- marquee horizontal (grille) ----
    if (viewRef.current === "grid") {
      const G = grid.current;
      G.vel *= 0.9;
      const autoG = G.pause ? 0 : 0.5;
      G.pos += autoG + G.vel;
      if (!G.unit) measureGrid();
      if (G.unit) {
        while (G.pos >= G.unit) G.pos -= G.unit;
        while (G.pos < 0) G.pos += G.unit;
      }
      if (htrackRef.current)
        htrackRef.current.style.transform = `translateX(${-G.pos}px)`;
    }
  });

  // ---- survol liste ----
  const enterRow = (projIdx: number) => {
    const C = cursor.current;
    C.active = projIdx;
    C.fx = C.mx; // snap au curseur (pas de vol depuis un coin)
    C.fy = C.my;
    const f = floatRefs.current[projIdx];
    if (f) {
      f.style.left = `${C.mx}px`;
      f.style.top = `${C.my}px`;
    }
    setActive(projIdx);
  };
  const leaveRow = () => {
    cursor.current.active = -1;
    setActive(-1);
  };

  // ---- survol grille ----
  const enterCard = (key: string, projIdx: number) => {
    grid.current.pause = true; // l'avance auto s'arrête (la molette reste active)
    setBg(works[projIdx]);
    setGridHover({ key, proj: projIdx });
  };
  const leaveCard = () => {
    grid.current.pause = false;
    setGridHover(null); // on garde `bg` pour le fondu sortant
  };

  // 3 sets répétés pour la boucle (wrap sur 1/3 de la longueur)
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
      <div className={styles.viewtoggle}>
        <button
          className={`${styles.vtBtn} ${view === "list" ? styles.active : ""}`}
          onClick={() => setView("list")}
          type="button"
        >
          Liste
        </button>
        <button
          className={`${styles.vtBtn} ${view === "grid" ? styles.active : ""}`}
          onClick={() => setView("grid")}
          type="button"
        >
          Grille
        </button>
      </div>

      <nav className={styles.nav}>
        <Link href="/" className={styles.nlogo} aria-label="KINAYA — accueil">
          <KinayaLogo />
        </Link>
        <div className={styles.nlinks}>
          <Link href="/studio">Studio</Link>
          <Link href="/travaux">Work</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </nav>

      {/* aperçu plein écran (grille, au survol) */}
      <div
        className={`${styles.gridBg} ${gridHover ? styles.on : ""}`}
        style={bgStyle}
        aria-hidden
      />

      {/* phrase d'intro (grille) */}
      <p
        className={`${styles.gridIntro} ${
          view === "grid" && !gridHover ? styles.on : ""
        }`}
        aria-hidden={view !== "grid"}
      >
        Une sélection.
        <br />
        <em>Le reste se raconte de vive voix.</em>
      </p>

      {/* ---------- VUE LISTE ---------- */}
      <div
        ref={viewportRef}
        className={`${styles.viewport} ${view === "grid" ? styles.off : ""} ${
          active >= 0 ? styles.hovering : ""
        }`}
      >
        <div ref={trackRef} className={styles.track}>
          {sets.map((s) =>
            works.map((w, i) => (
              <Link
                key={`${s}-${i}`}
                href={`/travaux/${w.slug}`}
                className={styles.row}
                onMouseEnter={() => enterRow(i)}
                onMouseLeave={leaveRow}
              >
                <span className={styles.cats}>
                  {w.categories.map((c) => (
                    <i key={c}>{c}</i>
                  ))}
                </span>
                <span className={styles.title}>{w.title}</span>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* ---------- VUE GRILLE ---------- */}
      <div
        ref={hgridRef}
        className={`${styles.hgrid} ${view === "grid" ? styles.on : ""} ${
          gridHover ? styles.hovering : ""
        }`}
      >
        <div ref={htrackRef} className={styles.htrack}>
          {sets.map((s) =>
            works.map((w, i) => {
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

      {/* ---------- IMAGES FLOTTANTES (survol liste) ---------- */}
      {works.map((w, i) => (
        <div
          key={w.slug}
          ref={(el) => {
            floatRefs.current[i] = el;
          }}
          className={`${styles.floatImg} ${active === i ? styles.show : ""}`}
          style={cVar(w.color)}
        >
          {w.image ? <img src={w.image} alt={w.title} /> : <span>{w.title}</span>}
        </div>
      ))}
    </div>
  );
}
