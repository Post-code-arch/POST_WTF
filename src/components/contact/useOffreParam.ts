"use client";

import { useSearchParams } from "next/navigation";
import { getOffre, type Offre } from "@/lib/offres";

/** offre ou programme passé dans l'URL (/contact?offre=<slug>), s'il existe */
export function useOffreParam(): Offre | undefined {
  const slug = useSearchParams().get("offre");
  return slug ? getOffre(slug) : undefined;
}

/** type de projet du formulaire correspondant à une offre */
export const typeForOffre = (o: Offre) =>
  o.kind === "programme" ? "Programme" : o.nom;
