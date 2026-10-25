"use client"

import Timeline, { type JourneyItem } from "@/components/ui/timeline"

/**
 * Chronologie de l'association (page L'association), d'après timeline.tsx.
 * Uniquement des étapes confirmées : la création (novembre 2005), le premier congrès (2006)
 * et des éditions dont les dates et les thèmes figurent sur les affiches.
 */
const etapes: JourneyItem[] = [
  {
    id: "c2005",
    year: "2005",
    month: "novembre",
    content: "Naissance de BIOTRACE à l’Université de Montpellier, portée par des étudiants passionnés de biotechnologies.",
  },
  {
    id: "c2006",
    year: "2006",
    content: "Premier congrès scientifique annuel, imaginé et porté par les étudiants : une tradition est née.",
  },
  {
    id: "c2019",
    year: "2019",
    month: "février",
    content: "Congrès « Biotechnologies : de l’innovation au dispositif pour la santé et l’environnement ».",
  },
  {
    id: "c2021",
    year: "2021",
    month: "février",
    content: "16e congrès, en webinaire : les « microbiotechnologies », au carrefour des sciences innovantes.",
  },
  {
    id: "c2023",
    year: "2023",
    month: "février",
    content: "18e congrès : la place des biotechnologies dans la conquête spatiale.",
  },
  {
    id: "c2026",
    year: "2026",
    month: "février",
    content: "20e congrès : « Voyage vers un futur guidé par les biotechnologies ».",
  },
  {
    id: "c2027",
    year: "2027",
    month: "février",
    content: "Bio-Innov 2027, 21e édition, organisée par le Master IBION-Tec : les biomatériaux.",
  },
]

export function Chronologie() {
  return (
    <div className="border-b-[1.5px] border-ink">
      <Timeline
        id="chronologie"
        // Frise centrée verticalement, sous l'en-tête fixe ; section un peu moins haute (moins d'attente avant la suite).
        className="h-[150vw] max-[600px]:h-[400vh]"
        stickyClassName="flex items-center pt-24 pb-6 max-[600px]:block max-[600px]:pt-[10%]"
        title="Notre chronologie"
        periodLabel="2005 — 2027"
        items={etapes}
        textColor="var(--ink)"
        mutedTextColor="var(--ink-soft)"
        activeColor="var(--lab-blue)"
        backgroundColor="transparent"
        imageUrl="/images/equipe/2026-2027/equipe-complete.jpg"
        imageAlt="L’équipe Biotrace 2026–2027 devant le logo de l’Université de Montpellier."
        duration={1.4}
        titleClassName="font-display uppercase"
        itemTitleClassName="font-display uppercase"
      />
    </div>
  )
}
