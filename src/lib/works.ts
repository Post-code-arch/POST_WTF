export interface Work {
  slug: string;
  title: string;
  categories: string[];
  /** couleur de placeholder (en attendant le vrai visuel) */
  color: string;
  /** chemin du visuel (survol en liste / vignette en grille) — placeholder si absent */
  image?: string;
}

/**
 * Index des travaux (page /travaux). Ordre figé (cf. brief Work).
 * Chaque projet lie vers sa page-objet /travaux/[slug].
 */
export const works: Work[] = [
  {
    slug: "phase-0",
    title: "Phase 0",
    categories: ["Art Direction", "3D Experience"],
    color: "#2a2620",
  },
  {
    slug: "atelier-spoon",
    title: "Atelier Spoon",
    categories: ["Art Direction", "Branding", "UX/UI"],
    color: "#1f2a24",
  },
  {
    slug: "fennec",
    title: "Fennec Coffee Roasters",
    categories: ["UX/UI Design", "Branding"],
    color: "#2a1f18",
  },
  {
    slug: "astarte",
    title: "Astarté",
    categories: ["Branding", "Éditorial"],
    color: "#241f2a",
    image: "/travaux/astarte/mockup-4.webp",
  },
  {
    slug: "imlead",
    title: "IMLEAD",
    categories: ["3D Experience", "Art Direction"],
    color: "#1a2230",
  },
  {
    slug: "marpharma",
    title: "Marpharma",
    categories: ["Branding", "Art Direction"],
    color: "#2a2230",
  },
];
