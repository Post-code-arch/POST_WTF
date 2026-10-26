import Link from "next/link";
import Todo from "@/components/Todo";
import Carte from "./Carte";
import { KNav, KFooter, KContact } from "./Shell";
import {
  identite,
  roles,
  ticker,
  experiences,
  missions,
  formation,
  competences,
  chemins,
  tx,
  UI,
  type Lang,
  type Ligne,
} from "@/lib/kamil";
import type { Carte as CarteData } from "@/lib/kamilProjets";
import styles from "./Portfolio.module.css";

/** nombre de projets montrés en aperçu sur l'accueil */
const APERCU = 6;

function Lignes({ items, lang }: { items: Ligne[]; lang: Lang }) {
  return (
    <ul className={styles.lines}>
      {items.map((l, i) => (
        <li key={i} className={styles.line}>
          <span className={styles.year}>{l.annee}</span>
          <span className={styles.lineMain}>
            <b>{tx(l.titre, lang)}</b>
            {l.structure && <span className={styles.lineOrg}>{tx(l.structure, lang)}</span>}
          </span>
          {l.detail && <span className={styles.lineDetail}>{tx(l.detail, lang)}</span>}
        </li>
      ))}
    </ul>
  );
}

/**
 * Accueil du portfolio de Kamil Grimes — même grammaire que le site du
 * studio : hero image plein cadre + bandeau défilant, intro sur fond sombre,
 * aperçu des projets (chacun a sa page), parcours, contact.
 */
export default function Portfolio({ lang, cartes }: { lang: Lang; cartes: CarteData[] }) {
  const ui = UI[lang];
  const c = chemins(lang);
  const autre = chemins(lang === "fr" ? "en" : "fr");
  const accroche = tx(identite.bio ?? identite.accroche, lang);
  return (
    <div className={styles.page} lang={lang}>
      <KNav lang={lang} alt={autre.home} />

      {/* HERO */}
      <section className={styles.hero} id="top">
        <div className={styles.heroFrame}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={styles.heroBg} src="/home/aventures/av-6.webp" alt="" aria-hidden />
          <h1 className={styles.heroName}>{identite.nom}</h1>
          <div className={styles.heroFoot}>
            <ul className={styles.heroRoles}>
              {roles.map((r) => (
                <li key={r.titre.fr}>{r.titre[lang]}</li>
              ))}
            </ul>
            <div className={styles.heroMeta}>
              {identite.ville[lang]}
              <span>·</span>36.7°N
            </div>
          </div>
          <div className={styles.ticker} aria-hidden>
            <div className={styles.tickerTrack}>
              {[0, 1].map((g) => (
                <span key={g} className={styles.tickerGroup}>
                  {[...ticker, ...ticker].map((w, i) => (
                    <span key={i} className={styles.tickerWord}>
                      {w[lang]}
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
          {accroche.split(" ").map((w, i) => (
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
            <div key={r.titre.fr} className={styles.role}>
              <span className={styles.roleNum}>0{i + 1}</span>
              <h2 className={styles.roleTitle}>{r.titre[lang]}</h2>
              <p className={styles.roleChamps}>{r.champs.map((x) => x[lang]).join(" · ")}</p>
            </div>
          ))}
        </div>
      </section>

      {/* APERÇU DES PROJETS */}
      <section className={styles.work} id="projets">
        <div className={styles.secHead}>
          <span className={styles.mono}>({ui.projets})</span>
          <h2 className={styles.secTitle}>{ui.selection}</h2>
          <span className={styles.mono}>{ui.nProjets(cartes.length)}</span>
        </div>
        <div className={styles.grid}>
          {cartes.slice(0, APERCU).map((x) => (
            <Carte key={x.slug} c={x} />
          ))}
        </div>
        <Link href={c.projets} className={styles.voirTout}>
          <span>{ui.voirTout(cartes.length)}</span>
          <span aria-hidden>→</span>
        </Link>
      </section>

      {/* PARCOURS */}
      <section className={styles.cv} id="parcours">
        <div className={styles.secHead}>
          <span className={styles.mono}>({ui.parcours})</span>
          <h2 className={styles.secTitle}>{ui.experiences}</h2>
        </div>
        <Lignes items={experiences} lang={lang} />

        <div className={styles.secHead}>
          <span className={styles.mono}>{ui.missionsKicker}</span>
          <h2 className={styles.secTitle}>{ui.missions}</h2>
        </div>
        <Lignes items={missions} lang={lang} />

        <div className={styles.grid4}>
          <div>
            <h3 className={styles.colTitle}>{ui.formation}</h3>
            <ul className={styles.list}>
              {formation.map((f) => (
                <li key={f.annee}>
                  <b>{tx(f.titre, lang)}</b>
                  <span>
                    {f.structure ? `${tx(f.structure, lang)} · ` : ""}
                    {f.annee}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {competences.map((k) => (
            <div key={k.titre.fr}>
              <h3 className={styles.colTitle}>{k.titre[lang]}</h3>
              <ul className={styles.list}>
                {k.items.map((it) => (
                  <li key={it.fr}>{tx(it, lang)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <KContact lang={lang} />
      <KFooter lang={lang} />
    </div>
  );
}
