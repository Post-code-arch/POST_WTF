"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type CSSProperties,
} from "react";
import Nav from "@/components/Nav";
import KinayaLogo from "@/components/KinayaLogo";
import type { Service } from "@/lib/services";
import styles from "./Services.module.css";

const clamp = (v: number) => Math.min(Math.max(v, 0), 1);
const easeIO = (k: number) =>
  k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
const easeOut = (k: number) => 1 - Math.pow(1 - k, 3);

const useIso = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function ServicesPage({ services }: { services: Service[] }) {
  const stageRef = useRef<HTMLElement>(null);
  const N = services.length;

  useIso(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const bgs = Array.from(stage.querySelectorAll<HTMLElement>("[data-bg]"));
    const txts = Array.from(stage.querySelectorAll<HTMLElement>("[data-txt]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const OFFSETS = [0.3, 0.36, 0.44, 0.52]; // stagger : titre, num, phrase, tags

    let ticking = false;
    const apply = () => {
      ticking = false;
      const r = stage.getBoundingClientRect();
      const sc = stage.offsetHeight - window.innerHeight;
      const p = clamp(-r.top / sc) * (N - 1); // 0..N-1

      if (reduced) {
        // fondu simple, pas de parallaxe ni contre-mouvement
        bgs.forEach((bg, i) => {
          bg.style.transform = "none";
          bg.style.opacity = String(clamp(1 - Math.abs(p - i)));
          const g = bg.querySelector<HTMLElement>("[data-grain]");
          if (g) g.style.transform = "none";
        });
        txts.forEach((txt, i) => {
          const vis = clamp(1 - Math.abs(p - i));
          txt.querySelectorAll<HTMLElement>("[data-part]").forEach((el) => {
            el.style.opacity = String(vis);
            el.style.transform = "none";
          });
          txt.style.visibility = vis > 0.5 ? "visible" : "hidden";
        });
        return;
      }

      // ----- COUCHE A : fonds qui montent l'un par-dessus l'autre -----
      bgs.forEach((bg, i) => {
        const grain = bg.querySelector<HTMLElement>("[data-grain]");
        if (i === 0) {
          bg.style.transform = "translateY(0)";
        } else {
          const local = clamp(p - (i - 1));
          const e = easeIO(local);
          bg.style.transform = `translateY(${(1 - e) * 100}%)`;
        }
        // parallaxe / zoom interne
        const dist = Math.abs(p - i);
        const scale = 1.14 - Math.min(dist, 1) * 0.1;
        const drift = (p - i) * -26;
        if (grain) grain.style.transform = `scale(${scale}) translateY(${drift}px)`;
      });

      // ----- COUCHE B : textes — contre-mouvement + stagger + anti-overlap -----
      txts.forEach((txt, i) => {
        const local = clamp(p - (i - 1)); // entrée du texte i
        const out = clamp(p - i); // sortie une fois dépassé
        const leave = easeIO(clamp(out / 0.38));
        const parts = txt.querySelectorAll<HTMLElement>("[data-part]");
        parts.forEach((el, k) => {
          const appear = easeOut(clamp((local - OFFSETS[k]) / 0.5));
          let op = appear * (1 - leave);
          const y = (1 - appear) * -40 + leave * 95; // depuis le haut, sort vers le bas
          if (out >= 0.4) op = 0;
          el.style.opacity = String(op);
          el.style.transform = `translateY(${y}px)`;
        });
        const anyVisible = local > OFFSETS[0] && out < 0.4;
        txt.style.visibility = anyVisible ? "visible" : "hidden";
      });
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
  }, [N]);

  return (
    <div className={styles.page}>
      <Nav />

      <section
        ref={stageRef}
        className={styles.stage}
        style={{ height: `${N * 100}vh` }}
      >
        <div className={styles.sticky}>
          {/* COUCHE A — fonds */}
          <div className={styles.bgLayer}>
            {services.map((s, i) => (
              <div
                key={s.num}
                data-bg
                className={styles.bg}
                style={{
                  background: s.bg,
                  zIndex: i + 1,
                  transform: i === 0 ? "translateY(0)" : "translateY(100%)",
                }}
              >
                <div
                  data-grain
                  className={styles.grain}
                  style={
                    s.image
                      ? { backgroundImage: `url(${s.image})` }
                      : undefined
                  }
                />
              </div>
            ))}
          </div>

          {/* COUCHE B — textes */}
          <div className={styles.txtLayer}>
            {services.map((s, i) => (
              <div
                key={s.num}
                data-txt
                className={styles.txt}
                style={{ zIndex: i + 1 } as CSSProperties}
              >
                <div className={styles.txtInner}>
                  <div className={styles.txtHead}>
                    <h2 data-part className={styles.title}>
                      {s.name}
                    </h2>
                    <span data-part className={styles.num}>
                      {s.num}
                    </span>
                  </div>
                  <p data-part className={styles.line}>
                    {s.line}
                  </p>
                  <div data-part className={styles.tags}>
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
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
    </div>
  );
}
