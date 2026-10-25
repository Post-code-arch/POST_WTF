"use client";

import { useState } from "react";
import Link from "next/link";
import type { OffreClient } from "@/lib/offres";
import { typo } from "@/lib/typo";
import styles from "./OffresIndex.module.css";

/**
 * Porte 2 — les offres en mots empilés : chaque nom, en très grand, est
 * rogné par le filet de la ligne suivante ; l'offre ouverte se déplie
 * (nom entier, description, livrables, visuel).
 */
export default function OffresStack({ items }: { items: OffreClient[] }) {
  const [open, setOpen] = useState(0);

  return (
    <ol className={styles.stack}>
      {items.map((o, i) => {
        const isOpen = i === open;
        return (
          <li key={o.slug} className={`${styles.stackRow} ${isOpen ? styles.stackOpen : ""}`}>
            <button
              type="button"
              className={styles.stackHead}
              aria-expanded={isOpen}
              aria-controls={`offre-${o.slug}`}
              onClick={() => setOpen(i)}
            >
              <span className={styles.stackNum}>0{i + 1}</span>
              <span className={styles.stackWord}>{o.nom.toLowerCase()}</span>
            </button>

            <div id={`offre-${o.slug}`} className={styles.stackBody} hidden={!isOpen}>
              <div className={styles.stackText}>
                {o.accroche && (
                  <p className={styles.mono}>{typo(`« ${o.accroche} »`)}</p>
                )}
                <p className={styles.stackLead}>{typo(o.carte)}</p>
                {o.mention && <p className={styles.mono}>{o.mention}</p>}
                {o.livrables && (
                  <div className={styles.stackDeliv}>
                    <span className={styles.mono}>Ce qui est livré</span>
                    <div className={styles.stackGroups}>
                      {o.livrables.map((g) => (
                        <div key={g.groupe}>
                          <b>{g.groupe}</b>
                          <ul className={styles.stackList}>
                            {g.items.map((it) => (
                              <li key={it}>{typo(it)}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <Link href={`/offres/${o.slug}`} className={styles.arrowLink}>
                  <span className={styles.arrow} aria-hidden>
                    →
                  </span>
                  Découvrir l’offre {o.nom}
                </Link>
              </div>
              {o.visuel && (
                <div className={styles.stackMedia}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={o.visuel} alt="" loading="lazy" />
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
