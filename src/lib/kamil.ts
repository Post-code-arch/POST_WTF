/* ════════════════════════════════════════════════════════════════
   Portfolio de Kamil Grimes (/kamil-grimes, pages non référencées),
   en français et en anglais (/kamil-grimes/en).
   Contenu tiré de son CV (2026) ; fautes de frappe corrigées, rien
   d'ajouté. Les études de cas viennent de public/travaux/.
   Chaque texte traduisible est un couple { fr, en } ; les noms propres
   restent de simples chaînes.
   ════════════════════════════════════════════════════════════════ */

import { typo } from "./typo";

export type Lang = "fr" | "en";
export type L = { fr: string; en: string };

/** texte dans la langue voulue ; la typographie française (espaces fines
 *  avant ; ? ! :) ne s'applique qu'au français */
export function tx(l: L | string, lang: Lang): string {
  const s = typeof l === "string" ? l : l[lang];
  return lang === "fr" ? typo(s) : s;
}

/** chemins des pages, par langue */
export function chemins(lang: Lang) {
  const home = lang === "fr" ? "/kamil-grimes" : "/kamil-grimes/en";
  const projets = lang === "fr" ? "/kamil-grimes/projets" : "/kamil-grimes/en/projects";
  return { home, projets, projet: (slug: string) => `${projets}/${slug}` };
}

/* ---------- interface ---------- */

export const UI = {
  fr: {
    projets: "Projets",
    parcours: "Parcours",
    contact: "Contact",
    selection: "Sélection.",
    voirTout: (n: number) => `Voir les ${n} projets`,
    nProjets: (n: number) => `${n} projet${n > 1 ? "s" : ""}`,
    filtrer: "Filtrer",
    tous: "Tous",
    leProjet: "Le projet",
    leDefi: "Le défi",
    laDirection: "La direction",
    role: "Rôle",
    secteur: "Secteur",
    annee: "Année",
    cadre: "Cadre",
    site: "Site",
    suivant: "Projet suivant",
    retour: "← Tous les projets",
    experiences: "Expériences.",
    missionsKicker: "(Missions)",
    missions: "Freelance.",
    formation: "Formation",
    travaillons: "Travaillons ensemble.",
    nom: "Nom",
    tel: "Tél",
    mail: "Mail",
    ville: "Ville",
    lieu: "Alger, Algérie",
    slots: {
      vibe: "Ambiance",
      direction: "Direction",
      fabrication: "Fabrication",
      application: "Application",
      asset: "Supports",
    },
    films: "Films",
    images: "Images",
  },
  en: {
    projets: "Projects",
    parcours: "Background",
    contact: "Contact",
    selection: "Selected work.",
    voirTout: (n: number) => `See all ${n} projects`,
    nProjets: (n: number) => `${n} project${n > 1 ? "s" : ""}`,
    filtrer: "Filter",
    tous: "All",
    leProjet: "The project",
    leDefi: "The challenge",
    laDirection: "The direction",
    role: "Role",
    secteur: "Sector",
    annee: "Year",
    cadre: "Context",
    site: "Website",
    suivant: "Next project",
    retour: "← All projects",
    experiences: "Experience.",
    missionsKicker: "(Freelance)",
    missions: "Clients.",
    formation: "Education",
    travaillons: "Let's work together.",
    nom: "Name",
    tel: "Phone",
    mail: "Email",
    ville: "City",
    lieu: "Algiers, Algeria",
    slots: {
      vibe: "Mood",
      direction: "Direction",
      fabrication: "Making",
      application: "Application",
      asset: "Assets",
    },
    films: "Films",
    images: "Stills",
  },
} as const;

/* ---------- identité ---------- */

export const identite = {
  nom: "Kamil Grimes",
  nomComplet: "Grimes Kamil-Ilies",
  ville: { fr: "Alger", en: "Algiers" } as L,
  // TODO — bio rédigée par Kamil (affichée à la place de l'accroche)
  bio: null as L | null,
  accroche: {
    fr: "Directeur créatif, producteur et artiste visuel basé à Alger.",
    en: "Creative director, producer and visual artist based in Algiers.",
  } as L,
  tel: "+213 540 87 73 98",
  mail: "grimeskamil@gmail.com" as string | null,
};

