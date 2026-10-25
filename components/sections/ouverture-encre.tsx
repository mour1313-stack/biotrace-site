"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import InkHero from "@/components/ui/ink-hero"
import { Reveal } from "@/components/site/motion-provider"
import { Entoure } from "@/components/site/doodles"

/**
 * Première section de l'accueil, plein écran : la photo du biomatériau poreux occupe
 * toute la largeur et « se développe » comme une encre au défilement (papier → lavis → tirage),
 * avec une lente respiration. Le nom BIOTRACE est posé directement dessus.
 */
export function OuvertureEncre() {
  return (
    <InkHero
      image={{
        src: "/images/accueil/reseau-poreux.webp",
        alt: "Vue rapprochée d’un biomatériau poreux : un réseau beige et blanc de fibres et d’alvéoles de tailles variées, en profondeur.",
      }}
      frame={false}
      zoom={false}
      breathe
      showRail={false}
      nav={null}
      inkColor="#14532d"
      travel={160}
      feather={0.12}
      grain={0.3}
      noiseScale={4}
      startAt={0.5}
      overlay={<TitreBiotrace />}
      // Remonte sous la barre de navigation (flottante) pour occuper exactement l’écran
      className="-mt-20 xl:-mt-24"
    />
  )
}

function TitreBiotrace() {
  return (
    <div className="relative flex h-full w-full flex-col justify-end">
      {/* Dégradés de lisibilité : crème depuis le bas et depuis la gauche */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,var(--paper)_0%,rgb(247_242_230/0.88)_26%,rgb(247_242_230/0.45)_52%,transparent_78%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_15%_80%,rgb(247_242_230/0.6),transparent_70%)]"
      />

      <div className="relative mx-auto w-full max-w-[1680px] px-5 pt-24 pb-8 sm:px-8 lg:px-12 lg:pb-12 xl:px-16">
        <Reveal>
          <p className="etiquette inline-flex items-center gap-2 rounded-full border-[1.5px] border-ink bg-[#fffdf7]/90 px-3 py-1.5 backdrop-blur-sm">
            <span className="size-2 animate-pulse rounded-full bg-lab-green" aria-hidden />
            Association étudiante du Master IBION-Tec
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <h1 className="mt-5 text-ink">
            <span className="titre-affiche block text-[23vw] sm:text-[clamp(4.4rem,15.5vw,16rem)] leading-[0.85] tracking-[-0.005em] drop-shadow-[0_2px_18px_rgb(247_242_230/0.7)]">
              <span className="surligne inline-block [background-position:0_96%] [background-size:100%_0.16em]">Biotrace</span>
            </span>
            <span className="titre-affiche mt-3 block pl-[0.08em] text-[clamp(1.3rem,3.4vw,3.4rem)] leading-none tracking-[0.42em]">
              Montpellier
            </span>
          </h1>
        </Reveal>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <div>
            <Reveal delay={0.18}>
              <p className="font-hand text-[1.9rem] leading-tight font-bold text-lab-blue sm:text-[2.4rem]">
                Depuis <Entoure>2005</Entoure>, la science nous rassemble.
              </p>
            </Reveal>
            <Reveal delay={0.28} className="mt-6 flex flex-wrap gap-3">
              <Link href="/equipe" className="bouton bouton-noir">
                Découvrir notre équipe <ArrowRight aria-hidden className="size-4" />
              </Link>
              <Link href="/bio-innov-2027" className="bouton bouton-fluo">
                Bio-Innov 2027
              </Link>
            </Reveal>
          </div>
          <Reveal delay={0.36}>
            <p className="etiquette max-w-xs text-ink-soft max-sm:hidden">
              Fig. 01 — Biomatériau poreux, vu de très près · illustration
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
