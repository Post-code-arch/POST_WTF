import { getProjectsForGrid } from "./projects";

export interface Work {
  slug: string;
  title: string;
  categories: string[];
  /** disciplines normalisées pour le filtre par type (Branding, Web, …) */
  disciplines: string[];
  /** couleur de placeholder (en attendant le vrai visuel) */
  color: string;
  /** chemin du visuel (survol en liste / vignette en grille) — placeholder si absent */
  image?: string;
}

/**
 * Index des travaux — dérivé des pages-objets sous public/travaux/<slug>/.
 * Ajouter un projet = déposer son dossier ; il apparaît ici automatiquement.
 */
export const works: Work[] = getProjectsForGrid();