/** les trois casquettes du CV, avec leurs champs */
export const roles: { titre: L; champs: L[] }[] = [
  {
    titre: { fr: "Directeur créatif", en: "Creative director" },
    champs: [
      { fr: "UI", en: "UI" },
      { fr: "UX", en: "UX" },
      { fr: "Motion", en: "Motion" },
      { fr: "Brand", en: "Brand" },
      { fr: "Éditorial", en: "Editorial" },
    ],
  },
  {
    titre: { fr: "Producteur", en: "Producer" },
    champs: [
      { fr: "Séries", en: "Series" },
      { fr: "Projets culturels", en: "Cultural projects" },
    ],
  },
  {
    titre: { fr: "Artiste visuel", en: "Visual artist" },
    champs: [
      { fr: "Installation", en: "Installation" },
      { fr: "Musique", en: "Music" },
    ],
  },
];

export const ticker: L[] = [
  { fr: "Direction créative", en: "Creative direction" },
  { fr: "Production", en: "Production" },
  { fr: "Art visuel", en: "Visual art" },
  { fr: "Brand", en: "Brand" },
  { fr: "Motion", en: "Motion" },
  { fr: "Éditorial", en: "Editorial" },
  { fr: "UI / UX", en: "UI / UX" },
  { fr: "Séries", en: "Series" },
  { fr: "Musique", en: "Music" },
];

/* ---------- projets ---------- */

/** disciplines servant de filtre sur la page Projets (dans cet ordre) */
export const FILTRES = {
  identite: { fr: "Identité", en: "Identity" },
  web: { fr: "Web", en: "Web" },
  packaging: { fr: "Packaging", en: "Packaging" },
  campagne: { fr: "Campagne", en: "Campaign" },
  editorial: { fr: "Éditorial", en: "Editorial" },
  film: { fr: "Film", en: "Film" },
  production: { fr: "Production", en: "Production" },
  ia: { fr: "IA", en: "AI" },
} satisfies Record<string, L>;
export type Filtre = keyof typeof FILTRES;

interface ProjetBase {
  /** adresse de la page (/kamil-grimes/projets/<slug>) */
  slug: string;
  titre: string;
  sousTitre?: L;
  annee?: string;
  role?: L;
  secteur?: L;
  projet?: L;
  defi?: L;
  filtres: Filtre[];
  /** vignette (pages Projets et accueil) : image, ou boucle vidéo + affiche */
  vignette?: { image?: string; video?: string; poster?: string };
}

/** étude de cas du site du studio (visuels de public/travaux/<source>/) */
export interface ProjetEtude extends ProjetBase {
  kind: "etude";
  source: string;
  /** visuel principal choisi à la main (sinon : le hero de l'étude) */
  principal?: string;
  /** visuels de l'étude à ne pas montrer ici (ex. ceux qui portent le nom du studio) */
  exclure?: RegExp;
}
/** LITHIC MEMORY — page sur mesure */
export interface ProjetLithic extends ProjetBase {
  kind: "lithic";
}
/** productions en image générée (anciens projets du Lab) : boucles courtes
 *  tirées des films, avec une image d'affiche */
export interface ProjetFilms extends ProjetBase {
  kind: "films";
  tag: L;
  films: { label: L; src: string; poster: string }[];
  images?: string[];
}
export type Projet = ProjetEtude | ProjetLithic | ProjetFilms;

const LM = "/kamil-grimes/lithic-memory";
const IA = "/kamil-grimes/ia";
const FENNEC = "/travaux/fennec-coffee-roasters";

