import type { Metadata } from "next";
import ServicesPage from "@/components/services/ServicesPage";
import { services } from "@/lib/services";

export const metadata: Metadata = {
  title: "Champs",
  description:
    "Stratégie, branding, digital, production. Les quatre champs de Kinaya.",
};

export default function Page() {
  return <ServicesPage services={services} />;
}
