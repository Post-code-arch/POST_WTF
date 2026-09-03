"use client";

import { useRef, type CSSProperties } from "react";
import Nav from "@/components/Nav";
import type { LabPiece, LabVideo } from "@/lib/lab";
import styles from "./Lab.module.css";

function ratioStyle(ratio: number): CSSProperties {
  return { aspectRatio: String(ratio) };
}

function LabVideoBlock({ video, label }: { video: LabVideo; label: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const seekTo = (index: number) => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration)) return;
    v.pause();
    v.currentTime = (v.duration * (index + 0.5)) / video.frames.length;
  };

  const resume = () => {
    videoRef.current?.play().catch(() => {});
  };

  return (
    <div className={styles.videoBlock}>
      <div className={styles.stage} style={ratioStyle(video.ratio)}>
        <video
          ref={videoRef}
          className={styles.video}
          src={video.src}
          poster={video.frames[0]?.src}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>

      <div className={styles.videoLabel}>{video.label}</div>

      <div className={styles.filmstrip} onMouseLeave={resume}>
        {video.frames.map((frame, i) => (
          <button
            key={frame.src}
            type="button"
            className={styles.frame}
            style={ratioStyle(frame.ratio)}
            onMouseEnter={() => seekTo(i)}
            onFocus={() => seekTo(i)}
            onBlur={resume}
            aria-label={`${label} — ${video.label} — frame ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={frame.src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}

function LabProject({ piece }: { piece: LabPiece }) {
  return (
    <article className={styles.project}>
      <header className={styles.projectHeader}>
        <h2>{piece.title}</h2>
        {piece.note && <p>{piece.note}</p>}
      </header>
      <div className={styles.videos}>
        {piece.videos.map((video) => (
          <LabVideoBlock key={video.src} video={video} label={piece.title} />
        ))}
      </div>
    </article>
  );
}

export default function LabPage({ pieces }: { pieces: LabPiece[] }) {
  return (
    <main className={styles.lab}>
      <Nav />

      <header className={styles.header}>
        <span className={styles.label}>Lab — usage interne</span>
        <h1>Taff IA</h1>
      </header>

      {pieces.length === 0 ? (
        <p className={styles.empty}>Rien pour l’instant.</p>
      ) : (
        <div className={styles.projects}>
          {pieces.map((piece) => (
            <LabProject key={piece.slug} piece={piece} />
          ))}
        </div>
      )}
    </main>
  );
}
