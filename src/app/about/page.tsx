import type { Metadata } from "next";
import About from "@/components/about/About";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Kinaya est une agence créative basée à Alger. On préfère montrer que raconter.",
};

export default function AboutPage() {
  return <About />;
}
