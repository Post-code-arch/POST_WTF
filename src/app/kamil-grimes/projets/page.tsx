import ProjetsIndex from "@/components/portfolio/ProjetsIndex";
import { metaProjets } from "@/lib/kamilMeta";

export const metadata = metaProjets("fr");

export default function Page() {
  return <ProjetsIndex lang="fr" />;
}
