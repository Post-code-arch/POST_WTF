import { notFound } from "next/navigation";
import ProjetPage from "@/components/portfolio/ProjetPage";
import { projets } from "@/lib/kamil";
import { getProjetKamil } from "@/lib/kamilProjets";
import { metaProjet } from "@/lib/kamilMeta";

const LANG = "fr" as const;

export const dynamicParams = false;

export function generateStaticParams() {
  return projets.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  return metaProjet((await params).slug, LANG);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const p = getProjetKamil((await params).slug);
  if (!p) notFound();
  return <ProjetPage p={p} lang={LANG} />;
}
