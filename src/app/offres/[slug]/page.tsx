import { notFound } from "next/navigation";
import type { Metadata } from "next";
import OffrePage from "@/components/offres/OffrePage";
import { offres, getOffre } from "@/lib/offres";
import { getProject } from "@/lib/projects";
import { works } from "@/lib/works";

export const dynamicParams = false;

export function generateStaticParams() {
  return offres.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const offre = getOffre(slug);
  if (!offre) return {};
  return { title: offre.nom, description: offre.carte };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const offre = getOffre(slug);
  if (!offre) notFound();

  // études de cas liées : slugs explicites (dans l'ordre donné) ou filtre
  // sur les livrables (`champs`) des fiches — brouillons exclus
  const linked =
    "slugs" in offre.travaux
      ? offre.travaux.slugs
          .map((s) => works.find((w) => w.slug === s))
          .filter((w) => w !== undefined)
      : works.filter((w) =>
          w.categories.some((c) => (offre.travaux as { champs: RegExp }).champs.test(c))
        );

  // références : un slug d'étude de cas devient son titre (lien si publiée,
  // masqué si brouillon) ; tout autre nom s'affiche tel quel
  const references = offre.references
    ? offre.references.flatMap((ref) => {
        const p = getProject(ref);
        if (!p) return [{ nom: ref }];
        if (p.meta.brouillon) return [];
        return [{ nom: p.meta.titre, href: `/travaux/${ref}` }];
      })
    : null;

  return <OffrePage offre={offre} works={linked} references={references} />;
}
