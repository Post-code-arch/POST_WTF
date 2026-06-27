import { notFound } from "next/navigation";
import { Fragment, type ReactNode } from "react";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import {
  Hero,
  Section,
  Details,
  Media,
  Gallery,
  Manifesto,
  Testimonial,
  NextCase,
} from "@/components/project";
import {
  getProject,
  getProjectSlugs,
  SECTION_VISUAL_SLOT,
} from "@/lib/projects";

export const dynamicParams = false;

/** rendu inline minimal : **gras** et *italique* */
function inline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  let last = 0;
  let key = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1] !== undefined) nodes.push(<strong key={key++}>{m[1]}</strong>);
    else nodes.push(<em key={key++}>{m[2]}</em>);
    last = re.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.meta.titre,
    description: project.meta.sousTitre,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const { meta, sections, visuals } = project;
  const hero = visuals.find((v) => v.slot === "hero") ?? visuals[0];
  const assets = visuals.filter((v) => v.slot === "asset");
  const nextProject = meta.suivant ? getProject(meta.suivant.slug) : null;
  const nextHero = nextProject
    ? nextProject.visuals.find((v) => v.slot === "hero") ??
      nextProject.visuals[0]
    : undefined;

  return (
    <>
      <Nav />
      <main>
        <Hero titre={meta.titre} sousTitre={meta.sousTitre} hero={hero} />

        {sections.map((s, i) => {
          const sectionVisuals = visuals.filter(
            (v) => v.slot === SECTION_VISUAL_SLOT[s.bloc]
          );
          return (
            <Fragment key={s.bloc}>
              <Section
                num={String(i + 1).padStart(2, "0")}
                kicker={s.kicker}
                heading={s.heading}
              >
                {s.body.map((para, k) => (
                  <p key={k}>{inline(para)}</p>
                ))}
                {s.bloc === "lecture" && <Details meta={meta} />}
              </Section>
              {sectionVisuals.length === 1 ? (
                <Media v={sectionVisuals[0]} />
              ) : sectionVisuals.length > 1 ? (
                <Gallery visuals={sectionVisuals} />
              ) : null}
            </Fragment>
          );
        })}

        {assets.length === 1 ? (
          <Media v={assets[0]} />
        ) : assets.length > 1 ? (
          <Gallery visuals={assets} />
        ) : null}

        {meta.ideeDirectrice && <Manifesto>{meta.ideeDirectrice}</Manifesto>}
        {meta.temoignage && (
          <Testimonial
            citation={meta.temoignage.citation}
            source={meta.temoignage.source}
          />
        )}
        {meta.suivant && (
          <NextCase
            titre={meta.suivant.titre}
            slug={meta.suivant.slug}
            preview={nextHero}
          />
        )}
      </main>
    </>
  );
}
