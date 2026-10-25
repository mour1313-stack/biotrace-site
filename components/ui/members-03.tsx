// Adapté pour Biotrace : contenu passé en props (plus de données de démo), next/image,
// titre et actions libres (le projet n'a pas de Button « asChild » : les actions sont
// fournies par l'appelant), en-tête accessible (id du titre), classes personnalisables.

import Image from "next/image"
import { Dot } from "lucide-react"
import { Fragment } from "react"
import { cn } from "@/lib/utils"

export type MemberCard = { name: string; role?: string; image?: string; alt?: string }

export default function Members({
  title = "Members",
  titleId,
  meta = ["Team Avengers", "10 Members"],
  actions,
  members = [],
  children,
  className,
  headerClassName,
  metaClassName,
  gridClassName,
  imageWrapperClassName,
  imageClassName,
  nameClassName,
  roleClassName,
  imageSizes = "(min-width: 1024px) 220px, (min-width: 512px) 45vw, 92vw",
}: {
  title?: React.ReactNode
  titleId?: string
  /** Informations courtes séparées par un point (ex. équipe, nombre de membres). */
  meta?: React.ReactNode[]
  actions?: React.ReactNode
  members?: MemberCard[]
  /** Contenu libre entre l'en-tête et la grille. */
  children?: React.ReactNode
  className?: string
  headerClassName?: string
  metaClassName?: string
  gridClassName?: string
  imageWrapperClassName?: string
  imageClassName?: string
  nameClassName?: string
  roleClassName?: string
  imageSizes?: string
}) {
  return (
    <div className={className}>
      <div
        className={cn(
          "flex justify-between gap-4 rounded-lg bg-muted/90 px-6 py-5 max-[32rem]:flex-col min-[32rem]:items-center",
          headerClassName,
        )}
      >
        <div>
          <h3 id={titleId} className="text-lg font-medium">
            {title}
          </h3>
          {meta.length > 0 && (
            <div className={cn("mt-0.5 flex flex-wrap items-center text-sm text-muted-foreground", metaClassName)}>
              {meta.map((m, i) => (
                <Fragment key={i}>
                  {i > 0 && <Dot aria-hidden />}
                  <span>{m}</span>
                </Fragment>
              ))}
            </div>
          )}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>

      {children}

      <ul className={cn("mt-6 grid grid-cols-1 gap-x-4 gap-y-8 min-[32rem]:grid-cols-2 lg:grid-cols-3", gridClassName)}>
        {members.map((member) => (
          <li key={member.name}>
            <div className={cn("relative aspect-square overflow-hidden rounded-lg bg-muted", imageWrapperClassName)}>
              {member.image && (
                <Image
                  alt={member.alt ?? member.name}
                  className={cn("size-full rounded-lg object-cover", imageClassName)}
                  src={member.image}
                  fill
                  sizes={imageSizes}
                />
              )}
            </div>
            <p className={cn("mt-3 text-lg font-medium", nameClassName)}>{member.name}</p>
            {member.role && <p className={cn("text-sm text-muted-foreground", roleClassName)}>{member.role}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}
