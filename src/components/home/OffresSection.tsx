import Link from "next/link";
import RevealWords from "./RevealWords";
import { programmes, offresSeules, type Offre } from "@/lib/offres";
import { typo } from "@/lib/typo";
import styles from "./Home.module.css";

const COLONNES: { num: string; label: string; quand: string; items: Offre[] }[] = [
  {
    num: "01",
    label: "Programmes",
    quand: "Quand toute l'image doit suivre",
    items: programmes,
  },
  {
    num: "02",
    label: "Offres",
    quand: "Quand le besoin est précis",
    items: offresSeules,
  },
];

/**
 * Accueil — les deux portes d'entrée en tableau à deux colonnes, même
 * hauteur : 2 programmes à gauche (lignes doubles), 4 offres à droite.
 * Survol : la ligne s'inverse et révèle son résumé.
 */
export default function OffresSection() {
  return (
    <section className={styles.offres} data-theme="light">
      <RevealWords
        className={styles.workTitle}
        lines={[typo("Deux portes d'entrée.")]}
      />
      <div className={styles.table}>
        {COLONNES.map((col) => (
          <div key={col.label} className={styles.col}>
            <div className={styles.colHead}>
              <span>({col.num})</span>
              <span className={styles.colLabel}>{col.label}</span>
              <span className={styles.colQuand}>{typo(col.quand)}</span>
            </div>
            <ul
              className={styles.colRows}
              style={{ ["--rows" as string]: col.items.length }}
            >
              {col.items.map((o, i) => (
                <li key={o.slug}>
                  <Link href={`/offres/${o.slug}`} className={styles.cell}>
                    <span className={styles.cellNum}>
                      {col.num}.{i + 1}
                    </span>
                    <span className={styles.cellName}>{o.nom}</span>
                    <span className={styles.cellResume}>{typo(o.resume)}</span>
                    <span className={styles.cellArrow} aria-hidden>
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Link href="/offres" className={styles.porteMore}>
        Voir les offres →
      </Link>
    </section>
  );
}
