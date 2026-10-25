import type { Metadata } from "next";
import Contact from "@/components/contact/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Un projet d’image, une échéance ? Écrivez-nous, nous répondons sous 48 heures.",
};

export default function ContactPage() {
  return <Contact />;
}
