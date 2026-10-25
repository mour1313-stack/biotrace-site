"use client"

import { ClipboardList, Megaphone, PartyPopper, Users, Wallet } from "lucide-react"
import RadialOrbitalTimeline, { type TimelineItem } from "@/components/ui/radial-orbital-timeline"
import type { Pole } from "@/content/equipe"

const icones: Record<string, React.ElementType> = {
  administration: ClipboardList,
  tresorerie: Wallet,
  communication: Megaphone,
  evenementiel: PartyPopper,
}

const fonds: Record<Pole["couleur"], string> = {
  violet: "!bg-pole-violet",
  orange: "!bg-pole-orange",
  rose: "!bg-pole-rose",
  jaune: "!bg-pole-jaune",
  vert: "!bg-pole-vert",
}

/** Les 4 pôles de l'équipe en orbite autour du bureau (RadialOrbitalTimeline). */
export function OrbitePoles({ poles }: { poles: Pole[] }) {
  const items: TimelineItem[] = poles.map((pole, i) => ({
    id: i + 1,
    title: pole.nom,
    date: `Équipe ${String(i + 2).padStart(2, "0")} · ${pole.membres.length} membres`,
    content: pole.mission,
    icon: icones[pole.id] ?? Users,
    relatedIds: [],
    nodeClassName: fonds[pole.couleur],
    extra: (
      <>
        <p className="font-hand text-lg leading-tight font-bold text-lab-blue">« {pole.accroche} »</p>
        <ul className="mt-2 space-y-0.5 text-xs text-ink">
          {pole.membres.map((m) => (
            <li key={m.nom}>
              <span className="font-semibold">{m.nom}</span>
              {m.fonction && <span className="text-ink-soft"> — {m.fonction}</span>}
            </li>
          ))}
        </ul>
      </>
    ),
    link: { href: `#pole-${pole.id}`, label: `Voir le pôle ${pole.nom}` },
  }))

  return (
    <div>
      <RadialOrbitalTimeline
        timelineData={items}
        center={<span className="titre-affiche !text-[0.7rem] !text-[#fffdf7]">Bureau</span>}
        heightClassName="h-[620px] sm:h-[580px]"
        className="rounded-[2rem] border-[1.5px] border-dashed border-lab-blue/40 bg-paper/60"
      />
      <p className="mt-3 text-center font-hand text-xl font-bold text-lab-blue">
        Cliquez sur un pôle pour faire connaissance ↑
      </p>
    </div>
  )
}