export const projets: Projet[] = [
  {
    kind: "etude",
    slug: "imlead",
    source: "imlead",
    titre: "IMLEAD",
    filtres: ["identite", "web", "editorial"],
    annee: "2026",
    sousTitre: { fr: "« Gouverner pour valoriser. »", en: "“Govern to create value.”" },
    secteur: {
      fr: "Immobilier — Assistance à maîtrise d'ouvrage",
      en: "Real estate — Client-side project management",
    },
    role: {
      fr: "Direction créative · Web · Branding · Audit stratégique",
      en: "Creative direction · Web · Branding · Strategic audit",
    },
    projet: {
      fr: "Identité, charte, contenus sociaux et site d'un cabinet de gouvernance de projet, qui représente le maître d'ouvrage dans les opérations immobilières à forts enjeux.",
      en: "Identity, guidelines, social content and website for a project governance firm that represents the client-owner in high-stakes real-estate operations.",
    },
    defi: {
      fr: "Un métier que le marché nomme mal, dans un secteur immobilier algérien dominé par des codes visuels génériques. Il fallait rendre visible une position : le tiers rigoureux qui arbitre, là où d'autres exécutent.",
      en: "A profession the market struggles to name, in an Algerian real-estate sector dominated by generic visual codes. The task was to make a position visible: the rigorous third party who arbitrates, where others execute.",
    },
  },
  {
    kind: "lithic",
    slug: "lithic-memory",
    titre: "LITHIC MEMORY",
    filtres: ["production", "film"],
    // TODO — année à confirmer (CV : 2025 ; fichiers du projet : 2026)
    annee: "2025",
    sousTitre: {
      fr: "« Tlagh » — Une mémoire de pierre, et une route vers la lumière.",
      en: "“Tlagh” — A memory of stone, and a road toward the light.",
    },
    secteur: { fr: "Musique", en: "Music" },
    role: {
      fr: "Producteur — production de l'album et de son univers visuel, gestion financière, démarchage",
      en: "Producer — production of the album and its visual universe, financial management, outreach",
    },
    projet: {
      fr: "Un album musical et son univers visuel : un signe, un titre, une série de couvertures et le clip du morceau « Tlagh », en deux minutes quarante-deux.",
      en: "A music album and its visual universe: a sign, a title, a series of covers and the music video for the track “Tlagh”, two minutes forty-two long.",
    },
    defi: {
      fr: "« Tlagh » porte le nom d'une ville de l'Ouest algérien. LITHIC MEMORY part d'une idée simple : la pierre se souvient. Il fallait une image à la hauteur : un signe qui tienne seul, des couvertures qui s'imposent en petit sur un écran de téléphone, et un clip qui installe un monde en moins de trois minutes.",
      en: "“Tlagh” is named after a town in western Algeria. LITHIC MEMORY starts from a simple idea: stone remembers. The images had to live up to it: a sign that stands on its own, covers that hold up at thumbnail size on a phone screen, and a video that builds a world in under three minutes.",
    },
    vignette: {
      video: `${LM}/films/lithic-01-titre.mp4`,
      poster: `${LM}/films/lithic-01-titre-poster.jpg`,
    },
  },
  {
    kind: "etude",
    slug: "banbiom",
    source: "banbiom",
    titre: "BANBIOM",
    filtres: ["identite", "web"],
    annee: "2026",
    sousTitre: { fr: "« La mer, cellule par cellule. »", en: "“The sea, cell by cell.”" },
    secteur: {
      fr: "Biodiversité marine — Données scientifiques",
      en: "Marine biodiversity — Scientific data",
    },
    // TODO — rôle de Kamil à confirmer (absent du CV) : repris des champs du projet
    role: {
      fr: "Direction créative · Identité · Système graphique · Application web",
      en: "Creative direction · Identity · Graphic system · Web application",
    },
    projet: {
      fr: "Identité, système graphique et application d'une banque de données des écosystèmes marins de la côte algérienne : une fiche par espèce, et un espace où les chercheurs ajoutent les leurs.",
      en: "Identity, graphic system and application for a database of marine ecosystems along the Algerian coast: one record per species, and a space where researchers add their own.",
    },
    defi: {
      fr: "Une base scientifique a deux publics : le chercheur, qui veut des fiches vérifiables, et le visiteur, qui veut comprendre ce qui vit sous la surface. Il fallait une image qui serve les deux. Réponse : le diagramme de Voronoï, où une cellule est une espèce et chaque forme porte une donnée.",
      en: "A scientific database has two audiences: researchers, who want verifiable records, and visitors, who want to understand what lives below the surface. The image had to serve both. The answer: the Voronoi diagram, where a cell is a species and every shape carries data.",
    },
    vignette: { image: "/travaux/banbiom/01-hero.webp" },
    // la couverture de la charte et l'animation d'étude de cas citent le studio
    exclure: /(02-vibe-couverture|18-application-etude-de-cas)/,
  },
  {
    kind: "etude",
    slug: "mag-agency",
    source: "mag-agency",
    titre: "MAG Agency",
    filtres: ["identite", "web"],
    annee: "2025",
    sousTitre: {
      fr: "« Protéger le capital avant de le déployer. »",
      en: "“Protect the capital before deploying it.”",
    },
    secteur: {
      fr: "Aéronautique — Conseil en investissement",
      en: "Aviation — Investment advisory",
    },
    role: { fr: "Identité · Web · Direction artistique", en: "Identity · Web · Art direction" },
    projet: {
      fr: "Identité, direction artistique et site d'un cabinet de conseil en investissement aéronautique installé à Dubaï, qui intervient en Europe, au Moyen-Orient et en Afrique.",
      en: "Identity, art direction and website for an aviation investment advisory firm based in Dubai, working across Europe, the Middle East and Africa.",
    },
    defi: {
      fr: "Deux métiers très différents sous le même nom : investir dans un avion, et investir dans l'aviation. L'investisseur devait comprendre l'offre avant de comprendre le cabinet ; il fallait qu'il sache en un clic par quelle porte entrer.",
      en: "Two very different businesses under one name: investing in an aircraft, and investing in aviation. Investors had to understand the offer before understanding the firm; they needed to know in one click which door to walk through.",
    },
    principal: "/travaux/mag-agency/01-hero.webp",
  },
  {
    kind: "etude",
    slug: "fennec-cafe",
    source: "fennec-coffee-roasters",
    titre: "Fennec Café",
    filtres: ["identite", "packaging", "film"],
    annee: "2025",
    sousTitre: {
      fr: "« Trois massifs, trois cafés, une même matière. »",
      en: "“Three ranges, three coffees, one material.”",
    },
    secteur: { fr: "Café de spécialité — torréfaction", en: "Specialty coffee — roasting" },
    role: {
      fr: "Branding · Packaging · Réseaux sociaux",
      en: "Branding · Packaging · Social media",
    },
    projet: {
      fr: "Identité, packaging, illustration et films d'une gamme de trois cafés de spécialité torréfiés en Algérie, chacun nommé d'après un massif : Aurès, Hogar, Tassili.",
      en: "Identity, packaging, illustration and films for a range of three specialty coffees roasted in Algeria, each named after a mountain range: Aurès, Hogar, Tassili.",
    },
    defi: {
      fr: "Le café de spécialité a ses codes, venus d'ailleurs, et partout ils se ressemblent. Il fallait une marque qui parle le même langage de qualité, mais qui ne puisse venir que d'ici.",
      en: "Specialty coffee has its own codes, imported from elsewhere, and everywhere they look alike. The brand had to speak the same language of quality, yet could only come from here.",
    },
    vignette: {
      video: `${FENNEC}/17-application-film-aures-nuit.mp4`,
      poster: `${FENNEC}/17-application-film-aures-nuit-poster.jpg`,
    },
  },
  {
    kind: "etude",
    slug: "astarte-conseils",
    source: "astarte-conseils",
    titre: "Astarté Conseils",
    filtres: ["identite", "web", "editorial"],
    annee: "2026",
    sousTitre: { fr: "« Le terrain comme doctrine. »", en: "“The ground as doctrine.”" },
    secteur: { fr: "Conseil & études — Maghreb, Sahel", en: "Consulting & research — Maghreb, Sahel" },
    role: { fr: "Direction créative · Web · Branding", en: "Creative direction · Web · Branding" },
    projet: {
      fr: "Identité de marque, direction artistique, éditorial et site d'un cabinet d'études et de conseil qui travaille en Algérie, au Maghreb et au Sahel.",
      en: "Brand identity, art direction, editorial and website for a research and consulting firm working in Algeria, the Maghreb and the Sahel.",
    },
    defi: {
      fr: "Quinze ans de missions, mais un discours qui ressemblait à celui de tout le monde. Leur vraie force, la connaissance du terrain là où les modèles importés se cassent, restait implicite : il fallait en faire l'axe de toute la marque.",
      en: "Fifteen years of missions, but a message that sounded like everyone else's. Their real strength, knowing the ground where imported models break down, remained implicit: it had to become the backbone of the whole brand.",
    },
  },
  {
    kind: "etude",
    slug: "marpharmal",
    source: "marpharmal",
    titre: "Marpharmal",
    filtres: ["campagne", "identite"],
    annee: "2024",
    sousTitre: {
      fr: "« La science de la mer, rendue lisible. »",
      en: "“Marine science, made readable.”",
    },
    secteur: { fr: "Événementiel scientifique — Algérie", en: "Scientific events — Algeria" },
    role: { fr: "Campagne · Branding · Motion", en: "Campaign · Branding · Motion" },
    projet: {
      fr: "Identité et système visuel de la conférence nationale sur l'économie pharmaceutique et l'innovation issue des produits de la mer, déclinés sur tous les supports : scène, banderoles, écrans, badges, programme et magazine.",
      en: "Identity and visual system for the national conference on the pharmaceutical economy and marine-derived innovation, rolled out across every medium: stage, banners, screens, badges, programme and magazine.",
    },
    defi: {
      fr: "Partir d'une page blanche et tenir une tension : rester crédible auprès des chercheurs tout en restant lisible pour tous. Vulgariser sans décrédibiliser.",
      en: "Starting from a blank page and holding a tension: staying credible to researchers while remaining readable to everyone. Popularising without discrediting.",
    },
    principal: "/travaux/marpharmal/08-application-scene.webp",
  },
  {
    kind: "etude",
    slug: "spoon-atelier",
    source: "spoon-atelier",
    titre: "Spoon Atelier",
    filtres: ["identite", "editorial"],
    annee: "2026",
    sousTitre: { fr: "« Le mobilier comme pièce. »", en: "“Furniture as a piece.”" },
    secteur: { fr: "Mobilier — Atelier de création", en: "Furniture — Design workshop" },
    role: {
      fr: "Direction créative · Éditorial · Branding",
      en: "Creative direction · Editorial · Branding",
    },
    projet: {
      fr: "Identité, charte, visualisation 3D et fiches produit d'un atelier qui fabrique ses meubles une à une.",
      en: "Identity, guidelines, 3D visualisation and product sheets for a workshop that makes its furniture one piece at a time.",
    },
    defi: {
      fr: "Le travail était là, le cadre manquait : chaque objet existait pour lui-même, sans grammaire commune. Il fallait transformer des meubles isolés en une collection.",
      en: "The craft was there, the framework was missing: each object existed on its own, with no shared grammar. Isolated pieces had to become a collection.",
    },
  },
  {
    kind: "films",
    slug: "cristor",
    titre: "Cristor",
    filtres: ["ia", "film"],
    // TODO — description, rôle et année (à fournir par Kamil)
    tag: { fr: "VFX · Packshot IA", en: "VFX · AI packshot" },
    films: [
      { label: { fr: "Cuisinière — spot", en: "Cooker — spot" }, src: `${IA}/cristor/cuisiniere.webm`, poster: `${IA}/cristor/cuisiniere-poster.jpg` },
      { label: { fr: "Climatiseur — spot", en: "Air conditioner — spot" }, src: `${IA}/cristor/climatiseur.webm`, poster: `${IA}/cristor/climatiseur-poster.jpg` },
      { label: { fr: "Film corporate — 45 s", en: "Corporate film — 45 s" }, src: `${IA}/cristor/film-corporate.webm`, poster: `${IA}/cristor/film-corporate-poster.jpg` },
      { label: { fr: "Showroom", en: "Showroom" }, src: `${IA}/cristor/showroom.webm`, poster: `${IA}/cristor/showroom-poster.jpg` },
    ],
    vignette: { video: `${IA}/cristor/cuisiniere.webm`, poster: `${IA}/cristor/cuisiniere-poster.jpg` },
  },
  {
    kind: "films",
    slug: "bassit",
    titre: "Bassit",
    filtres: ["ia", "film"],
    // TODO — description, rôle et année (à fournir par Kamil)
    tag: { fr: "VFX", en: "VFX" },
    films: [{ label: { fr: "Bassit", en: "Bassit" }, src: `${IA}/bassit/bassit.webm`, poster: `${IA}/bassit/bassit-poster.jpg` }],
    images: [`${IA}/bassit/still-1.jpg`, `${IA}/bassit/still-2.jpg`, `${IA}/bassit/still-3.jpg`],
    vignette: { video: `${IA}/bassit/bassit.webm`, poster: `${IA}/bassit/bassit-poster.jpg` },
  },
];

