import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "@/styles/globals.css";
import Intro from "@/components/Intro";
import { INTRO_SCRIPT } from "@/lib/intro";

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
    // suppressHydrationWarning : le script de tête pose data-intro sur <html>
    <html lang="fr" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body>
        <Intro />
        {children}
      </body>
    </html>
  );
}
