/* ════════════════════════════════════════════════════════════════
   Offres de post_ : deux portes d’entrée présentées à égalité.
     - 2 programmes (dispositifs intégrés)
     - 4 offres (commandables seules)
   Chaque entrée alimente sa carte (/offres, accueil) et sa page
   (/offres/<slug>). Jamais de palier, de formule, de niveau ni de prix :
   une entrée se définit par la situation du client.

   `null` = contenu à rédiger (TODO). En développement, la page affiche un
   repère « TODO » ; en production, la section ou la ligne est omise.
   ════════════════════════════════════════════════════════════════ */

import { LIVRABLES, type GroupeLivrables } from "./livrables";

export type OffreKind = "programme" | "offre";

/** les 4 temps du process, une phrase adaptée par page */
export interface Process {
  lecture: string | null;
  direction: string | null;
  fabrication: string | null;
  application: string | null;
}

export interface Offre {
  slug: string;
  kind: OffreKind;
  nom: string;
  /** paragraphe de la carte (page Offres) */
  carte: string;
  /** résumé en quelques mots (tableau de l'accueil), tiré de la carte */
  resume: string;
  /** hero — phrase de promesse */
  promesse: string;
  /** hero — accroche placée en sous-titre (reprise des anciennes accroches) */
  accroche?: string;
  /** mention factuelle sous le hero (ex. agrément) */
  mention?: string;
  /** section « Quand… » */
  quand: { titre: string | null; texte: string | null; signes: string[] | null };
  /** références : slugs d’études de cas, ou noms ; null = TODO */
  references: string[] | null;
  /** ce que ça change — trois résultats */
  changements: string[] | null;
  /** études de cas liées : slugs explicites, ou filtre sur les champs des fiches */
  travaux: { slugs: string[] } | { champs: RegExp };
  process: Process;
  pratique: {
    pourQui: string | null;
    demande: string | null;
    livre: string | null;
  };
  /** clôture — une question */
  cloture: string | null;
  /** offres : programmes dont elle fait partie (slugs) */
  programmes?: string[];
  /** visuel d'illustration (page Offres) */
  visuel?: string;
  /** livrables détaillés, regroupés par nature (lib/livrables.ts) */
  livrables?: GroupeLivrables[];
}

const PROCESS_TODO: Process = {
  lecture: null, // TODO
  direction: null, // TODO
  fabrication: null, // TODO
  application: null, // TODO
};

