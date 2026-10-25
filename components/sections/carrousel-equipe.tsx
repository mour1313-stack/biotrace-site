import Link from "next/link"
import { ArrowRight, Users } from "lucide-react"
import { promotionActuelle } from "@/content/equipe"
import TeamMarquee from "@/components/ui/team"

/** Accueil : carrousel horizontal des portraits (noir et blanc, couleur au survol). */
export function CarrouselEquipe() {
  const promo = promotionActuelle
  return (
    <section aria-labelledby="titre-carrousel-equipe" className="border-t-[1.5px] border-ink py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <TeamMarquee
          headingId="titre-carrousel-equipe"
          title={
            <span className="titre-affiche block text-5xl sm:text-6xl lg:text-7xl">
              Les visages de <span className="surligne">Biotrace</span>
            </span>
          }
          description={
            <p className="text-lg sm:text-xl">
              {promo.sousTitre}{" "}
              <span className="font-hand text-2xl font-bold text-lab-blue [@media(hover:none)]:hidden">
                Survolez un portrait pour le voir en couleur !
              </span>
            </p>
          }
          icon={<Users aria-hidden className="size-6" />}
          iconClassName="rounded-full border-[1.5px] border-ink bg-lab-lime text-ink"
          members={promo.poles.flatMap((pole) =>
            pole.membres.map((m) => ({
              name: m.nom,
              role: m.fonction ? `${m.fonction} · ${pole.nom}` : `Pôle ${pole.nom}`,
              image: m.photo,
              alt: `Portrait de ${m.nom}`,
            })),
          )}
          duration="60s"
          fadeColor="var(--paper)"
          className="!bg-transparent !py-0"
          titleClassName="font-normal"
          cardClassName="w-48 sm:w-52"
          imageWrapperClassName="h-64 sm:h-72 rounded-2xl border-[1.5px] border-ink bg-pole-vert"
          imageClassName="object-top [@media(hover:none)]:grayscale-0"
          captionClassName="m-2 w-[calc(100%-1rem)] rounded-xl border-[1.5px] border-ink bg-[#fffdf7]/95 text-left [&>span:first-child]:text-lab-blue [&>span:first-child]:leading-tight [&>span:last-child]:text-xs [&>span:last-child]:text-ink-soft"
          imageSizes="208px"
        />
        <div className="mt-8 text-center">
          <Link href="/equipe" className="bouton bouton-noir">
            Rencontrer toute l’équipe <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
