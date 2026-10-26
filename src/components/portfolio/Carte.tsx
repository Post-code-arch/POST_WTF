import Link from "next/link";
import AutoVideo from "@/components/AutoVideo";
import type { Carte as CarteData } from "@/lib/kamilProjets";
import styles from "./Portfolio.module.css";

/** vignette de projet : visuel (ou boucle vidéo), titre, disciplines, année */
export default function Carte({ c }: { c: CarteData }) {
  return (
    <Link href={c.href} className={styles.card}>
      <div className={styles.cardMedia}>
        {c.video ? (
          <AutoVideo src={c.video} poster={c.poster} />
        ) : c.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={c.image} alt={c.titre} loading="lazy" />
        ) : null}
      </div>
      <div className={styles.cardMeta}>
        <span className={styles.cardTitle}>{c.titre}</span>
        {c.annee && <span className={styles.mono}>{c.annee}</span>}
      </div>
      <span className={`${styles.mono} ${styles.cardTags}`}>{c.tags.join(" · ")}</span>
    </Link>
  );
}
