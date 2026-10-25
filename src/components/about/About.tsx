import Nav from "@/components/Nav";
import Todo from "@/components/Todo";
import { typo } from "@/lib/typo";
import styles from "./About.module.css";

const OFFRES = ["Identité", "Web", "Film", "Contenu"];

const PARAGRAPHES = [
  "post_ est une agence d'image basée à Alger. Nous travaillons pour des institutions et des entreprises dont la réalité dépasse l'image qu'elles renvoient.",
  "Notre particularité tient en une phrase : l'identité, le site et le film sont conçus et fabriqués chez nous, sous une seule direction. Pas de sous-traitance en cascade, pas de trois prestataires à coordonner.",
  "L'équipe vient de la production télévisée et du cinéma. Nous appliquons ce standard à chaque film institutionnel, et la même exigence au reste.",
  "On finit par livrer quelque chose qui peut tourner sans nous. Le bon travail ne crée pas de dépendance.",
];

const FONDATEURS = [
  { nom: "Grimes Kamil-Ilies", role: "co-fondateur" },
  { nom: "Akram Chikhi Abdellah", role: "co-fondateur" },
];

const TRAVAUX = [
  "IMLEAD",
  "Fennec Coffee Roasters",
  "Atelier Spoon",
  "Astarté",
  "Marpharma",
  // TODO — Phase 0 : à expliquer ou retirer (décision post_)
  "Phase 0",
  // TODO — Présidence : gardée en off tant que l'étude de cas est en brouillon
  // "Présidence",
];

export default function About() {
  return (
    <main className={styles.about}>
      <Nav />

      <div className={styles.grid}>
        {/* colonne texte */}
        <div className={styles.text}>
          <h1 className={styles.title}>
            Une direction, un atelier, des outils qui durent.
          </h1>
          {PARAGRAPHES.map((p) => (
            <p key={p}>{typo(p)}</p>
          ))}

          <h2 className={styles.label}>Offres</h2>
          <ul className={styles.list}>
            {OFFRES.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>

          <h2 className={styles.label}>Fondateurs</h2>
          <ul className={styles.people}>
            {FONDATEURS.map((f) => (
              <li key={f.nom}>
                <b>{f.nom}</b>, {f.role}
                {/* TODO — une ligne de parcours */}
                <span className={styles.bio}>
                  <Todo label="parcours" />
                </span>
              </li>
            ))}
          </ul>

          <h2 className={styles.label}>Références</h2>
          {/* TODO — liste institutionnelle à fournir */}
          <Todo label="références institutionnelles" />

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
              08, Rue Didouche Mourad, 2ème étage, Bureau 09
              <br />
              16000 Alger, Algérie
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
            <span>post-wtf.vercel.app</span>
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
    </main>
  );
}
