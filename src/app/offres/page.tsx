import type { Metadata } from "next";
import OffresPage from "@/components/offres/OffresPage";
import { works } from "@/lib/works";

export const metadata: Metadata = {
  title: "Offres",
  description:
    "Deux portes d’entrée : des programmes complets ou des offres ciblées en identité, web, film et contenu.",
};

export default function Page() {
  return <OffresPage works={works} />;
}
