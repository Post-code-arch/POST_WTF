"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import KinayaLogo from "./KinayaLogo";
import styles from "./Nav.module.css";

const LINKS: [string, string][] = [
  ["/travaux", "Travaux"],
  ["/services", "Champs"],
  ["/about", "À propos"],
  ["/contact", "Contact"],
];

/**
 * Nav desktop partagée (logo · Travaux · Champs · À propos … Contact),
 * fixe + mix-blend. Sur mobile : burger → overlay plein écran.
 */
export default function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo} aria-label="KINAYA — accueil">
          <KinayaLogo />
        </Link>
        <div className={styles.links}>
          <Link href="/travaux">Travaux</Link>
          <Link href="/services">Champs</Link>
          <Link href="/about">À propos</Link>
        </div>
        <Link href="/contact" className={styles.contact}>
          Contact
        </Link>
        <button
          type="button"
          className={styles.burger}
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <span />
          <span />
        </button>
      </nav>

      <div
        className={`${styles.overlay} ${open ? styles.open : ""}`}
        aria-hidden={!open}
      >
        <button
          type="button"
          className={styles.close}
          aria-label="Fermer le menu"
          onClick={() => setOpen(false)}
        >
          ✕
        </button>
        <ul className={styles.menu}>
          {LINKS.map(([href, label]) => (
            <li key={href}>
              <Link href={href} onClick={() => setOpen(false)}>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
