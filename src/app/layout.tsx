import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "post_ — Architectes d’image, Alger",
    template: "%s — post_",
  },
  description:
    "Identité, site et film pour les institutions et entreprises algériennes. Mettre votre image à la hauteur de votre réalité.",
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
