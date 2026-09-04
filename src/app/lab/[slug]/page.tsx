import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLabPieces, getLabPiece, getLabPieceSlugs } from "@/lib/lab";
import LabProjectPage from "@/components/lab/LabProjectPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return getLabPieceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const piece = getLabPiece(slug);
  if (!piece) return {};
  return {
    title: piece.title,
    description: piece.note,
    robots: { index: false, follow: false },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const piece = getLabPiece(slug);
  if (!piece) notFound();

  const pieces = getLabPieces();
  const i = pieces.findIndex((p) => p.slug === slug);
  const next = pieces[(i + 1) % pieces.length];

  return <LabProjectPage piece={piece} next={next} />;
}