/** LITHIC MEMORY — album produit par Kamil (CV : « Producteur — Lithic Memory,
 *  projet Al Mawred ») et son univers visuel. Textes d'après le dossier du
 *  projet ; aucune mention d'outil ni de procédé de fabrication des images. */
export const lithicMemory = {
  cadre: { fr: "Projet Al Mawred", en: "Al Mawred project" } as L,
  direction: {
    fr: "Le noir et blanc, et le grain : une image qui a l'air d'avoir traversé le temps. Une seule couleur pour la marque, le bleu du titre ; une seule couleur d'alerte, réservée aux couvertures, le rouge. Et une figure, le taureau : gravé dans la pierre, vivant dans le troupeau qui charge, seul dans la plaine de nuit.",
    en: "Black and white, and grain: images that look as if they have travelled through time. One colour for the brand, the blue of the title; one alert colour, reserved for the covers, red. And one figure, the bull: carved in stone, alive in the charging herd, alone on the plain at night.",
  } as L,
  labels: {
    couvertures: { fr: "Les couvertures", en: "The covers" },
    signe: { fr: "Le signe dans le paysage", en: "The sign in the landscape" },
    mineral: { fr: "La mémoire minérale, puis le troupeau", en: "Mineral memory, then the herd" },
    storyboard: { fr: "Le storyboard", en: "The storyboard" },
    agrandir: { fr: "Agrandir ↗", en: "Enlarge ↗" },
    clip: { fr: "Le clip — « Tlagh », 2 min 42", en: "The video — “Tlagh”, 2 min 42" },
    storyboardAlt: { fr: "Storyboard du clip « Tlagh »", en: "Storyboard for the “Tlagh” video" },
  } satisfies Record<string, L>,
  boucleTitre: `${LM}/films/lithic-01-titre.mp4`,
  posterTitre: `${LM}/films/lithic-01-titre-poster.jpg`,
  boucles: [
    { label: { fr: "Le troupeau", en: "The herd" }, src: `${LM}/films/lithic-02-troupeau.mp4`, poster: `${LM}/films/lithic-02-troupeau-poster.jpg` },
    { label: { fr: "Le signe", en: "The sign" }, src: `${LM}/films/lithic-03-signe.mp4`, poster: `${LM}/films/lithic-03-signe-poster.jpg` },
    { label: { fr: "La piste", en: "The road" }, src: `${LM}/films/lithic-04-piste.mp4`, poster: `${LM}/films/lithic-04-piste-poster.jpg` },
  ] as { label: L; src: string; poster: string }[],
  couvertures: [
    { label: { fr: "La porte aux taureaux", en: "The bull gate" }, src: `${LM}/couvertures/couverture-03-porte.jpg` },
    { label: { fr: "Le troupeau", en: "The herd" }, src: `${LM}/couvertures/couverture-01-troupeau.jpg` },
    { label: { fr: "Le trait rouge", en: "The red line" }, src: `${LM}/couvertures/couverture-02-troupeau-rouge.jpg` },
    { label: { fr: "L'horizon", en: "The horizon" }, src: `${LM}/couvertures/couverture-04-horizon.jpg` },
    { label: { fr: "La nuit", en: "The night" }, src: `${LM}/couvertures/couverture-05-horizon-large.jpg` },
  ] as { label: L; src: string }[],
  signe: [`${LM}/images/still-01-signe-lac.jpg`, `${LM}/images/still-02-signe-monolithes.jpg`],
  mineral: [
    `${LM}/images/still-03-roches.jpg`,
    `${LM}/images/still-04-falaise.jpg`,
    `${LM}/images/still-12-taureau-nuit.jpg`,
    `${LM}/images/still-06-colonne.jpg`,
  ],
  troupeau: [
    `${LM}/images/still-07-troupeau.jpg`,
    `${LM}/images/still-08-troupeau-nuit.jpg`,
    `${LM}/images/still-09-troupeau-horizon.jpg`,
    `${LM}/images/still-10-plaine.jpg`,
    `${LM}/images/still-05-tours.jpg`,
    `${LM}/images/still-11-oeil.jpg`,
  ],
  storyboard: { image: `${LM}/storyboard.jpg`, png: `${LM}/storyboard.png` },
  clip: { src: `${LM}/films/clip-tlagh-720p.mp4`, poster: `${LM}/images/still-08-troupeau-nuit.jpg` },
  signeSvg: `${LM}/phase0.svg`,
};

