import type { Metadata } from "next";
import OffresPage from "@/components/offres/OffresPage";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Offres",
  description:
    "Deux portes d’entrée : des programmes complets ou des offres ciblées en identité, web, film et contenu.",
};

export default function Page() {
  // aperçu des travaux : les quatre premières études de cas publiées
  const cases = getAllProjects()
    .slice(0, 4)
    .map(({ meta }) => ({
      slug: meta.slug,
      titre: meta.titre,
      sousTitre: meta.sousTitre,
      secteur: meta.secteur,
      champs: meta.champs,
    }));
  return <OffresPage cases={cases} />;
}
