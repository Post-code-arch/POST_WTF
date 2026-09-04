import Link from "next/link";
import Nav from "@/components/Nav";
import type { LabPiece } from "@/lib/lab";
import LabVideoBlock from "./LabVideoBlock";
import styles from "./LabProjectPage.module.css";

export default function LabProjectPage({
  piece,
  next,
}: {
  piece: LabPiece;
  next: LabPiece;
}) {
  const main = piece.videos[0];

  return (
    <main className={styles.page}>
      <Nav />

      <section className={styles.hero}>
        <video
          className={styles.heroVideo}
          src={main.src}
          poster={piece.poster.src}
          autoPlay
          muted
          loop
          playsInline
        />
        <div className={styles.heroGradient} />
        <div className={styles.heroContent}>
          <Link href="/lab" className={styles.back}>
            ← Lab
          </Link>
          <div className={styles.heroBottom}>
            {piece.note && <span className={styles.kicker}>{piece.note}</span>}
            <h1>{piece.title}</h1>
          </div>
        </div>
      </section>

      {piece.description.length > 0 && (
        <section className={styles.description}>
          {piece.description.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </section>
      )}

      <section className={styles.videos}>
        {piece.videos.length > 1 && (
          <span className={styles.videosLabel}>
            {piece.videos.length} vidéos
          </span>
        )}
        <div className={styles.videosGrid}>
          {piece.videos.map((video) => (
            <LabVideoBlock key={video.src} video={video} ariaLabel={piece.title} />
          ))}
        </div>
      </section>

      <Link href={`/lab/${next.slug}`} className={styles.next}>
        <span className={styles.nextLabel}>Projet suivant</span>
        <h2>{next.title}</h2>
      </Link>
    </main>
  );
}
