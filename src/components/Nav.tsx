import Link from "next/link";
import KinayaLogo from "./KinayaLogo";

/**
 * Nav fixe, en mix-blend-mode:difference — s'inverse selon le fond.
 * (La version theme-aware de l'accueil viendra plus tard.)
 */
export default function Nav() {
  return (
    <nav className="nav">
      <Link href="/" className="logo" aria-label="KINAYA — accueil">
        <KinayaLogo />
      </Link>
      <div className="nav-r">
        <Link href="/studio">Studio</Link>
        <Link href="/travaux">Travaux</Link>
        <Link href="/contact">Contact</Link>
      </div>
    </nav>
  );
}
