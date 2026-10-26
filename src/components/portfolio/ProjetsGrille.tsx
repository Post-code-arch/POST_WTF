"use client";

import { useState } from "react";
import Carte from "./Carte";
import type { Carte as CarteData } from "@/lib/kamilProjets";
import styles from "./Portfolio.module.css";

/** grille des projets avec barre de filtres par discipline */
export default function ProjetsGrille({
  cartes,
  filtres,
  labels,
}: {
  cartes: CarteData[];
  filtres: { key: string; label: string }[];
  labels: { filtrer: string; tous: string };
}) {
  const [actif, setActif] = useState<string | null>(null);
  const visibles = actif ? cartes.filter((c) => (c.filtres as string[]).includes(actif)) : cartes;
  return (
    <>
      <div className={styles.filters}>
        <span className={styles.mono}>{labels.filtrer}</span>
        <ul>
          <li>
            <button
              type="button"
              className={actif === null ? styles.on : undefined}
              aria-pressed={actif === null}
              onClick={() => setActif(null)}
            >
              {labels.tous} <sup>{cartes.length}</sup>
            </button>
          </li>
          {filtres.map((f) => (
            <li key={f.key}>
              <button
                type="button"
                className={actif === f.key ? styles.on : undefined}
                aria-pressed={actif === f.key}
                onClick={() => setActif((a) => (a === f.key ? null : f.key))}
              >
                {f.label}{" "}
                <sup>{cartes.filter((c) => (c.filtres as string[]).includes(f.key)).length}</sup>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className={styles.grid}>
        {visibles.map((c) => (
          <Carte key={c.slug} c={c} />
        ))}
      </div>
    </>
  );
}
