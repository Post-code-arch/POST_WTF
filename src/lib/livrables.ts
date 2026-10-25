/* ════════════════════════════════════════════════════════════════
   Livrables de chaque programme et de chaque offre : ce que le client
   reçoit, regroupé par nature. Une seule liste par offre, sans palier,
   sans quantité ni prix — le périmètre exact se cale au premier échange.
   Source : les fiches d'offre de post_ (2026), mises à plat.
   ════════════════════════════════════════════════════════════════ */

export interface GroupeLivrables {
  groupe: string;
  items: string[];
}

export const LIVRABLES: Record<string, GroupeLivrables[]> = {
  "mutation-structuration": [
    {
      groupe: "Stratégie",
      items: [
        "Audit stratégique",
        "Plateforme de marque du groupe",
        "Architecture de marque",
      ],
    },
    {
      groupe: "Identité",
      items: [
        "Système identitaire complet",
        "Chartes déclinées par entité",
        "Charte graphique du groupe et papeterie de direction",
      ],
    },
    {
      groupe: "Web",
      items: [
        "Portail web corporate de référence",
        "Intégration de l'écosystème des filiales",
        "Déploiement multi-sites interconnectés",
      ],
    },
    {
      groupe: "Film",
      items: [
        "Film de groupe : l'histoire et la trajectoire",
        "Film manifeste porté par la vision des dirigeants",
        "Films dédiés par pôle d'activité",
      ],
    },
    {
      groupe: "Interne",
      items: ["Kit d'intégration", "Outils de communication interne"],
    },
  ],

  "rayonnement-expansion": [
    {
      groupe: "Identité",
      items: ["Identité mise à niveau", "Déclinaisons multilingues"],
    },
    {
      groupe: "Web",
      items: ["Portail web trilingue", "Catalogue et offres structurés"],
    },
    {
      groupe: "Film",
      items: ["Film de référence en 4K", "Versions multilingues"],
    },
    {
      groupe: "Rendez-vous",
      items: ["Présentation commerciale B2B (pitch deck)", "Supports d'exposition"],
    },
  ],

  identite: [
    {
      groupe: "Stratégie de marque",
      items: [
        "Positionnement et architecture de marque",
        "Territoire et personnalité de marque",
        "Proposition de valeur et différenciation",
        "Ton de voix",
      ],
    },
    {
      groupe: "Signe et système",
      items: [
        "Création du logo, ou redessin précis de l'existant (restructuration, vectorisation)",
        "Architecture de logos et déclinaisons",
        "Typographie",
        "Couleur et harmonisation chromatique",
        "Bibliothèque d'éléments graphiques",
        "Principes de composition et de mise en page",
        "Motion identity et logo animé",
      ],
    },
    {
      groupe: "Règles",
      items: [
        "Charte d'application et guidelines",
        "Guide de transition, quand l'identité existante évolue",
      ],
    },
    {
      groupe: "Supports",
      items: [
        "Carte de visite et kit papeterie",
        "Signature e-mail",
        "Photo de profil et couverture des réseaux sociaux",
        "Modèles de publication pour les réseaux sociaux",
        "Signalétique de bureau",
      ],
    },
  ],

  web: [
    {
      groupe: "Conception",
      items: [
        "Structuration et rédaction des contenus, à partir de vos informations",
        "Stratégie éditoriale adaptée à vos différents publics",
        "UX / UI et design sur mesure",
        "Direction artistique, interactions et animations",
      ],
    },
    {
      groupe: "Développement",
      items: [
        "Développement sur mesure, adapté au mobile et à la tablette",
        "Espace d'administration pour modifier vos contenus",
        "Pages dédiées : références, réalisations, secteurs, certifications, équipe",
        "Versions bilingues ou multilingues (FR, AR, EN)",
        "Catalogue, espaces dédiés et fonctionnalités définies au cahier des charges",
      ],
    },
    {
      groupe: "Mise en ligne",
      items: [
        "Formulaire de contact",
        "Optimisation des performances et référencement technique",
        "Mise en ligne et hébergement la première année",
      ],
    },
  ],

  film: [
    {
      groupe: "Écriture",
      items: [
        "Écriture éditoriale et découpage technique",
        "Conception narrative et direction artistique",
        "Écriture documentaire ou scénario sur mesure",
      ],
    },
    {
      groupe: "Tournage",
      items: [
        "Tournage sur site, de l'équipe réduite à l'équipe cinéma complète",
        "Éclairage et prise de son",
        "Machinerie de mouvement et prises de vues aériennes",
        "Casting, décors et direction de production",
        "Tournages multi-sites ou suivi au long cours",
      ],
    },
    {
      groupe: "Post-production",
      items: [
        "Montage, étalonnage et mixage audio",
        "Habillage graphique : motion design, typographie, données clés",
        "Animations 3D",
      ],
    },
    {
      groupe: "Livraison",
      items: [
        "Film principal",
        "Versions multilingues : sous-titrage ou voix off",
        "Formats adaptés à chaque écran",
        "Série d'épisodes ou écosystème vidéo",
      ],
    },
  ],

  contenu: [
    {
      groupe: "Design",
      items: [
        "Déclinaisons graphiques régulières",
        "Éditions, rapports et bilans",
        "Présentations stratégiques",
        "Supports d'événements",
        "Infographies et données",
      ],
    },
    {
      groupe: "Vidéo",
      items: [
        "Captations régulières sur site",
        "Formats courts : interviews, capsules, temps forts",
        "Formats narratifs et habillages animés",
        "Montage, étalonnage et déclinaisons multi-formats",
      ],
    },
    {
      groupe: "Suivi",
      items: [
        "Réunions de cadrage mensuelles",
        "Gestion des réseaux sociaux",
        "Direction artistique et veille sur le respect de la charte",
      ],
    },
  ],
};
