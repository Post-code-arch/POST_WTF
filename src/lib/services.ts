export interface Service {
  name: string;
  num: string;
  line: string;
  tagsLeft: string[];
  tagsRight: string[];
  /** dégradé placeholder (en attendant le vrai visuel) */
  bg: string;
  /** chemin de l'image de fond (parallaxe) — placeholder si absent */
  image?: string;
}

export const services: Service[] = [
  {
    name: "Stratégie",
    num: "01",
    line: "La phase qu’on prend le plus au sérieux.",
    tagsLeft: ["Audit", "diagnostic", "positionnement", "architecture"],
    tagsRight: [
      "tone of voice",
      "plateforme verbale",
      "recherche · benchmark culturel",
      "cadrage stratégique.",
    ],
    bg: "linear-gradient(135deg,#6b8cae,#3a5573)",
  },
  {
    name: "Branding",
    num: "02",
    line: "Là où la lecture devient un système.",
    tagsLeft: ["Audit", "Diagnostic", "Positionnement", "Architecture"],
    tagsRight: [
      "Tone of voice",
      "Plateforme verbale",
      "Recherche · benchmark culturel",
      "Cadrage stratégique.",
    ],
    bg: "linear-gradient(135deg,#2f5fc4,#1a3a8a)",
  },
  {
    name: "Digital",
    num: "03",
    line: "Le digital comme prolongement de l’identité, pas comme livrable séparé.",
    tagsLeft: ["Design web", "UX / UI", "Webflow / Framer", "Custom HTML/CSS/JS"],
    tagsRight: [
      "Performance",
      "SEO et référencement",
      "Design system digital",
      "Animation web",
    ],
    bg: "linear-gradient(135deg,#caa07a,#7a5a3a)",
  },
  {
    name: "Production",
    num: "04",
    line: "La fabrication technique, sans renier le regard.",
    tagsLeft: ["Film documentaire", "Motion Design", "Compositing", "Pipeline AI"],
    tagsRight: ["Marque blanche", "Direction technique"],
    bg: "linear-gradient(135deg,#3a3228,#1a1510)",
  },
];
