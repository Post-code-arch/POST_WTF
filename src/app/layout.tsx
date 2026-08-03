import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Kinaya",
    template: "%s — Kinaya",
  },
  description:
    "On est une agence créative. On essaie de ne pas en avoir l'air. Studio à Alger — stratégie, identité, web, production.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
