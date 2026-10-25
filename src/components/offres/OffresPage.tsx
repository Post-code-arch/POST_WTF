import Link from "next/link";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import { programmes, offresSeules, rdvHref, toClient } from "@/lib/offres";
import { typo } from "@/lib/typo";
import ProgrammesTabs from "./ProgrammesTabs";
import OffresStack from "./OffresStack";
import styles from "./OffresIndex.module.css";

export interface CaseTeaser {
  slug: string;
  titre: string;
  sousTitre: string;
  secteur: string;
  champs: string[];
}

/** astérisque à huit branches, en tête du titre géant */
function Star() {
  return (
    <svg className={styles.star} viewBox="0 0 100 100" aria-hidden>
      {[0, 45, 90, 135].map((a) => (
        <line
          key={a}
          x1="50"
          y1="4"
          x2="50"
          y2="96"
          transform={`rotate(${a} 50 50)`}
          stroke="currentColor"
          strokeWidth="6"
        />
      ))}
    </svg>
  );
}

const LETTRES = "ABCDEFGH";

/**
 * Page Offres — deux portes d'entrée de même poids :
 *   titre géant · porte 1 (programmes, panneau à onglets) · porte 2 (offres,
 *   mots empilés dépliables) · clôture · aperçu des travaux (cartes texte).
 * Ni palier ni prix : chaque entrée part de la situation du client.
 */
export default function OffresPage({ cases }: { cases: CaseTeaser[] }) {
  return (
    <div className={styles.page}>
      <Nav />

      {/* ---------- titre ---------- */}
      <header className={styles.hero}>
        <h1 className={styles.mega}>
          <Star />
          Offres
        </h1>
        <div className={styles.heroRow}>
          <p className={styles.heroIntro}>
            {typo(
              "Deux portes d'entrée. Un programme quand toute l'image doit suivre, une offre quand le besoin est précis. Dans les deux cas, une seule direction, du diagnostic à la livraison."
            )}
          </p>
          <div className={styles.heroLinks}>
            <Link href={rdvHref()} className={styles.underline}>
              Demander un rendez-vous
            </Link>
            <span className={styles.mono}>(Défiler)</span>
          </div>
        </div>
      </header>

      {/* ---------- porte 1 : programmes ---------- */}
      <section className={styles.porte} id="programmes">
        <div className={styles.porteHead}>
          <span className={styles.mono}>Porte 1</span>
          <h2 className={styles.porteTitle}>Programmes</h2>
          <p>
            {typo(
              "Quand toute l'image doit suivre : croissance, transmission, nouveau marché."
            )}
          </p>
        </div>
        <ProgrammesTabs items={programmes.map(toClient)} />
      </section>

      {/* ---------- porte 2 : offres ---------- */}
      <section className={styles.porte} id="offres">
        <div className={styles.porteHead}>
          <span className={styles.mono}>Porte 2</span>
          <h2 className={styles.porteTitle}>Offres</h2>
          <p>
            {typo(
              "Quand le besoin est précis : Identité, Web, Film, Contenu. Chacune se commande seule, et peut devenir le premier pas d'un programme."
            )}
          </p>
        </div>
        <OffresStack items={offresSeules.map(toClient)} />
      </section>

      {/* ---------- clôture ---------- */}
      <section className={styles.closing}>
        <h2 className={styles.closingTitle}>
          {typo("Votre image a pris du retard sur votre réalité ?")}
        </h2>
        <Link href={rdvHref()} className={styles.pill}>
          Parlons-en
        </Link>
      </section>

      {/* ---------- travaux : titre en bandeaux + cartes texte ---------- */}
      <section className={styles.cases}>
        <span className={styles.casesNum}>Travaux :</span>
        <div className={styles.bands} aria-label="Ce qui ne se voyait pas.">
          <span className={`${styles.band} ${styles.bandLight}`} aria-hidden>
            Ce qui ne
          </span>
          <span className={`${styles.band} ${styles.bandDark}`} aria-hidden>
            se voyait
          </span>
          <span className={styles.bandPlain} aria-hidden>
            pas.
          </span>
        </div>

        <div className={styles.caseGrid}>
          {cases.map((c, i) => (
            <Link key={c.slug} href={`/travaux/${c.slug}`} className={styles.caseCard}>
              <span className={styles.caseLetter}>({LETTRES[i]}) :</span>
              <span className={styles.caseQuote}>{typo(c.sousTitre)}</span>
              <span className={styles.caseChamps}>{c.champs.join(" · ")}</span>
              <span className={styles.caseFoot}>
                <span>Client :</span>
                <span>
                  ↳ {c.titre} / {c.secteur.split("—")[0].trim()}
                </span>
                <span>
                  {i + 1} → {cases.length}
                </span>
              </span>
            </Link>
          ))}
        </div>

        <div className={styles.casesMore}>
          <Link href="/travaux" className={styles.pillDark}>
            Tous les travaux
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
