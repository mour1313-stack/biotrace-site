import type { Metadata } from "next"
import { Equipe } from "@/components/sections/equipe"

export const metadata: Metadata = {
  title: "Notre équipe",
  description:
    "Les visages de Biotrace : le bureau 2026–2027 et les quatre pôles de l’association (Administration, Trésorerie, Communication, Événementiel).",
}

export default function PageEquipe() {
  return <Equipe />
}
