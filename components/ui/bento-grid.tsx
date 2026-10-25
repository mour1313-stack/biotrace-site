// Adapté pour Biotrace : icônes lucide-react (pas de @radix-ui/react-icons) ; lien Next.js ou
// externe à la place du Button « asChild » (absent du projet) ; lien visible au focus clavier ;
// sur écran tactile (sans survol) le lien reste visible ; styles de carte personnalisables ;
// titre de carte de niveau configurable.

import type { ComponentType, ReactNode } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

const BentoGrid = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <div className={cn("grid w-full auto-rows-[22rem] grid-cols-3 gap-4", className)}>{children}</div>
}

const BentoCard = ({
  name,
  className,
  background,
  Icon,
  description,
  href,
  cta,
  cardClassName,
  iconClassName,
  nameClassName,
  descriptionClassName,
  ctaClassName,
  headingLevel = "h3",
}: {
  name: string
  className?: string
  background?: ReactNode
  Icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>
  description: ReactNode
  href: string
  cta: string
  /** Remplace l'habillage de la carte (fond, ombre, bordure). */
  cardClassName?: string
  iconClassName?: string
  nameClassName?: string
  descriptionClassName?: string
  ctaClassName?: string
  headingLevel?: "h2" | "h3" | "h4"
}) => {
  const externe = href.startsWith("http")
  const Titre = headingLevel
  const contenuLien = (
    <>
      {cta}
      {externe ? (
        <ArrowUpRight aria-hidden className="ml-2 h-4 w-4" />
      ) : (
        <ArrowRight aria-hidden className="ml-2 h-4 w-4" />
      )}
      {externe && <span className="sr-only"> (nouvel onglet)</span>}
    </>
  )
  const classesLien = cn(
    "pointer-events-auto inline-flex items-center rounded-md px-3 py-2 text-sm font-medium",
    ctaClassName,
  )

  return (
    <div
      className={cn(
        "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl",
        cardClassName ??
          "transform-gpu bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        className,
      )}
    >
      <div>{background}</div>
      <div className="pointer-events-none z-10 flex transform-gpu flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10 [@media(hover:none)]:-translate-y-10">
        <Icon
          aria-hidden
          className={cn(
            "h-12 w-12 origin-left transform-gpu text-neutral-700 transition-all duration-300 ease-in-out group-hover:scale-75",
            iconClassName,
          )}
        />
        <Titre className={cn("text-xl font-semibold text-neutral-700", nameClassName)}>{name}</Titre>
        <p className={cn("max-w-lg text-neutral-400", descriptionClassName)}>{description}</p>
      </div>

      <div className="pointer-events-none absolute bottom-0 z-10 flex w-full translate-y-10 transform-gpu flex-row items-center p-4 opacity-0 transition-all duration-300 group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
        {externe ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className={classesLien}>
            {contenuLien}
          </a>
        ) : (
          <Link href={href} className={classesLien}>
            {contenuLien}
          </Link>
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 transform-gpu transition-all duration-300 group-hover:bg-black/[.03]" />
    </div>
  )
}

export { BentoCard, BentoGrid }
