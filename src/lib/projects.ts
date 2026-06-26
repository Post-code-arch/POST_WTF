import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/* ════════════════════════════════════════════════════════════════
   Loader des pages-objets « travaux ».
   Source de vérité : public/travaux/<slug>/
     - index.md          → frontmatter + 4 sections (markdown)
     - NN-bloc[-type].ext → visuels (le nommage EST le mapping)
   Les médias vivant sous public/ sont servis nativement à
   /travaux/<slug>/<fichier>.
   ════════════════════════════════════════════════════════════════ */

export type VisualSlot =
  | "hero"
  | "vibe"
  | "direction"
  | "fabrication"
  | "application"
  | "asset";

export interface Visual {
  /** numéro (préfixe NN du fichier) = ordre de composition */
  n: number;
  slot: VisualSlot;
  /** URL servie (/travaux/<slug>/<fichier>) */
  src: string;
  isVideo: boolean;
}

export interface Temoignage {
  citation: string;
  source: string;
}
export interface Suivant {
  titre: string;
  slug: string;
}

export interface ProjectMeta {
  slug: string;
  titre: string;
  sousTitre: string;
  secteur: string;
  type: string;
  annee: string | number;
  champs: string[];
  client?: string;
  couleur?: string;
  ideeDirectrice?: string;
  temoignage?: Temoignage;
  suivant?: Suivant;
}

export type SectionBloc = "lecture" | "direction" | "fabrication" | "application";

export interface ProjectSection {
  bloc: SectionBloc;
  kicker: string;
  heading: string;
  body: string[];
}

export interface Project {
  meta: ProjectMeta;
  sections: ProjectSection[];
  visuals: Visual[];
}

const TRAVAUX_DIR = path.join(process.cwd(), "public", "travaux");

const VISUAL_RE = /^(\d{1,3})-([a-z]+)(?:-[a-z0-9-]+)?\.(png|jpe?g|webp|gif|webm|mp4)$/i;
const VIDEO_EXT = /\.(webm|mp4)$/i;
const KNOWN_SLOTS: VisualSlot[] = [
  "hero",
  "vibe",
  "direction",
  "fabrication",
  "application",
  "asset",
];

const SECTION_ORDER: SectionBloc[] = [
  "lecture",
  "direction",
  "fabrication",
  "application",
];
const KICKER: Record<SectionBloc, string> = {
  lecture: "Le dossier",
  direction: "Ce qu'on a posé",
  fabrication: "Ce qu'on a fabriqué",
  application: "Ce qu'on a livré",
};
/** quel bloc de visuel alimente chaque section (Lecture ← visuels « vibe ») */
export const SECTION_VISUAL_SLOT: Record<SectionBloc, VisualSlot> = {
  lecture: "vibe",
  direction: "direction",
  fabrication: "fabrication",
  application: "application",
};

export function getProjectSlugs(): string[] {
  if (!fs.existsSync(TRAVAUX_DIR)) return [];
  return fs
    .readdirSync(TRAVAUX_DIR, { withFileTypes: true })
    .filter(
      (d) =>
        d.isDirectory() &&
        fs.existsSync(path.join(TRAVAUX_DIR, d.name, "index.md"))
    )
    .map((d) => d.name)
    .sort();
}

function detectBloc(heading: string): SectionBloc | null {
  const h = heading.toLowerCase();
  if (h.includes("lecture")) return "lecture";
  if (h.includes("direction")) return "direction";
  if (h.includes("fabrication")) return "fabrication";
  if (h.includes("application")) return "application";
  return null;
}

/** retire les préfixes « NN · » et « Bloc — » pour ne garder que la phrase. */
function cleanHeading(raw: string): string {
  const h = raw
    .replace(/^\s*\d+\s*[·.\-—:]*\s*/, "")
    .replace(
      /^(lecture|direction|fabrication|application)\s*[·.\-—:]*\s*/i,
      ""
    )
    .trim();
  return h || raw.trim();
}

function parseSections(body: string): ProjectSection[] {
  const parts = body
    .split(/^##\s+/m)
    .map((s) => s.trim())
    .filter(Boolean);
  const out: ProjectSection[] = [];
  for (const part of parts) {
    const nl = part.indexOf("\n");
    const rawHeading = (nl === -1 ? part : part.slice(0, nl)).trim();
    const rest = nl === -1 ? "" : part.slice(nl + 1).trim();
    const bloc = detectBloc(rawHeading);
    if (!bloc) continue;
    const paragraphs = rest
      .split(/\n\s*\n/)
      .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
      .filter(Boolean);
    out.push({
      bloc,
      kicker: KICKER[bloc],
      heading: cleanHeading(rawHeading),
      body: paragraphs,
    });
  }
  out.sort((a, b) => SECTION_ORDER.indexOf(a.bloc) - SECTION_ORDER.indexOf(b.bloc));
  return out;
}

function readVisuals(slug: string): Visual[] {
  const dir = path.join(TRAVAUX_DIR, slug);
  return fs
    .readdirSync(dir)
    .map((f) => {
      const m = f.match(VISUAL_RE);
      if (!m) return null;
      let slot = m[2].toLowerCase() as VisualSlot;
      if (!KNOWN_SLOTS.includes(slot)) slot = "asset";
      return {
        n: parseInt(m[1], 10),
        slot,
        src: `/travaux/${slug}/${f}`,
        isVideo: VIDEO_EXT.test(f),
      } as Visual;
    })
    .filter((v): v is Visual => v !== null)
    .sort((a, b) => a.n - b.n);
}

export function getProject(slug: string): Project | null {
  const file = path.join(TRAVAUX_DIR, slug, "index.md");
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const meta = { slug, ...(data as Record<string, unknown>) } as ProjectMeta;
  if (!meta.titre) meta.titre = slug;
  if (!Array.isArray(meta.champs)) meta.champs = [];
  return {
    meta,
    sections: parseSections(content),
    visuals: readVisuals(slug),
  };
}

export function getAllProjects(): Project[] {
  return getProjectSlugs()
    .map(getProject)
    .filter((p): p is Project => p !== null);
}

/* ---------- grille d'accueil / index travaux ---------- */

export interface GridWork {
  slug: string;
  title: string;
  categories: string[];
  color: string;
  image?: string;
}

export function getProjectsForGrid(): GridWork[] {
  return getAllProjects().map((p) => {
    const hero = p.visuals.find((v) => v.slot === "hero") ?? p.visuals[0];
    return {
      slug: p.meta.slug,
      title: p.meta.titre,
      categories: p.meta.champs,
      color: p.meta.couleur ?? "#2a2620",
      image: hero?.src,
    };
  });
}
