"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { CakeSlice, Expand, Images } from "lucide-react"
import type { CategorieGalerie, ImageGalerie } from "@/content/evenements"
import { Visionneuse } from "./lightbox"
import { cn } from "@/lib/utils"
import {
  HoverSlider,
  HoverSliderImage,
  HoverSliderImageWrap,
  HoverSliderPanel,
  TextStaggerHover,
} from "@/components/ui/animated-slideshow"

/**
 * Présentation du choix de rubrique :
 * - "barre" : barre horizontale soulignée ; aucune photo avant un clic sur une rubrique ;
 * - "diaporama" : grands titres animés et aperçu (d'après animated-slideshow.tsx) ;
 * - "pastilles" : boutons-pastilles d'origine, galerie complète affichée d'emblée.
 */
const MODE_FILTRES: "barre" | "diaporama" | "pastilles" = "barre"

/** Vignettes épurées (photo sans cadre, ombre douce, légende discrète). false : cartes à contour noir d'origine. */
const VIGNETTES_EPUREES = true

/** Image d'aperçu de chaque rubrique (aucune pour une rubrique encore vide). */
const apercus: Record<string, string> = {
  Tout: "/images/equipe/2026-2027/equipe-complete.jpg",
  Équipe: "/images/equipe/2026-2027/bureau-photo-equipe-hd.jpg",
}

const categories: CategorieGalerie[] = ["Congrès", "Équipe", "Stands & vie associative"]

