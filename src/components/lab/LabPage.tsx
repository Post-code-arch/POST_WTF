"use client";

import { useRef, useState, type CSSProperties } from "react";
import Nav from "@/components/Nav";
import type { LabPiece } from "@/lib/lab";
import styles from "./Lab.module.css";

function ratioStyle(ratio: number): CSSProperties {
  return { aspectRatio: String(ratio) };
}

function LabItem({ piece }: { piece: LabPiece }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const seekTo = (index: number) => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration)) return;
    v.pause();
    v.currentTime = (v.duration * (index + 0.5)) / piece.frames.length;
  };

  const resume = () => {
    videoRef.current?.play().catch(() => {});
  };

  return (
    <article className={styles.piece}>
      <div className={styles.stage} style={ratioStyle(piece.ratio)}>
        <video
          ref={videoRef}
          className={styles.video}
          src={piece.video}
          poster={piece.frames[0]?.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>

      <div className={styles.meta}>
        <h2>{piece.title}</h2>
        {piece.note && <p>{piece.note}</p>}
      </div>

      <div className={styles.filmstrip} onMouseLeave={resume}>
        {piece.frames.map((frame, i) => (
          <button
            key={frame.src}
            type="button"
            className={styles.frame}
            style={ratioStyle(frame.ratio)}
            onMouseEnter={() => seekTo(i)}
            onFocus={() => seekTo(i)}
            onBlur={resume}
            aria-label={`${piece.title} — frame ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={frame.src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </article>
  );
}

export default function LabPage({ pieces }: { pieces: LabPiece[] }) {
  const [count] = useState(pieces.length);

  return (
    <main className={styles.lab}>
      <Nav />

      <header className={styles.header}>
        <span className={styles.label}>Lab — usage interne</span>
        <h1>Taff IA</h1>
      </header>

      {count === 0 ? (
        <p className={styles.empty}>Rien pour l’instant.</p>
      ) : (
        <div className={styles.grid}>
          {pieces.map((piece) => (
            <LabItem key={piece.slug} piece={piece} />
          ))}
        </div>
      )}
    </main>
  );
}
