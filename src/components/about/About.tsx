import Nav from "@/components/Nav";
import styles from "./About.module.css";

const CHAMPS = [
  "Stratégie",
  "Identité",
  "Web",
  "Production",
  "Motion",
  "3D",
  "AI",
];

const TRAVAUX = [
  "IMLEAD",
  "Fennec Coffee Roasters",
  "Atelier Spoon",
  "Astarté",
  "Marpharma",
  "Phase 0",
];

export default function About() {
  return (
    <main className={styles.about}>
      <Nav />

      <div className={styles.grid}>
        {/* colonne texte */}
        <div className={styles.text}>
          <p>
            <b>POST</b> est une agence créative basée à Alger, menée par une
            petite équipe depuis un atelier.
          </p>
          <p>
            On travaille quatre champs : la stratégie, pour poser les fondations
            avant de construire. L’identité, pour donner à une marque un visage
            qui tient. Le web, pour que tout ça vive en ligne proprement. La
            production — film, photo, contenu — pour le montrer au monde.
          </p>
          <p>
            On expérimente, et on applique. Puis on recommence. Ce qui marche,
            on le garde, on l’affine, on s’en sert pour de vrai. Une chose
            appelle l’autre, sans fin.
          </p>
          <p>
            On finit par livrer quelque chose qui peut tourner sans nous. C’est
            aussi simple que ça.
          </p>

          <h2 className={styles.label}>Champs</h2>
          <ul className={styles.list}>
            {CHAMPS.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>

          <ul className={styles.works}>
            {TRAVAUX.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        {/* coordonnées */}
        <div className={styles.meta}>
          <div className={styles.row}>
            <span className={styles.k}>Atelier</span>
            <span>
              25 Rabah Bourbia
              <br />
              El Biar, Alger
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.k}>Tél</span>
            <span>+213 540 87 73 98</span>
          </div>
          <div className={styles.row}>
            <span className={styles.k}>Mail</span>
            <span>
              <a href="mailto:wearepostagency@gmail.com">wearepostagency@gmail.com</a>
            </span>
          </div>
          <div className={styles.row}>
            <span className={styles.k}>Web</span>
            <span>postwtf.vercel.app</span>
          </div>
          <div className={styles.row}>
            <span className={styles.k}>@</span>
            <span>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                post
              </a>
            </span>
          </div>
        </div>
      </div>

      {/* sloughi bas-droite (encre sur transparent) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.sloughi}
        src="/about/sloughi/sloughi-01.webp"
        alt="Sloughi au galop, à l’encre"
      />
    </main>
  );
}