export function Galerie({ images }: { images: ImageGalerie[] }) {
  // En mode « barre », aucune rubrique n'est choisie au départ : aucune photo n'est affichée.
  const [filtre, setFiltre] = useState<CategorieGalerie | "Tout" | null>(MODE_FILTRES === "barre" ? null : "Tout")
  const [index, setIndex] = useState<number | null>(null)
  const [survol, setSurvol] = useState<number | null>(null)
  const rubriques = ["Tout", ...categories] as const
  const nombre = (c: (typeof rubriques)[number]) =>
    c === "Tout" ? images.length : images.filter((i) => i.categorie === c).length
  const apercu = (c: (typeof rubriques)[number]) => apercus[c] ?? images.find((i) => i.categorie === c)?.src

  const visibles = useMemo(
    () => (filtre === null ? [] : filtre === "Tout" ? images : images.filter((i) => i.categorie === filtre)),
    [filtre, images],
  )

  return (
    <div>
      {MODE_FILTRES === "barre" ? (
        <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
          <div role="group" aria-label="Choisir une rubrique de la galerie" className="flex w-max gap-6 sm:gap-8">
            {rubriques.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={filtre === c}
                onClick={() => {
                  setIndex(null)
                  setFiltre(c)
                }}
                className={cn(
                  "group/rubrique shrink-0 rounded-sm pt-1 text-left text-sm font-bold tracking-[0.06em] whitespace-nowrap uppercase transition-colors sm:text-base",
                  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lab-blue",
                  filtre === c ? "text-ink" : "text-ink-soft hover:text-ink",
                )}
              >
                {c} <span className="font-semibold opacity-70">({nombre(c)})</span>
                <span
                  aria-hidden
                  className={cn(
                    "mt-2 block h-1 rounded-full transition-colors duration-300",
                    filtre === c ? "bg-lab-lime" : "bg-ink/10 group-hover/rubrique:bg-ink/25",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
      ) : MODE_FILTRES === "diaporama" ? (
        <HoverSlider
          value={survol ?? (filtre ? rubriques.indexOf(filtre) : -1)}
          onValueChange={setSurvol}
          onMouseLeave={() => setSurvol(null)}
          className="flex flex-col-reverse gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-12"
        >
          <div role="group" aria-label="Filtrer la galerie" className="flex flex-col items-start gap-1 sm:gap-2">
            {rubriques.map((c, i) => (
              <button
                key={c}
                type="button"
                aria-pressed={filtre === c}
                onClick={() => setFiltre(c)}
                onFocus={() => setSurvol(i)}
                onBlur={() => setSurvol(null)}
                className="group/rubrique flex items-baseline gap-3 rounded-md text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lab-blue"
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-3 shrink-0 self-center rounded-full border-[1.5px] border-ink transition-colors",
                    filtre === c ? "bg-lab-lime" : "bg-transparent",
                  )}
                />
                <TextStaggerHover
                  index={i}
                  text={c}
                  className="cursor-pointer pt-[0.12em] font-display text-3xl leading-[1.1] uppercase sm:text-5xl lg:text-6xl"
                />
                <span className="etiquette text-ink-soft">({nombre(c)})</span>
              </button>
            ))}
          </div>

          <HoverSliderImageWrap className="aspect-[4/3] w-full max-w-md rounded-2xl border-[1.5px] border-ink bg-[#fffdf7] shadow-[4px_4px_0_0_var(--ink)] sm:w-[42%]">
            {rubriques.map((c, i) => {
              const src = apercu(c)
              return src ? (
                <HoverSliderImage
                  key={c}
                  index={i}
                  src={src}
                  alt=""
                  className="size-full object-cover object-[center_75%]"
                  loading="eager"
                  decoding="async"
                />
              ) : (
                <HoverSliderPanel
                  key={c}
                  index={i}
                  aria-hidden
                  className="flex size-full flex-col items-center justify-center gap-2 bg-pole-jaune p-6 text-center"
                >
                  <CakeSlice className="size-12" />
                  <span className="font-hand text-2xl font-bold">Photos à venir !</span>
                </HoverSliderPanel>
              )
            })}
          </HoverSliderImageWrap>
        </HoverSlider>
      ) : (
        <div role="group" aria-label="Filtrer la galerie" className="flex flex-wrap gap-2">
          {(["Tout", ...categories] as const).map((c) => {
            const nb = c === "Tout" ? images.length : images.filter((i) => i.categorie === c).length
            return (
              <button
                key={c}
                type="button"
                aria-pressed={filtre === c}
                onClick={() => setFiltre(c)}
                className={cn(
                  "glow rounded-full border-[1.5px] border-ink px-4 py-2 text-sm font-bold transition",
                  filtre === c ? "bg-ink text-[#fffdf7]" : "bg-[#fffdf7] hover:bg-lab-lime",
                )}
              >
                {c} <span className="etiquette opacity-70">({nb})</span>
              </button>
            )
          })}
        </div>
      )}

      {filtre === null ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-10 flex flex-col items-center gap-3 py-10 text-center text-ink-soft"
        >
          <Images aria-hidden className="size-8" />
          Sélectionnez une catégorie pour afficher les photos.
        </motion.p>
      ) : visibles.length === 0 ? (
        <p className="mt-8 rounded-2xl border-[1.5px] border-dashed border-ink/40 bg-[#fffdf7]/60 p-8 text-center text-ink-soft">
          Les photos de cette rubrique arrivent bientôt. Suivez nos stands et moments de vie associative sur{" "}
          <a
            href="https://www.instagram.com/biotrace_mtp/"
            target="_blank"
            rel="noopener noreferrer"
            className="lien-bleu"
          >
            Instagram<span className="sr-only"> (nouvel onglet)</span>
          </a>
          .
        </p>
      ) : (
        <motion.ul
          // Nouvelle rubrique : la galerie précédente est remplacée, avec un fondu.
          key={filtre}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={cn("mt-8 columns-2 sm:columns-3 lg:columns-4", VIGNETTES_EPUREES ? "gap-6" : "gap-4")}
        >
          {visibles.map((img, i) =>
            VIGNETTES_EPUREES ? (
              <li key={img.src} className="mb-8 break-inside-avoid">
                {/* Photo seule, sans cadre : coins à peine arrondis, ombre douce ; légende discrète dessous. */}
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  className="group block w-full cursor-zoom-in text-left"
                >
                  <span className="relative block overflow-hidden rounded-[3px] shadow-[0_1px_2px_rgba(22,22,22,0.10),0_10px_24px_-10px_rgba(22,22,22,0.35)] transition-shadow duration-500 group-hover:shadow-[0_2px_4px_rgba(22,22,22,0.12),0_18px_36px_-12px_rgba(22,22,22,0.45)]">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={800}
                      height={1000}
                      sizes="(min-width: 1024px) 300px, (min-width: 640px) 33vw, 50vw"
                      className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    />
                    <span className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full bg-[#fffdf7]/85 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                      <Expand aria-hidden className="size-3.5" />
                    </span>
                  </span>
                  <span className="mt-2.5 block text-sm leading-snug text-ink-soft group-hover:text-ink">
                    {img.legende}
                  </span>
                </button>
              </li>
            ) : (
              <li key={img.src} className="mb-4 break-inside-avoid">
                <button
                  type="button"
                  onClick={() => setIndex(i)}
                  className="group relative block w-full cursor-zoom-in overflow-hidden rounded-xl border-[1.5px] border-ink bg-[#fffdf7] text-left shadow-[3px_3px_0_0_var(--ink)]"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    width={800}
                    height={1000}
                    sizes="(min-width: 1024px) 300px, (min-width: 640px) 33vw, 50vw"
                    className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <span className="flex items-center justify-between gap-2 border-t-[1.5px] border-ink px-3 py-2 text-xs font-bold">
                    {img.legende}
                    <Expand aria-hidden className="size-3.5 shrink-0" />
                  </span>
                </button>
              </li>
            ),
          )}
        </motion.ul>
      )}

      <Visionneuse images={visibles} index={index} onClose={() => setIndex(null)} onChange={setIndex} />
    </div>
  )
}
