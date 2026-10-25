import Todo from "@/components/Todo";
import {
  identite,
  roles,
  experiences,
  missions,
  formation,
  competences,
  type Ligne,
} from "@/lib/kamil";
import { typo } from "@/lib/typo";
import styles from "./Portfolio.module.css";

export interface PortfolioCase {
  slug: string;
  titre: string;
  sousTitre: string;
  secteur: string;
  role: string;
  annee: string;
  projet: string;
  defi: string;
  hero?: string;
  strip: string[];
}

const TICKER = [
  "Direction créative",
  "Production",
  "Art visuel",
  "Brand",
  "Motion",
  "Éditorial",
  "UI / UX",
  "Séries",
  "Musique",
];

function Lignes({ items }: { items: Ligne[] }) {
  return (
    <ul className={styles.lines}>
      {items.map((l, i) => (
        <li key={i} className={styles.line}>
          <span className={styles.year}>{l.annee}</span>
          <span className={styles.lineMain}>
            <b>{typo(l.titre)}</b>
            {l.structure && <span className={styles.lineOrg}>{typo(l.structure)}</span>}
          </span>
          {l.detail && <span className={styles.lineDetail}>{typo(l.detail)}</span>}
        </li>
      ))}
    </ul>
  );
}

/**
 * One-pager portfolio de Kamil Grimes — même grammaire que le site du studio :
 * hero image plein cadre + bandeau défilant, intro sur fond sombre, travaux,
 * parcours en tableaux, contact et pied de page.
 */
