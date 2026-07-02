import Nav from "@/components/Nav";
import KinayaLogo from "@/components/KinayaLogo";
import type { Service } from "@/lib/services";
import RippleImage from "./RippleImage";
import styles from "./Services.module.css";

/**
 * Page Services — fond neutre, une image 4:5 en tête de chaque service qui
 * ondule au passage de la souris (RippleImage / WebGL), puis le chapitrage
 * (numéro, nom, phrase, champs) en dessous.
 */
export default function ServicesPage({ services }: { services: Service[] }) {
  return (
    <div className={styles.page}>
      <Nav />

      <header className={styles.intro}>
        <span className={styles.kicker}>(Nos services)</span>
        <h1 className={styles.introTitle}>
          Quatre façons de travailler la même exigence.
        </h1>
      </header>

      <div className={styles.list}>
        {services.map((s) => (
          <section key={s.num} className={styles.service}>
            <div className={styles.media}>
              {s.image && <RippleImage src={s.image} alt={s.name} />}
            </div>
            <div className={styles.meta}>
              <div className={styles.head}>
                <span className={styles.num}>{s.num}</span>
                <h2 className={styles.title}>{s.name}</h2>
              </div>
              <p className={styles.line}>{s.line}</p>
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
            contact@kinaya.wtf
          </div>
          <div className={styles.r}>
            25 Rabah Bourbia,
            <br />
            El Biar, Alger
          </div>
        </div>
        <div className={styles.footLogo}>
          <KinayaLogo />
        </div>
      </footer>
    </div>
  );
}
