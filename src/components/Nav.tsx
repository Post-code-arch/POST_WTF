"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import POSTLogo from "./POSTLogo";
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
  const pathname = usePathname();
  const isHome = pathname === "/";
  // sur l'accueil, les liens n'apparaissent qu'une fois le logo « calé » dans
  // la nav (événement émis par HeroLogoTravel). Ailleurs : visibles d'emblée.
  const [docked, setDocked] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setDocked(true);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDocked(true);
      return;
    }
    setDocked(false);
    const onDock = (e: Event) =>
      setDocked((e as CustomEvent<boolean>).detail === true);
    window.addEventListener("post:dock", onDock);
    return () => window.removeEventListener("post:dock", onDock);
  }, [isHome]);

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
        <Link
          href="/"
          className={styles.logo}
          aria-label="POST — accueil"
          data-nav-logo
        >
          <POSTLogo />
        </Link>
        <div className={`${styles.links} ${docked ? "" : styles.hidden}`}>
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
