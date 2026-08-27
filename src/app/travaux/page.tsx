import type { Metadata } from "next";
import WorkPage from "@/components/work/WorkPage";
import { works } from "@/lib/works";

export const metadata: Metadata = {
  title: "Travaux",
  description: "Les travaux de POST. On préfère montrer que raconter.",
};

export default function TravauxIndex() {
  return <WorkPage works={works} />;
}
