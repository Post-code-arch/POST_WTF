import styles from "./Home.module.css";

/**
 * Bandeau défilant en bas du hero — les quatre offres en boucle continue
 * (marquee CSS, sans JS). La liste est doublée dans chaque groupe pour
 * couvrir les écrans larges ; le groupe est rendu deux fois et l'animation
 * translate de -50 % pour une boucle sans couture.
 */
const OFFRES = ["IDENTITÉ", "SITE", "FILM", "CONTENU"];
const WORDS = [...OFFRES, ...OFFRES];

function Group() {
  return (
    <span className={styles.tickerGroup} aria-hidden>
      {WORDS.map((w, i) => (
        <span key={i} className={styles.tickerWord}>
          {w}
          <i className={styles.tickerDot}>•</i>
        </span>
      ))}
    </span>
  );
}

export default function HeroTicker() {
  return (
    <div className={styles.heroTicker}>
      <div className={styles.tickerTrack}>
        <Group />
        <Group />
      </div>
    </div>
  );
}
