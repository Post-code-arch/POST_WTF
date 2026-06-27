import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import Marquee from "./Marquee";
import Reveal from "./Reveal";
import JustifiedRow from "./JustifiedRow";
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
   Rangées « justifiées » : chaque cellule garde le ratio naturel de son
   visuel (flex-basis 0, flex-grow/shrink = ratio) et la rangée elle-même
   est mise à l'échelle (aspect-ratio = somme des ratios) — aucun visuel
   n'est jamais recadré, et la rangée occupe toujours 100% de la largeur. */

/** dispose une liste de visuels en rangées justifiées (2 ou 3 par rangée,
 *  jamais 1 seul — qui reste en <Media> pleine largeur, non recadré). */
export function Gallery({ visuals }: { visuals: Visual[] }) {
  const blocks: ReactNode[] = [];
  let i = 0;
  while (i < visuals.length) {
    const left = visuals.length - i;
    if (left === 1) {
      blocks.push(<Media key={visuals[i].src} v={visuals[i]} />);
      i += 1;
    } else if (left === 3 || left >= 5) {
      blocks.push(
        <JustifiedRow key={visuals[i].src} visuals={visuals.slice(i, i + 3)} />
      );
      i += 3;
    } else {
      blocks.push(
        <JustifiedRow key={visuals[i].src} visuals={visuals.slice(i, i + 2)} />
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
