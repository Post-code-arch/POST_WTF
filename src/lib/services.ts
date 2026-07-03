export interface Service {
  name: string;
  num: string;
  /** accroche courte (sous-titre) */
  line: string;
  /** paragraphe descriptif */
  body: string;
  tagsLeft: string[];
  tagsRight: string[];
  /** dégradé placeholder (en attendant le vrai visuel) */
  bg: string;
  /** chemin de l'image (interaction ripple) — placeholder si absent */
  image?: string;
}

export const services: Service[] = [
  {
    name: "Stratégie",
    num: "01",
    line: "La phase qu’on prend le plus au sérieux.",
    body: "Tout part de là. Avant de dessiner quoi que ce soit, on cherche à comprendre : ce que la marque veut dire, à qui, et ce que les autres racontent déjà. C’est un travail de lecture et de questions — parfois inconfortables, toujours utiles. Ce qui en sort tient sur quelques pages, mais tout le reste s’appuie dessus.",
    tagsLeft: ["Audit", "diagnostic", "positionnement", "architecture"],
    tagsRight: [
      "tone of voice",
      "plateforme verbale",
      "recherche · benchmark culturel",
      "cadrage stratégique.",
    ],
    bg: "linear-gradient(135deg,#868686,#505050)",
    image: "/travaux/astarte-conseils/04-application-carte.webp",
  },
  {
    name: "Identité",
    num: "02",
    line: "« Un visage qui tient. »",
    body: "Une identité, ce n’est pas un logo — c’est tout ce qui fait qu’on vous reconnaît sans lire votre nom. On construit des systèmes complets : le signe, la typographie, la couleur, le ton, et les règles pour que tout ça survive à l’usage. Pensé pour durer des années, pas une saison.",
    tagsLeft: ["Logotype", "Système typographique", "Couleur", "Direction artistique"],
    tagsRight: ["Charte de marque", "Ton de voix", "Déclinaisons", "Guidelines"],
    bg: "linear-gradient(135deg,#5c5c5c,#3a3a3a)",
    image: "/travaux/marpharmal/11-application-badge.webp",
  },
  {
    name: "Web",
    num: "03",
    line: "« Que ça vive en ligne, proprement. »",
    body: "Un site n’a pas besoin d’en faire beaucoup — il doit être clair, rapide, et dire juste. On conçoit et on développe des sites qui ressemblent à la marque qui les porte, sans gadgets qui vieillissent mal. Livrés propres, faciles à maintenir, avec ce qu’il faut pour que vous soyez autonomes dessus.",
    tagsLeft: ["Design web", "UX / UI", "Webflow / Framer", "Custom HTML/CSS/JS"],
    tagsRight: [
      "Performance",
      "SEO et référencement",
      "Design system digital",
      "Animation web",
    ],
    bg: "linear-gradient(135deg,#a8a8a8,#606060)",
    image: "/travaux/imlead/06-application-configurateur.webp",
  },
  {
    name: "Production",
    num: "04",
    line: "« Montrer, pas raconter. »",
    body: "C’est ici qu’on fabrique ce qui se voit : film, photo, contenu. On tourne avec une intention — pas pour remplir un feed, pour montrer ce qui mérite de l’être. Du documentaire de marque à la capsule courte, avec le même soin de la lumière au montage.",
    tagsLeft: ["Film documentaire", "Motion Design", "Compositing", "Pipeline AI"],
    tagsRight: ["Marque blanche", "Direction technique"],
    bg: "linear-gradient(135deg,#333333,#161616)",
    image: "/home/aventures/av-7.webp",
  },
];
