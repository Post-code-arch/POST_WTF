import type { Metadata } from "next";
import { getLabPieces } from "@/lib/lab";
import LabIndex from "@/components/lab/LabIndex";

export const metadata: Metadata = {
  title: "Lab",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LabIndex pieces={getLabPieces()} />;
}
