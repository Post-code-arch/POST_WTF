import type { Metadata } from "next";
import WorkPage from "@/components/work/WorkPage";
import { works } from "@/lib/works";

export const metadata: Metadata = {
  title: "Travaux",
  description: "Des organisations solides, une image en retard. Ce qu’on a changé.",
};

export default function TravauxIndex() {
  return <WorkPage works={works} />;
}
