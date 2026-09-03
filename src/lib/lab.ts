import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";

/* ════════════════════════════════════════════════════════════════
   Loader de la page /lab (showcase interne, non référencée).
   Source : public/lab/<slug>/
     - source.<mp4|webm|mov|m4v>  → vidéo jouée
     - frames/frame-NN.jpg        → filmstrip (généré par
       `npm run lab:frames`, cf. scripts/extract-frames.mjs)
     - meta.json (optionnel)      → { "title": "…", "note": "…" }
   Un dossier sans frames extraites est ignoré (pas de vidéo jouable
   sans son filmstrip).
   ════════════════════════════════════════════════════════════════ */

const LAB_DIR = path.join(process.cwd(), "public", "lab");
const SOURCE_EXTENSIONS = [".mp4", ".webm", ".mov", ".m4v"];

export interface LabFrame {
  src: string;
  ratio: number;
}

export interface LabPiece {
  slug: string;
  title: string;
  note?: string;
  video: string;
  ratio: number;
  frames: LabFrame[];
}

function humanize(slug: string): string {
  return slug
    .replace(/[-_]+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function findSourceFile(dir: string): string | null {
  const entries = fs.readdirSync(dir);
  const name = entries.find(
    (f) =>
      path.parse(f).name === "source" &&
      SOURCE_EXTENSIONS.includes(path.extname(f).toLowerCase()),
  );
  return name ?? null;
}

export function getLabPieces(): LabPiece[] {
  if (!fs.existsSync(LAB_DIR)) return [];

  const slugs = fs
    .readdirSync(LAB_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

  const pieces: LabPiece[] = [];

  for (const slug of slugs) {
    const dir = path.join(LAB_DIR, slug);
    const sourceName = findSourceFile(dir);
    const framesDir = path.join(dir, "frames");
    if (!sourceName || !fs.existsSync(framesDir)) continue;

    const frameFiles = fs
      .readdirSync(framesDir)
      .filter((f) => /^frame-\d+\.jpg$/i.test(f))
      .sort();
    if (frameFiles.length === 0) continue;

    const frames: LabFrame[] = frameFiles.map((f) => {
      const { width, height } = imageSize(fs.readFileSync(path.join(framesDir, f)));
      return {
        src: `/lab/${slug}/frames/${f}`,
        ratio: width && height ? width / height : 16 / 9,
      };
    });

    const metaPath = path.join(dir, "meta.json");
    const meta = fs.existsSync(metaPath)
      ? (JSON.parse(fs.readFileSync(metaPath, "utf8")) as {
          title?: string;
          note?: string;
        })
      : {};

    pieces.push({
      slug,
      title: meta.title ?? humanize(slug),
      note: meta.note,
      video: `/lab/${slug}/${sourceName}`,
      ratio: frames[0].ratio,
      frames,
    });
  }

  return pieces;
}
