"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import type { Work } from "@/lib/works";
import { typo } from "@/lib/typo";
import styles from "./Work.module.css";

/**
 * Index des travaux — grille de cartes sur trois colonnes : grand visuel,
 * nom du projet, sa phrase, et ses étiquettes (secteur). Filtre par type
 * au-dessus de la grille.
 */
export default function WorkPage({ works }: { works: Work[] }) {
  const [filter, setFilter] = useState<string | null>(null);

  // disciplines présentes dans les projets, dans l'ordre de première apparition
  const filters = works.reduce<string[]>((acc, w) => {
    for (const d of w.disciplines) if (!acc.includes(d)) acc.push(d);
    return acc;
  }, []);
  const visible = filter ? works.filter((w) => w.disciplines.includes(filter)) : works;

  return (
    <div className={styles.work}>
      <Nav />
      <main className={styles.main}>
        <header className={styles.head}>
          <h1 className={styles.title}>Travaux</h1>
          <span className={styles.count}>
            ({String(visible.length).padStart(2, "0")})
          </span>
        </header>

        <div className={styles.filters}>
          <span className={styles.filterHead}>Type</span>
          <ul>
            <li>
              <button
                type="button"
                className={filter === null ? styles.on : undefined}
                aria-pressed={filter === null}
                onClick={() => setFilter(null)}
              >
                Tous
              </button>
            </li>
            {filters.map((f) => (
              <li key={f}>
                <button
                  type="button"
                  className={filter === f ? styles.on : undefined}
                  aria-pressed={filter === f}
                  onClick={() => setFilter((cur) => (cur === f ? null : f))}
                >
                  {f}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.grid}>
          {visible.map((w) => (
            <Link key={w.slug} href={`/travaux/${w.slug}`} className={styles.card}>
              <div className={styles.media} style={{ background: w.color }}>
                {w.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={w.image} alt={w.title} loading="lazy" />
                )}
              </div>
              <h2 className={styles.name}>{w.title}</h2>
              <p className={styles.line}>{typo(w.tagline)}</p>
              <ul className={styles.tags}>
                {w.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
                <li>{w.annee}</li>
              </ul>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
