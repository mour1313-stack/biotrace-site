"use client"

import { Dna, GraduationCap, Handshake, Microscope, Users } from "lucide-react"
import RadialOrbitalTimeline, { type TimelineItem } from "@/components/ui/radial-orbital-timeline"
import { missions } from "@/content/site"

const icones = { graduation: GraduationCap, handshake: Handshake, microscope: Microscope, users: Users } as const

/** Les 4 missions de Biotrace en orbite (RadialOrbitalTimeline). Chaque mission est reliée à ses voisines. */
export function OrbiteMissions() {
  const n = missions.length
  const items: TimelineItem[] = missions.map((m, i) => ({
    id: i + 1,
    title: m.titre,
    date: `Mission ${String(i + 1).padStart(2, "0")}`,
    content: m.texte,
    icon: icones[m.icone],
    relatedIds: [((i + n - 1) % n) + 1, ((i + 1) % n) + 1],
  }))

  return (
    <div>
      <RadialOrbitalTimeline
        timelineData={items}
        center={<Dna aria-hidden className="size-7 text-lab-lime" />}
        heightClassName="h-[460px] sm:h-[540px]"
        labels={{ related: "Missions liées" }}
        className="rounded-[2rem] border-[1.5px] border-dashed border-lab-blue/40 bg-paper/60"
      />
      <p className="mt-3 text-center font-hand text-xl font-bold text-lab-blue">
        Cliquez sur une mission pour l’ouvrir ↑
      </p>
    </div>
  )
}