export default function Portfolio({ cases }: { cases: PortfolioCase[] }) {
  return (
    <div className={styles.page}>
      {/* nav : nom · ancres · contact */}
      <nav className={styles.nav}>
        <a href="#top" className={styles.navName}>
          {identite.nom}
        </a>
        <div className={styles.navLinks}>
          <a href="#travaux">Travaux</a>
          <a href="#parcours">Parcours</a>
          <a href="#contact">Contact</a>
        </div>
        <a href={`tel:${identite.tel.replace(/\s/g, "")}`} className={styles.navPost}>
          {identite.tel}
        </a>
      </nav>

      {/* HERO */}
      <section className={styles.hero} id="top">
        <div className={styles.heroFrame}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.heroBg} src="/home/aventures/av-6.webp" alt="" aria-hidden />
          <h1 className={styles.heroName}>{identite.nom}</h1>
          <div className={styles.heroFoot}>
            <ul className={styles.heroRoles}>
              {roles.map((r) => (
                <li key={r.titre}>{r.titre}</li>
              ))}
            </ul>
            <div className={styles.heroMeta}>
              {identite.ville}
              <span>·</span>36.7°N
            </div>
          </div>
          <div className={styles.ticker} aria-hidden>
            <div className={styles.tickerTrack}>
              {[0, 1].map((g) => (
                <span key={g} className={styles.tickerGroup}>
                  {[...TICKER, ...TICKER].map((w, i) => (
                    <span key={i} className={styles.tickerWord}>
                      {w}
                      <i>•</i>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INTRO + RÔLES */}
      <section className={styles.intro}>
        <p className={styles.introText}>
          <span className={styles.sq} />
          {/* les mots composés (co-fondateur) ne se coupent pas au trait d'union */}
          {typo(identite.bio ?? identite.accroche)
            .split(" ")
            .map((w, i) => (
              <span key={i}>
                {i > 0 && " "}
                {w.includes("-") ? <span style={{ whiteSpace: "nowrap" }}>{w}</span> : w}
              </span>
            ))}
        </p>
        {!identite.bio && (
          <p style={{ marginTop: 16 }}>
            <Todo label="bio de Kamil" />
          </p>
        )}
        <div className={styles.roles}>
          {roles.map((r, i) => (
            <div key={r.titre} className={styles.role}>
              <span className={styles.roleNum}>0{i + 1}</span>
              <h2 className={styles.roleTitle}>{r.titre}</h2>
              <p className={styles.roleChamps}>{r.champs.join(" · ")}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TRAVAUX */}
      <section className={styles.work} id="travaux">
        <div className={styles.secHead}>
          <span className={styles.mono}>(Travaux)</span>
          <h2 className={styles.secTitle}>Sélection.</h2>
          <span className={styles.mono}>{cases.length} projets</span>
        </div>

        {cases.map((c, i) => (
          <article key={c.slug} className={styles.case}>
            <div className={styles.caseHero}>
              {c.hero && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={c.hero} alt={c.titre} loading="lazy" />
              )}
            </div>
            <div className={styles.caseInfo}>
              <span className={styles.mono}>
                {String(i + 1).padStart(2, "0")} / {String(cases.length).padStart(2, "0")}
              </span>
              <h3 className={styles.caseTitle}>{c.titre}</h3>
              <p className={styles.caseQuote}>{typo(c.sousTitre)}</p>
              <div className={styles.caseText}>
                <p>
                  <span className={styles.mono}>Le projet</span>
                  {typo(c.projet)}
                </p>
                <p>
                  <span className={styles.mono}>Le défi</span>
                  {typo(c.defi)}
                </p>
              </div>
              <dl className={styles.caseMeta}>
                <dt>Rôle</dt>
                <dd>{c.role}</dd>
                <dt>Secteur</dt>
                <dd>{typo(c.secteur)}</dd>
                <dt>Année</dt>
                <dd>{c.annee}</dd>
              </dl>
            </div>
            {c.strip.length > 0 && (
              <div className={styles.strip} data-count={c.strip.length}>
                {c.strip.map((s) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={s} src={s} alt="" loading="lazy" />
                ))}
              </div>
            )}
          </article>
        ))}
      </section>

      {/* PARCOURS */}
      <section className={styles.cv} id="parcours">
        <div className={styles.secHead}>
          <span className={styles.mono}>(Parcours)</span>
          <h2 className={styles.secTitle}>Expériences.</h2>
        </div>
        <Lignes items={experiences} />

        <div className={styles.secHead}>
          <span className={styles.mono}>(Missions)</span>
          <h2 className={styles.secTitle}>Projets.</h2>
        </div>
        <Lignes items={missions} />

        <div className={styles.grid4}>
          <div>
            <h3 className={styles.colTitle}>Formation</h3>
            <ul className={styles.list}>
              {formation.map((f) => (
                <li key={f.titre}>
                  <b>{f.titre}</b>
                  <span>
                    {f.structure ? `${f.structure} · ` : ""}
                    {f.annee}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {competences.map((c) => (
            <div key={c.titre}>
              <h3 className={styles.colTitle}>{c.titre}</h3>
              <ul className={styles.list}>
                {c.items.map((it) => (
                  <li key={it}>{typo(it)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section className={styles.contact} id="contact">
        <h2 className={styles.contactTitle}>{typo("Travaillons ensemble.")}</h2>
        <div className={styles.contactRows}>
          <div>
            <span className={styles.mono}>Nom</span>
            <span>{identite.nomComplet}</span>
          </div>
          <div>
            <span className={styles.mono}>Tél</span>
            <span>{identite.tel}</span>
          </div>
          {identite.mail && (
            <div>
              <span className={styles.mono}>Mail</span>
              <a href={`mailto:${identite.mail}`}>{identite.mail}</a>
            </div>
          )}
          <div>
            <span className={styles.mono}>Ville</span>
            <span>Alger, Algérie</span>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footTop}>
          <span>{identite.nomComplet}</span>
          <span>{roles.map((r) => r.titre).join(" · ")}</span>
          <span>Alger, Algérie</span>
        </div>
        <div className={styles.footName} aria-hidden>
          {identite.nom}
        </div>
      </footer>
    </div>
  );
}
