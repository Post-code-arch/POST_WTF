import ProjetsIndex from "@/components/portfolio/ProjetsIndex";
import { metaProjets } from "@/lib/kamilMeta";

export const metadata = metaProjets("en");

export default function Page() {
  return <ProjetsIndex lang="en" />;
}
