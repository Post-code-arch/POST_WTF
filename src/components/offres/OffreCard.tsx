import Link from "next/link";
import type { Offre } from "@/lib/offres";
import { typo } from "@/lib/typo";
import styles from "./Offres.module.css";

export default function OffreCard({ offre }: { offre: Offre }) {
  return (
    <article className={styles.card}>
      <h3 className={styles.cardName}>{offre.nom}</h3>
      <p className={styles.body}>{typo(offre.carte)}</p>
      <Link href={`/offres/${offre.slug}`} className={styles.link}>
        Découvrir →
      </Link>
    </article>
  );
}
