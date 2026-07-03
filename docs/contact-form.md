# Formulaire de contact (`/contact`)

Formulaire du site Kinaya. À chaque soumission valide, la route API
`POST /api/contact` déclenche **trois actions en parallèle** :

1. **Email interne** (Resend) → `contact@kinaya.wtf`, sujet `Nouveau contact — [Type]`,
   `replyTo` = l'email du prospect.
2. **Accusé de réception** (Resend) → le prospect (« On a bien reçu votre message… »).
3. **Page Notion** créée dans la base de suivi.

Seul l'échec de **l'email interne** renvoie une erreur à l'utilisateur. L'accusé
et Notion sont *best-effort* : en cas d'échec, l'erreur est loggée mais la
soumission reste un succès (l'utilisateur n'est jamais bloqué).

## Fichiers

| Fichier | Rôle |
|---|---|
| `src/app/contact/page.tsx` | Route de la page + métadonnées |
| `src/components/contact/Contact.tsx` | Layout (accroche + coordonnées + formulaire) |
| `src/components/contact/ContactForm.tsx` | Formulaire client (validation, états, envoi) |
| `src/components/contact/Contact.module.css` | Styles |
| `src/lib/contact.ts` | Types + validation partagés client/serveur |
| `src/app/api/contact/route.ts` | Route API (Resend + Notion) |

## Variables d'environnement

À définir en local dans `.env.local` **et** sur Vercel
(*Settings → Environment Variables*, Production + Preview). Voir `.env.example`.

| Clé | Requis | Rôle |
|---|---|---|
| `RESEND_API_KEY` | oui | Envoi des emails |
| `NOTION_API_KEY` | oui | Secret de l'intégration Notion |
| `NOTION_DATABASE_ID` | oui | ID (32 car.) de la base de suivi |
| `CONTACT_FROM` | non | Expéditeur (défaut `Kinaya <contact@kinaya.wtf>`) |

Tant que les clés sont absentes, la soumission affiche l'erreur sobre
« L'envoi a échoué… » — c'est le comportement attendu.

## Configurer Resend

1. Créer une clé sur <https://resend.com/api-keys> → `RESEND_API_KEY`.
2. **Vérifier le domaine `kinaya.wtf`** (*Domains* → enregistrements DNS
   SPF/DKIM). Sans domaine vérifié, l'envoi depuis `contact@kinaya.wtf` est
   refusé — vérifier le domaine, ou poser `CONTACT_FROM` sur un expéditeur
   d'un domaine déjà vérifié.

## Configurer Notion

1. **Créer l'intégration** : <https://www.notion.so/my-integrations> →
   *New integration* (« Kinaya Contact », interne). Copier le
   *Internal Integration Secret* → `NOTION_API_KEY`.
2. **Créer la base** (database) avec **exactement** ces propriétés :

   | Propriété | Type | Options |
   |---|---|---|
   | `Nom` | Title | — |
   | `Email` | Email | — |
   | `Type` | Select | Identité · Web · Film & contenu · Édition · Autre |
   | `Budget` | Select | Moins de 300k DZD · 300k–800k · 800k–2M · Plus de 2M · Je ne sais pas encore |
   | `Message` | Text | — |
   | `Date` | Created time | — |
   | `Statut` | Select | Nouveau · Répondu · RDV · Devis envoyé · Gagné · Perdu |

   À la création d'une page, `Statut` est mis à **Nouveau**.
3. **Partager la base avec l'intégration** : ouvrir la base → `•••` →
   *Connections* → « Kinaya Contact ». **Indispensable**, sinon l'API Notion
   renvoie une erreur de permission.
4. **Récupérer l'ID** : dans l'URL `notion.so/<ID>?v=…`, l'`<ID>` de 32
   caractères (avant le `?`) → `NOTION_DATABASE_ID`.

> Les options Select sont créées à la volée si absentes ; garder les libellés
> identiques à ceux ci-dessus pour un affichage propre.

## Tester

Après avoir posé les clés et redéployé : envoyer un message depuis `/contact`.
On doit recevoir l'email interne, le prospect reçoit l'accusé, et une ligne
« Nouveau » apparaît dans la base Notion.
