import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import Marquee from "./Marquee";
import Reveal from "./Reveal";
import type { ProjectMeta, Visual } from "@/lib/projects";

/* ---------- média ---------- */

function MediaInner({ v }: { v: Visual }) {
  if (v.isVideo) {
    return <video src={v.src} autoPlay loop muted playsInline aria-hidden />;
  }
  return <img src={v.src} alt="" />;
}

/* ---------- HERO ---------- */

export function Hero({
  titre,
  sousTitre,
  hero,
}: {
  titre: string;
  sousTitre: string;
  hero?: Visual;
}) {
  return (
    <header className="hero">
      {hero && (
        <div className="hero-media" aria-hidden>
          <MediaInner v={hero} />
        </div>
      )}
      <h1 className="hero-title">
        <Marquee items={titre} repeat={4} />
      </h1>
      <p className="hero-sub">{sousTitre}</p>
      <div className="hero-foot">
        <span>(SCROLL)</span>
        <Link href="/travaux">Tous les travaux →</Link>
      </div>
    </header>
  );
}

/* ---------- SECTION numérotée ---------- */

export function Section({
  num,
  kicker,
  heading,
  children,
}: {
  num: string;
  kicker: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <Reveal as="section" className="sec">
      <div className="sec-num">
        ({num})
        <br />
        <span className="ac">،</span>
        {kicker}
      </div>
      <div className="sec-body">
        <h2>{heading}</h2>
        {children}
      </div>
    </Reveal>
  );
}

/* le dossier — méta du projet, tiré du frontmatter */
export function Details({ meta }: { meta: ProjectMeta }) {
  return (
    <div className="details">
      <div className="did-label">(Le dossier)</div>
      <ul>
        <li>
          <b>Type</b> {meta.type}
        </li>
        <li>
          <b>Secteur</b> {meta.secteur}
        </li>
        <li>
          <b>Année</b> {meta.annee}
        </li>
        <li>
          <b>Champs</b>{" "}
          {meta.champs.map((c, i) => (
            <Fragment key={c}>
              {i > 0 && <span className="ac">،</span>}
              {c}
            </Fragment>
          ))}
        </li>
      </ul>
    </div>
  );
}

/* ---------- MEDIA (un visuel pleine largeur, jamais recadré) ---------- */

export function Media({ v }: { v: Visual }) {
  return (
    <Reveal className="media-full">
      <div className={`ph${v.slot === "vibe" ? " vibe" : ""}`}>
        <MediaInner v={v} />
      </div>
    </Reveal>
  );
}

/* ---------- GALERIE (compositions multi-visuels) ----------
   Cellules cadrées (cover) : duo côte à côte, mosaïque 1 grande + 2 empilées.
   Les visuels seuls restent en <Media> pleine largeur (non recadrés). */

function Cell({ v, className }: { v: Visual; className?: string }) {
  return (
    <div className={`gal-cell${className ? ` ${className}` : ""}`}>
      <MediaInner v={v} />
    </div>
  );
}

function Duo({ a, b }: { a: Visual; b: Visual }) {
  return (
    <Reveal className="gal gal-duo">
      <Cell v={a} />
      <Cell v={b} />
    </Reveal>
  );
}

function Mosaic({
  big,
  a,
  b,
  flip,
}: {
  big: Visual;
  a: Visual;
  b: Visual;
  flip?: boolean;
}) {
  return (
    <Reveal className={`gal gal-mosaic${flip ? " flip" : ""}`}>
      <Cell v={big} className="cell-big" />
      <Cell v={a} className="cell-a" />
      <Cell v={b} className="cell-b" />
    </Reveal>
  );
}

/** dispose une liste de visuels en compositions : 1→pleine largeur,
 *  2→duo, 3→mosaïque, 4→duo+duo, ≥5→mosaïque puis le reste. */
export function Gallery({ visuals }: { visuals: Visual[] }) {
  const blocks: ReactNode[] = [];
  let i = 0;
  let flip = false;
  while (i < visuals.length) {
    const left = visuals.length - i;
    if (left === 1) {
      blocks.push(<Media key={visuals[i].src} v={visuals[i]} />);
      i += 1;
    } else if (left === 3 || left >= 5) {
      blocks.push(
        <Mosaic
          key={visuals[i].src}
          big={visuals[i]}
          a={visuals[i + 1]}
          b={visuals[i + 2]}
          flip={flip}
        />
      );
      i += 3;
      flip = !flip;
    } else {
      blocks.push(
        <Duo key={visuals[i].src} a={visuals[i]} b={visuals[i + 1]} />
      );
      i += 2;
    }
  }
  return <>{blocks}</>;
}

/* ---------- MANIFESTO (idée directrice) ---------- */

export function Manifesto({
  kicker = "Idée directrice",
  children,
}: {
  kicker?: string;
  children: ReactNode;
}) {
  return (
    <div className="manifesto">
      <div className="kicker">{kicker}</div>
      <h2>
        <Marquee items={String(children)} repeat={3} />
      </h2>
    </div>
  );
}

/* ---------- TESTIMONIAL ---------- */

export function Testimonial({
  citation,
  source,
}: {
  citation: string;
  source: string;
}) {
  return (
    <Reveal className="testi">
      <div className="testi-top">
        <span>Mot du client</span>
        <Link href="/contact">Travaillons ensemble →</Link>
      </div>
      <blockquote>{citation}</blockquote>
      <cite>{source}</cite>
    </Reveal>
  );
}

/* ---------- NEXT CASE ---------- */

export function NextCase({
  titre,
  slug,
  preview,
}: {
  titre: string;
  slug: string;
  preview?: Visual;
}) {
  return (
    <div className="next">
      <div className="small">Projet suivant</div>
      {preview && (
        <div className="next-preview" aria-hidden>
          <MediaInner v={preview} />
        </div>
      )}
      <Link href={`/travaux/${slug}`}>
        <Marquee items={titre} repeat={3} />
      </Link>
    </div>
  );
}
