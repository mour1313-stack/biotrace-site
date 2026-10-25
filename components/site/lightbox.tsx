"use client"

import Image from "next/image"
import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react"
import { cn } from "@/lib/utils"

export type ImageAgrandie = { src: string; alt: string; legende?: string }

/**
 * Visionneuse plein écran basée sur <dialog> (focus piégé et touche Échap natifs).
 * Flèches gauche/droite pour naviguer quand plusieurs images sont fournies.
 */
export function Visionneuse({
  images,
  index,
  onClose,
  onChange,
}: {
  images: ImageAgrandie[]
  index: number | null
  onClose: () => void
  onChange?: (i: number) => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const ouvert = index !== null
  const multiple = images.length > 1 && !!onChange

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (ouvert && !d.open) d.showModal()
    if (!ouvert && d.open) d.close()
  }, [ouvert])

  const aller = useCallback(
    (delta: number) => {
      if (index === null || !onChange) return
      onChange((index + delta + images.length) % images.length)
    },
    [index, images.length, onChange],
  )

  useEffect(() => {
    if (!ouvert || !multiple) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") aller(1)
      if (e.key === "ArrowLeft") aller(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [ouvert, multiple, aller])

  const image = index !== null ? images[index] : null

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      aria-label={image?.legende ?? image?.alt ?? "Image agrandie"}
      className="m-auto h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-ink/85 backdrop:backdrop-blur-sm"
    >
      {image && (
        <div className="pointer-events-none flex h-full w-full flex-col items-center justify-center gap-3 p-4 sm:p-10">
          <figure className="pointer-events-auto relative flex max-h-full flex-col items-center">
            <Image
              key={image.src}
              src={image.src}
              alt={image.alt}
              width={1600}
              height={1600}
              sizes="100vw"
              className="h-[74dvh] w-[92vw] object-contain drop-shadow-2xl"
            />
            {image.legende && (
              <figcaption className="mt-3 rounded-full bg-[#fffdf7] px-4 py-1.5 text-center text-sm font-semibold text-ink">
                {image.legende}
                {multiple && index !== null && (
                  <span className="etiquette ml-2 text-ink-soft">
                    {index + 1}/{images.length}
                  </span>
                )}
              </figcaption>
            )}
          </figure>
          <div className="pointer-events-auto flex items-center gap-3">
            {multiple && (
              <button type="button" onClick={() => aller(-1)} className="bouton bouton-clair !size-12 !p-0">
                <ChevronLeft aria-hidden className="size-5" />
                <span className="sr-only">Image précédente</span>
              </button>
            )}
            <button type="button" onClick={onClose} className="bouton bouton-fluo" autoFocus>
              <X aria-hidden className="size-5" /> Fermer
            </button>
            {multiple && (
              <button type="button" onClick={() => aller(1)} className="bouton bouton-clair !size-12 !p-0">
                <ChevronRight aria-hidden className="size-5" />
                <span className="sr-only">Image suivante</span>
              </button>
            )}
          </div>
        </div>
      )}
    </dialog>
  )
}

/** Miniature cliquable qui s'ouvre en grand. */
export function ImageZoom({
  src,
  alt,
  legende,
  width,
  height,
  sizes,
  className,
  imageClassName,
  label = "Agrandir l’image",
  labelClassName,
  priority,
}: ImageAgrandie & {
  width: number
  height: number
  sizes?: string
  className?: string
  imageClassName?: string
  label?: string
  /** Classes du petit bouton « Agrandir » (pour le restyler ou ne l'afficher qu'au survol). */
  labelClassName?: string
  priority?: boolean
}) {
  const [ouvert, setOuvert] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOuvert(true)}
        className={cn("group relative block cursor-zoom-in overflow-hidden text-left", className)}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          className={cn("transition-transform duration-500 group-hover:scale-[1.03]", imageClassName)}
        />
        <span
          className={cn(
            "absolute right-2 bottom-2 inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-ink bg-[#fffdf7] px-2.5 py-1 text-xs font-bold opacity-90 transition group-hover:opacity-100 group-focus-visible:opacity-100",
            labelClassName,
          )}
        >
          <Expand aria-hidden className="size-3.5" />
          {label}
        </span>
      </button>
      <Visionneuse images={[{ src, alt, legende }]} index={ouvert ? 0 : null} onClose={() => setOuvert(false)} />
    </>
  )
}

/** Bouton texte qui ouvre une image en grand (ex. fiche d'un pôle). */
export function BoutonVisionneuse({
  image,
  children,
  className,
}: {
  image: ImageAgrandie
  children: React.ReactNode
  className?: string
}) {
  const [ouvert, setOuvert] = useState(false)
  return (
    <>
      <button type="button" onClick={() => setOuvert(true)} className={className}>
        {children}
      </button>
      <Visionneuse images={[image]} index={ouvert ? 0 : null} onClose={() => setOuvert(false)} />
    </>
  )
}
