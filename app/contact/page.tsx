import type { Metadata } from "next"
import { Contact } from "@/components/sections/contact"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contacter Biotrace Montpellier : e-mail, Instagram, LinkedIn et adresse à la Faculté des Sciences de Montpellier.",
}

export default function PageContact() {
  return <Contact />
}
