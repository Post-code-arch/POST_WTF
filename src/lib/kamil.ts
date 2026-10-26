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

/** projets montrés (visuels des études de cas), avec le rôle de Kamil (CV),
 *  ce qu'est le projet et son défi — résumés des textes des études de cas */
export interface Travail {
  slug: string;
  role: string;
  annee: string;
  projet: string;
  defi: string;
  /** visuels choisis à la main (sinon : hero + 3 visuels d'application) */
  visuels?: { principal: string; bande: string[] };
}

export const travaux: Travail[] = [
  {
    slug: "imlead",
    role: "Direction créative · Web · Branding · Audit stratégique",
    annee: "2026",
    projet:
      "Identité, charte, contenus sociaux et site d'un cabinet de gouvernance de projet, qui représente le maître d'ouvrage dans les opérations immobilières à forts enjeux.",
    defi:
      "Un métier que le marché nomme mal, dans un secteur immobilier algérien dominé par des codes visuels génériques. Il fallait rendre visible une position : le tiers rigoureux qui arbitre, là où d'autres exécutent.",
  },
  {
    slug: "astarte-conseils",
    role: "Direction créative · Web · Branding",
    annee: "2026",
    projet:
      "Identité de marque, direction artistique, éditorial et site d'un cabinet d'études et de conseil qui travaille en Algérie, au Maghreb et au Sahel.",
    defi:
      "Quinze ans de missions, mais un discours qui ressemblait à celui de tout le monde. Leur vraie force, la connaissance du terrain là où les modèles importés se cassent, restait implicite : il fallait en faire l'axe de toute la marque.",
  },
  {
    slug: "mag-agency",
    role: "Identité · Web · Direction artistique",
    annee: "2025",
    projet:
      "Identité, direction artistique et site d'un cabinet de conseil en investissement aéronautique installé à Dubaï, qui intervient en Europe, au Moyen-Orient et en Afrique.",
    defi:
      "Deux métiers très différents sous le même nom : investir dans un avion, et investir dans l'aviation. L'investisseur devait comprendre l'offre avant de comprendre le cabinet ; il fallait qu'il sache en un clic par quelle porte entrer.",
    visuels: {
      principal: "/travaux/mag-agency/01-hero.webp",
      bande: [
        "/travaux/mag-agency/02-vibe-hublot.webp",
        "/travaux/mag-agency/05-direction-slider.webp",
        "/travaux/mag-agency/14-application-devices.webp",
      ],
    },
  },
  {
    slug: "marpharmal",
    role: "Campagne · Branding · Motion",
    annee: "2024",
    projet:
      "Identité et système visuel de la conférence nationale sur l'économie pharmaceutique et l'innovation issue des produits de la mer, déclinés sur tous les supports : scène, banderoles, écrans, badges, programme et magazine.",
    defi:
      "Partir d'une page blanche et tenir une tension : rester crédible auprès des chercheurs tout en restant lisible pour tous. Vulgariser sans décrédibiliser.",
    visuels: {
      principal: "/travaux/marpharmal/08-application-scene.webp",
      bande: [
        "/travaux/marpharmal/09-application-banner.webp",
        "/travaux/marpharmal/10-application-ecran.webp",
        "/travaux/marpharmal/11-application-badge.webp",
        "/travaux/marpharmal/12-application-programme.webp",
        "/travaux/marpharmal/13-application-magazine.webp",
      ],
    },
  },
  {
    slug: "fennec-coffee-roasters",
    role: "Branding · Packaging · Réseaux sociaux",
    annee: "2025",
    projet:
      "Identité, packaging, illustration et films d'une gamme de trois cafés de spécialité torréfiés en Algérie, chacun nommé d'après un massif : Aurès, Hogar, Tassili.",
    defi:
      "Le café de spécialité a ses codes, venus d'ailleurs, et partout ils se ressemblent. Il fallait une marque qui parle le même langage de qualité, mais qui ne puisse venir que d'ici.",
  },
  {
    slug: "spoon-atelier",
    role: "Direction créative · Éditorial · Branding",
    annee: "2026",
    projet:
      "Identité, charte, visualisation 3D et fiches produit d'un atelier qui fabrique ses meubles une à une.",
    defi:
      "Le travail était là, le cadre manquait : chaque objet existait pour lui-même, sans grammaire commune. Il fallait transformer des meubles isolés en une collection.",
  },
];

/** productions en image générée (anciens projets du Lab) : boucles courtes
 *  tirées des films, avec une image d'affiche */
export interface ProductionIA {
  titre: string;
  tag: string;
  films: { label: string; src: string; poster: string }[];
  images?: string[];
}

const IA = "/kamil-grimes/ia";

export const productionsIA: ProductionIA[] = [
  {
    titre: "Bassit",
    tag: "VFX",
    films: [{ label: "Bassit", src: `${IA}/bassit/bassit.webm`, poster: `${IA}/bassit/bassit-poster.jpg` }],
    images: [`${IA}/bassit/still-1.jpg`, `${IA}/bassit/still-2.jpg`, `${IA}/bassit/still-3.jpg`],
  },
  {
    titre: "Cristor",
    tag: "VFX · Packshot IA",
    films: [
      { label: "Cuisinière — spot", src: `${IA}/cristor/cuisiniere.webm`, poster: `${IA}/cristor/cuisiniere-poster.jpg` },
      { label: "Climatiseur — spot", src: `${IA}/cristor/climatiseur.webm`, poster: `${IA}/cristor/climatiseur-poster.jpg` },
      { label: "Film corporate — 45 s", src: `${IA}/cristor/film-corporate.webm`, poster: `${IA}/cristor/film-corporate-poster.jpg` },
      { label: "Showroom", src: `${IA}/cristor/showroom.webm`, poster: `${IA}/cristor/showroom-poster.jpg` },
    ],
  },
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

  { annee: "2025", titre: "MAG Agency", detail: "Identité · Web · Direction artistique" },
  {
    annee: "2025",
    titre: "Fennec Café",
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