/* ---------- parcours ---------- */

export interface Ligne {
  annee: string;
  titre: L | string;
  structure?: L | string;
  detail?: L | string;
}

export const experiences: Ligne[] = [
  {
    annee: "2026",
    titre: { fr: "Producteur exécutif", en: "Executive producer" },
    structure: "Ennahar TV",
    detail: {
      fr: "Producteur exécutif et directeur de production d'une série de 5 × 15 min, « Halwa Wmoura ».",
      en: "Executive producer and production manager of a 5 × 15 min series, “Halwa Wmoura”.",
    },
  },
  {
    annee: "2025",
    titre: { fr: "Producteur", en: "Producer" },
    structure: { fr: "« Lithic Memory » — projet Al Mawred", en: "“Lithic Memory” — Al Mawred project" },
    detail: {
      fr: "Production d'un album musical accompagné de la création d'un univers visuel associé. Gestion financière et démarchage du projet.",
      en: "Production of a music album along with the creation of its visual universe. Financial management and outreach for the project.",
    },
  },
  {
    annee: "2024",
    titre: { fr: "Designer junior", en: "Junior designer" },
    structure: { fr: "Havas Algérie (Genfood)", en: "Havas Algeria (Genfood)" },
    detail: {
      fr: "Campagnes pour Hamoud Boualem, Castel et Heineken : key visuals, assets de campagne, déclinaisons motion design ; projets de branding et de systèmes d'identité.",
      en: "Campaigns for Hamoud Boualem, Castel and Heineken: key visuals, campaign assets, motion design adaptations; branding and identity system projects.",
    },
  },
  {
    annee: "2024",
    titre: { fr: "Directeur créatif", en: "Creative director" },
    structure: "Boulevard Design",
    detail: {
      fr: "Direction créative sur une campagne pour la GIZ ; coordination d'un réseau de freelances et de collaborateurs externes. Organisation du concours du programme Jil Siyaha (logistique et communication).",
      en: "Creative direction on a campaign for GIZ; coordination of a network of freelancers and external collaborators. Organisation of the Jil Siyaha programme competition (logistics and communication).",
    },
  },
  {
    annee: "2023",
    titre: { fr: "Designer junior", en: "Junior designer" },
    structure: { fr: "Lotus Conseils (groupe Leo Burnett / Publicis)", en: "Lotus Conseils (Leo Burnett / Publicis group)" },
    detail: {
      fr: "Traduction de briefs en propositions et campagnes visuelles pour Cevital, Ooredoo et UNO.",
      en: "Turning briefs into proposals and visual campaigns for Cevital, Ooredoo and UNO.",
    },
  },
];

