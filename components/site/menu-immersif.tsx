"use client"

import Image from "next/image"
import { RechercheSite } from "@/components/site/recherche-site"
import { useDefilement } from "@/components/site/use-defilement"
import ImmersiveFullscreenNav from "@/components/ui/immersive-full-screen-nav"
import { navigation, site } from "@/content/site"
import { cn } from "@/lib/utils"

/**
 * Menu vert plein écran du site.
 * - Mobile et tablette (moins de 1280 px) : en-tête fixe avec logo, loupe et bouton menu.
 * - Ordinateur : invisible en haut de page (la longue barre de Header s'affiche) ; dès que
 *   l’on descend, la loupe et le bouton menu (trois lignes) apparaissent, fixes en haut à droite.
 *   Une fois le menu ouvert, l'en-tête reprend son aspect habituel (logo + croix).
 */
export function MenuImmersif() {
  const defile = useDefilement()
  // L'en-tête porte data-open dès le clic : les styles « menu fermé » sur ordinateur
  // s'appuient dessus (variantes data-[open=false] et group-data-[open=false]/entete).

  return (
    <div>
      <ImmersiveFullscreenNav
        navConfig={{
          brand: (
            <span className="flex items-center gap-2 normal-case tracking-normal">
              <Image
                src="/images/logos/biotrace.jpg"
                alt=""
                width={671}
                height={457}
                priority
                className="h-9 w-auto rounded-md bg-[#fffdf7] p-0.5 mix-blend-multiply"
              />
              <span className="font-display text-2xl uppercase">Biotrace</span>
              <span className="etiquette text-[0.62rem] opacity-80 max-[380px]:hidden">Montpellier</span>
            </span>
          ),
          brandLabel: "Biotrace Montpellier — accueil",
          brandHref: "/",
          toggleLabel: "Menu",
          // Loupe à gauche du bouton menu ; le champ s'ouvre vers la gauche (par-dessus le logo sur mobile).
          // Sur ordinateur, elle n'apparaît qu'une fois la page défilée, avec le bouton menu.
          headerActions: (
            <div className="relative size-10 xl:pointer-events-auto xl:size-12">
              <RechercheSite compact className="absolute top-1/2 right-0 -translate-y-1/2" />
            </div>
          ),
          clipOrigin: "bottom",
          overlayBg: "#14532d",
          headerOpenColor: "#f7f2e6",
          headerClassName: cn(
            "border-b-[1.5px] border-ink bg-paper/90 backdrop-blur-md transition-[background-color,border-color,opacity,visibility,translate] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] data-[open=true]:border-transparent data-[open=true]:bg-transparent data-[open=true]:backdrop-blur-none max-sm:px-4 motion-reduce:transition-none",
            "group/entete",
            // Ordinateur, menu fermé : en-tête transparent, seul le bouton menu reste cliquable…
            "xl:data-[open=false]:pointer-events-none xl:data-[open=false]:border-transparent xl:data-[open=false]:bg-transparent xl:data-[open=false]:backdrop-blur-none",
            // …et en haut de page, rien du tout : la longue barre de Header prend le relais.
            !defile && "xl:data-[open=false]:invisible xl:data-[open=false]:-translate-y-4 xl:data-[open=false]:opacity-0",
          ),
          // Ordinateur, menu fermé : logo masqué, bouton menu en pastille (comme la longue barre).
          brandClassName: "xl:group-data-[open=false]/entete:invisible xl:group-data-[open=false]/entete:opacity-0 xl:group-data-[open=false]/entete:!delay-0",
          toggleClassName: cn(
            "transition-all duration-500",
            "xl:group-data-[open=false]/entete:pointer-events-auto xl:group-data-[open=false]/entete:size-12 xl:group-data-[open=false]/entete:rounded-full xl:group-data-[open=false]/entete:border-[1.5px] xl:group-data-[open=false]/entete:border-ink",
            "xl:group-data-[open=false]/entete:bg-paper/90 xl:group-data-[open=false]/entete:px-3.5 xl:group-data-[open=false]/entete:shadow-[3px_3px_0_0_var(--ink)] xl:group-data-[open=false]/entete:backdrop-blur-md xl:group-data-[open=false]/entete:hover:bg-lab-lime",
          ),
          openDuration: 1,
          closeDuration: 0.9,
        }}
        navContent={{
          agencyName: site.nom,
          tagline: site.accroche,
          // Ordinateur : taille limitée par la hauteur de l'écran pour que les six rubriques tiennent sans se couper.
          linkClassName:
            "font-display uppercase leading-[1.05] whitespace-nowrap xl:!text-[min(4.6vw,8.5vh)] max-[1025px]:!text-[10.5vw] max-sm:!text-[11.5vw]",
          links: navigation.map(({ label, href }) => ({ label, href })),
          images: [
            { src: "/images/equipe/2026-2027/equipe-complete.jpg", alt: "Photo de groupe de l’équipe Biotrace 2026–2027 devant le logo de l’Université de Montpellier." },
          ],
          socials: [
            { type: "instagram", href: site.reseaux.instagram, label: "Instagram de Biotrace (nouvel onglet)" },
            { type: "linkedin", href: site.reseaux.linkedin, label: "LinkedIn de Biotrace (nouvel onglet)" },
          ],
          location: `${site.adresse.lieu} · Montpellier`,
        }}
      />
      {/* Réserve la hauteur de l'en-tête fixe */}
      <div aria-hidden className="h-20 xl:hidden" />
    </div>
  )
}
