import Nav from "@/components/Nav";
import ContactForm from "./ContactForm";
import styles from "./Contact.module.css";

export default function Contact() {
  return (
    <main className={styles.contact}>
      <Nav />

      <div className={styles.grid}>
        {/* colonne gauche : intro + coordonnées */}
        <aside className={styles.intro}>
          <span className={styles.kicker}>(Contact)</span>
          <h1 className={styles.title}>Travaillons ensemble.</h1>
          <p className={styles.lead}>
            Un projet, une intuition, une question. Écrivez-nous — on lit tout,
            et on répond.
          </p>

          <div className={styles.meta}>
            <div className={styles.row}>
              <span className={styles.k}>Atelier</span>
              <span>
                25 Rabah Bourbia
                <br />
                El Biar, Alger
              </span>
            </div>
            <div className={styles.row}>
              <span className={styles.k}>Mail</span>
              <span>
                <a href="mailto:contact@kinaya.wtf">contact@kinaya.wtf</a>
              </span>
            </div>
            <div className={styles.row}>
              <span className={styles.k}>Tél</span>
              <span>+213 540 87 73 98</span>
            </div>
          </div>
        </aside>

        {/* colonne droite : formulaire */}
        <div className={styles.formCol}>
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
