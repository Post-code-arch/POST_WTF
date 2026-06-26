# Kinaya — travaux · conventions

Pages-objets du portfolio. Un dossier par projet, le texte et les visuels
co-localisés. On enrichit projet par projet.

## Arborescence

```
travaux/
├─ CONVENTIONS.md            ← ce fichier (guide, pas un projet)
├─ EXEMPLE-index.md          ← gabarit à copier (fill-in)
└─ <slug>/                   ← un dossier = un projet
   ├─ index.md               ← texte + frontmatter
   ├─ 01-hero.png
   ├─ 02-vibe.png
   ├─ 03-direction-motion.webm
   ├─ 04-fabrication-typographie.png
   └─ 05-application-mockup.png
```

- **slug** : minuscules, tirets (`astarte-conseils`, `spoon-atelier`, `imlead`).
  Le nom du dossier = le `slug` du frontmatter.
- **un `index.md` par projet**, à côté de ses visuels renommés.

## Nommage des visuels — `NN-bloc[-type].ext`

- `NN` : ordre de **composition de la page** (pas l'ordre d'upload) — `01`, `02`…
- `bloc` : un des blocs de référence ci-dessous.
- `type` (optionnel) : précision libre (`motion`, `typographie`, `mockup`, `carte`…).
- `.ext` : `.png` / `.jpg` / `.webp` (images), `.webm` / `.mp4` (vidéos).

Exemples : `01-hero.png` · `02-vibe.png` · `03-direction-motion.webm` ·
`04-fabrication-typographie.png` · `05-application-mockup.png` · `06-asset.png`

**Blocs de référence** (= « slot ») :

| bloc          | rôle                                             |
|---------------|--------------------------------------------------|
| `hero`        | visuel d'ouverture plein cadre (1 seul, en `01`) |
| `vibe`        | l'ambiance / le terrain (section Lecture)        |
| `direction`   | la DA posée (section Direction)                  |
| `fabrication` | ce qu'on a fabriqué (section Fabrication)        |
| `application` | mise en situation / livrables (section Appli.)   |
| `asset`       | pièce isolée sur fond clair (carte, objet…)      |

Composition : alterner portrait / paysage, ne pas empiler deux formats
identiques d'affilée. Pas de quota, pas de minimum.

## Le numéro fait le lien

Pas de liste de visuels à écrire dans le frontmatter : le préfixe `NN` d'un
fichier EST son numéro de visuel, le `bloc` son slot. Le nommage mappe les
images au texte.
