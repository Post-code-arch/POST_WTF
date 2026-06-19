import { Fragment, type ReactNode } from "react";
import Link from "next/link";
import Marquee from "./Marquee";
import Reveal from "./Reveal";
import type { ProjectMeta, Visual } from "@/lib/projects";

/* ---------- helpers visuels ---------- */

function byN(visuals: Visual[], n: number): Visual | undefined {
  return visuals.find((v) => v.n === n);
}

function variantClass(slot: Visual["slot"]): string {
  if (slot === "vibe") return "vibe";
  if (slot === "motion") return "motion";
  if (slot === "asset") return "cream";
  return "";
}

function MediaInner({ v }: { v: Visual }) {
  if (!v.src) return null; // placeholder via .ph::before
  if (v.slot === "motion") {
    return (
      <video
        src={v.src}
        autoPlay
        loop
        muted
        playsInline
        aria-label={v.alt || v.label}
      />
    );
  }
  return <img src={v.src} alt={v.alt || ""} />;
}

/* ---------- HERO ---------- */

export function Hero({
  titre,
  sousTitre,
  visuals,
}: {
  titre: string;
  sousTitre: string;
  visuals: Visual[];
}) {
  const v = byN(visuals, 1);
  return (
    <header className="hero">
      {v && (
        <div className="hero-media" aria-hidden>
          <MediaInner v={v} />
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
  level = 2,
  children,
}: {
  num: string;
  kicker: string;
  heading: string;
  level?: 2 | 3 | "2" | "3";
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
        {Number(level) === 3 ? <h3>{heading}</h3> : <h2>{heading}</h2>}
        {children}
      </div>
    </Reveal>
  );
}

/* liste « ce qu'on a posé / fabriqué / livré » */
export function Did({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="did">
      <div className="did-label">{label}</div>
      {children}
    </div>
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

/* ---------- MEDIA ---------- */

export function Media({ n, visuals }: { n: number; visuals: Visual[] }) {
  const v = byN(visuals, n);
  if (!v) return null;
  return (
    <Reveal className="media-full">
      <div className={["ph", variantClass(v.slot)].filter(Boolean).join(" ")} data-label={v.label}>
        <MediaInner v={v} />
      </div>
    </Reveal>
  );
}

export function MediaDuo({
  a,
  b,
  visuals,
}: {
  a: number;
  b: number;
  visuals: Visual[];
}) {
  const va = byN(visuals, a);
  const vb = byN(visuals, b);
  if (!va || !vb) return null;
  return (
    <Reveal className="media-duo">
      <div className={["ph", variantClass(va.slot)].filter(Boolean).join(" ")} data-label={va.label}>
        <MediaInner v={va} />
      </div>
      <div className={["ph", variantClass(vb.slot)].filter(Boolean).join(" ")} data-label={vb.label}>
        <MediaInner v={vb} />
      </div>
    </Reveal>
  );
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

export function NextCase({ titre, slug }: { titre: string; slug: string }) {
  return (
    <div className="next">
      <div className="small">Projet suivant</div>
      <Link href={`/travaux/${slug}`}>
        <Marquee items={titre} repeat={3} />
      </Link>
    </div>
  );
}
