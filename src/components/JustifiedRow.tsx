"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";
import Reveal from "./Reveal";
import type { Visual } from "@/lib/projects";

function Cell({ v }: { v: Visual }) {
  return (
    <div
      className="gal-cell"
      style={
        {
          flex: `${v.ratio} ${v.ratio} 0%`,
          "--ratio": v.ratio,
        } as CSSProperties
      }
    >
      {v.isVideo ? (
        <video src={v.src} autoPlay loop muted playsInline aria-hidden />
      ) : (
        <img src={v.src} alt="" />
      )}
    </div>
  );
}

/** Rangée justifiée : la hauteur exacte de la rangée est calculée en JS
 *  (largeur disponible moins les gaps, divisée par la somme des ratios)
 *  plutôt qu'approximée en CSS — sinon les gaps faussent légèrement le
 *  ratio de chaque cellule et laissent un filet de bande vide (letterbox)
 *  autour des visuels en object-fit:contain. */
export default function JustifiedRow({ visuals }: { visuals: Visual[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const sumRatio = visuals.reduce((s, v) => s + v.ratio, 0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const setHeight = () => {
      const cs = getComputedStyle(el);
      if (cs.flexDirection === "column") {
        el.style.height = "";
        return;
      }
      const gapPx = parseFloat(cs.columnGap || cs.gap || "0") || 0;
      const availWidth = el.clientWidth - gapPx * Math.max(visuals.length - 1, 0);
      // une fois la hauteur posée explicitement, aspect-ratio (CSS) calculerait
      // sinon la largeur à partir de cette hauteur (et non l'inverse) — on le
      // désactive donc pour laisser la largeur suivre le flux normal du bloc.
      el.style.aspectRatio = "auto";
      el.style.height = `${availWidth / sumRatio}px`;
    };
    setHeight();
    const ro = new ResizeObserver(setHeight);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sumRatio, visuals.length]);

  return (
    <Reveal>
      <div className="gal" ref={ref} style={{ aspectRatio: sumRatio }}>
        {visuals.map((v) => (
          <Cell key={v.src} v={v} />
        ))}
      </div>
    </Reveal>
  );
}
