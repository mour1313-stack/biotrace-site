// Adapté pour Biotrace : textes en français et passés en props ; liens Next.js avec les
// boutons du site (.bouton) au lieu de <Button asChild> (le Button du projet, base-ui,
// n'a pas d'asChild) ; « 404 » en police d'affiche, dans un vrai <h1> accessible.

import Link from "next/link"
import { CompassIcon, HomeIcon } from "lucide-react"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty"
import { cn } from "@/lib/utils"

type Lien = { label: string; href: string }

export function NotFound({
  eyebrow,
  description = (
    <>
      The page you&apos;re looking for might have been <br />
      moved or doesn&apos;t exist.
    </>
  ),
  home = { label: "Go Home", href: "/" },
  explore = { label: "Explore", href: "/" },
  className,
}: {
  eyebrow?: React.ReactNode
  description?: React.ReactNode
  home?: Lien
  explore?: Lien
  className?: string
}) {
  return (
    <div className={cn("relative flex min-h-screen w-full items-center justify-center overflow-hidden", className)}>
      <Empty>
        <EmptyHeader className="max-w-xl">
          {eyebrow}
          <EmptyTitle>
            <h1 className="mask-b-from-20% mask-b-to-80% font-display text-[9rem] leading-none font-normal sm:text-[12rem]">
              <span className="sr-only">Erreur </span>404
            </h1>
          </EmptyTitle>
          <EmptyDescription className="-mt-6 text-base text-foreground/80 sm:text-lg">{description}</EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="max-w-lg">
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={home.href} className="bouton bouton-noir">
              <HomeIcon aria-hidden className="size-4" />
              {home.label}
            </Link>
            <Link href={explore.href} className="bouton bouton-clair">
              <CompassIcon aria-hidden className="size-4" />
              {explore.label}
            </Link>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  )
}
