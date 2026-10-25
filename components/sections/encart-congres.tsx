import Link from "next/link"
import { ArrowRight, CalendarDays, MapPin } from "lucide-react"
import { congres } from "@/content/congres"
import { ImageZoom } from "@/components/site/lightbox"
import { Reveal } from "@/components/site/motion-provider"
import { SectionTitre } from "@/components/site/section-titre"
import { Circuit } from "@/components/site/doodles"

export function EncartCongres() {
  return (
    <section
      id="bio-innov"
      aria-labelledby="titre-encart-congres"
      className="relative overflow-hidden border-t-[1.5px] border-ink bg-lab-green-deep py-24 text-[#f7f2e6]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-25 [background-image:linear-gradient(rgb(200_245_106/0.25)_1px,transparent_1px),linear-gradient(90deg,rgb(200_245_106/0.25)_1px,transparent_1px)] [background-size:24px_24px]"
      />
      <Circuit className="absolute top-10 right-6 h-20 text-lab-lime/40" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <SectionTitre
            id="titre-encart-congres"
            numero="03"
            surtitre={`Congrès · ${congres.edition}`}
            clair
            titre={
              <>
                {congres.nom}
                <span className="mt-3 block text-[0.55em] text-lab-lime">{congres.theme}</span>
              </>
            }
            sousTitre={`${congres.sousTitre}. ${congres.mention}`}
          />
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            <li className="flex items-start gap-3 rounded-2xl border-[1.5px] border-lab-lime/60 p-4">
              <CalendarDays aria-hidden className="mt-0.5 size-5 shrink-0 text-lab-lime" />
              <span className="font-semibold">{congres.dates}</span>
            </li>
            <li className="flex items-start gap-3 rounded-2xl border-[1.5px] border-lab-lime/60 p-4">
              <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-lab-lime" />
              <span className="font-semibold">
                {congres.lieu.nom}
                <span className="block text-sm font-normal text-[#f7f2e6]/80">{congres.lieu.detail}</span>
              </span>
            </li>
          </ul>
          <Link href="/bio-innov-2027" className="bouton bouton-fluo mt-8">
            Tout savoir sur Bio-Innov 2027 <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
        <Reveal className="mx-auto w-full max-w-sm rotate-[-2deg]">
          <ImageZoom
            src={congres.affiche.src}
            alt={congres.affiche.alt}
            legende="Bio-Innov 2027 — affiche officielle"
            width={1086}
            height={1524}
            sizes="(min-width: 1024px) 384px, 80vw"
            className="rounded-xl border-2 border-lab-lime shadow-[8px_8px_0_0_var(--lab-lime)]"
            imageClassName="h-auto w-full"
            label="Voir l’affiche"
          />
        </Reveal>
      </div>
    </section>
  )
}
