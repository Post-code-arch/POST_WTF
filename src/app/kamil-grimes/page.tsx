import type { Metadata } from "next";
import Portfolio, { type PortfolioCase } from "@/components/portfolio/Portfolio";
import { getProject } from "@/lib/projects";
import { travaux } from "@/lib/kamil";

// page non référencée : hors menu, et exclue des moteurs de recherche
export const metadata: Metadata = {
  title: { absolute: "Kamil Grimes — Portfolio" },
  description: "Directeur créatif, producteur et artiste visuel basé à Alger.",
  robots: { index: false, follow: false },
};

export default function Page() {
  const cases: PortfolioCase[] = travaux.flatMap(({ slug, role, annee }) => {
    const p = getProject(slug);
    if (!p || p.meta.brouillon) return [];
    const hero = p.visuals.find((v) => v.slot === "hero" && !v.isVideo && !/-hero-mobile\./.test(v.src));
    // bandeau : trois visuels d'application / fabrication, hors vidéos
    const strip = p.visuals
      .filter((v) => !v.isVideo && (v.slot === "application" || v.slot === "fabrication"))
      .slice(0, 3)
      .map((v) => v.src);
    return [
      {
        slug,
        titre: p.meta.titre,
        sousTitre: p.meta.sousTitre,
        secteur: p.meta.secteur,
        role,
        annee,
        hero: hero?.src,
        strip,
      },
    ];
  });
  return <Portfolio cases={cases} />;
}
