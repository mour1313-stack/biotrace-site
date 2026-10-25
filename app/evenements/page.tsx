import type { Metadata } from "next"
import { Evenements } from "@/components/sections/evenements"

export const metadata: Metadata = {
  title: "Événements",
  description:
    "Congrès, actions étudiantes et vie associative : les événements de Biotrace Montpellier, les archives du congrès et la galerie photo.",
}

export default function PageEvenements() {
  return <Evenements />
}
