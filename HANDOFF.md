# Handoff — état du projet (site post_)

Site vitrine Next.js 15 (App Router, SSG + une route API), déployé sur Vercel.
Repo : `Post-code-arch/POST_WTF`. Branche de travail : `main` (les changements
sont mergés là et poussés).

## Positionnement (branche `repositionnement`)
- post_ = **architectes d’image** ; promesse « Mettre votre image à la hauteur de votre
  réalité. » Cible : institutions, ETI, groupes, exportateurs algériens.
- Deux portes d’entrée à égalité : **2 programmes** (Mutation & Structuration, Rayonnement &
  Expansion) et **4 offres** (Identité, Web, Film, Contenu). **Jamais** de palier, formule,
  niveau ni prix sur le site.
- Données : `src/lib/offres.ts` (`null` = TODO, repère visible en dev, omis en prod).
- Typographie française au rendu : `src/lib/typo.ts`.

## Déploiement / URLs
- **URL de prod : https://post-wtf.vercel.app** (HTTP 200). Projet Vercel `post-wtf`, équipe
  `wearepostagency-2217`, connecté à ce repo (`Post-code-arch/POST_WTF`) ; chaque push sur
  `main` le redéploie. Aucune trace de l'ancien nom "kinaya" dans cette URL.
- `postwtf.vercel.app` (sans tiret) → 404, projet/domaine inexistant : ne pas confondre avec
  `post-wtf.vercel.app` (avec tiret), qui est la bonne URL.
- La ligne « Web » de la page À propos affiche `post-wtf.vercel.app`.

## Marque
- Nom **post_** dans le texte courant et les titres de pages ; le logo SVG reste « POST_ ».
  Event interne `post:dock`.
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
- Champs : Nom, Email, Type de projet (Programme, Identité, Web, Film, Contenu, Autre), Message.
  Plus de Budget ni de « Marque / Agence ». `?offre=<slug>` présélectionne le type, transmet
  l’offre dans l’email interne et préremplit l’objet du lien « Demander un rendez-vous ».
  Base Notion : les propriétés Profil et Budget ne sont plus alimentées.

## Pages & specificités
- **Accueil** (`HomeStatic.tsx`) : hero (H1 « Mettre votre image à la hauteur de votre
  réalité. », sous-titre « Architectes d’image · Alger · 36.7°N ») + bandeau
  `IDENTITÉ • SITE • FILM • CONTENU` ; intro (texte A) ; « Deux portes d’entrée »
  (`OffresSection`) ; travaux « Ce qui ne se voyait pas. » ; Process (sloughi tramé) ;
  Aventures ; signature « Les bonnes idées n’ont pas besoin de hausser le ton. » ; footer.
  Section Départements supprimée.
- **Travaux** (`WorkPage.tsx`) : rangée horizontale infinie en bas ; filtre « Type » en liste
  texte horizontale juste au-dessus des cartes (dérivé des `champs` des projets). Ordre via
  `ordre:` dans le frontmatter ; `brouillon: true` = ni carte ni page (Présidence).
- **Offres** (`/offres`, `/offres/<slug>`, ex-« Champs » `/services` → redirection 308) :
  index (programmes + offres, clôture, aperçu travaux) et gabarit commun en 8 sections
  (`components/offres/`).
- **Fiches projet** (`app/travaux/[slug]/page.tsx`) : hero 150vh ; visuels via nommage
  `NN-slot-suffix.webp` sous `public/travaux/<slug>/`. Hero mobile optionnel `NN-hero-mobile`.
  Fennec : hero = **peinture orientaliste** (`02-vibe` réutilisée).
- **À propos** : layout éditorial en fond sombre (espresso, texte crème), sans illustration ;
  H1, fondateurs (parcours TODO), références institutionnelles (TODO).
- **Contact** : layout éditorial, sloughi à l'encre décoratif.

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
