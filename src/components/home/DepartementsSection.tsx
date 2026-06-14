"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import styles from "./Departements.module.css";

interface Dept {
  name: string;
  desc: string;
  tags: string[];
  color: string;
  image?: string;
}

const DEPARTEMENTS: Dept[] = [
  {
    name: "Studio",
    desc: "Le pôle marque. On accompagne une entreprise de la réflexion stratégique jusqu’aux supports finaux : on étudie son marché et son positionnement, on définit son identité, on conçoit son site et ses outils de communication.",
    tags: ["Stratégie", "Identité", "Web", "Production"],
    color: "#2a2620",
  },
  {
    name: "Atelier",
    desc: "Le pôle production. On fabrique les contenus visuels : images et vidéos générées par IA, motion design, 3D. On travaille pour nos propres projets comme en sous-traitance pour d’autres studios et agences.",
    tags: ["Production AI", "Motion", "3D", "Marque blanche"],
    color: "#1f2a24",
  },
  {
    name: "Label",
    desc: "Le pôle édition. Nos projets à nous : publications, objets, éditions culturelles. Pas encore lancé, mais ça vient.",
    tags: ["Bientôt"],
    color: "#2a1f18",
  },
];

const AUTO = 2800;

export default function DepartementsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const timerbarRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const desc = descRef.current;
    const tags = tagsRef.current;
    const timerbar = timerbarRef.current;
    const preview = previewRef.current;
    const right = rightRef.current;
    if (!section || !desc || !tags || !timerbar || !preview || !right) return;

    const items = Array.from(section.querySelectorAll<HTMLElement>("[data-srv]"));
    const pvs = Array.from(section.querySelectorAll<HTMLElement>("[data-pv]"));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cur = 0;
    let autoTimer: ReturnType<typeof setInterval> | null = null;
    let timerTween: gsap.core.Tween | null = null;

    const renderTags = (i: number) => {
      tags.innerHTML = DEPARTEMENTS[i].tags.map((t) => `<i>${t}</i>`).join("");
    };
    const runTimer = () => {
      if (reduced) return;
      if (timerTween) timerTween.kill();
      gsap.set(timerbar, { width: 0 });
      timerTween = gsap.to(timerbar, {
        width: "100%",
        duration: AUTO / 1000,
        ease: "none",
      });
    };
    const setActive = (i: number) => {
      if (i === cur) return;
      cur = i;
      items.forEach((el, k) => el.classList.toggle(styles.active, k === i));
      pvs.forEach((el, k) => el.classList.toggle(styles.on, k === i));
      if (reduced) {
        desc.textContent = DEPARTEMENTS[i].desc;
        renderTags(i);
        return;
      }
      gsap.to([desc, tags], {
        opacity: 0,
        y: 8,
        duration: 0.22,
        onComplete: () => {
          desc.textContent = DEPARTEMENTS[i].desc;
          renderTags(i);
          gsap.fromTo(
            [desc, tags],
            { opacity: 0, y: 8 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
          );
        },
      });
    };
    const stopAuto = () => {
      if (autoTimer) clearInterval(autoTimer);
      if (timerTween) timerTween.pause();
    };
    const startAuto = () => {
      if (reduced) return;
      stopAuto();
      runTimer();
      autoTimer = setInterval(() => {
        setActive((cur + 1) % items.length);
        runTimer();
      }, AUTO);
    };

    const handlers = items.map((el, i) => {
      const h = () => {
        setActive(i);
        stopAuto();
      };
      el.addEventListener("mouseenter", h);
      el.addEventListener("focus", h);
      return [el, h] as const;
    });
    const onMove = (e: MouseEvent) => {
      if (reduced) return;
      const r = right.getBoundingClientRect();
      const y = e.clientY - r.top;
      gsap.to(preview, {
        top: Math.max(130, Math.min(r.height - 130, y)),
        duration: 0.6,
        ease: "power3.out",
      });
    };
    const onLeave = () => startAuto();
    right.addEventListener("mousemove", onMove);
    right.addEventListener("mouseleave", onLeave);

    renderTags(0);
    startAuto();
    if (!reduced) {
      gsap.from(items, {
        y: 36,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
      });
    }

    return () => {
      stopAuto();
      handlers.forEach(([el, h]) => {
        el.removeEventListener("mouseenter", h);
        el.removeEventListener("focus", h);
      });
      right.removeEventListener("mousemove", onMove);
      right.removeEventListener("mouseleave", onLeave);
      if (timerTween) timerTween.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.sec} data-theme="dark">
      <div className={styles.left}>
        <div className={styles.srvTimer}>
          <i ref={timerbarRef} />
        </div>
        <div className={styles.kicker}>
          <span className={styles.dot} />
          Trois départements
        </div>
        <div className={styles.note}>(Maison)</div>
        <div className={styles.desc} ref={descRef}>
          {DEPARTEMENTS[0].desc}
        </div>
        <div className={styles.tags} ref={tagsRef}>
          {DEPARTEMENTS[0].tags.map((t) => (
            <i key={t}>{t}</i>
          ))}
        </div>
      </div>

      <div className={styles.right} ref={rightRef}>
        <ul className={styles.srvList}>
          {DEPARTEMENTS.map((d, i) => (
            <li
              key={d.name}
              data-srv
              tabIndex={0}
              className={`${styles.srv} ${i === 0 ? styles.active : ""}`}
            >
              {d.name}
            </li>
          ))}
        </ul>
        <div className={styles.preview} ref={previewRef}>
          {DEPARTEMENTS.map((d, i) => (
            <div
              key={d.name}
              data-pv
              className={`${styles.pv} ${i === 0 ? styles.on : ""}`}
              style={
                {
                  ["--c"]: d.color,
                  ...(d.image
                    ? { backgroundImage: `url(${d.image})` }
                    : {}),
                } as CSSProperties
              }
            >
              <span>{d.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
