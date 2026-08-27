import type { Metadata } from "next";
import Contact from "@/components/contact/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Un projet, une question ? Écrivez à POST — on lit tout, et on répond.",
};

export default function ContactPage() {
  return <Contact />;
}
