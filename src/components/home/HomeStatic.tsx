import POSTLogo from "@/components/POSTLogo";
import Nav from "@/components/Nav";
import RevealWords from "./RevealWords";
import HeroHeadline from "./HeroHeadline";
import HeroLogoTravel from "./HeroLogoTravel";
import HeroTicker from "./HeroTicker";
import IntroReveal from "./IntroReveal";
import AventuresStage from "./AventuresStage";
import MethodeSection from "./MethodeSection";
import WorkGrid from "./WorkGrid";
import OffresSection from "./OffresSection";
import { typo } from "@/lib/typo";
import type { Work } from "@/lib/works";
import styles from "./Home.module.css";

/**
 * Accueil — variante STATIQUE, sans animation.
 * Même layout et mêmes placeholders que la version animée, mais :
 *  - pas de logo voyageur : le logotype est affiché en place (hero, footer),
 *    la nav reste visible et s'adapte au fond via mix-blend-mode.
 *  - pas de parallaxe, pas de reveal, pas de suivi curseur.
 * Composant serveur pur (aucun JS client).
 */
export default function HomeStatic({ works }: { works: Work[] }) {
  const featured = works.slice(0, 4);

  return (
    <div className={`${styles.home} ${styles.static}`}>
      {/* nav partagée + logo voyageur (hero → nav) */}
      <Nav />
      <HeroLogoTravel />

      {/* HERO — image plein cadre, POST en bandeau, accroche en bas */}
      <section className={styles.hero} data-theme="dark" data-hero>
        <div className={styles.heroFrame}>
          <picture>
            {/* mobile : plan portrait chaud (bokeh) ; desktop : atelier */}
            <source
              media="(max-width: 760px)"
              srcSet="/home/aventures/av-5.webp"
            />
            <img
              className={styles.heroBg}
              src="/home/aventures/av-8.webp"
              alt=""
              aria-hidden
            />
          </picture>
          <div className={styles.heroLogo} data-hero-logo>
            <POSTLogo className="klogo" />
          </div>
          <div className={styles.heroFoot}>
            <HeroHeadline
              className={styles.heroHeadline}
              lines={["Mettre votre image à la", "hauteur de votre réalité."]}
            />
            <div className={styles.heroMeta}>
              {typo("Architectes d'image")}
              <span className={styles.dot}>·</span>
              Alger
              <span className={styles.dot}>·</span>
              36.7°N
            </div>
          </div>
          <HeroTicker />
        </div>
      </section>

      {/* INTRO — révélation mot à mot au scroll, couleurs inversées (fond sombre) */}
      <section className={styles.intro} data-theme="dark">
        <div className={styles.introInner}>
          <IntroReveal />
        </div>
      </section>

      {/* OFFRES — deux portes d'entrée */}
      <OffresSection />

      {/* WORK */}
      <section className={styles.work} data-theme="light">
        <RevealWords
          className={styles.workTitle}
          lines={["Ce qui ne se voyait pas."]}
        />
        <p className={styles.workSub}>
          {typo(
            "Des organisations solides, une image en retard. Voici ce qu'on a changé."
          )}
        </p>
        <WorkGrid items={featured} />
      </section>

      {/* MÉTHODE — 4 phases, ancrage numéroté */}
      <MethodeSection />

      {/* AVENTURES — composition + parallaxe curseur */}
      <AventuresStage />

      {/* SIGNATURE — l'ancien H1 */}
      <section className={styles.signature} data-theme="light">
        <RevealWords
          className={styles.workTitle}
          lines={[typo("Les bonnes idées n'ont pas"), "besoin de hausser le ton."]}
        />
      </section>

      {/* FOOTER */}
      <section className={styles.footer} data-theme="light">
        <div className={styles.footTop}>
          <div className={styles.l}>
            <span>
              <span className={styles.sq} />
              Instagram
            </span>
            <span>
              <span className={styles.sq} />
              Youtube
            </span>
          </div>
          <div className={styles.c}>
            +213 540 87 73 98
            <br />
            wearepostagency@gmail.com
          </div>
          <div className={styles.r}>
            08, Rue Didouche Mourad, 2ème étage, Bureau 09
            <br />
            16000 Alger, Algérie
          </div>
        </div>
        <div className={styles.footLogo}>
          <POSTLogo className="klogo" />
        </div>
      </section>
    </div>
  );
}
