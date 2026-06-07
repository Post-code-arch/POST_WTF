"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import KinayaLogo from "@/components/KinayaLogo";
import Reveal from "@/components/Reveal";
import type { Work } from "@/lib/works";
import styles from "./Home.module.css";

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp = (t: number) => Math.min(Math.max(t, 0), 1);
const ease = (t: number) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

export default function HomePage({ works }: { works: Work[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const travelRef = useRef<HTMLDivElement>(null);
  const heroSlotRef = useRef<HTMLDivElement>(null);
  const navSlotRef = useRef<HTMLDivElement>(null);
  const footSlotRef = useRef<HTMLDivElement>(null);
  const heroSecRef = useRef<HTMLElement>(null);
  const footSecRef = useRef<HTMLElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);

  const featured = works.slice(0, 4);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const sections = Array.from(
      root.querySelectorAll<HTMLElement>("[data-theme]")
    );
    const thumbs = Array.from(
      root.querySelectorAll<HTMLElement>("[data-thumb]")
    ).map((t) => ({ t, m: t.querySelector<HTMLElement>("[data-media]") }));

    const CREAM = "#f2efe6";
    const INK = "#0e0e0e";
    const FOOT = "#7a2e15";

    // ---- logo voyageur (hero → nav → footer) ----
    const placeLogo = () => {
      const travel = travelRef.current;
      const heroSlot = heroSlotRef.current;
      const navSlot = navSlotRef.current;
      const footSlot = footSlotRef.current;
      const heroSec = heroSecRef.current;
      const footSec = footSecRef.current;
      const navEl = navRef.current;
      if (
        !travel || !heroSlot || !navSlot || !footSlot || !heroSec ||
        !footSec || !navEl
      )
        return;

      const vh = window.innerHeight;
      const y = window.scrollY;
      const heroH = heroSec.offsetHeight;
      const p1 = heroH * 0.65;
      const fr = footSec.getBoundingClientRect();
      const footIn = fr.top < vh * 0.9;
      const h = heroSlot.getBoundingClientRect();
      const n = navSlot.getBoundingClientRect();
      const f = footSlot.getBoundingClientRect();

      let L: number, T: number, W: number, col: string;
      if (footIn) {
        // Phase 2 — nav → footer
        const t = ease(clamp((vh * 0.9 - fr.top) / (vh * 0.6)));
        L = lerp(n.left, f.left, t);
        T = lerp(n.top, f.top, t);
        W = lerp(n.width, f.width, t);
        col = t > 0.5 ? FOOT : CREAM;
        navEl.classList.toggle(styles.show, t < 0.4);
      } else {
        // Phase 1 — hero → nav
        const t = ease(clamp(y / p1));
        L = lerp(h.left, n.left, t);
        T = lerp(h.top, n.top, t);
        W = lerp(h.width, n.width, t);
        navEl.classList.toggle(styles.show, t > 0.9);
        col =
          navEl.classList.contains(styles.light) && t > 0.85 ? INK : CREAM;
      }
      travel.style.left = `${L}px`;
      travel.style.top = `${T}px`;
      travel.style.width = `${W}px`;
      travel.style.color = col;
      travel.style.opacity = "1";
    };

    // ---- couleur de la nav selon le fond ----
    const navTheme = () => {
      const navEl = navRef.current;
      if (!navEl) return;
      const mid = 28;
      let th = "dark";
      for (const s of sections) {
        const r = s.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) {
          th = s.dataset.theme || "dark";
          break;
        }
      }
      navEl.classList.toggle(styles.dark, th === "dark");
      navEl.classList.toggle(styles.light, th === "light");
    };

    // ---- parallaxe des vignettes Travaux ----
    const parWork = () => {
      const vh = window.innerHeight;
      thumbs.forEach(({ t, m }) => {
        if (!m) return;
        const r = t.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const p = (r.top + r.height / 2 - vh / 2) / (vh / 2);
        m.style.transform = `translateY(${-p * 22}px)`;
      });
    };

    let ticking = false;
    const onScroll = () => {
      if (window.scrollY > 120 && hintRef.current)
        hintRef.current.style.opacity = "0";
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          placeLogo();
          navTheme();
          parWork();
          ticking = false;
        });
      }
    };
    const onResize = () => {
      placeLogo();
      parWork();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onResize);
    if (document.fonts && document.fonts.ready)
      document.fonts.ready.then(() => {
        placeLogo();
        navTheme();
        parWork();
      });

    placeLogo();
    navTheme();
    parWork();

    // ---- aventures : collage en suivi de curseur ----
    const advSec = root.querySelector<HTMLElement>("[data-adv]");
    const stage = root.querySelector<HTMLElement>("[data-adv-stage]");
    const photos = Array.from(
      root.querySelectorAll<HTMLElement>("[data-adv-photo]")
    );
    let mx = 0, my = 0, cx = 0, cy = 0;
    const onAdvMove = (e: MouseEvent) => {
      if (!stage) return;
      const r = stage.getBoundingClientRect();
      mx = e.clientX - r.left - r.width / 2;
      my = e.clientY - r.top - r.height / 2;
    };
    advSec?.addEventListener("mousemove", onAdvMove);
    let raf = 0;
    const animAdv = () => {
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;
      photos.forEach((p) => {
        const d = parseFloat(p.dataset.d || "0");
        p.style.transform = `translate(${-cx * d}px,${-cy * d}px)`;
      });
      raf = requestAnimationFrame(animAdv);
    };
    animAdv();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
      advSec?.removeEventListener("mousemove", onAdvMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={styles.home} ref={rootRef}>
      {/* nav (slot logo + liens) */}
      <nav className={styles.nav} ref={navRef}>
        <div className={styles.nlogo} ref={navSlotRef}>
          <KinayaLogo className="klogo" />
        </div>
        <div className={styles.nlinks}>
          <Link href="/studio">Studio</Link>
          <Link href="/travaux">Work</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </nav>

      {/* logo voyageur — instance unique */}
      <div
        className={styles.travelLogo}
        ref={travelRef}
        style={{ opacity: 0 }}
        aria-hidden
      >
        <KinayaLogo className="klogo" />
      </div>

      {/* HERO */}
      <section className={styles.hero} data-theme="dark" ref={heroSecRef}>
        <div className={styles.heroLogo} ref={heroSlotRef}>
          <KinayaLogo className="klogo" />
        </div>
        <div className={styles.heroBlock} />
        <div className={styles.heroGrow} />
        <div className={styles.heroTag}>
          On est une agence créative.
          <br />
          On essaie de ne pas en avoir l&apos;air.
        </div>
        <div className={styles.heroChips}>
          <span>Stratégie</span>
          <span>Motion</span>
          <span>Ai</span>
          <span>Production</span>
          <span>Branding</span>
          <span>Rédaction</span>
          <span>Digital</span>
          <span>Web</span>
        </div>
      </section>

      {/* INTRO */}
      <section className={styles.intro} data-theme="light">
        <div className={styles.introInner}>
          <p>
            <span className={styles.sq} />
            Une agence créative qui travaille la stratégie, l&apos;identité, le
            web et la production avec la même attention. Une moitié du temps à
            comprendre ce qui est déjà là. L&apos;autre à faire les choses
            jusqu&apos;au bout, en laissant au client l&apos;autonomie pour la
            suite.
          </p>
        </div>
      </section>

      {/* WORK */}
      <section className={styles.work} data-theme="light">
        <div className={styles.workGrid}>
          {featured.map((w) => (
            <Reveal key={w.slug} className={styles.workItem}>
              <Link href={`/travaux/${w.slug}`} style={{ display: "block" }}>
                <div className={styles.workThumb} data-thumb>
                  <div
                    className={styles.workMedia}
                    data-media
                    style={
                      w.image
                        ? { backgroundImage: `url(${w.image})` }
                        : undefined
                    }
                  />
                </div>
                <div className={styles.workCap}>
                  {w.title}
                  <span className={styles.d} />
                  {w.categories[0]}
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* AVENTURES */}
      <section className={styles.adv} data-theme="light" data-adv>
        <div className={styles.advStage} data-adv-stage>
          <div className={styles.advPhoto} data-adv-photo data-d="0.03" />
          <div className={styles.advPhoto} data-adv-photo data-d="0.06" />
          <div className={styles.advPhoto} data-adv-photo data-d="0.04" />
          <div className={styles.advPhoto} data-adv-photo data-d="0.08" />
          <div className={styles.advPhoto} data-adv-photo data-d="0.05" />
        </div>
        <div className={styles.advLabel}>
          <span className={styles.sq} />
          AVENTURES
        </div>
      </section>

      {/* FOOTER */}
      <section className={styles.footer} data-theme="light" ref={footSecRef}>
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
        <div className={styles.footLogo} ref={footSlotRef}>
          <KinayaLogo className="klogo" />
        </div>
      </section>

      <div className={styles.scrollHint} ref={hintRef}>
        SCROLL ↓
      </div>
    </div>
  );
}
