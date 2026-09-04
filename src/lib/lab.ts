import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

/* ════════════════════════════════════════════════════════════════
   Loader de la page /lab (showcase interne, non référencée).
   Source : public/lab/<slug>/
     - <nom>.<mp4|webm|mov|m4v>   → une ou plusieurs vidéos, déposées
       directement à la racine du dossier du projet
     - frames/<nom>/frame-NN.jpg → filmstrip par vidéo (généré par
       `npm run lab:frames`, cf. scripts/extract-frames.mjs)
     - meta.json (optionnel)     → { "title": "…", "note": "…",
       "description": "…" ou ["§1", "§2"] }
   Une vidéo sans frames extraites est ignorée. Un projet sans aucune
   vidéo prête est ignoré.
   ════════════════════════════════════════════════════════════════ */

const LAB_DIR = path.join(process.cwd(), "public", "lab");
const VIDEO_EXTENSIONS = [".mp4", ".webm", ".mov", ".m4v"];

export interface LabFrame {
  src: string;
  ratio: number;
}

export interface LabVideo {
  label: string;
  src: string;
  ratio: number;
  frames: LabFrame[];
}

export interface LabPiece {
  slug: string;
  title: string;
  note?: string;
  description: string[];
  videos: LabVideo[];
  poster: LabFrame;
}

function humanize(name: string): string {
  return name
    .replace(/^\d+[-_]*/, "")
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function listVideoFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter(
      (e) =>
        e.isFile() &&
        VIDEO_EXTENSIONS.includes(path.extname(e.name).toLowerCase()),
    )
    .map((e) => e.name)
    .sort();
}

function getLabSlugs(): string[] {
  if (!fs.existsSync(LAB_DIR)) return [];
  return fs
    .readdirSync(LAB_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();
}

function loadPiece(slug: string): LabPiece | null {
  const dir = path.join(LAB_DIR, slug);
  const videoFiles = listVideoFiles(dir);

  const videos: LabVideo[] = [];
  for (const file of videoFiles) {
    const stem = path.parse(file).name;
    const framesDir = path.join(dir, "frames", stem);
    if (!fs.existsSync(framesDir)) continue;

    const frameFiles = fs
      .readdirSync(framesDir)
      .filter((f) => /^frame-\d+\.jpg$/i.test(f))
      .sort();
    if (frameFiles.length === 0) continue;

    const frames: LabFrame[] = frameFiles.map((f) => {
      const { width, height } = imageSize(
        fs.readFileSync(path.join(framesDir, f)),
      );
      return {
        src: `/lab/${slug}/frames/${encodeURIComponent(stem)}/${f}`,
        ratio: width && height ? width / height : 16 / 9,
      };
    });

    videos.push({
      label: humanize(stem),
      src: `/lab/${slug}/${encodeURIComponent(file)}`,
      ratio: frames[0].ratio,
      frames,
    });
  }

  if (videos.length === 0) return null;

  const metaPath = path.join(dir, "meta.json");
  const meta = fs.existsSync(metaPath)
    ? (JSON.parse(fs.readFileSync(metaPath, "utf8")) as {
        title?: string;
        note?: string;
        description?: string | string[];
      })
    : {};

  const description = Array.isArray(meta.description)
    ? meta.description
    : meta.description
      ? [meta.description]
      : [];

  return {
    slug,
    title: meta.title ?? humanize(slug),
    note: meta.note,
    description,
    videos,
    poster: videos[0].frames[0],
  };
}

export function getLabPieces(): LabPiece[] {
  return getLabSlugs()
    .map(loadPiece)
    .filter((p): p is LabPiece => p !== null);
}

export function getLabPieceSlugs(): string[] {
  return getLabPieces().map((p) => p.slug);
}

export function getLabPiece(slug: string): LabPiece | null {
  return loadPiece(slug);
}
