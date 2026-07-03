"use client";

import { useState } from "react";
import {
  PROJECT_TYPES,
  BUDGETS,
  PROFILS,
  validateContact,
  type ContactErrors,
  type ContactPayload,
} from "@/lib/contact";
import styles from "./Contact.module.css";

type Status = "idle" | "loading" | "success" | "error";

const EMPTY: ContactPayload = {
  profil: "",
  nom: "",
  email: "",
  type: "",
  budget: "",
  message: "",
  company: "",
};

export default function ContactForm() {
  const [v, setV] = useState<ContactPayload>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const set = (k: keyof ContactPayload) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setV((prev) => ({ ...prev, [k]: e.target.value }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    const clientErrors = validateContact(v);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }
    setStatus("loading");
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(v),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.errors) setErrors(data.errors as ContactErrors);
        setServerError(
          data.error || "L’envoi a échoué. Réessayez dans un instant."
        );
        setStatus("error");
        return;
      }
      setStatus("success");
    } catch {
      setServerError("Connexion impossible. Vérifiez votre réseau et réessayez.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className={styles.success} role="status">
        <p>Bien reçu. On lit, puis on répond — comptez deux jours ouvrés.</p>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.field}>
        <span className={styles.lab}>
          Vous êtes <span className={styles.req}>*</span>
        </span>
        <div
          className={styles.segmented}
          role="radiogroup"
          aria-label="Vous êtes"
        >
          {PROFILS.map((pf) => (
            <button
              key={pf}
              type="button"
              role="radio"
              aria-checked={v.profil === pf}
              className={`${styles.seg} ${v.profil === pf ? styles.segOn : ""}`}
              onClick={() => {
                setV((prev) => ({ ...prev, profil: pf }));
                if (errors.profil) setErrors((p) => ({ ...p, profil: undefined }));
              }}
            >
              {pf}
            </button>
          ))}
        </div>
        {errors.profil && <span className={styles.err}>{errors.profil}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="nom" className={styles.lab}>
          Nom <span className={styles.req}>*</span>
        </label>
        <input
          id="nom"
          name="nom"
          type="text"
          autoComplete="name"
          className={`${styles.input} ${errors.nom ? styles.invalid : ""}`}
          value={v.nom}
          onChange={set("nom")}
          aria-invalid={!!errors.nom}
        />
        {errors.nom && <span className={styles.err}>{errors.nom}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="email" className={styles.lab}>
          Email <span className={styles.req}>*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className={`${styles.input} ${errors.email ? styles.invalid : ""}`}
          value={v.email}
          onChange={set("email")}
          aria-invalid={!!errors.email}
        />
        {errors.email && <span className={styles.err}>{errors.email}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="type" className={styles.lab}>
          Type de projet <span className={styles.req}>*</span>
        </label>
        <select
          id="type"
          name="type"
          className={`${styles.input} ${styles.select} ${errors.type ? styles.invalid : ""}`}
          value={v.type}
          onChange={set("type")}
          aria-invalid={!!errors.type}
        >
          <option value="" disabled>
            Sélectionnez…
          </option>
          {PROJECT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        {errors.type && <span className={styles.err}>{errors.type}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="budget" className={styles.lab}>
          Budget approximatif <span className={styles.opt}>(optionnel)</span>
        </label>
        <select
          id="budget"
          name="budget"
          className={`${styles.input} ${styles.select}`}
          value={v.budget}
          onChange={set("budget")}
        >
          <option value="">Sélectionnez…</option>
          {BUDGETS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label htmlFor="message" className={styles.lab}>
          Message <span className={styles.req}>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          className={`${styles.input} ${styles.textarea} ${errors.message ? styles.invalid : ""}`}
          placeholder="Parlez-nous de votre projet, où vous en êtes, ce que vous cherchez."
          value={v.message}
          onChange={set("message")}
          aria-invalid={!!errors.message}
        />
        {errors.message && <span className={styles.err}>{errors.message}</span>}
      </div>

      {/* honeypot anti-spam — invisible, hors flux de tabulation */}
      <div className={styles.hp} aria-hidden>
        <label htmlFor="company">Ne pas remplir</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={v.company}
          onChange={set("company")}
        />
      </div>

      {serverError && status === "error" && (
        <p className={styles.serverErr} role="alert">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        className={styles.submit}
        disabled={status === "loading"}
      >
        {status === "loading" ? "Envoi…" : "Envoyer"}
      </button>
    </form>
  );
}
