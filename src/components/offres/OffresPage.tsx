import Link from "next/link";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import WorkGrid from "@/components/home/WorkGrid";
import { programmes, offresSeules, rdvHref } from "@/lib/offres";
import type { Work } from "@/lib/works";
import { typo } from "@/lib/typo";
import OffreCard from "./OffreCard";
import styles from "./Offres.module.css";

/**
 * Page Offres — deux portes d'entrée de même poids : les programmes
 * (dispositifs intégrés) et les offres (commandables seules). Ni palier ni
 * prix : chaque carte part de la situation du client.
 */
export default function OffresPage({ works }: { works: Work[] }) {
  return (
    <div className={styles.page}>
      <Nav />

      <header className={styles.head}>
        <span className={styles.kicker}>(Offres)</span>
        <h1 className={styles.name}>Offres</h1>
        <div className={styles.rule} />
        <p className={styles.line}>
          {typo(
            "Deux portes d'entrée. Un programme quand toute l'image doit suivre, une offre quand le besoin est précis. Dans les deux cas, une seule direction, du diagnostic à la livraison."
          )}
        </p>
        <div className={styles.actions}>
          <Link href={rdvHref()} className={styles.btn}>
            Demander un rendez-vous
          </Link>
        </div>
      </header>

      <section className={styles.sec} id="programmes">
        <div className={styles.porte}>
          <div className={styles.porteHead}>
            <span className={styles.kicker}>Porte 1</span>
            <h2 className={styles.secTitle}>Programmes</h2>
            <p>
              {typo(
                "Quand toute l'image doit suivre : croissance, transmission, nouveau marché."
              )}
            </p>
          </div>
          <div className={styles.cards} style={{ ["--cols" as string]: 2 }}>
            {programmes.map((o) => (
              <OffreCard key={o.slug} offre={o} />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.sec} id="offres">
        <div className={styles.porte}>
          <div className={styles.porteHead}>
            <span className={styles.kicker}>Porte 2</span>
            <h2 className={styles.secTitle}>Offres</h2>
            <p>
              {typo(
                "Quand le besoin est précis : Identité, Web, Film, Contenu. Chacune se commande seule, et peut devenir le premier pas d'un programme."
              )}
            </p>
          </div>
          <div className={styles.cards} style={{ ["--cols" as string]: 4 }}>
            {offresSeules.map((o) => (
              <OffreCard key={o.slug} offre={o} />
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.dark} ${styles.closing}`}>
        <h2 className={styles.secTitle}>
          {typo("Votre image a pris du retard sur votre réalité ?")}
        </h2>
        <div className={styles.actions}>
          <Link href={rdvHref()} className={styles.btn}>
            Parlons-en
          </Link>
        </div>
      </section>

      <section className={styles.sec}>
        <span className={styles.kicker}>Travaux</span>
        <h2 className={styles.secTitle} style={{ marginBottom: "clamp(28px, 4vh, 56px)" }}>
          Ce qui ne se voyait pas.
        </h2>
        <WorkGrid items={works.slice(0, 4)} />
        <div className={styles.actions}>
          <Link href="/travaux" className={styles.link}>
            Tous les travaux →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
