import Link from "next/link";
import Nav from "@/components/Nav";
import POSTLogo from "@/components/POSTLogo";
import type { Service } from "@/lib/services";
import RippleImage from "./RippleImage";
import styles from "./Services.module.css";

/**
 * Page Services — empilement au scroll (sticky stacking) : chaque service est
 * un panneau plein écran, opaque, qui glisse par-dessus le précédent. En tête
 * de chaque panneau, le nom (gauche) et le numéro (droite) en grand ; en
 * dessous, l'accroche, le paragraphe, les champs et l'image (ondulation souris).
 */
export default function ServicesPage({ services }: { services: Service[] }) {
  return (
    <div className={styles.page}>
      <Nav />

      <div className={styles.stack}>
        {services.map((s) => (
          <section key={s.num} className={styles.panel}>
            <div className={styles.pHead}>
              <h2 className={styles.name}>{s.name}</h2>
              <span className={styles.num}>{s.num}</span>
            </div>
            <div className={styles.rule} />

            <div className={styles.pMain}>
              <div className={styles.pCol}>
                <p className={styles.line}>{s.line}</p>
                <p className={styles.body}>{s.body}</p>
                <div className={styles.tags}>
                  <ul>
                    {s.tagsLeft.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <ul>
                    {s.tagsRight.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
                <Link href="/contact" className={styles.inquire}>
                  Écrire →
                </Link>
              </div>

              <div className={styles.media}>
                {s.image && <RippleImage src={s.image} alt={s.name} />}
              </div>
            </div>
          </section>
        ))}
      </div>

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
            25 Rabah Bourbia,
            <br />
            El Biar, Alger
          </div>
        </div>
        <div className={styles.footLogo}>
          <POSTLogo />
        </div>
      </footer>
    </div>
  );
}
