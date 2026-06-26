import { notFound } from "next/navigation";
import { Fragment } from "react";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import {
  Hero,
  Section,
  Details,
  Media,
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
                  <p key={k}>{para}</p>
                ))}
                {s.bloc === "lecture" && <Details meta={meta} />}
              </Section>
              {sectionVisuals.map((v) => (
                <Media key={v.src} v={v} />
              ))}
            </Fragment>
          );
        })}

        {assets.map((v) => (
          <Media key={v.src} v={v} />
        ))}

        {meta.ideeDirectrice && <Manifesto>{meta.ideeDirectrice}</Manifesto>}
        {meta.temoignage && (
          <Testimonial
            citation={meta.temoignage.citation}
            source={meta.temoignage.source}
          />
        )}
        {meta.suivant && (
          <NextCase titre={meta.suivant.titre} slug={meta.suivant.slug} />
        )}
      </main>
    </>
  );
}
