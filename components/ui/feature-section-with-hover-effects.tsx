// Adapté pour Biotrace : contenu passé en props (plus de textes de démo), icônes lucide-react
// au lieu de @tabler/icons-react, couleurs du cahier de labo, cases optionnellement cliquables
// (lien Next.js), bordures adaptées au nombre de colonnes.

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

export type Feature = {
  title: string
  description: string
  icon: React.ReactNode
  /** Rend toute la case cliquable. */
  href?: string
}

export function FeaturesSectionWithHoverEffects({ features, className }: { features: Feature[]; className?: string }) {
  const total = features.length
  return (
    <div className={cn("relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4", className)}>
      {features.map((feature, index) => (
        <FeatureCase key={feature.title} {...feature} index={index} total={total} />
      ))}
    </div>
  )
}

function FeatureCase({
  title,
  description,
  icon,
  href,
  index,
  total,
}: Feature & { index: number; total: number }) {
  // Bordures fines entre les cases : 1 colonne (mobile), 2 (tablette), 4 (bureau).
  const firstRow = index < 4
  return (
    <div
      className={cn(
        "group/feature relative flex flex-col border-ink/15 py-10",
        index < total - 1 && "border-b",
        index % 2 === 0 && "md:border-r",
        index >= total - 2 && "md:border-b-0",
        "lg:border-r",
        index % 4 === 0 && "lg:border-l",
        firstRow && total > 4 ? "lg:border-b" : "lg:border-b-0",
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 h-full w-full to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100",
          firstRow ? "bg-gradient-to-t from-paper-deep" : "bg-gradient-to-b from-paper-deep",
        )}
      />
      <div className="relative z-10 mb-4 px-8 text-ink-soft [&_svg]:size-6">{icon}</div>
      <h3 className="relative z-10 mb-2 px-8 text-lg font-bold">
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-r-full bg-ink/20 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-lab-blue"
        />
        {href ? (
          <Link
            href={href}
            className="inline-flex items-center gap-1.5 text-ink transition duration-200 group-hover/feature:translate-x-2 after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:rounded-sm focus-visible:after:outline-2 focus-visible:after:outline-lab-blue"
          >
            {title}
            <ArrowUpRight aria-hidden className="size-4 text-lab-blue opacity-0 transition group-hover/feature:opacity-100" />
          </Link>
        ) : (
          <span className="inline-block text-ink transition duration-200 group-hover/feature:translate-x-2">{title}</span>
        )}
      </h3>
      <p className="relative z-10 max-w-xs px-8 text-sm text-ink-soft">{description}</p>
    </div>
  )
}
