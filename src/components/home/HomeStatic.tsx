import Link from "next/link";
import KinayaLogo from "@/components/KinayaLogo";
import Nav from "@/components/Nav";
import RevealWords from "./RevealWords";
import HeroHeadline from "./HeroHeadline";
import HeroLogoTravel from "./HeroLogoTravel";
import IntroReveal from "./IntroReveal";
import AventuresStage from "./AventuresStage";
import DepartementsSection from "./DepartementsSection";
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

      {/* HERO — image plein cadre, KINAYA en bandeau, accroche en bas */}
      <section className={styles.hero} data-theme="dark" data-hero>
        <div className={styles.heroFrame}>
          <img
            className={styles.heroBg}
            src="/home/aventures/av-8.webp"
            alt=""
            aria-hidden
          />
          <div className={styles.heroLogo} data-hero-logo>
            <KinayaLogo className="klogo" />
          </div>
          <div className={styles.heroFoot}>
            <HeroHeadline
              className={styles.heroHeadline}
              lines={["Les bonnes idées n'ont pas", "besoin de hausser le ton."]}
            />
            <div className={styles.heroMeta}>
              Agence créative
              <span className={styles.dot}>·</span>
              Alger
              <span className={styles.dot}>·</span>
              36.7°N
            </div>
          </div>
        </div>
      </section>

      {/* INTRO — révélation mot à mot au scroll, couleurs inversées (fond sombre) */}
      <section className={styles.intro} data-theme="dark">
        <div className={styles.introInner}>
          <IntroReveal />
        </div>
      </section>

      {/* WORK */}
      <section className={styles.work} data-theme="light">
        <RevealWords
          className={styles.workTitle}
          lines={["L’art de dire une chose", "pour en signifier une autre."]}
        />
        <div className={styles.workGrid}>
          {featured.map((w) => (
            <div key={w.slug} className={styles.workItem}>
              <Link href={`/travaux/${w.slug}`} style={{ display: "block" }}>
                <div className={styles.workThumb}>
                  <div
                    className={styles.workMedia}
                    style={
                      w.image
                        ? { backgroundImage: `url(${w.image})` }
                        : undefined
                    }
                  />
                </div>
                <div className={styles.workCap}>
                  <span className={styles.workName}>{w.title}</span>
                  <span className={styles.workDisc}>{w.categories[0]}</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* DÉPARTEMENTS — placé avant Aventures */}
      <DepartementsSection />

      {/* SHOWREEL — vidéo en boucle plein écran (100vh × 100vw, gutter 1%) */}
      <section className={styles.showreel} data-theme="dark">
        <video
          className={styles.showreelVideo}
          src="/home/showreel.webm"
          autoPlay
          loop
          muted
          playsInline
        />
      </section>

      {/* AVENTURES — composition + parallaxe curseur */}
      <AventuresStage />

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
            contact@kinaya.wtf
          </div>
          <div className={styles.r}>
            25 Rabah Bourbia,
            <br />
            El Biar, Alger
          </div>
        </div>
        <div className={styles.footLogo}>
          <KinayaLogo className="klogo" />
        </div>
      </section>
    </div>
  );
}