export const offres: Offre[] = [
  /* ---------------- programmes ---------------- */
  {
    slug: "mutation-structuration",
    kind: "programme",
    nom: "Mutation & Structuration",
    resume: "Croissance · transmission · filiales à harmoniser",
    carte:
      "Un dispositif complet pour les organisations qui ont changé plus vite que leur image : croissance, transmission, filiales à harmoniser. Architecture de marque, identité, portail et film de groupe, menés ensemble. Pour les groupes, les ETI et les entreprises en restructuration.",
    promesse:
      "Le programme pour les organisations qui ont changé plus vite que leur image.",
    quand: {
      titre: "Quand l'organisation change, l'image doit suivre.",
      texte:
        "La croissance multiplie les entités, les supports et les récits. Sans direction commune, l'image se fragmente et ne dit plus ce que l'organisation est devenue.",
      signes: [
        "Vos filiales ont chacune leur logo, leur ton et leur site.",
        "Votre site présente l'entreprise d'il y a dix ans.",
        "Vos équipes racontent l'organisation chacune à leur façon.",
        "Un changement de direction ou d'actionnariat appelle un nouveau récit.",
        "Vos partenaires perçoivent une structure plus petite que celle que vous êtes.",
      ],
    },
    // Présidence : étude de cas en brouillon, masquée tant qu'elle n'est pas publiée
    references: ["imlead", "marpharmal", "astarte-conseils", "presidence"],
    changements: [
      "Une image de groupe lisible par tous.",
      "Un récit que la direction porte.",
      "Un standard qui tient sur chaque support.",
    ],
    travaux: { slugs: ["imlead", "marpharmal", "astarte-conseils", "presidence"] },
    process: PROCESS_TODO, // TODO — une phrase par temps
    pratique: {
      pourQui:
        "Groupes, ETI et holdings en croissance, en transmission ou en restructuration.",
      demande:
        "Un sponsor à la direction et un référent projet, présents aux étapes de décision.",
      livre:
        "Architecture de marque, identité et chartes par entité, portail web corporate, film de groupe, outils de communication interne.",
    },
    cloture: "Votre organisation a changé ? Votre image peut suivre.",
  },
  {
    slug: "rayonnement-expansion",
    kind: "programme",
    nom: "Rayonnement & Expansion",
    resume: "Nouveau marché · bailleur · grand salon",
    carte:
      "Un dispositif complet pour aborder un nouveau marché, un bailleur ou un grand salon. Identité, site trilingue, film de présentation et supports d'exposition, au niveau de vos interlocuteurs. Pour les organisations qui exportent ou s'ouvrent à l'international.",
    promesse:
      "Le programme pour convaincre au premier regard, face à des interlocuteurs étrangers.",
    quand: {
      titre: "On vous juge sur vos outils avant de vous entendre.",
      texte:
        "Un acheteur, un bailleur ou un partenaire étranger se fait une idée sur votre site, votre film et vos documents, avant le premier rendez-vous.",
      signes: [
        "Vous préparez un salon international ou une mission export.",
        "Un bailleur va examiner votre dossier.",
        "Votre site n'existe qu'en une langue.",
        "Votre offre n'est pas lisible pour un acheteur étranger.",
        "Votre film de présentation date, ou n'existe pas.",
      ],
    },
    // MAG Agency (Dubaï) ; autres références : TODO
    references: ["mag-agency"],
    changements: [
      "Une image au standard de vos interlocuteurs.",
      "Une offre lisible en trois langues.",
      "Des supports prêts pour le rendez-vous.",
    ],
    travaux: { slugs: ["mag-agency"] }, // TODO — autres études de cas liées
    process: PROCESS_TODO, // TODO — une phrase par temps
    pratique: {
      pourQui: "Organisations qui exportent ou s'ouvrent à l'international.",
      demande:
        "Un référent à la direction et un calendrier calé sur vos échéances.",
      livre:
        "Identité mise à niveau, portail trilingue avec catalogue d'offres, film de présentation et versions multilingues, présentation commerciale, supports d'exposition.",
    },
    cloture: "Un marché à ouvrir ? Préparons-le.",
  },

  /* ---------------- offres ---------------- */
  {
    slug: "identite",
    kind: "offre",
    visuel: "/travaux/marpharmal/11-application-badge.webp",
    nom: "Identité",
    resume: "Signe · typographie · couleur · ton",
    carte:
      "Créer une identité, ou remettre à niveau celle qui existe sans casser la reconnaissance. Le signe, la typographie, la couleur, le ton et les règles pour que tout tienne à l'usage. Pour les organisations qui lancent une marque, ou dont l'image a vieilli.",
    promesse:
      "Créer une identité, ou remettre à niveau celle qui existe sans casser la reconnaissance. Le signe, la typographie, la couleur, le ton et les règles pour que tout tienne à l'usage.",
    accroche: "Un visage qui tient.",
    quand: { titre: null, texte: null, signes: null }, // TODO
    references: null, // TODO
    changements: null, // TODO
    travaux: { champs: /identit|charte|syst[èe]me visuel|direction artistique/i },
    process: PROCESS_TODO, // TODO
    pratique: {
      pourQui:
        "Les organisations qui lancent une marque, ou dont l'image a vieilli.",
      demande: null, // TODO
      livre:
        "Plateforme de marque (positionnement, architecture, ton de voix), logotype, système typographique, couleur, direction artistique, charte de marque, déclinaisons, guidelines.",
    },
    cloture: null, // TODO
    programmes: ["mutation-structuration", "rayonnement-expansion"],
  },
  {
    slug: "web",
    kind: "offre",
    visuel: "/travaux/imlead/06-application-configurateur.webp",
    nom: "Web",
    resume: "Du site vitrine au portail institutionnel",
    carte:
      "Un site clair, rapide, qui ressemble à la marque qui le porte, du site vitrine au portail institutionnel. Pour les organisations dont le site ne dit plus ce qu'elles font.",
    promesse:
      "Un site clair, rapide, qui ressemble à la marque qui le porte, du site vitrine au portail institutionnel.",
    accroche: "Que ça vive en ligne, proprement.",
    quand: { titre: null, texte: null, signes: null }, // TODO
    references: null, // TODO
    changements: null, // TODO
    travaux: { champs: /site|web/i },
    process: PROCESS_TODO, // TODO
    pratique: {
      pourQui: "Les organisations dont le site ne dit plus ce qu'elles font.",
      demande: null, // TODO
      livre:
        "Design web, UX / UI, développement sur mesure (HTML, CSS, JS), performance, SEO et référencement, design system digital, animation web.",
    },
    cloture: null, // TODO
    programmes: ["mutation-structuration", "rayonnement-expansion"],
  },
  {
    slug: "film",
    kind: "offre",
    visuel: "/home/aventures/av-7.webp",
    nom: "Film",
    resume: "Du portrait au film manifeste",
    carte:
      "Du portrait au film manifeste, écrit, tourné et monté avec des moyens de cinéma. Pour les organisations qui ont besoin d'un film de référence.",
    promesse:
      "Du portrait au film manifeste, écrit, tourné et monté avec des moyens de cinéma.",
    accroche: "Montrer, pas raconter.",
    mention: "Société de production audiovisuelle agréée CNCA.",
    quand: { titre: null, texte: null, signes: null }, // TODO
    references: null, // TODO
    changements: null, // TODO
    travaux: { champs: /film|vid[ée]o|motion/i },
    process: PROCESS_TODO, // TODO
    pratique: {
      pourQui: "Les organisations qui ont besoin d'un film de référence.",
      demande: null, // TODO
      livre:
        "Film documentaire, motion design, compositing, direction technique.",
    },
    cloture: null, // TODO
    programmes: ["mutation-structuration", "rayonnement-expansion"],
  },
  {
    slug: "contenu",
    kind: "offre",
    visuel: "/travaux/imlead/04-fabrication-social-posts.webp",
    nom: "Contenu",
    resume: "Éditions · rapports · présentations · capsules vidéo",
    carte:
      "Un atelier externe sur un rythme régulier : éditions, rapports, présentations, capsules vidéo. Pour les structures qui veulent un flux cohérent sans recruter en interne.",
    promesse:
      "Un atelier externe sur un rythme régulier : éditions, rapports, présentations, capsules vidéo.",
    quand: { titre: null, texte: null, signes: null }, // TODO
    references: null, // TODO
    changements: null, // TODO
    travaux: { champs: /content|contenu|[ée]ditorial|[ée]dition/i },
    process: PROCESS_TODO, // TODO
    pratique: {
      pourQui:
        "Les structures qui veulent un flux cohérent sans recruter en interne.",
      demande: null, // TODO
      // résumé non rédigé : le détail vient de lib/livrables.ts
      livre: null,
    },
    cloture: null, // TODO
    // TODO — programme de rattachement à confirmer
  },
];

for (const o of offres) o.livrables = LIVRABLES[o.slug];

/** version sérialisable (sans le filtre RegExp) pour les composants client */
export type OffreClient = Omit<Offre, "travaux">;
export const toClient = ({ travaux: _travaux, ...o }: Offre): OffreClient => o;

export const programmes = offres.filter((o) => o.kind === "programme");
export const offresSeules = offres.filter((o) => o.kind === "offre");

export function getOffre(slug: string): Offre | undefined {
  return offres.find((o) => o.slug === slug);
}

/** lien de prise de rendez-vous, l'offre passée en paramètre */
export const rdvHref = (slug?: string) =>
  slug ? `/contact?offre=${slug}` : "/contact";
