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
  getPublishedSlugs,
  SECTION_VISUAL_SLOT,
  type Visual,
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
  return getPublishedSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project || project.meta.brouillon) return {};
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
  if (!project || project.meta.brouillon) notFound();

  const { meta, sections, visuals } = project;
  // variante portrait optionnelle du hero : fichier « NN-hero-mobile.ext »
  const isMobileHero = (v: Visual) => /-hero-mobile\.[a-z0-9]+$/i.test(v.src);
  const heroMobile = visuals.find(isMobileHero);
  const hero =
    visuals.find((v) => v.slot === "hero" && !isMobileHero(v)) ?? visuals[0];
  const assets = visuals.filter((v) => v.slot === "asset");
  // Marpharmal : visuels agrandis, rangées de 2 max (pas de rangée de 3).
  const galleryPerRow = slug === "marpharmal" ? 2 : 3;
  // Certains visuels sortent du flux en rangées pour passer en pleine
  // largeur. `pos` place chaque visuel avant ou après la grille de sa
  // section. Marpharmal : badge + couvertures en fin ; Astarté : le banner
  // (billboard) en tête ; Fennec : paysages, sachet de profil, carte et
  // films en pleine largeur.
  const FULL_WIDTH: Record<string, { re: RegExp; pos: "before" | "after" }[]> = {
    marpharmal: [{ re: /(11-application-badge|12-application-programme)\.webp$/, pos: "after" }],
    "astarte-conseils": [{ re: /02-application-billboard\.webp$/, pos: "before" }],
    imlead: [{ re: /05-fabrication-social-stories\.webp$/, pos: "after" }],
    "fennec-coffee-roasters": [
      { re: /02-vibe-paysage-tassili\./, pos: "before" },
      { re: /0[45]-direction-tassili-/, pos: "before" },
      { re: /14-fabrication-carte-logo\./, pos: "after" },
      { re: /17-application-film-aures-nuit\./, pos: "before" },
      { re: /2[45]-application-film-tassili-sable-/, pos: "after" },
    ],
  };
  const fullWidth = FULL_WIDTH[slug] ?? [];
  const fullPos = (v: Visual) => fullWidth.find((c) => c.re.test(v.src))?.pos;
  const isFull = (v: Visual) => !!fullPos(v);
  const nextCandidate = meta.suivant ? getProject(meta.suivant.slug) : null;
  const nextProject = nextCandidate && !nextCandidate.meta.brouillon ? nextCandidate : null;
  const nextHero = nextProject
    ? nextProject.visuals.find((v) => v.slot === "hero" && !isMobileHero(v)) ??
      nextProject.visuals[0]
    : undefined;

  return (
    <>
      <Nav />
      <main>
        <Hero
          titre={meta.titre}
          sousTitre={meta.sousTitre}
          hero={hero}
          heroMobile={heroMobile}
        />

        {sections.map((s, i) => {
          const sectionVisuals = visuals.filter(
            (v) => v.slot === SECTION_VISUAL_SLOT[s.bloc]
          );
          const rowed = sectionVisuals.filter((v) => !isFull(v));
          const fullEls = (pos: "before" | "after") =>
            sectionVisuals
              .filter((v) => fullPos(v) === pos)
              .map((v) => <Media key={v.src} v={v} />);
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
              {fullEls("before")}
              {rowed.length === 1 ? (
                <Media v={rowed[0]} />
              ) : rowed.length > 1 ? (
                <Gallery visuals={rowed} maxPerRow={galleryPerRow} />
              ) : null}
              {fullEls("after")}
            </Fragment>
          );
        })}

        {assets.length === 1 ? (
          <Media v={assets[0]} />
        ) : assets.length > 1 ? (
          <Gallery visuals={assets} maxPerRow={galleryPerRow} />
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
