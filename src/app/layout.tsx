import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "@/styles/globals.css";
import LoadingBar from "@/components/LoadingBar";
import { LOADING_BAR_SCRIPT } from "@/lib/loadingBar";

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
    // suppressHydrationWarning : le script de tête pose data-pl sur <html>
    <html lang="fr" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: LOADING_BAR_SCRIPT }} />
      </head>
      <body>
        <LoadingBar />
        {children}
      </body>
    </html>
  );
}
