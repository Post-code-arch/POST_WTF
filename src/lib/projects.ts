import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { imageSize } from "image-size";

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
  /** ratio largeur/hauteur naturel (pour composer des galeries sans recadrage) */
  ratio: number;
  /** image d'affiche d'une vidéo : fichier « <même nom>-poster.jpg|webp » */
  poster?: string;
  /** suffixe « -desktop » / « -mobile » : servi seulement sur cet écran */
  only?: "desktop" | "mobile";
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
  /** gamme (optionnel, affiché dans « Le dossier ») */
  gamme?: string;
  /** marchés / implantation (optionnel, affiché dans « Le dossier ») */
  marches?: string;
  /** site du client (optionnel, affiché dans « Le dossier ») */
  lien?: string;
  type: string;
  annee: string | number;
  champs: string[];
  client?: string;
  couleur?: string;
  ideeDirectrice?: string;
  temoignage?: Temoignage;
  suivant?: Suivant;
  /** position dans les listes (accueil, index) — croissant ; sans ordre = en fin */
  ordre?: number;
  /** projet préparé mais non publié : absent des listes et sans page */
  brouillon?: boolean;
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
const CANONICAL: Record<SectionBloc, string> = {
  lecture: "Lecture",
  direction: "Direction",
  fabrication: "Fabrication",
  application: "Application",
};
/** lignes du bloc « (Le dossier) » écrit à la main dans le corps — on les
 *  retire (le dossier est rendu depuis le frontmatter). */
const DOSSIER_LINE =
  /^\s*(\*\*\(?\s*le dossier\s*\)?\*\*|type\s*·|secteur\s*·|ann[ée]e\s*·|champs\s*·)/i;
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

/** retire « (01) », « NN · », parenthèses « (Le dossier) » et le mot-clé de bloc
 *  pour ne garder que la phrase éditoriale ; à défaut, le label canonique. */
function cleanHeading(raw: string, bloc: SectionBloc): string {
  const h = raw
    .replace(/\(\s*\d+\s*\)/g, " ") // (01)
    .replace(/\([^)]*\)/g, " ") // (Le dossier)
    .replace(/^\s*\d+[\s·.\-—:]*/, " ") // NN en tête
    .replace(
      /^[\s·.\-—:]*(lecture|direction|fabrication|application)[\s·.\-—:]*/i,
      " "
    )
    .replace(/[\s·.\-—:]+$/, "")
    .trim();
  return h || CANONICAL[bloc];
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
    const bloc = detectBloc(rawHeading);
    if (!bloc) continue;
    const rest = (nl === -1 ? "" : part.slice(nl + 1))
      .split("\n")
      .filter((l) => !DOSSIER_LINE.test(l))
      .join("\n")
      .trim();
    const paragraphs = rest
      .split(/\n\s*\n/)
      .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
      .filter(Boolean);
    out.push({
      bloc,
      kicker: KICKER[bloc],
      heading: cleanHeading(rawHeading, bloc),
      body: paragraphs,
    });
  }
  out.sort((a, b) => SECTION_ORDER.indexOf(a.bloc) - SECTION_ORDER.indexOf(b.bloc));
  return out;
}

/** ratio par défaut pour les vidéos (la sonde de dimensions ne lit pas les conteneurs vidéo) */
const DEFAULT_VIDEO_RATIO = 16 / 9;

/** dimensions d'une vidéo MP4 : lues dans la première piste « tkhd » non vide */
function mp4Ratio(absPath: string): number | null {
  const buf = fs.readFileSync(absPath);
  for (let i = buf.indexOf("tkhd"); i !== -1; i = buf.indexOf("tkhd", i + 4)) {
    const version = buf[i + 4];
    const off = i + 80 + (version === 1 ? 12 : 0);
    if (off + 8 > buf.length) break;
    const w = buf.readUInt32BE(off) / 65536;
    const h = buf.readUInt32BE(off + 4) / 65536;
    if (w > 0 && h > 0) return w / h;
  }
  return null;
}

function readRatio(absPath: string, isVideo: boolean): number {
  if (isVideo) {
    if (/\.mp4$/i.test(absPath)) {
      try {
        return mp4Ratio(absPath) ?? DEFAULT_VIDEO_RATIO;
      } catch {
        return DEFAULT_VIDEO_RATIO;
      }
    }
    return DEFAULT_VIDEO_RATIO;
  }
  try {
    const { width, height } = imageSize(fs.readFileSync(absPath));
    return width / height;
  } catch {
    return 1;
  }
}

/** affiches de vidéos : jamais des visuels à part entière */
const POSTER_RE = /-poster\.(jpe?g|webp|png)$/i;

