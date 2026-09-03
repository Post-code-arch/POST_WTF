import type { Metadata } from "next";
import { getLabPieces } from "@/lib/lab";
import LabPage from "@/components/lab/LabPage";

export const metadata: Metadata = {
  title: "Lab",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LabPage pieces={getLabPieces()} />;
}
