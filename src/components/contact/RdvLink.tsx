"use client";

import { useOffreParam } from "./useOffreParam";

const MAIL = "wearepostagency@gmail.com";

/** lien principal « Demander un rendez-vous » — objet du mail prérempli
 *  avec l'offre d'origine quand l'URL en porte une */
export default function RdvLink({ className }: { className?: string }) {
  const offre = useOffreParam();
  const subject = offre
    ? `Demande de rendez-vous — ${offre.nom}`
    : "Demande de rendez-vous";
  return (
    <a
      className={className}
      href={`mailto:${MAIL}?subject=${encodeURIComponent(subject)}`}
    >
      Demander un rendez-vous
    </a>
  );
}
