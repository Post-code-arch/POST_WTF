# Handoff — état du projet (site POST)

Site vitrine Next.js 15 (App Router, SSG + une route API), déployé sur Vercel.
Repo : `Post-code-arch/POST_WTF`. Branche de travail : `main` (les changements
sont mergés là et poussés).

## Déploiement / URLs
- **URL de prod : https://post-wtf.vercel.app** (HTTP 200). Projet Vercel `post-wtf`, équipe
  `wearepostagency-2217`, connecté à ce repo (`Post-code-arch/POST_WTF`) ; chaque push sur
  `main` le redéploie. Aucune trace de l'ancien nom "kinaya" dans cette URL.
- `postwtf.vercel.app` (sans tiret) → 404, projet/domaine inexistant : ne pas confondre avec
  `post-wtf.vercel.app` (avec tiret), qui est la bonne URL.
- La ligne « Web » de la page À propos affiche `post-wtf.vercel.app`.

## Marque
- Identité **POST** partout (metadata/titre d'onglet, À propos, descriptions de pages,
  signatures d'emails, event interne `post:dock`, commentaires, `package.json`).
- Logotype : `src/components/POSTLogo.tsx` (wordmark « POST_ », `fill="currentColor"`,
  s'adapte au fond via `mix-blend`). Utilisé dans nav, hero d'accueil, footers.
- Favicon : `src/app/icon.svg` + `icon.png` (POST_ blanc sur tuile sombre).
- Le **hero voyageur** (`HeroLogoTravel`) anime le logo de l'accueil vers la nav au scroll.

## Contact (formulaire `/contact`)
- Route `src/app/api/contact/route.ts` : Resend (email interne + accusé prospect) + Notion, en
  parallèle (Notion/accusé best-effort, non bloquants).
- Mail : `wearepostagency@gmail.com`. `CONTACT_FROM` défaut `POST <onboarding@resend.dev>`
  (Gmail interdit en envoi Resend — vérifier un domaine pour un vrai expéditeur).
- Clés env à poser sur Vercel : `RESEND_API_KEY`, `NOTION_API_KEY`, `NOTION_DATABASE_ID`
  (voir `.env.example` et `docs/contact-form.md`). Base Notion : propriétés Nom/Email/Profil/
  Type/Budget/Message/Date/Statut (détaillé dans la doc).
- Champ formulaire « Vous êtes : Une marque / Une agence » (création vs outsourcing).

## Pages & specificités
- **Accueil** (`HomeStatic.tsx`) : hero image plein cadre (mobile = `av-5`, desktop = `av-8`) +
  bandeau défilant `MOTION • AI • DIGITAL • STRATEGY • CONTENT • WEB • PROD` ; pas de vidéo
  showreel (retirée). Sections Méthode (sloughi tramé), Départements, Aventures, footer.
- **Travaux** (`WorkPage.tsx`) : rangée horizontale infinie en bas ; filtre « Type » en liste
  texte horizontale juste au-dessus des cartes (dérivé des `champs` des projets).
- **Services** (`ServicesPage.tsx`) : empilement au scroll (sticky stacking) — chaque service
  = panneau plein écran qui glisse sur le précédent (ombre portée en haut), nom + numéro, filet,
  accroche, paragraphe, puces, image 4:5 à **ondulation souris** (`RippleImage`, WebGL).
- **Fiches projet** (`app/travaux/[slug]/page.tsx`) : hero 150vh ; visuels via nommage
  `NN-slot-suffix.webp` sous `public/travaux/<slug>/`. Hero mobile optionnel `NN-hero-mobile`.
  Fennec : hero = **peinture orientaliste** (`02-vibe` réutilisée).
- **À propos** / **Contact** : layout éditorial, sloughi à l'encre décoratif.
- **Lab** (`/lab`, `LabIndex.tsx` + `/lab/[slug]`, `LabProjectPage.tsx`) : showcase du taff IA,
  **dans la nav** (lien "Lab") mais toujours `robots: noindex, nofollow` (pas dans les moteurs
  de recherche). Design dark (palette `--espresso`/`--cream`, inspiré A24/NEON) distinct du
  reste du site en cream : `/lab` = hero « à la une » + grille de posters portrait 2:3 (titre
  sous l'image, layout calqué sur neonrated.com) — survol → aperçu vidéo léger (`preview.webm`,
  ~200-300 Ko, généré exprès pour ça — pas le fichier source complet) ; poster masqué seulement
  une fois l'aperçu prêt à jouer, pour éviter un flash noir. `/lab/<slug>` = page dédiée par
  projet (hero vidéo plein cadre, description optionnelle, grille des vidéos avec filmstrip,
  lien « projet suivant »).
  Un projet = un dossier `public/lab/<slug>/`, qui peut contenir **plusieurs vidéos déposées
  directement à la racine** du dossier : `<nom>.<mp4|webm|mov|m4v>` → `frames/<nom>/frame-NN.jpg`
  + `frames/<nom>/preview.webm` (filmstrip + aperçu générés par `npm run lab:frames`, cf.
  `scripts/extract-frames.mjs`, basé sur
  `ffmpeg-static` — pas d'ffmpeg système requis). Détecte aussi un éventuel bandeau noir
  cinéma (letterboxing intégré aux pixels, ex. 2.35:1 dans un cadre 16:9) via `cropdetect`
  et le retire des visuels générés (vertical uniquement, jamais horizontal, pour ne pas
  rogner du vrai contenu sur un faux positif). `meta.json` optionnel par projet :
  `{ "title", "note", "description": "…" ou ["§1", "§2"] }`. Survol d'une frame → la vidéo
  correspondante (autoplay muted loop) se cale sur ce timecode. Projets en place : **Bassit**
  (VFX, 1 vidéo) et **Cristor** (VFX + Packshot IA, 4 vidéos) — contenu déposé et frames
  générées ; pas encore de `description` renseignée (à ajouter dans `meta.json`).

## Design system
- Palette monochrome (gris bornés, jamais #000/#fff). Images : couleurs conservées + léger
  `contrast(0.9)`. Couche de micro-animations (liens, boutons, hover images) guardée
  `prefers-reduced-motion`. Tokens dans `src/styles/globals.css`.

## Workflow
- Dev sur `main` (branche feature `claude/*` puis ff-merge sur `main`, push).
- `npm run build` avant de committer. `node_modules` est parfois vidé au reset du conteneur —
  refaire `npm install` si `next`/`playwright` manquent.
- Vérifs visuelles via Playwright/Chromium (`executablePath: /opt/pw-browsers/chromium`).

## En attente / décisions ouvertes
1. Confirmer l'email public (`wearepostagency@gmail.com`) + configurer les clés Resend/Notion.
