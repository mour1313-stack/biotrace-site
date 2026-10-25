"use client"

import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { ExpandingSearchDock } from "@/components/ui/expanding-search-dock-shadcnui"
import { rechercher } from "@/lib/recherche"

/** Largeur du champ ouvert sur grand écran (px). */
export const LARGEUR_CHAMP = 340

/**
 * Recherche du site : petite loupe en haut de page, qui s'ouvre en champ de recherche.
 * Placée dans la barre de navigation grand écran (Header) et dans l'en-tête mobile (MenuImmersif).
 */
export function RechercheSite({
  className,
  compact = false,
  onExpandedChange,
}: {
  className?: string
  compact?: boolean
  onExpandedChange?: (expanded: boolean) => void
}) {
  const router = useRouter()

  return (
    <div className={cn("print:hidden", className)}>
      <ExpandingSearchDock
        placeholder="Un pôle, un nom, un congrès…"
        openLabel="Rechercher sur le site"
        closeLabel="Fermer la recherche"
        inputLabel="Rechercher sur le site"
        emptyLabel="Aucun résultat — essayez « congrès », « trésorerie » ou un prénom."
        resultsPlacement="bottom"
        expandedWidth={compact ? 280 : LARGEUR_CHAMP}
        onExpandedChange={onExpandedChange}
        getResults={(q) =>
          rechercher(q).map((r) => ({
            id: `${r.type}-${r.href}-${r.titre}`,
            title: r.titre,
            subtitle: r.extrait,
            badge: r.type,
            href: r.href,
          }))
        }
        onSelect={(r) => r.href && router.push(r.href)}
        onSearch={(q) => {
          const [premier] = rechercher(q, 1)
          if (premier) router.push(premier.href)
        }}
        buttonClassName={cn(
          // .glow : même lueur « spotlight » que les boutons du site (voir globals.css).
          "glow border-[1.5px] border-ink bg-lab-lime text-ink shadow-[3px_3px_0_0_var(--ink)] hover:bg-lab-lime hover:brightness-95",
          compact && "!size-10 xl:!size-12",
        )}
        fieldClassName="border-[1.5px] border-ink bg-paper/95 shadow-[3px_3px_0_0_var(--ink)]"
        panelClassName="border-[1.5px] border-ink bg-paper shadow-[3px_3px_0_0_var(--ink)] [&_[aria-selected=true]]:bg-lab-lime"
      />
    </div>
  )
}
