import Link from "next/link";
import type { CSSProperties } from "react";
import Todo from "@/components/Todo";
import AutoVideo from "@/components/AutoVideo";
import { Media, Gallery } from "@/components/project";
import { KNav, KFooter } from "./Shell";
import {
  lithicMemory as lm,
  chemins,
  tx,
  UI,
  type Lang,
  type Projet,
  type ProjetEtude,
  type ProjetFilms,
} from "@/lib/kamil";
import { carte, suivant, visuelsEtude } from "@/lib/kamilProjets";
import styles from "./Portfolio.module.css";

type Ligne = { label: string; valeur: React.ReactNode };

/** textes (projet, défi, direction) + fiche (rôle, secteur, année…) */
function Infos({
  p,
  lang,
  direction,
  extra = [],
}: {
  p: Projet;
  lang: Lang;
  direction?: string;
  extra?: Ligne[];
}) {
  const ui = UI[lang];
  const fiche: Ligne[] = [
    ...(p.role ? [{ label: ui.role, valeur: tx(p.role, lang) }] : []),
    ...(p.secteur ? [{ label: ui.secteur, valeur: tx(p.secteur, lang) }] : []),
    ...extra,
    ...(p.annee ? [{ label: ui.annee, valeur: p.annee }] : []),
  ];
  return (
    <div className={styles.pInfo}>
      <div className={styles.caseText}>
        {p.projet && (
          <p>
            <span className={styles.mono}>{ui.leProjet}</span>
            {tx(p.projet, lang)}
          </p>
        )}
        {p.defi && (
          <p>
            <span className={styles.mono}>{ui.leDefi}</span>
            {tx(p.defi, lang)}
          </p>
        )}
        {direction && (
          <p>
            <span className={styles.mono}>{ui.laDirection}</span>
            {direction}
          </p>
        )}
        {!p.projet && <Todo label={`description de ${p.titre}`} />}
      </div>
      {fiche.length > 0 && (
        <dl className={styles.caseMeta}>
          {fiche.map((l) => (
            <div key={l.label} style={{ display: "contents" }}>
              <dt>{l.label}</dt>
              <dd>{l.valeur}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

/** grand titre plein cadre sur le visuel de couverture */
function Hero({ p, lang, image }: { p: Projet; lang: Lang; image?: string }) {
  return (
    <header className={styles.pHero}>
      <div className={styles.heroFrame}>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className={styles.heroBg} src={image} alt="" aria-hidden />
        )}
        <div className={styles.pHeroText}>
          <h1 className={styles.pTitle}>{p.titre}</h1>
          {p.sousTitre && <p className={styles.pSub}>{tx(p.sousTitre, lang)}</p>}
        </div>
      </div>
    </header>
  );
}

function Retour({ lang, sombre }: { lang: Lang; sombre?: boolean }) {
  return (
    <Link
      href={chemins(lang).projets}
      className={`${styles.mono} ${styles.retour}${sombre ? ` ${styles.retourSombre}` : ""}`}
    >
      {UI[lang].retour}
    </Link>
  );
}

function Etude({ p, lang }: { p: ProjetEtude; lang: Lang }) {
  const ui = UI[lang];
  const { hero, lien, groupes } = visuelsEtude(p);
  const extra: Ligne[] = lien
    ? [
        {
          label: ui.site,
          valeur: (
            <a href={lien} target="_blank" rel="noreferrer">
              {lien.replace(/^https?:\/\//, "")}
            </a>
          ),
        },
      ]
    : [];
  return (
    <>
      <Hero p={p} lang={lang} image={hero} />
      <section className={styles.pBody}>
        <Retour lang={lang} />
        <Infos p={p} lang={lang} extra={extra} />
      </section>
      {/* --gutter : marge des galeries du site du studio */}
      <div className={styles.pMedia} style={{ "--gutter": "var(--pad)" } as CSSProperties}>
        {groupes.map((g) => (
          <section key={g.slot}>
            <h2 className={styles.pLabel}>{ui.slots[g.slot]}</h2>
            {g.before.map((v) => (
              <Media key={v.src} v={v} />
            ))}
            {g.rangees.length === 1 ? (
              <Media v={g.rangees[0]} />
            ) : g.rangees.length > 1 ? (
              <Gallery visuals={g.rangees} maxPerRow={p.source === "marpharmal" ? 2 : 3} />
            ) : null}
            {g.after.map((v) => (
              <Media key={v.src} v={v} />
            ))}
          </section>
        ))}
      </div>
    </>
  );
}

function Films({ p, lang }: { p: ProjetFilms; lang: Lang }) {
  const ui = UI[lang];
  return (
    <>
      <Hero p={p} lang={lang} image={p.films[0]?.poster} />
      <section className={styles.pBody}>
        <Retour lang={lang} />
        <Infos p={p} lang={lang} extra={[{ label: "Type", valeur: tx(p.tag, lang) }]} />
      </section>
      <section className={`${styles.ia} ${styles.pDark}`}>
        <h2 className={styles.pLabel}>{ui.films}</h2>
        <div className={styles.iaGrid} data-count={p.films.length}>
          {p.films.map((f) => (
            <figure key={f.src} className={styles.iaFilm}>
              <AutoVideo src={f.src} poster={f.poster} className={styles.iaVideo} />
              {p.films.length > 1 && (
                <figcaption className={styles.mono}>{tx(f.label, lang)}</figcaption>
              )}
            </figure>
          ))}
        </div>
        {p.images && (
          <>
            <h2 className={styles.pLabel}>{ui.images}</h2>
            <div className={styles.iaStills}>
              {p.images.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} src={src} alt="" loading="lazy" />
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}

/** LITHIC MEMORY — page sombre, le bleu du titre comme seul accent */
function Lithic({ p, lang }: { p: Projet; lang: Lang }) {
  const L = lm.labels;
  return (
    <section className={styles.lm}>
      <Retour lang={lang} sombre />
      <div className={styles.lmHead}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={lm.signeSvg} alt="" className={styles.lmSigne} />
        <span className={styles.mono}>(Production)</span>
      </div>
      <h1 className={styles.lmTitle}>{p.titre}</h1>
      {p.sousTitre && <p className={styles.lmSub}>{tx(p.sousTitre, lang)}</p>}

      <AutoVideo src={lm.boucleTitre} poster={lm.posterTitre} className={styles.lmWide} />

      <Infos
        p={p}
        lang={lang}
        direction={tx(lm.direction, lang)}
        extra={[{ label: UI[lang].cadre, valeur: tx(lm.cadre, lang) }]}
      />

      <div className={styles.lmLoops}>
        {lm.boucles.map((b) => (
          <figure key={b.src}>
            <AutoVideo src={b.src} poster={b.poster} className={styles.lmVideo} />
            <figcaption className={styles.mono}>{tx(b.label, lang)}</figcaption>
          </figure>
        ))}
      </div>

      <h2 className={styles.lmLabel}>{tx(L.couvertures, lang)}</h2>
      <div className={styles.lmCovers}>
        {lm.couvertures.map((c) => (
          <figure key={c.src}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.src} alt={c.label[lang]} loading="lazy" />
            <figcaption className={styles.mono}>{tx(c.label, lang)}</figcaption>
          </figure>
        ))}
      </div>

      <h2 className={styles.lmLabel}>{tx(L.signe, lang)}</h2>
      <div className={styles.lmPair}>
        {lm.signe.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt="" loading="lazy" />
        ))}
      </div>

      <h2 className={styles.lmLabel}>{tx(L.mineral, lang)}</h2>
      <div className={styles.lmGrid4}>
        {lm.mineral.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt="" loading="lazy" />
        ))}
      </div>
      <div className={styles.lmGrid3}>
        {lm.troupeau.map((src) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt="" loading="lazy" />
        ))}
      </div>

      <h2 className={styles.lmLabel}>{tx(L.storyboard, lang)}</h2>
      <a href={lm.storyboard.png} target="_blank" rel="noreferrer" className={styles.lmBoard}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={lm.storyboard.image} alt={L.storyboardAlt[lang]} loading="lazy" />
        <span className={styles.mono}>{L.agrandir[lang]}</span>
      </a>

      <h2 className={styles.lmLabel}>{tx(L.clip, lang)}</h2>
      <video
        className={styles.lmClip}
        src={lm.clip.src}
        poster={lm.clip.poster}
        controls
        preload="none"
        playsInline
      />
    </section>
  );
}

function Suivant({ p, lang }: { p: Projet; lang: Lang }) {
  const n = carte(suivant(p.slug), lang);
  return (
    <Link href={n.href} className={styles.next}>
      <span className={styles.mono}>{UI[lang].suivant}</span>
      <span className={styles.nextTitle}>{n.titre}</span>
      <span className={styles.nextMedia} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {(n.image ?? n.poster) && <img src={n.image ?? n.poster} alt="" loading="lazy" />}
      </span>
    </Link>
  );
}

/** page d'un projet du portfolio (étude de cas, films, ou Lithic Memory) */
export default function ProjetPage({ p, lang }: { p: Projet; lang: Lang }) {
  const autre = chemins(lang === "fr" ? "en" : "fr").projet(p.slug);
  return (
    <div className={styles.page} lang={lang}>
      <KNav lang={lang} alt={autre} />
      <main>
        {p.kind === "etude" && <Etude p={p} lang={lang} />}
        {p.kind === "films" && <Films p={p} lang={lang} />}
        {p.kind === "lithic" && <Lithic p={p} lang={lang} />}
        <Suivant p={p} lang={lang} />
      </main>
      <KFooter lang={lang} />
    </div>
  );
}
