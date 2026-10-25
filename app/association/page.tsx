import type { Metadata } from "next"
import { Association } from "@/components/sections/association"
import { Chronologie } from "@/components/sections/chronologie"
import { NotreHistoire } from "@/components/sections/notre-histoire"

export const metadata: Metadata = {
  title: "L’association",
  description:
    "Créée en novembre 2005, Biotrace est l’association étudiante du Master IBION-Tec de l’Université de Montpellier : son histoire, ses missions et son fonctionnement.",
}

export default function PageAssociation() {
  return (
    <>
      <NotreHistoire />
      <Chronologie />
      <Association />
    </>
  )
}
