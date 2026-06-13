import type { Metadata } from "next";
import Fantascope from "@/components/about/Fantascope";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "On expérimente, et on applique. Puis on recommence. C'est ce qu'on appelle un cercle vertueux.",
};

export default function AboutPage() {
  return (
    <main>
      <Fantascope />
    </main>
  );
}
