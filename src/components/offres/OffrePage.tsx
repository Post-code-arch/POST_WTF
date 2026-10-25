import Link from "next/link";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/SiteFooter";
import WorkGrid from "@/components/home/WorkGrid";
import { getOffre, rdvHref, type Offre } from "@/lib/offres";
import type { Work } from "@/lib/works";
import { typo } from "@/lib/typo";
import Todo, { SHOW_TODO } from "@/components/Todo";
import styles from "./Offres.module.css";

const TEMPS = [
  ["lecture", "Lecture"],
  ["direction", "Direction"],
  ["fabrication", "Fabrication"],
  ["application", "Application"],
] as const;

/** une section n'est rendue que si elle a du contenu, ou en dev (repère TODO) */
const show = (v: unknown) => v != null || SHOW_TODO;

/**
 * Gabarit commun des pages programme / offre :
 * hero · « Quand… » · références · ce que ça change · travaux ·
 * comment on travaille · en pratique · clôture.
 */
export default function OffrePage({
  offre,
  works,
  references,
}: {
  offre: Offre;
  /** études de cas liées (déjà filtrées) */
  works: Work[];
  /** références résolues (noms + lien éventuel) ; null = à fournir */
  references: { nom: string; href?: string }[] | null;
}) {
  const { quand, process, pratique } = offre;
  const isProgramme = offre.kind === "programme";
  const parents = (offre.programmes ?? [])
    .map(getOffre)
    .filter((p): p is Offre => !!p);
  const processEmpty = TEMPS.every(([k]) => process[k] == null);

  return (
    <div className={styles.page}>
      <Nav />

      {/* 1 — hero */}
      <header className={styles.head}>
        <span className={styles.kicker}>
          ({isProgramme ? "Programme" : "Offre"})
        </span>
        <h1 className={styles.name}>{offre.nom}</h1>
        <div className={styles.rule} />
        {offre.accroche && (
          <p className={styles.sub}>{typo(`« ${offre.accroche} »`)}</p>
        )}
        <p className={styles.line}>{typo(offre.promesse)}</p>
        {offre.mention && <p className={styles.mention}>{offre.mention}</p>}
        <div className={styles.actions}>
          <a href="#quand" className={styles.link}>
            Découvrir
          </a>
          <Link href={rdvHref(offre.slug)} className={styles.btn}>
            Demander un rendez-vous
          </Link>
        </div>
      </header>

      {/* ancre du bouton « Découvrir » — toujours présente, même si la
          section 2 est encore à rédiger */}
      <div id="quand" />

      {/* 2 — quand… */}
      {show(quand.titre) && (
        <section className={styles.sec}>
          <div className={styles.split}>
            <h2 className={styles.secTitle}>
              {quand.titre ? typo(quand.titre) : <Todo label="titre-problème" />}
            </h2>
            <div>
              {quand.texte ? (
                <p className={styles.body}>{typo(quand.texte)}</p>
              ) : (
                <Todo label="deux phrases" />
              )}
              {quand.signes ? (
                <ul className={styles.list}>
                  {quand.signes.map((s) => (
                    <li key={s}>{typo(s)}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ marginTop: 12 }}>
                  <Todo label="4 à 5 signes" />
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 3 — références */}
      {show(references) && (references === null || references.length > 0) && (
        <section className={styles.sec}>
          <span className={styles.kicker}>Références</span>
          {references ? (
            <div className={styles.refs}>
              {references.map((r) =>
                r.href ? (
                  <Link key={r.nom} href={r.href}>
                    {r.nom}
                  </Link>
                ) : (
                  <span key={r.nom}>{r.nom}</span>
                )
              )}
            </div>
          ) : (
            <p style={{ marginTop: 12 }}>
              <Todo label="références" />
            </p>
          )}
        </section>
      )}

      {/* 4 — ce que ça change */}
      {show(offre.changements) && (
        <section className={styles.sec}>
          <h2 className={styles.secTitle}>{typo("Ce que ça change")}</h2>
          {offre.changements ? (
            <div className={styles.results}>
              {offre.changements.map((c, i) => (
                <p key={c}>
                  <span>0{i + 1}</span>
                  {typo(c)}
                </p>
              ))}
            </div>
          ) : (
            <p style={{ marginTop: 12 }}>
              <Todo label="trois résultats" />
            </p>
          )}
        </section>
      )}

      {/* 5 — travaux liés */}
      {(works.length > 0 || SHOW_TODO) && (
        <section className={styles.sec}>
          <span className={styles.kicker}>Travaux</span>
          {works.length > 0 ? (
            <div style={{ marginTop: "clamp(22px, 3.4vh, 40px)" }}>
              <WorkGrid items={works} />
            </div>
          ) : (
            <p style={{ marginTop: 12 }}>
              <Todo label="études de cas liées" />
            </p>
          )}
        </section>
      )}

      {/* 6 — comment on travaille */}
      {(!processEmpty || SHOW_TODO) && (
        <section className={styles.sec}>
          <h2 className={styles.secTitle}>Comment on travaille</h2>
          <div className={styles.steps}>
            {TEMPS.map(([k, label], i) =>
              process[k] || SHOW_TODO ? (
                <div key={k} className={styles.row}>
                  <span className={styles.n}>
                    0{i + 1} {label}
                  </span>
                  <span>
                    {process[k] ? typo(process[k]!) : <Todo label="une phrase" />}
                  </span>
                </div>
              ) : null
            )}
          </div>
        </section>
      )}

      {/* 7 — en pratique */}
      <section className={styles.sec}>
        <h2 className={styles.secTitle}>En pratique</h2>
        <div className={styles.rows}>
          {(
            [
              ["Pour qui", pratique.pourQui],
              ["Ce qu'on demande à la direction", pratique.demande],
              ["Ce qui est livré", pratique.livre],
            ] as const
          ).map(([k, v]) => {
            const detail = k === "Ce qui est livré" ? offre.livrables : undefined;
            if (!show(v) && !detail) return null;
            return (
              <div key={k} className={styles.row}>
                <span className={styles.k}>{typo(k)}</span>
                <div>
                  {/* le détail des livrables remplace le résumé quand il existe */}
                  {!detail && (v ? <p>{typo(v)}</p> : <Todo label="à rédiger" />)}
                  {detail && (
                    <div className={styles.deliv}>
                      {detail.map((g) => (
                        <div key={g.groupe}>
                          <h3 className={styles.delivHead}>{g.groupe}</h3>
                          <ul>
                            {g.items.map((it) => (
                              <li key={it}>{typo(it)}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8 — clôture */}
      <section className={`${styles.dark} ${styles.closing}`}>
        <h2 className={styles.secTitle}>
          {offre.cloture ? typo(offre.cloture) : SHOW_TODO ? <Todo label="question de clôture" /> : "Parlons-en."}
        </h2>
        <div className={styles.actions}>
          <Link href={rdvHref(offre.slug)} className={styles.btn}>
            Demander un rendez-vous
          </Link>
        </div>
        {parents.length > 0 && (
          <p className={styles.note}>
            {parents.length === 1 ? "Cette offre fait partie du programme " : "Cette offre fait partie des programmes "}
            {parents.map((p, i) => (
              <span key={p.slug}>
                {i > 0 && " et "}
                <Link href={`/offres/${p.slug}`}>{p.nom}</Link>
              </span>
            ))}
            .
          </p>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
