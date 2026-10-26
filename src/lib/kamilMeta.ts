import type { Metadata } from "next";
import { identite, chemins, tx, type Lang } from "./kamil";
import { getProjetKamil } from "./kamilProjets";

/* métadonnées des pages du portfolio : hors moteurs de recherche, avec le
   lien vers la même page dans l'autre langue */

const robots = { index: false, follow: false };

function alternates(fr: string, en: string): Metadata["alternates"] {
  return { languages: { fr, en } };
}

export function metaAccueil(lang: Lang): Metadata {
  return {
    title: { absolute: `${identite.nom} — Portfolio` },
    description: identite.accroche[lang],
    robots,
    alternates: alternates(chemins("fr").home, chemins("en").home),
  };
}

export function metaProjets(lang: Lang): Metadata {
  return {
    title: { absolute: `${lang === "fr" ? "Projets" : "Projects"} — ${identite.nom}` },
    description: identite.accroche[lang],
    robots,
    alternates: alternates(chemins("fr").projets, chemins("en").projets),
  };
}

export function metaProjet(slug: string, lang: Lang): Metadata {
  const p = getProjetKamil(slug);
  if (!p) return { robots };
  return {
    title: { absolute: `${p.titre} — ${identite.nom}` },
    description: p.sousTitre ? tx(p.sousTitre, lang) : identite.accroche[lang],
    robots,
    alternates: alternates(chemins("fr").projet(slug), chemins("en").projet(slug)),
  };
}