const MESRS: L = {
  fr: "Ministère de l'Enseignement supérieur et de la Recherche scientifique",
  en: "Ministry of Higher Education and Scientific Research",
};

export const missions: Ligne[] = [
  {
    annee: "2026",
    titre: { fr: "Registre des filiales du MESRS, vol. 2", en: "Register of MESRS subsidiaries, vol. 2" },
    structure: MESRS,
    detail: {
      fr: "Conception éditoriale et direction créative ; organisation de la donnée.",
      en: "Editorial design and creative direction; data organisation.",
    },
  },
  { annee: "2026", titre: "Astarté Conseils", detail: { fr: "Direction créative · Web · Branding", en: "Creative direction · Web · Branding" } },
  { annee: "2026", titre: "IMLEAD", detail: { fr: "Direction créative · Web · Branding · Audit stratégique", en: "Creative direction · Web · Branding · Strategic audit" } },
  { annee: "2026", titre: "Atelier Spoon", detail: { fr: "Direction créative · Éditorial · Branding", en: "Creative direction · Editorial · Branding" } },
  { annee: "2025", titre: "MAG Agency", detail: { fr: "Identité · Web · Direction artistique", en: "Identity · Web · Art direction" } },
  { annee: "2025", titre: "Fennec Café", detail: { fr: "Branding · Packaging · Réseaux sociaux", en: "Branding · Packaging · Social media" } },
  {
    annee: "2025",
    titre: { fr: "Registre des filiales du MESRS, vol. 1", en: "Register of MESRS subsidiaries, vol. 1" },
    structure: MESRS,
    detail: {
      fr: "Organisation de la donnée, solution web et document récapitulatif.",
      en: "Data organisation, web solution and summary document.",
    },
  },
  {
    annee: "2025",
    titre: "Olympiades des métiers",
    structure: "ONCI",
    detail: { fr: "Motion design du spectacle d'inauguration.", en: "Motion design for the opening show." },
  },
  {
    annee: "2025",
    titre: "Ecogic",
    detail: {
      fr: "Branding · Web — identité et site pour une entreprise d'ingénierie écologique.",
      en: "Branding · Web — identity and website for an ecological engineering company.",
    },
  },
  {
    annee: "2025",
    titre: { fr: "Amnesty International Algérie", en: "Amnesty International Algeria" },
    detail: {
      fr: "Éditorial — supports et illustrations pour la journée des droits des femmes.",
      en: "Editorial — materials and illustrations for International Women's Day.",
    },
  },
  {
    annee: "2025",
    titre: "Burha (Aromplus)",
    detail: {
      fr: "Branding · Packaging — identité et packaging d'une sous-marque.",
      en: "Branding · Packaging — identity and packaging for a sub-brand.",
    },
  },
  {
    annee: "2024",
    titre: "Marpharmal",
    detail: {
      fr: "Campagne · Branding · Motion — campagne de communication pour une conférence sur les produits halieutiques dans le secteur médical.",
      en: "Campaign · Branding · Motion — communication campaign for a conference on marine products in the medical sector.",
    },
  },
  {
    annee: "2024",
    titre: {
      fr: "Conférence sur la sécurité alimentaire dans le monde arabe",
      en: "Conference on food security in the Arab world",
    },
    structure: { fr: "Ligue arabe", en: "Arab League" },
    detail: {
      fr: "Rédaction du document stratégique et de la stratégie de communication.",
      en: "Writing of the strategy document and the communication strategy.",
    },
  },
  {
    annee: "2023",
    titre: { fr: "Jeux arabes", en: "Arab Games" },
    detail: {
      fr: "Motion design des spectacles d'inauguration et de clôture.",
      en: "Motion design for the opening and closing shows.",
    },
  },
  {
    annee: "2023",
    titre: { fr: "Programme « Économie bleue »", en: "“Blue Economy” programme" },
    structure: { fr: "Union européenne en Algérie", en: "European Union in Algeria" },
    detail: {
      fr: "Conception des supports et de la stratégie de communication.",
      en: "Design of materials and the communication strategy.",
    },
  },
];

