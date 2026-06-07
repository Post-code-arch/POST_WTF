import { notFound } from "next/navigation";
import type { Metadata } from "next";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import Nav from "@/components/Nav";
import {
  Hero,
  HeroImage,
  Section,
  Did,
  Details,
  Media,
  MediaDuo,
  Manifesto,
  Testimonial,
  NextCase,
} from "@/components/project";
import {
  getProjectSlugs,
  getProjectSource,
  type ProjectMeta,
} from "@/lib/projects";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const source = getProjectSource(slug);
  if (!source) return {};
  const { data } = matter(source);
  const meta = data as ProjectMeta;
  return {
    title: meta.titre,
    description: meta.sousTitre,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const source = getProjectSource(slug);
  if (!source) notFound();

  const meta = matter(source).data as ProjectMeta;
  const { visuels } = meta;

  // Composants MDX, liés au frontmatter (visuels / méta du projet).
  const components = {
    Section,
    Did,
    Manifesto,
    Details: () => <Details meta={meta} />,
    Media: ({ n }: { n: number }) => <Media n={n} visuals={visuels} />,
    MediaDuo: ({ a, b }: { a: number; b: number }) => (
      <MediaDuo a={a} b={b} visuals={visuels} />
    ),
  };

  const { content } = await compileMDX({
    source,
    components,
    options: { parseFrontmatter: true },
  });

  return (
    <>
      <Nav />
      <main>
        <Hero titre={meta.titre} sousTitre={meta.sousTitre} />
        <HeroImage visuals={visuels} />
        {content}
        <Testimonial
          citation={meta.temoignage.citation}
          source={meta.temoignage.source}
        />
        <NextCase titre={meta.suivant.titre} slug={meta.suivant.slug} />
      </main>
    </>
  );
}
