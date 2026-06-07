import fs from "node:fs";
import path from "node:path";

export type VisualSlot =
  | "hero"
  | "technique"
  | "vibe"
  | "motion"
  | "mockup"
  | "asset";

export interface Visual {
  /** numéro de visuel 1–10 (cf. canevas Kinaya) */
  n: number;
  slot: VisualSlot;
  /** chemin du média (vide → placeholder labellisé) */
  src?: string;
  alt?: string;
  label: string;
}

export interface ProjectMeta {
  titre: string;
  sousTitre: string;
  type: string;
  secteur: string;
  annee: string | number;
  champs: string[];
  ideeDirectrice: string;
  temoignage: { citation: string; source: string };
  suivant: { titre: string; slug: string };
  visuels: Visual[];
}

export const CONTENT_DIR = path.join(process.cwd(), "content", "travaux");

export function getProjectSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getProjectSource(slug: string): string | null {
  const file = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, "utf8");
}
