/**
 * Typographie française appliquée au rendu : les textes restent lisibles
 * dans les sources (espaces ordinaires, apostrophe droite) et sortent
 * composés correctement.
 *  - espace fine insécable (U+202F) avant ; ? !
 *  - espace insécable (U+00A0) avant : et à l’intérieur des « »
 *  - apostrophe courbe ’
 */
export function typo(s: string): string {
  return s
    .replace(/'/g, "’")
    .replace(/ ([;?!])/g, " $1")
    .replace(/ :/g, " :")
    .replace(/« /g, "« ")
    .replace(/ »/g, " »");
}
