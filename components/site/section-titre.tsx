import { cn } from "@/lib/utils"

/** En-tête de section façon page de carnet : numéro, titre affiche, sous-titre. */
export function SectionTitre({
  numero,
  surtitre,
  titre,
  sousTitre,
  id,
  className,
  clair,
  as: Titre = "h2",
}: {
  numero: string
  surtitre: string
  titre: React.ReactNode
  sousTitre?: React.ReactNode
  id?: string
  className?: string
  clair?: boolean
  /** h1 quand la section est le sujet principal de la page. */
  as?: "h1" | "h2"
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      <p className={cn("etiquette flex items-center gap-3", clair ? "text-lab-lime" : "text-lab-blue")}>
        <span
          className={cn(
            "inline-flex h-7 min-w-7 items-center justify-center rounded-full border-2 px-1.5 font-bold",
            clair ? "border-lab-lime" : "border-lab-blue",
          )}
        >
          {numero}
        </span>
        {surtitre}
      </p>
      <Titre id={id} className={cn("titre-affiche mt-4 text-5xl sm:text-6xl lg:text-7xl", clair && "!text-[#f7f2e6]")}>
        {titre}
      </Titre>
      {sousTitre && (
        <p className={cn("mt-5 text-lg sm:text-xl", clair ? "text-[#f7f2e6]/85" : "text-ink-soft")}>{sousTitre}</p>
      )}
    </div>
  )
}
