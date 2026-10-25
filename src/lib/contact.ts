/* Contrat partagé client ⇄ serveur pour le formulaire de contact.
   Ni budget ni prix : la demande part de la situation du client. */

export const PROJECT_TYPES = [
  "Programme",
  "Identité",
  "Web",
  "Film",
  "Contenu",
  "Autre",
] as const;

export interface ContactPayload {
  nom: string;
  email: string;
  type: string;
  /** offre ou programme d'origine (paramètre ?offre= de l'URL), si présent */
  offre?: string;
  message: string;
  /** honeypot anti-spam — doit rester vide */
  company?: string;
}

export type ContactErrors = Partial<Record<keyof ContactPayload, string>>;

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validation commune. Renvoie les messages d'erreur (français, sobres). */
export function validateContact(p: Partial<ContactPayload>): ContactErrors {
  const e: ContactErrors = {};
  if (!p.nom || !p.nom.trim()) e.nom = "Votre nom, s’il vous plaît.";
  if (!p.email || !p.email.trim()) e.email = "Une adresse pour vous répondre.";
  else if (!EMAIL_RE.test(p.email.trim())) e.email = "Cette adresse semble incomplète.";
  if (!p.type || !PROJECT_TYPES.includes(p.type as (typeof PROJECT_TYPES)[number]))
    e.type = "Choisissez un type de projet.";
  if (!p.message || !p.message.trim()) e.message = "Dites-nous quelques mots.";
  return e;
}
