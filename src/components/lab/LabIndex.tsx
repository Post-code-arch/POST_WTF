"use client";

import { useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import type { LabPiece } from "@/lib/lab";
import styles from "./LabIndex.module.css";

function ratioStyle(ratio: number): CSSProperties {
  return { aspectRatio: String(ratio) };
}

function LabCard({ piece, index }: { piece: LabPiece; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hover, setHover] = useState(false);
  const [ready, setReady] = useState(false);
  const showVideo = hover && ready;

  const onEnter = () => {
    setHover(true);
    videoRef.current?.play().catch(() => {});
  };
  const onLeave = () => {
    setHover(false);
    const v = videoRef.current;
    if (!v) return;
    v.pause();
    v.currentTime = 0;
  };

  return (
    <Link
      href={`/lab/${piece.slug}`}
      className={styles.card}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      <span className={styles.cardNum}>{String(index + 1).padStart(2, "0")}</span>
      <div className={styles.cardMedia} style={ratioStyle(piece.poster.ratio)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={`${styles.cardPoster} ${showVideo ? styles.cardPosterHidden : ""}`}
          src={piece.poster.src}
          alt=""
        />
        <video
          ref={videoRef}
          className={`${styles.cardVideo} ${showVideo ? styles.cardVideoVisible : ""}`}
          src={piece.videos[0]?.src}
          muted
          loop
          playsInline
          preload="none"
          onCanPlay={() => setReady(true)}
        />
      </div>
      <div className={styles.cardInfo}>
        <h2>{piece.title}</h2>
        {piece.note && <span className={styles.cardNote}>{piece.note}</span>}
      </div>
    </Link>
  );
}

export default function LabIndex({ pieces }: { pieces: LabPiece[] }) {
  return (
    <main className={styles.lab}>
      <Nav />

      <header className={styles.header}>
        <span className={styles.label}>Lab</span>
        <h1>Taff IA</h1>
        <p className={styles.intro}>
          Expérimentations, VFX et productions assistées par l’IA — les
          coulisses du studio.
        </p>
      </header>

      {pieces.length === 0 ? (
        <p className={styles.empty}>Rien pour l’instant.</p>
      ) : (
        <div className={styles.grid}>
          {pieces.map((piece, i) => (
            <LabCard key={piece.slug} piece={piece} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}
