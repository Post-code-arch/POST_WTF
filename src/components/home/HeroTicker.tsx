import styles from "./Home.module.css";

/**
 * Bandeau défilant en bas du hero — les champs de l'agence en boucle continue
 * (marquee CSS, sans JS). Le groupe est rendu deux fois : l'animation translate
 * de -50 % pour une boucle sans couture.
 */
const WORDS = [
  "MOTION",
  "AI",
  "DIGITAL",
  "STRATEGY",
  "CONTENT",
  "WEB",
  "PROD",
];

function Group() {
  return (
    <span className={styles.tickerGroup} aria-hidden>
      {WORDS.map((w) => (
        <span key={w} className={styles.tickerWord}>
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
