import Link from "next/link";
import KinayaLogo from "./KinayaLogo";
import styles from "./Nav.module.css";

/**
 * Nav desktop partagée (toutes les pages) :
 * logo à gauche · Travaux · Champs · À propos … Contact à droite.
 * Fixe, s'adapte au fond via mix-blend-mode.
 */
export default function Nav() {
  return (
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
    </nav>
  );
}
