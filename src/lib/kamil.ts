/* ════════════════════════════════════════════════════════════════
   Portfolio de Kamil Grimes (/kamil-grimes, page non référencée).
   Contenu tiré de son CV (2026) ; fautes de frappe corrigées, rien
   d'ajouté. Les études de cas viennent de public/travaux/.
   ════════════════════════════════════════════════════════════════ */

export const identite = {
  nom: "Kamil Grimes",
  nomComplet: "Grimes Kamil-Ilies",
  ville: "Alger",
  // TODO — bio rédigée par Kamil (affichée à la place de l'accroche)
  bio: null as string | null,
  accroche:
    "Directeur créatif, producteur et artiste visuel basé à Alger.",
  tel: "+213 540 87 73 98",
  mail: "grimeskamil@gmail.com" as string | null,
};

/** les trois casquettes du CV, avec leurs champs */
export const roles = [
  { titre: "Directeur créatif", champs: ["UI", "UX", "Motion", "Brand", "Éditorial"] },
  { titre: "Producteur", champs: ["Séries", "Projets culturels"] },
  { titre: "Artiste visuel", champs: ["Installation", "Musique"] },
];

/** projets montrés (visuels des études de cas), avec le rôle de Kamil (CV) */
export const travaux: { slug: string; role: string; annee: string }[] = [
  { slug: "imlead", role: "Direction créative · Web · Branding · Audit stratégique", annee: "2026" },
  { slug: "astarte-conseils", role: "Direction créative · Web · Branding", annee: "2026" },
  { slug: "marpharmal", role: "Campagne · Branding · Motion", annee: "2024" },
  { slug: "fennec-coffee-roasters", role: "Branding · Packaging · Réseaux sociaux", annee: "2025" },
  { slug: "spoon-atelier", role: "Direction créative · Éditorial · Branding", annee: "2026" },
];

export interface Ligne {
  annee: string;
  titre: string;
  structure?: string;
  detail?: string;
}

export const experiences: Ligne[] = [
  {
    annee: "2026",
    titre: "Producteur exécutif",
    structure: "Ennahar TV",
    detail:
      "Producteur exécutif et directeur de production d'une série de 5 × 15 min, « Halwa Wmoura ».",
  },
  {
    annee: "2025",
    titre: "Producteur",
    structure: "« Lithic Memory » — projet Al Mawred",
    detail:
      "Production d'un album musical accompagné de la création d'un univers visuel associé. Gestion financière et démarchage du projet.",
  },
  {
    annee: "2024",
    titre: "Designer junior",
    structure: "Havas Algérie (Genfood)",
    detail:
      "Campagnes pour Hamoud Boualem, Castel et Heineken : key visuals, assets de campagne, déclinaisons motion design ; projets de branding et de systèmes d'identité.",
  },
  {
    annee: "2024",
    titre: "Directeur créatif",
    structure: "Boulevard Design",
    detail:
      "Direction créative sur une campagne pour la GIZ ; coordination d'un réseau de freelances et de collaborateurs externes. Organisation du concours du programme Jil Siyaha (logistique et communication).",
  },
  {
    annee: "2023",
    titre: "Designer junior",
    structure: "Lotus Conseils (groupe Leo Burnett / Publicis)",
    detail:
      "Traduction de briefs en propositions et campagnes visuelles pour Cevital, Ooredoo et UNO.",
  },
];

export const missions: Ligne[] = [
  {
    annee: "2026",
    titre: "Registre des filiales du MESRS, vol. 2",
    structure: "Ministère de l'Enseignement supérieur et de la Recherche scientifique",
    detail: "Conception éditoriale et direction créative ; organisation de la donnée.",
  },
  { annee: "2026", titre: "Astarté Conseils", detail: "Direction créative · Web · Branding" },
  { annee: "2026", titre: "IMLEAD", detail: "Direction créative · Web · Branding · Audit stratégique" },
  { annee: "2026", titre: "Atelier Spoon", detail: "Direction créative · Éditorial · Branding" },
  { annee: "2026", titre: "Mag Agency", detail: "Web" },
  {
    annee: "2025",
    titre: "Fennec Coffee Roasters",
    detail: "Branding · Packaging · Réseaux sociaux",
  },
  {
    annee: "2025",
    titre: "Registre des filiales du MESRS, vol. 1",
    structure: "Ministère de l'Enseignement supérieur et de la Recherche scientifique",
    detail: "Organisation de la donnée, solution web et document récapitulatif.",
  },
  {
    annee: "2025",
    titre: "Olympiades des métiers",
    structure: "ONCI",
    detail: "Motion design du spectacle d'inauguration.",
  },
  { annee: "2025", titre: "Ecogic", detail: "Branding · Web — identité et site pour une entreprise d'ingénierie écologique." },
  {
    annee: "2025",
    titre: "Amnesty International Algérie",
    detail: "Éditorial — supports et illustrations pour la journée des droits des femmes.",
  },
  { annee: "2025", titre: "Burha (Aromplus)", detail: "Branding · Packaging — identité et packaging d'une sous-marque." },
  {
    annee: "2024",
    titre: "Marpharmal",
    detail:
      "Campagne · Branding · Motion — campagne de communication pour une conférence sur les produits halieutiques dans le secteur médical.",
  },
  {
    annee: "2024",
    titre: "Conférence sur la sécurité alimentaire dans le monde arabe",
    structure: "Ligue arabe",
    detail: "Rédaction du document stratégique et de la stratégie de communication.",
  },
  { annee: "2023", titre: "Jeux arabes", detail: "Motion design des spectacles d'inauguration et de clôture." },
  {
    annee: "2023",
    titre: "Programme « Économie bleue »",
    structure: "Union européenne en Algérie",
    detail: "Conception des supports et de la stratégie de communication.",
  },
];

export const formation: Ligne[] = [
  { annee: "2023 — 2025", titre: "Master Image Média", structure: "ESBA Alger" },
  { annee: "2020 — 2022", titre: "Licence Image Média", structure: "ESBA Alger" },
  { annee: "2019", titre: "Bac Mathématiques techniques" },
];

export const competences: { titre: string; items: string[] }[] = [
  {
    titre: "Design et communication",
    items: [
      "Stratégie de communication",
      "Identité de marque",
      "Identité visuelle",
      "Graphisme",
      "Motion design",
      "3D",
      "Direction créative et artistique",
      "Prompt engineering",
    ],
  },
  {
    titre: "Production",
    items: [
      "Production audiovisuelle",
      "Direction de production",
      "Gestion budgétaire et opérationnelle",
      "Montage de dossier",
    ],
  },
  {
    titre: "Logiciels",
    items: [
      "Suite Adobe : Illustrator, Photoshop, After Effects, InDesign",
      "Next.js / React, notions de bases de données",
      "Hermes, ComfyUI",
      "Notion, suite Microsoft",
    ],
  },
  { titre: "Langues", items: ["Français C2", "Anglais C2", "Arabe C2"] },
];
