import Link from "next/link";

/**
 * Placeholder temporaire. L'accueil (reference/home.html) sera porté plus tard.
 * En attendant, on pointe vers la première page-objet portée (le canevas projet).
 */
export default function TempHome() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 24,
        padding: "10vw",
        textAlign: "center",
        background: "var(--espresso)",
        color: "var(--cream)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--fl)",
          fontSize: 12,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          opacity: 0.6,
        }}
      >
        Kinaya — chantier
      </p>
      <Link
        href="/travaux/imlead"
        style={{
          fontFamily: "var(--fd)",
          fontWeight: 600,
          fontSize: "clamp(40px, 10vw, 120px)",
          lineHeight: 0.9,
          color: "var(--cream)",
          textDecoration: "none",
        }}
      >
        Voir le canevas →
      </Link>
    </main>
  );
}
