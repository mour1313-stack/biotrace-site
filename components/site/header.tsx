"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { LARGEUR_CHAMP, RechercheSite } from "@/components/site/recherche-site"
import { useDefilement } from "@/components/site/use-defilement"
import { AnimatedNavFramer } from "@/components/ui/navigation-menu"
import { navigation } from "@/content/site"
import { cn } from "@/lib/utils"

/**
 * Navigation grand écran (1280 px et plus) : longue barre flottante en haut de page,
 * avec la page en cours surlignée et la recherche. Dès que l'on descend, elle s'efface
 * en douceur et laisse place au bouton menu (trois lignes) de MenuImmersif ;
 * elle revient quand on remonte tout en haut. En dessous de 1280 px, voir MenuImmersif.
 */
export function Header() {
  const pathname = usePathname()
  const defile = useDefilement()
  // Recherche ouverte sans assez de place à côté de la barre : la barre se replie
  // en pastille le temps de la recherche, pour que rien ne se superpose.
  // On retient la plus grande largeur vue de la barre (dépliée), et on recalcule
  // au redimensionnement de la fenêtre.
  const [ouverte, setOuverte] = useState(false)
  const [replier, setReplier] = useState(false)
  const largeurBarre = useRef(0)

  useEffect(() => {
    const barre = document.querySelector<HTMLElement>('nav[aria-label="Navigation principale"]')
    if (!barre) return
    const mesurer = () => {
      largeurBarre.current = Math.max(largeurBarre.current, barre.offsetWidth)
    }
    mesurer()
    const ro = new ResizeObserver(mesurer)
    ro.observe(barre)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const calculer = () =>
      setReplier(ouverte && largeurBarre.current + 12 + LARGEUR_CHAMP + 48 > window.innerWidth)
    calculer()
    if (!ouverte) return
    window.addEventListener("resize", calculer)
    return () => window.removeEventListener("resize", calculer)
  }, [ouverte])

  return (
    <div className="hidden xl:block">
      <AnimatedNavFramer
        label="Navigation principale"
        expandLabel="Afficher le menu"
        logoHref="/"
        logoLabel="Biotrace Montpellier — accueil"
        logo={
          <span className="flex items-center gap-2">
            <Image
              src="/images/logos/biotrace.jpg"
              alt=""
              width={671}
              height={457}
              className="h-8 w-auto mix-blend-multiply"
              priority
            />
            <span className="font-display text-xl leading-none text-ink uppercase">Biotrace</span>
          </span>
        }
        items={navigation.map(({ label, href }) => ({ name: label, href }))}
        activeHref={pathname}
        cta={{ name: "Nous rejoindre", href: "/contact" }}
        navClassName="border-[1.5px] border-ink bg-paper/90 shadow-[3px_3px_0_0_var(--ink)] backdrop-blur-md"
        linkClassName="rounded-full !px-3 !py-1.5 text-[0.92rem] font-semibold text-ink-soft hover:bg-lab-lime hover:text-ink"
        activeLinkClassName="bg-lab-lime !text-ink"
        ctaClassName="bouton bouton-noir !min-h-9 !py-1 text-sm"
        collapseOnScroll={false}
        forceCollapsed={replier}
        className={cn(
          "transition-[opacity,translate,visibility] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          defile && "invisible pointer-events-none -translate-y-6 opacity-0",
        )}
        trailing={<RechercheSite onExpandedChange={setOuverte} />}
      />
      {/* Réserve la place de la barre flottante en haut de page */}
      <div aria-hidden className="h-24" />
    </div>
  )
}
