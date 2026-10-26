import Portfolio from "@/components/portfolio/Portfolio";
import { cartes } from "@/lib/kamilProjets";
import { metaAccueil } from "@/lib/kamilMeta";

// version anglaise (non référencée)
export const metadata = metaAccueil("en");

export default function Page() {
  return <Portfolio lang="en" cartes={cartes("en")} />;
}
