import { notFound } from "next/navigation";
import { Fragment, type ReactNode } from "react";
import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Link from "next/link";
import StickyAside from "@/components/case/StickyAside";
import css from "@/components/case/Case.module.css";
import { typo } from "@/lib/typo";
import {
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
  FULL_WIDTH,
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
  const fullWidth = FULL_WIDTH[slug] ?? [];
  const fullPos = (v: Visual) => fullWidth.find((c) => c.re.test(v.src))?.pos;
  const isFull = (v: Visual) => !!fullPos(v);
  const nextCandidate = meta.suivant ? getProject(meta.suivant.slug) : null;
  const nextProject = nextCandidate && !nextCandidate.meta.brouillon ? nextCandidate : null;
  const nextHero = nextProject
    ? nextProject.visuals.find((v) => v.slot === "hero" && !isMobileHero(v)) ??
      nextProject.visuals[0]
    : undefined;

  const BLOC: Record<string, string> = {
    lecture: "Lecture",
    direction: "Direction",
    fabrication: "Fabrication",
    application: "Application",
  };
  // les supports (assets) se rangent à la suite de la dernière section
  const lastBloc = sections[sections.length - 1]?.bloc;
  const visualsFor = (bloc: string) => [
    ...visuals.filter((v) => v.slot === SECTION_VISUAL_SLOT[bloc as keyof typeof SECTION_VISUAL_SLOT]),
    ...(bloc === lastBloc ? assets : []),
  ];
  const visualColumn = (vs: Visual[]) => {
    const rowed = vs.filter((v) => !isFull(v));
    return (
      <>
        {vs.filter((v) => fullPos(v) === "before").map((v) => (
          <Media key={v.src} v={v} />
        ))}
        {rowed.length === 1 ? (
          <Media v={rowed[0]} />
        ) : rowed.length > 1 ? (
          <Gallery visuals={rowed} maxPerRow={2} />
        ) : null}
        {vs.filter((v) => fullPos(v) === "after").map((v) => (
          <Media key={v.src} v={v} />
        ))}
      </>
    );
  };
  const dossier: [string, ReactNode][] = [
    ["Type", meta.type],
    ["Secteur", meta.secteur],
    ...(meta.gamme ? [["Gamme", meta.gamme] as [string, ReactNode]] : []),
    ...(meta.marches ? [["Marchés", meta.marches] as [string, ReactNode]] : []),
    ["Année", String(meta.annee)],
    [
      "Livrables",
      meta.champs.map((c, i) => (
        <Fragment key={c}>
          {i > 0 && <span className={css.sep}>،</span>}
          {c}
        </Fragment>
      )),
    ],
    ...(meta.lien
      ? [
          [
            "Site",
            <a key="site" href={meta.lien} target="_blank" rel="noreferrer">
              {meta.lien.replace(/^https?:\/\//, "")}
            </a>,
          ] as [string, ReactNode],
        ]
      : []),
  ];

  return (
    <>
      <Nav />
      <main className={css.case}>
        {/* ouverture : visuel principal + présentation du projet */}
        <div className={css.row}>
          <div className={css.vis}>
            {hero && <Media v={heroMobile ? { ...hero, only: "desktop" } : hero} />}
            {heroMobile && <Media v={{ ...heroMobile, only: "mobile" }} />}
          </div>
          <StickyAside className={css.txt}>
            <Link href="/travaux" className={css.back}>
              ← Tous les travaux
            </Link>
            <div className={css.kicker}>
              Étude de cas
              <br />
              {meta.type}
            </div>
            <h1 className={css.title}>{meta.titre}</h1>
            <p className={css.lede}>{typo(meta.sousTitre)}</p>
            <div className={css.dossier}>
              <div className={css.dossierLabel}>(Le dossier)</div>
              <dl>
                {dossier.map(([k, v]) => (
                  <Fragment key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </Fragment>
                ))}
              </dl>
            </div>
          </StickyAside>
        </div>

        {/* une rangée par section : ses visuels à gauche, son texte à droite */}
        {sections.map((s, i) => (
          <div key={s.bloc} className={css.row}>
            <div className={css.vis}>{visualColumn(visualsFor(s.bloc))}</div>
            <StickyAside className={css.txt}>
              <div className={css.num}>({String(i + 1).padStart(2, "0")})</div>
              <div className={css.kicker}>
                {BLOC[s.bloc]}
                <br />/ {s.kicker}
              </div>
              {/* pas de titre s'il ne fait que répéter le nom du bloc */}
              {s.heading.toLowerCase() !== BLOC[s.bloc].toLowerCase() && (
                <h2 className={css.heading}>{typo(s.heading)}</h2>
              )}
              <div className={css.body}>
                {s.body.map((para, k) => (
                  <p key={k}>{inline(typo(para))}</p>
                ))}
              </div>
            </StickyAside>
          </div>
        ))}

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
