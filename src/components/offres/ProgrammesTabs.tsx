"use client";

import { useState } from "react";
import Link from "next/link";
import type { OffreClient } from "@/lib/offres";
import { typo } from "@/lib/typo";
import styles from "./OffresIndex.module.css";

/**
 * Porte 1 — les programmes en panneau à onglets : un onglet par programme,
 * le contenu du programme actif en dessous (nom, promesse, situation, pour qui).
 */
export default function ProgrammesTabs({ items }: { items: OffreClient[] }) {
  const [active, setActive] = useState(0);
  const p = items[active];

  return (
    <div className={styles.panel}>
      <div className={styles.tabs} role="tablist" aria-label="Programmes">
        {items.map((o, i) => (
          <button
            key={o.slug}
            type="button"
            role="tab"
            id={`tab-${o.slug}`}
            aria-selected={i === active}
            aria-controls={`panel-${o.slug}`}
            className={`${styles.tab} ${i === active ? styles.tabOn : ""}`}
            onClick={() => setActive(i)}
          >
            <span className={styles.tabNum}>0{i + 1}</span>
            {o.nom}
          </button>
        ))}
      </div>

      <div
        className={styles.panelBody}
        role="tabpanel"
        id={`panel-${p.slug}`}
        aria-labelledby={`tab-${p.slug}`}
      >
        <span className={styles.mono}>Programme 0{active + 1}</span>
        <h3 className={styles.panelTitle}>{p.nom}</h3>
        <div className={styles.panelRule} />
        <div className={styles.panelCols}>
          <p className={styles.panelLead}>{typo(p.promesse)}</p>
          <div className={styles.panelSide}>
            {p.quand.texte && <p>{typo(p.quand.texte)}</p>}
            {p.pratique.pourQui && (
              <p>
                <span className={styles.mono}>Pour qui</span>
                <br />
                {typo(p.pratique.pourQui)}
              </p>
            )}
            <Link href={`/offres/${p.slug}`} className={styles.arrowLink}>
              <span className={styles.arrow} aria-hidden>
                →
              </span>
              Découvrir le programme
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
