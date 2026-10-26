import {
  projets,
  FILTRES,
  chemins,
  tx,
  type Filtre,
  type Lang,
  type Projet,
  type ProjetEtude,
} from "./kamil";
import { getProject, FULL_WIDTH, type Visual } from "./projects";

/** blocs de visuels montrés (le hero sert de couverture) */
export type SlotMontre = "vibe" | "direction" | "fabrication" | "application" | "asset";

/* Résolution (côté serveur) des projets du portfolio de Kamil : vignettes
   des pages Projets / accueil, et visuels des études de cas. */

/** vignette d'un projet, prête à afficher (textes dans la langue voulue) */
export interface Carte {
  slug: string;
  href: string;
  titre: string;
  annee?: string;
  filtres: Filtre[];
  tags: string[];
  image?: string;
  video?: string;
  poster?: string;
}

const isMobileHero = (v: Visual) => /-hero-mobile\.[a-z0-9]+$/i.test(v.src);

function heroEtude(p: ProjetEtude): string | undefined {
  if (p.principal) return p.principal;
  const e = getProject(p.source);
  return e?.visuals.find((v) => v.slot === "hero" && !v.isVideo && !isMobileHero(v))?.src;
}

export function carte(p: Projet, lang: Lang): Carte {
  const v = p.vignette ?? {};
  return {
    slug: p.slug,
    href: chemins(lang).projet(p.slug),
    titre: p.titre,
    annee: p.annee,
    filtres: p.filtres,
    tags: p.filtres.map((f) => FILTRES[f][lang]),
    image: v.image ?? (p.kind === "etude" ? heroEtude(p) : undefined),
    video: v.video,
    poster: v.poster,
  };
}

export const cartes = (lang: Lang) => projets.map((p) => carte(p, lang));

/** filtres présents dans les projets, dans l'ordre de FILTRES */
export const filtresPresents = (lang: Lang) =>
  (Object.keys(FILTRES) as Filtre[])
    .filter((f) => projets.some((p) => p.filtres.includes(f)))
    .map((f) => ({ key: f, label: FILTRES[f][lang] }));

export const getProjetKamil = (slug: string) => projets.find((p) => p.slug === slug);

/** projet suivant dans la liste (en boucle) */
export function suivant(slug: string): Projet {
  const i = projets.findIndex((p) => p.slug === slug);
  return projets[(i + 1) % projets.length];
}

export interface GroupeVisuels {
  slot: SlotMontre;
  before: Visual[];
  rangees: Visual[];
  after: Visual[];
}

/** visuels d'une étude de cas, par bloc (ambiance, direction, fabrication,
 *  application, supports), avec les mêmes pleines largeurs que sur le site
 *  du studio ; le visuel de couverture n'est pas répété */
export function visuelsEtude(p: ProjetEtude): { hero?: string; lien?: string; groupes: GroupeVisuels[] } {
  const e = getProject(p.source);
  if (!e) return { groupes: [] };
  const hero = heroEtude(p);
  const regles = FULL_WIDTH[p.source] ?? [];
  const pos = (v: Visual) => regles.find((r) => r.re.test(v.src))?.pos;
  const ordre: SlotMontre[] = ["vibe", "direction", "fabrication", "application", "asset"];
  const groupes = ordre
    .map((slot) => {
      const vs = e.visuals.filter(
        (v) =>
          v.slot === slot && v.src !== hero && !isMobileHero(v) && !p.exclure?.test(v.src)
      );
      return {
        slot,
        before: vs.filter((v) => pos(v) === "before"),
        rangees: vs.filter((v) => !pos(v)),
        after: vs.filter((v) => pos(v) === "after"),
      };
    })
    .filter((g) => g.before.length + g.rangees.length + g.after.length > 0);
  return { hero, lien: e.meta.lien, groupes };
}

export { tx };
