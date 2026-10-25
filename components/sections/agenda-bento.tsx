import Image from "next/image"
import { CakeSlice, CalendarDays, Camera, History, Microscope } from "lucide-react"
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid"
import { congres } from "@/content/congres"
import { archivesCongres, evenements, galerie } from "@/content/evenements"

/** Image de fond d'une carte : en haut, fondue vers le bas pour laisser le texte lisible. */
function Fond({ src, position = "object-top" }: { src: string; position?: string }) {
  return (
    <div aria-hidden className="absolute inset-0">
      <Image
        src={src}
        alt=""
        fill
        sizes="(min-width: 1024px) 33vw, 92vw"
        className={`object-cover ${position} opacity-90`}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#fffdf7]/70 to-[#fffdf7] to-75%" />
    </div>
  )
}

const carte = {
  cardClassName: "border-[1.5px] border-ink bg-[#fffdf7] shadow-[4px_4px_0_0_var(--ink)]",
  iconClassName: "text-lab-blue",
  nameClassName: "titre-affiche text-2xl text-ink",
  descriptionClassName: "text-ink-soft",
  ctaClassName: "bouton bouton-noir !min-h-9 !py-1 text-sm",
}

/** Agenda en mosaïque (d'après bento-grid.tsx) : uniquement des événements et pages réels du site. */
export function AgendaBento() {
  const bioInnov = evenements.find((e) => e.id === "bio-innov-2027")
  const crepes = evenements.find((e) => e.id === "crepes-gaufres")
  const editions = archivesCongres.length
  const premiere = archivesCongres.at(-1)?.annee
  const derniere = archivesCongres[0]?.annee

  return (
    <BentoGrid className="auto-rows-[20rem] lg:auto-rows-[15rem]">
      <BentoCard
        {...carte}
        Icon={Microscope}
        name={`${congres.nom} — à venir`}
        description={`${bioInnov?.date ?? congres.dates} · ${congres.lieu.nom}. ${congres.theme}.`}
        href="/bio-innov-2027"
        cta="Découvrir le congrès"
        background={<Fond src={congres.affiche.src} />}
        className="lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-4"
      />
      <BentoCard
        {...carte}
        Icon={CakeSlice}
        name="Crêpes & gaufres"
        description={crepes?.description ?? ""}
        href={crepes?.lien?.href ?? "/contact"}
        cta="Suivre sur Instagram"
        background={
          <div aria-hidden className="absolute inset-0 bg-pole-jaune">
            <span className="absolute top-6 right-6 rotate-6 font-hand text-4xl font-bold">miam !</span>
          </div>
        }
        className="lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3"
      />
      <BentoCard
        {...carte}
        Icon={CalendarDays}
        name="Archives du congrès"
        description={`${editions} affiches, de ${premiere} à ${derniere}.`}
        href="#archives"
        cta="Voir les archives"
        background={<Fond src={archivesCongres[0]?.affiche ?? congres.affiche.src} />}
        className="lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4"
      />
      <BentoCard
        {...carte}
        Icon={Camera}
        name="La galerie"
        description={`${galerie.length} images : congrès, équipe et vie associative.`}
        href="#galerie"
        cta="Ouvrir la galerie"
        background={<Fond src="/images/equipe/2026-2027/equipe-complete.jpg" position="object-center" />}
        className="lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2"
      />
      <BentoCard
        {...carte}
        Icon={History}
        name="Notre histoire"
        description="Depuis 2005, des générations d’étudiants et un congrès scientifique chaque année depuis 2006."
        href="/association"
        cta="Lire notre histoire"
        background={<Fond src="/images/equipe/2026-2027/equipe-escalier.jpg" position="object-center" />}
        className="lg:col-start-3 lg:col-end-4 lg:row-start-2 lg:row-end-4"
      />
    </BentoGrid>
  )
}
