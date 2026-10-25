import { Suspense } from "react";
import Nav from "@/components/Nav";
import { typo } from "@/lib/typo";
import ContactForm from "./ContactForm";
import RdvLink from "./RdvLink";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <main className={styles.contact}>
      <Nav />

      <div className={styles.grid}>
        {/* colonne gauche : intro + coordonnées */}
        <aside className={styles.intro}>
          <span className={styles.kicker}>(Contact)</span>
          <h1 className={styles.title}>Travaillons ensemble.</h1>
          <p className={styles.lead}>
            {typo(
              "Une échéance, un salon, une réorganisation, un nouveau marché. Dites-nous où vous en êtes : nous revenons vers vous sous 48 heures pour fixer un premier échange."
            )}
          </p>
          {/* lien principal — l'offre d'origine (?offre=) préremplit l'objet */}
          <Suspense
            fallback={
              <a className={styles.rdv} href="mailto:wearepostagency@gmail.com">
                Demander un rendez-vous
              </a>
            }
          >
            <RdvLink className={styles.rdv} />
          </Suspense>

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
              <span className={styles.k}>Mail</span>
              <span>
                <a href="mailto:wearepostagency@gmail.com">wearepostagency@gmail.com</a>
              </span>
            </div>
            <div className={styles.row}>
              <span className={styles.k}>Tél</span>
              <span>+213 540 87 73 98</span>
            </div>
          </div>
        </aside>

        {/* colonne droite : formulaire */}
        <div className={styles.formCol}>
          <Suspense fallback={null}>
            <ContactForm />
          </Suspense>
        </div>
      </div>

      {/* sloughi bas-gauche (encre sur transparent) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={styles.sloughi}
        src="/about/sloughi/sloughi-08.webp"
        alt=""
        aria-hidden
      />
    </main>
  );
}
