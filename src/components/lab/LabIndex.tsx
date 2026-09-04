"use client";

import { useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import type { LabPiece } from "@/lib/lab";
import styles from "./LabIndex.module.css";

function ratioStyle(ratio: number): CSSProperties {
  return { aspectRatio: String(ratio) };
}

function Feature({ piece }: { piece: LabPiece }) {
  return (
    <section className={styles.feature}>
      <video
        className={styles.featureVideo}
        src={piece.videos[0]?.src}
        poster={piece.poster.src}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className={styles.featureGradient} />
      <div className={styles.featureContent}>
        <span className={styles.featureKicker}>Lab — à la une</span>
        <h1>{piece.title}</h1>
        {piece.note && <span className={styles.featureNote}>{piece.note}</span>}
        <Link href={`/lab/${piece.slug}`} className={styles.featureCta}>
          Voir le projet
        </Link>
      </div>
    </section>
  );
}

function LabCard({ piece }: { piece: LabPiece }) {
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
      <div className={styles.poster} style={ratioStyle(2 / 3)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className={`${styles.posterImg} ${showVideo ? styles.posterImgHidden : ""}`}
          src={piece.poster.src}
          alt=""
        />
        <video
          ref={videoRef}
          className={`${styles.posterVideo} ${showVideo ? styles.posterVideoVisible : ""}`}
          src={piece.videos[0]?.preview}
          muted
          loop
          playsInline
          preload="none"
          onCanPlay={() => setReady(true)}
        />
      </div>
      <div className={styles.cardText}>
        <h3>{piece.title}</h3>
        {piece.note && <span className={styles.cardNote}>{piece.note}</span>}
      </div>
    </Link>
  );
}

export default function LabIndex({ pieces }: { pieces: LabPiece[] }) {
  const [feature] = pieces;

  return (
    <main className={styles.lab}>
      <Nav />

      {feature ? (
        <Feature piece={feature} />
      ) : (
        <header className={styles.emptyHeader}>
          <span className={styles.featureKicker}>Lab</span>
          <h1>Taff IA</h1>
        </header>
      )}

      <section className={styles.gridSection}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionLabel}>Tous les projets</span>
          <h2>Taff IA</h2>
        </div>

        {pieces.length === 0 ? (
          <p className={styles.empty}>Rien pour l’instant.</p>
        ) : (
          <div className={styles.grid}>
            {pieces.map((piece) => (
              <LabCard key={piece.slug} piece={piece} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
