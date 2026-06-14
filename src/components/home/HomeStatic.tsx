import Link from "next/link";
import KinayaLogo from "@/components/KinayaLogo";
import Nav from "@/components/Nav";
import HeroLogoTravel from "./HeroLogoTravel";
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

      {/* HERO */}
      <section className={styles.hero} data-theme="dark" data-hero>
        <div className={styles.heroLogo} data-hero-logo>
          <KinayaLogo className="klogo" />
        </div>
        <div className={styles.heroBlock} />
        <div className={styles.heroGrow} />
        <div className={styles.heroTag}>
          On est une agence créative.
          <br />
          On essaie de ne pas en avoir l&apos;air.
        </div>
        <div className={styles.heroChips}>
          <span>Stratégie</span>
          <span>Motion</span>
          <span>Ai</span>
          <span>Production</span>
          <span>Branding</span>
          <span>Rédaction</span>
          <span>Digital</span>
          <span>Web</span>
        </div>
      </section>

      {/* INTRO */}
      <section className={styles.intro} data-theme="light">
        <div className={styles.introInner}>
          <p>
            <span className={styles.sq} />
            Une agence créative qui travaille la stratégie, l&apos;identité, le
            web et la production avec la même attention. Une moitié du temps à
            comprendre ce qui est déjà là. L&apos;autre à faire les choses
            jusqu&apos;au bout, en laissant au client l&apos;autonomie pour la
            suite.
          </p>
        </div>
      </section>

      {/* WORK */}
      <section className={styles.work} data-theme="light">
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
                  {w.title}
                  <span className={styles.d} />
                  {w.categories[0]}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* AVENTURES */}
      <section className={styles.adv} data-theme="light">
        <div className={styles.advStage}>
          <div className={styles.advPhoto} />
          <div className={styles.advPhoto} />
          <div className={styles.advPhoto} />
          <div className={styles.advPhoto} />
          <div className={styles.advPhoto} />
        </div>
        <div className={styles.advLabel}>
          <span className={styles.sq} />
          AVENTURES
        </div>
      </section>

      {/* DÉPARTEMENTS */}
      <DepartementsSection />

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
