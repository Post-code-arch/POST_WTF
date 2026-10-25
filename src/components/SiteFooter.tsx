import POSTLogo from "@/components/POSTLogo";
import styles from "./SiteFooter.module.css";

/** Pied de page des pages intérieures (blanc cassé sur noir doux). */
export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footTop}>
        <div className={styles.l}>
          <span>
            <span className={styles.sq} />
            Instagram
          </span>
          <span>
            <span className={styles.sq} />
            Youtube
          </span>
        </div>
        <div className={styles.c}>
          +213 540 87 73 98
          <br />
          wearepostagency@gmail.com
        </div>
        <div className={styles.r}>
          08, Rue Didouche Mourad, 2ème étage, Bureau 09
          <br />
          16000 Alger, Algérie
        </div>
      </div>
      <div className={styles.footLogo}>
        <POSTLogo />
      </div>
    </footer>
  );
}
