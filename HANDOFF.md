# Handoff — état du projet (site POST, ex-Kinaya)

Site vitrine Next.js 15 (App Router, SSG + une route API), déployé sur Vercel.
Repo : `kinayahouse-cyber/kinaya`. Branche de travail : `main` (les changements
sont mergés là et poussés).

## Déploiement / URLs — ⚠️ À RÉGLER
- **En ligne et à jour : https://kinaya-nine.vercel.app** (HTTP 200, `<title>POST</title>`).
  C'est le projet Vercel connecté à ce repo ; chaque push sur `main` le redéploie.
- **postwtf.vercel.app → 404** : le projet/domaine Vercel derrière a été supprimé/détaché.
  Pour le réactiver (dashboard Vercel, pas faisable depuis Claude Code) : soit renommer le
  projet en `postwtf` (Settings → General → Project Name), soit ajouter le domaine
  (Settings → Domains → Add `postwtf.vercel.app`).
- La ligne « Web » de la page À propos affiche `postwtf.vercel.app` (à corriger si on garde
  kinaya-nine, ou à laisser si postwtf est réparé).

## Marque
- Rebrand **Kinaya → POST** effectué partout (metadata/titre d'onglet, À propos, descriptions
  de pages, signatures d'emails, event interne `post:dock`, commentaires, `package.json`).
- Logotype : `src/components/POSTLogo.tsx` (wordmark « POST_ », `fill="currentColor"`,
  s'adapte au fond via `mix-blend`). Utilisé dans nav, hero d'accueil, footers.
- Favicon : `src/app/icon.svg` + `icon.png` (POST_ blanc sur tuile sombre).
- Le composant s'appelle encore `POSTLogo` mais est importé un peu partout ; le **hero voyageur**
  (`HeroLogoTravel`) l'anime de l'accueil vers la nav au scroll.

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
1. Réparer `postwtf.vercel.app` côté Vercel (ou basculer la ligne « Web » sur kinaya-nine).
2. Confirmer l'email public (`wearepostagency@gmail.com`) + configurer les clés Resend/Notion.
3. Renommer le repo GitHub / projet Vercel si on veut retirer « kinaya » de l'infra (hors code).
