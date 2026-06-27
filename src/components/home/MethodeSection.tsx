import Link from "next/link";
import styles from "./Methode.module.css";

interface Phase {
  num: string;
  title: string;
  text: string;
}

const PHASES: Phase[] = [
  {
    num: "01",
    title: "Lecture.",
    text: "Avant de proposer quoi que ce soit, on regarde. Le terrain, le marché, les concurrents, l'histoire qu'on nous raconte et celle qu'on ne nous dit pas. On lit ce qui est déjà là — parce qu'une marque existe rarement à partir de rien, et que le travail commence par le comprendre.",
  },
  {
    num: "02",
    title: "Direction.",
    text: "On choisit un angle, et on le défend. Pas un éventail d'options pour se couvrir — une piste, parfois deux, jamais cinq. C'est le moment des décisions : ce qu'on garde, ce qu'on écarte, la direction qu'on assume avant de fabriquer.",
  },
  {
    num: "03",
    title: "Fabrication.",
    text: "C'est ici que passe la moitié du temps, et ce n'est pas un hasard. Une bonne idée mal exécutée ne vaut rien. On fait les choses jusqu'au bout — l'identité, le web, les objets, les images — avec l'attention d'un atelier, pas d'une usine.",
  },
  {
    num: "04",
    title: "Application.",
    text: "On livre, et on s'assure que ça tienne sans nous. Les fichiers, les règles, ce qu'il faut pour continuer seul. Le bon travail ne crée pas de dépendance — il laisse le client autonome pour la suite.",
  },
];

/**
 * Section Méthode (accueil) — squelette statique pour l'instant : 4 phases
 * empilées (30vh chacune), numéro typographique massif en ancrage de
 * chapitrage à gauche, titre + texte court à droite. Animations GSAP/Framer
 * Motion ajoutées dans une passe suivante.
 */
export default function MethodeSection() {
  return (
    <section className={styles.methode} data-theme="light">
      {PHASES.map((p) => (
        <div className={styles.phase} key={p.num} data-phase>
          <span className={styles.num}>[{p.num}]</span>
          <div className={styles.body}>
            <h3 className={styles.title}>{p.title}</h3>
            <p className={styles.text}>{p.text}</p>
          </div>
        </div>
      ))}
      <div className={styles.cta}>
        <Link href="/studio">→ La méthode en détail</Link>
      </div>
    </section>
  );
}
