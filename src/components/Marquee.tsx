"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { startEngine, getState } from "./marqueeEngine";

/**
 * Marquee scroll-réactif (porté de reference/projet-canevas.html).
 * Dérive de base, accélère avec la vélocité de scroll, change de sens selon
 * la direction du scroll. Le contenu est cloné jusqu'à couvrir 2× la largeur
 * de la fenêtre pour une boucle continue. Animation pilotée par GSAP.
 *
 * `items` est répété tel quel dans le markup (rendu SSR statique) ; les clones
 * supplémentaires sont ajoutés côté client après chargement des polices.
 */
export default function Marquee({
  items,
  repeat = 3,
  className,
}: {
  items: string;
  repeat?: number;
  className?: string;
}) {
  const rollRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const roll = rollRef.current;
    if (!roll) return;

    startEngine();

    let pos = 0;
    const base = 0.35;
    let unit = 0;
    let mounted = true;

    const fill = () => {
      const originals = [...roll.children];
      if (!originals.length) return;
      let guard = 0;
      while (roll.scrollWidth < window.innerWidth * 2 && guard < 20) {
        originals.forEach((c) => roll.appendChild(c.cloneNode(true)));
        guard++;
      }
    };

    const measure = () => {
      const first = roll.children[0] as HTMLElement | undefined;
      if (first) {
        const style = getComputedStyle(first);
        unit =
          first.getBoundingClientRect().width +
          parseFloat(style.marginRight || "0");
      }
    };

    const setup = () => {
      if (!mounted) return;
      fill();
      measure();
    };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(setup);
    }
    setup();

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    const move = () => {
      if (!unit) {
        measure();
        return;
      }
      const { extra, dir } = getState();
      pos += (base + extra) * dir;
      while (pos <= -unit) pos += unit;
      while (pos > 0) pos -= unit;
      gsap.set(roll, { x: pos });
    };
    gsap.ticker.add(move);

    return () => {
      mounted = false;
      gsap.ticker.remove(move);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <span className={["roll", className].filter(Boolean).join(" ")} ref={rollRef}>
      {Array.from({ length: repeat }).map((_, i) => (
        <span key={i}>{items}</span>
      ))}
    </span>
  );
}
