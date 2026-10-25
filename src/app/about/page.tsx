import type { Metadata } from "next";
import About from "@/components/about/About";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Agence d’image à Alger. Identité, site et film sous une seule direction.",
};

export default function AboutPage() {
  return <About />;
}
