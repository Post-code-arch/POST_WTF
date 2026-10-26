import Link from "next/link";
import { identite, roles, chemins, UI, tx, type Lang } from "@/lib/kamil";
import styles from "./Portfolio.module.css";

/** nav fixe : nom · Projets / Parcours / Contact · FR / EN.
 *  `alt` : la même page dans l'autre langue. */
export function KNav({ lang, alt }: { lang: Lang; alt: string }) {
  const c = chemins(lang);
  const ui = UI[lang];
  const fr = lang === "fr" ? undefined : alt;
  const en = lang === "en" ? undefined : alt;
  return (
    <nav className={styles.nav}>
      <Link href={c.home} className={styles.navName}>
        {identite.nom}
      </Link>
      <div className={styles.navLinks}>
        <Link href={c.projets}>{ui.projets}</Link>
        <Link href={`${c.home}#parcours`} className={styles.navHideM}>
          {ui.parcours}
        </Link>
        <Link href={`${c.home}#contact`}>{ui.contact}</Link>
      </div>
      <div className={styles.navLang}>
        {fr ? <Link href={fr} hrefLang="fr">FR</Link> : <span aria-current="true">FR</span>}
        <i>/</i>
        {en ? <Link href={en} hrefLang="en">EN</Link> : <span aria-current="true">EN</span>}
      </div>
    </nav>
  );
}

export function KFooter({ lang }: { lang: Lang }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footTop}>
        <span>{identite.nomComplet}</span>
        <span>{roles.map((r) => r.titre[lang]).join(" · ")}</span>
        <span>{UI[lang].lieu}</span>
      </div>
      <div className={styles.footName} aria-hidden>
        {identite.nom}
      </div>
    </footer>
  );
}

/** contact (fond sombre) — accueil */
export function KContact({ lang }: { lang: Lang }) {
  const ui = UI[lang];
  return (
    <section className={styles.contact} id="contact">
      <h2 className={styles.contactTitle}>{tx(ui.travaillons, lang)}</h2>
      <div className={styles.contactRows}>
        <div>
          <span className={styles.mono}>{ui.nom}</span>
          <span>{identite.nomComplet}</span>
        </div>
        <div>
          <span className={styles.mono}>{ui.tel}</span>
          <a href={`tel:${identite.tel.replace(/\s/g, "")}`}>{identite.tel}</a>
        </div>
        {identite.mail && (
          <div>
            <span className={styles.mono}>{ui.mail}</span>
            <a href={`mailto:${identite.mail}`}>{identite.mail}</a>
          </div>
        )}
        <div>
          <span className={styles.mono}>{ui.ville}</span>
          <span>{ui.lieu}</span>
        </div>
      </div>
    </section>
  );
}