export const formation: Ligne[] = [
  { annee: "2023 — 2025", titre: { fr: "Master Image Média", en: "Master's in Image & Media" }, structure: { fr: "ESBA Alger", en: "ESBA Algiers" } },
  { annee: "2020 — 2022", titre: { fr: "Licence Image Média", en: "Bachelor's in Image & Media" }, structure: { fr: "ESBA Alger", en: "ESBA Algiers" } },
  { annee: "2019", titre: { fr: "Bac Mathématiques techniques", en: "Baccalaureate, Technical Mathematics" } },
];

export const competences: { titre: L; items: L[] }[] = [
  {
    titre: { fr: "Design et communication", en: "Design & communication" },
    items: [
      { fr: "Stratégie de communication", en: "Communication strategy" },
      { fr: "Identité de marque", en: "Brand identity" },
      { fr: "Identité visuelle", en: "Visual identity" },
      { fr: "Graphisme", en: "Graphic design" },
      { fr: "Motion design", en: "Motion design" },
      { fr: "3D", en: "3D" },
      { fr: "Direction créative et artistique", en: "Creative and art direction" },
      { fr: "Prompt engineering", en: "Prompt engineering" },
    ],
  },
  {
    titre: { fr: "Production", en: "Production" },
    items: [
      { fr: "Production audiovisuelle", en: "Audiovisual production" },
      { fr: "Direction de production", en: "Production management" },
      { fr: "Gestion budgétaire et opérationnelle", en: "Budget and operations management" },
      { fr: "Montage de dossier", en: "Funding applications" },
    ],
  },
  {
    titre: { fr: "Logiciels", en: "Software" },
    items: [
      { fr: "Suite Adobe : Illustrator, Photoshop, After Effects, InDesign", en: "Adobe suite: Illustrator, Photoshop, After Effects, InDesign" },
      { fr: "Next.js / React, notions de bases de données", en: "Next.js / React, database basics" },
      { fr: "Hermes, ComfyUI", en: "Hermes, ComfyUI" },
      { fr: "Notion, suite Microsoft", en: "Notion, Microsoft Office" },
    ],
  },
  {
    titre: { fr: "Langues", en: "Languages" },
    items: [
      { fr: "Français C2", en: "French C2" },
      { fr: "Anglais C2", en: "English C2" },
      { fr: "Arabe C2", en: "Arabic C2" },
    ],
  },
];
