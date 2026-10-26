import { KNav, KFooter } from "./Shell";
import ProjetsGrille from "./ProjetsGrille";
import { chemins, UI, type Lang } from "@/lib/kamil";
import { cartes, filtresPresents } from "@/lib/kamilProjets";
import styles from "./Portfolio.module.css";

/** page Projets : tous les projets, filtrables par discipline */
export default function ProjetsIndex({ lang }: { lang: Lang }) {
  const ui = UI[lang];
  const liste = cartes(lang);
  return (
    <div className={styles.page} lang={lang}>
      <KNav lang={lang} alt={chemins(lang === "fr" ? "en" : "fr").projets} />
      <main className={styles.index}>
        <div className={styles.indexHead}>
          <h1 className={styles.indexTitle}>{ui.projets}</h1>
          <span className={styles.mono}>{ui.nProjets(liste.length)}</span>
        </div>
        <ProjetsGrille
          cartes={liste}
          filtres={filtresPresents(lang)}
          labels={{ filtrer: ui.filtrer, tous: ui.tous }}
        />
      </main>
      <KFooter lang={lang} />
    </div>
  );
}