function readVisuals(slug: string): Visual[] {
  const dir = path.join(TRAVAUX_DIR, slug);
  const files = fs.readdirSync(dir);
  return files
    .map((f) => {
      if (POSTER_RE.test(f)) return null;
      const m = f.match(VISUAL_RE);
      if (!m) return null;
      let slot = m[2].toLowerCase() as VisualSlot;
      if (!KNOWN_SLOTS.includes(slot)) slot = "asset";
      const isVideo = VIDEO_EXT.test(f);
      const base = f.replace(/\.[a-z0-9]+$/i, "");
      const poster = isVideo
        ? files.find((p) => POSTER_RE.test(p) && p.startsWith(`${base}-poster.`))
        : undefined;
      const only = slot !== "hero" ? base.match(/-(desktop|mobile)$/)?.[1] : undefined;
      return {
        n: parseInt(m[1], 10),
        slot,
        src: `/travaux/${slug}/${f}`,
        isVideo,
        ratio: readRatio(path.join(dir, f), isVideo),
        ...(poster ? { poster: `/travaux/${slug}/${poster}` } : {}),
        ...(only ? { only } : {}),
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
  // champs accepté en liste YAML OU en chaîne « a · b · c »
  const rawChamps = (data as Record<string, unknown>).champs;
  meta.champs = Array.isArray(rawChamps)
    ? (rawChamps as string[])
    : typeof rawChamps === "string"
      ? rawChamps
          .split(/\s*[·,]\s*/)
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
  return {
    meta,
    sections: parseSections(content),
    visuals: readVisuals(slug),
  };
}

/** projets publiés (hors brouillons), triés par `ordre` puis par titre */
export function getAllProjects(): Project[] {
  return getProjectSlugs()
    .map(getProject)
    .filter((p): p is Project => p !== null && !p.meta.brouillon)
    .sort(
      (a, b) =>
        (a.meta.ordre ?? Infinity) - (b.meta.ordre ?? Infinity) ||
        a.meta.titre.localeCompare(b.meta.titre, "fr")
    );
}

/** slugs des projets publiés — ceux qui ont une page */
export function getPublishedSlugs(): string[] {
  return getAllProjects().map((p) => p.meta.slug);
}

/* ---------- grille d'accueil / index travaux ---------- */

export interface GridWork {
  slug: string;
  title: string;
  categories: string[];
  /** disciplines normalisées pour le filtre (Branding, Web, …) */
  disciplines: string[];
  color: string;
  /** visuel de couverture — absent : la carte s'affiche en texte seul */
  image?: string;
}

/** Taxonomie de filtrage : replie les « champs » fins de chaque projet
 *  (Identité, Site, Packaging…) sur quelques disciplines lisibles. L'ordre
 *  ici est l'ordre d'affichage des filtres. */
const DISCIPLINES: { label: string; test: RegExp }[] = [
  { label: "Branding", test: /identit|charte|direction artistique|syst[èe]me visuel/i },
  { label: "Web", test: /site|web/i },
  { label: "Packaging", test: /packaging/i },
  { label: "Éditorial", test: /[ée]ditorial|[ée]dition/i },
  { label: "Illustration", test: /illustration/i },
  { label: "Signalétique", test: /signal[ée]tique/i },
  { label: "Contenu", test: /content|contenu/i },
  { label: "Photo", test: /photo/i },
  { label: "3D", test: /3d|visualisation/i },
];

/** disciplines d'un projet, dérivées de ses champs (dédupliquées, ordonnées) */
function disciplinesFor(champs: string[]): string[] {
  return DISCIPLINES.filter((d) => champs.some((c) => d.test.test(c))).map(
    (d) => d.label
  );
}

export function getProjectsForGrid(): GridWork[] {
  return getAllProjects().map((p) => {
    const hero = p.visuals.find((v) => v.slot === "hero") ?? p.visuals[0];
    return {
      slug: p.meta.slug,
      title: p.meta.titre,
      categories: p.meta.champs,
      disciplines: disciplinesFor(p.meta.champs),
      color: p.meta.couleur ?? "#262626",
      image: hero?.src,
    };
  });
}

// Certains visuels sortent du flux en rangées pour passer en pleine
// largeur. `pos` place chaque visuel avant ou après la grille de sa
// section. Marpharmal : badge + couvertures en fin ; Astarté : le banner
// (billboard) en tête ; Fennec : paysage, sachet de profil, carte et
// films en pleine largeur.
export const FULL_WIDTH: Record<string, { re: RegExp; pos: "before" | "after" }[]> = {
  marpharmal: [{ re: /(11-application-badge|12-application-programme)\.webp$/, pos: "after" }],
  "astarte-conseils": [{ re: /02-application-billboard\.webp$/, pos: "before" }],
  imlead: [{ re: /05-fabrication-social-stories\.webp$/, pos: "after" }],
  "fennec-coffee-roasters": [
    { re: /02-vibe-paysage-tassili\./, pos: "before" },
    { re: /04-direction-tassili-profil-embossage\./, pos: "before" },
    { re: /14-fabrication-carte-logo\./, pos: "after" },
    { re: /17-application-film-aures-nuit\./, pos: "before" },
    { re: /2[45]-application-film-tassili-sable-/, pos: "after" },
  ],
};

// Mise en page en deux colonnes (études de cas post_) : visuels montrés en
// grand, sur toute la colonne des visuels (les 2/3 de l'écran), à leur
// place dans le fil — en plus de ceux de FULL_WIDTH.
export const GRAND: Record<string, RegExp> = {
  "mag-agency":
    /(02-vibe-hublot|05-direction-slider|06-direction-slider-anim|08-fabrication-logo|13-fabrication-ui|14-application-devices|15-application-moment)\./,
  imlead: /07-application-site-ecran\./,
  marpharmal: /(05-fabrication-matiere|08-application-scene)\./,
  "spoon-atelier": /(04-fabrication-systeme-couleur|08-application-chaise)\./,
  "fennec-coffee-roasters": /18-application-tassili-oasis\./,
  banbiom:
    /(06-direction-couleurs|10-fabrication-voronoi|11-fabrication-signatures|14-application-console|15-application-ecrans|18-application-etude-de-cas)\./,
};
