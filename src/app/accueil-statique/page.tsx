import type { Metadata } from "next";
import HomeStatic from "@/components/home/HomeStatic";
import { works } from "@/lib/works";

export const metadata: Metadata = {
  title: "Accueil (statique)",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <HomeStatic works={works} />;
}
