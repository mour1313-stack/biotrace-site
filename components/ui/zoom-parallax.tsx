"use client"
// Adapté pour Biotrace : next/image ; option `fit` (contain pour garder les affiches entières) ;
// disposition « portrait » pour des affiches (cadre à la forme exacte de chaque image grâce à
// width/height, légère inclinaison possible) ; classes du cadre personnalisables ; grille simple
// à la place de l'effet sur petit écran et si l'utilisateur demande moins de mouvement ; 7 images max.

import Image from "next/image"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

interface ZoomImage {
  src: string
  alt?: string
  /** Dimensions d'origine : le cadre prend alors exactement la forme de l'image. */
  width?: number
  height?: number
}

interface ZoomParallaxProps {
  /** Images affichées dans l'effet (7 au maximum). La première est au centre. */
  images: ZoomImage[]
  /** cover : remplit le cadre (recadre) ; contain : image entière. */
  fit?: "cover" | "contain"
  /** landscape : cadres d'origine ; portrait : cadres plus hauts, adaptés aux affiches. */
  layout?: "landscape" | "portrait"
  frameClassName?: string
  /** Inclinaison de chaque cadre, en degrés (dans l'ordre des images). */
  tilts?: number[]
  className?: string
}

const positionsPaysage = [
  "",
  "[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]",
  "[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]",
  "[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]",
  "[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]",
  "[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]",
  "[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]",
]

// Hauteur limitée aussi par la largeur : sur un écran étroit et haut, les cadres ne se chevauchent pas.
const positionsPortrait = [
  "[&>div]:!h-[min(28vh,17.5vw)] [&>div]:!w-auto",
  "[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[min(28vh,17.5vw)] [&>div]:!w-auto",
  "[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[min(45vh,28vw)] [&>div]:!w-auto",
  "[&>div]:!left-[27.5vw] [&>div]:!h-[min(30vh,18.75vw)] [&>div]:!w-auto",
  "[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[min(25vh,15.5vw)] [&>div]:!w-auto",
  "[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[min(25vh,15.5vw)] [&>div]:!w-auto",
  "[&>div]:!top-[25vh] [&>div]:!left-[25vw] [&>div]:!h-[min(18vh,11.25vw)] [&>div]:!w-auto",
]

/** Forme exacte de l'image (si ses dimensions sont connues) et inclinaison éventuelle. */
function cadre(width?: number, height?: number, tilt?: number): React.CSSProperties {
  return {
    ...(width && height ? { aspectRatio: `${width} / ${height}` } : {}),
    ...(tilt ? { rotate: `${tilt}deg` } : {}),
  }
}

export function ZoomParallax({
  images,
  fit = "cover",
  layout = "landscape",
  frameClassName,
  tilts = [],
  className,
}: ZoomParallaxProps) {
  const positions = layout === "portrait" ? positionsPortrait : positionsPaysage
  const container = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  })

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4])
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5])
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6])
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8])
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9])

  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9]

  const grille = (extra?: string) => (
    <ul
      className={cn(
        "mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-12 sm:grid-cols-3 lg:grid-cols-4",
        className,
        extra,
      )}
    >
      {images.slice(0, 7).map(({ src, alt, width, height }, index) => (
        <li
          key={src}
          className={cn("relative aspect-[3/4] self-start", frameClassName)}
          style={cadre(width, height, tilts[index])}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[inherit]">
            <Image
              src={src}
              alt={alt || `Image ${index + 1}`}
              fill
              sizes="(min-width: 1024px) 25vw, 45vw"
              className={cn("h-full w-full", fit === "contain" ? "object-contain" : "object-cover")}
            />
          </div>
        </li>
      ))}
    </ul>
  )

  // Moins d'animations demandées : simple grille, sans zoom au défilement.
  if (reduce) return grille()

  return (
    <>
      {/* Petit écran : grille simple (l'effet est pensé pour un écran large). */}
      {grille("md:hidden")}
      <div ref={container} className={cn("relative hidden h-[300vh] md:block", className)}>
        <div className="sticky top-0 h-screen overflow-hidden">
          {images.slice(0, 7).map(({ src, alt, width, height }, index) => {
            const scale = scales[index % scales.length]

            return (
              <motion.div
                key={src}
                style={{ scale }}
                className={cn("absolute top-0 flex h-full w-full items-center justify-center", positions[index])}
              >
                <div
                  className={cn("relative h-[25vh] w-[25vw]", frameClassName)}
                  style={cadre(width, height, tilts[index])}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[inherit]">
                    <Image
                      src={src}
                      alt={alt || `Image ${index + 1}`}
                      fill
                      sizes={index === 0 ? "100vw" : "40vw"}
                      priority={index === 0}
                      className={cn("h-full w-full", fit === "contain" ? "object-contain" : "object-cover")}
                    />
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </>
  )
}
