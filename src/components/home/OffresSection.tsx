import Link from "next/link";
import RevealWords from "./RevealWords";
import { programmes, offresSeules } from "@/lib/offres";
import { typo } from "@/lib/typo";
import styles from "./Home.module.css";

const PORTES = [
  {
    label: "Programmes",
    texte:
      "Quand toute l'image doit suivre : croissance, transmission, nouveau marché.",
    items: programmes,
  },
  {
    label: "Offres",
    texte:
      "Quand le besoin est précis : Identité, Web, Film, Contenu. Chacune se commande seule, et peut devenir le premier pas d'un programme.",
    items: offresSeules,
  },
];

/** Accueil — les deux portes d'entrée, côte à côte, même poids visuel. */
export default function OffresSection() {
  return (
    <section className={styles.offres} data-theme="light">
      <RevealWords
        className={styles.workTitle}
        lines={[typo("Deux portes d'entrée.")]}
      />
      <div className={styles.portes}>
        {PORTES.map((p) => (
          <div key={p.label} className={styles.porte}>
            <h3 className={styles.porteLabel}>{p.label}</h3>
            <p className={styles.porteText}>{typo(p.texte)}</p>
            <ul className={styles.porteList}>
              {p.items.map((o) => (
                <li key={o.slug}>
                  <Link href={`/offres/${o.slug}`}>{o.nom}</Link>
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
