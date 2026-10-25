"use client"

import { ArrowRight } from "lucide-react"
import ComingSoonBlock from "@/components/ui/coming-soon-3"
import { congres } from "@/content/congres"
import { site } from "@/content/site"
import { IconeInstagram } from "./icones-reseaux"

/** Compte à rebours jusqu'au jour J de Bio-Innov 2027 (ComingSoonBlock). */
export function CompteARebours() {
  return (
    <ComingSoonBlock
      target={congres.compteARebours.debut}
      end={congres.compteARebours.fin}
      headingLevel="h2"
      badge="Compte à rebours · Jour J"
      title={
        <span className="titre-affiche block text-4xl sm:text-6xl">
          Plus que quelques jours avant <span className="surligne">{congres.nom}</span>
        </span>
      }
      description={
        <p>
          Rendez-vous le <strong className="text-ink">1er février 2027</strong> à la {congres.lieu.nom} (
          {congres.lieu.detail}) pour l’ouverture du congrès. Horaires à venir.
        </p>
      }
      labels={{ days: "Jours", hours: "Heures", minutes: "Minutes", seconds: "Secondes" }}
      srSummary={(t) =>
        `Ouverture de ${congres.nom} dans ${t.days} jour${t.days > 1 ? "s" : ""} et ${t.hours} heure${t.hours > 1 ? "s" : ""}.`
      }
      liveMessage={<span className="titre-affiche">C’est le jour J ! Bienvenue à {congres.nom}.</span>}
      endedMessage={<span className="titre-affiche">{congres.nom} a eu lieu. Merci à toutes et à tous !</span>}
      actions={
        <>
          <a href="#programme" className="bouton bouton-noir">
            Voir le programme <ArrowRight aria-hidden className="size-4" />
          </a>
          <a href={site.reseaux.instagram} target="_blank" rel="noopener noreferrer" className="bouton bouton-fluo">
            <IconeInstagram className="size-4" /> Suivre les annonces
            <span className="sr-only">(nouvel onglet)</span>
          </a>
        </>
      }
      className="min-h-0 border-b-[1.5px] border-ink bg-pole-vert/60 py-16 [&_.bg-card]:bg-[#fffdf7] [&_.bg-card]:text-lab-green-deep"
      tileClassName="w-[3.6rem] rounded-xl [&>span:first-child]:text-2xl sm:[&>span:first-child]:text-4xl max-sm:[&>span:last-child]:text-[9px] max-sm:[&>span:last-child]:tracking-normal border-[1.5px] border-ink shadow-[3px_3px_0_0_var(--ink)] sm:w-24 [&>span:last-child]:border-ink [&>span:last-child]:bg-lab-lime [&>span:last-child]:font-bold [&>span:last-child]:text-ink"
    />
  )
}
