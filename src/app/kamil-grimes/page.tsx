import Portfolio from "@/components/portfolio/Portfolio";
import { cartes } from "@/lib/kamilProjets";
import { metaAccueil } from "@/lib/kamilMeta";

// page non référencée : hors menu, et exclue des moteurs de recherche
export const metadata = metaAccueil("fr");

export default function Page() {
  return <Portfolio lang="fr" cartes={cartes("fr")} />;
}
