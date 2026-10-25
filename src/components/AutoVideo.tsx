"use client";

import { useEffect, useRef } from "react";

/* une seule vidéo joue à la fois sur la page : celle qui vient d'entrer
   à l'écran met les autres en pause */
const playing = new Set<HTMLVideoElement>();

/**
 * Vidéo muette en boucle, lue au défilement : elle démarre quand elle est
 * visible à moitié, se met en pause hors champ, et met en pause les autres.
 * L'affiche (poster) s'affiche tant qu'elle ne joue pas.
 * prefers-reduced-motion : jamais de lecture automatique.
 */
export default function AutoVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && e.intersectionRatio >= 0.5) {
          playing.forEach((o) => o !== v && o.pause());
          playing.clear();
          playing.add(v);
          v.play().catch(() => {});
        } else {
          v.pause();
          playing.delete(v);
        }
      },
      { threshold: [0, 0.5, 1] }
    );
    io.observe(v);
    return () => {
      io.disconnect();
      v.pause();
      playing.delete(v);
    };
  }, []);

  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden
    />
  );
}
