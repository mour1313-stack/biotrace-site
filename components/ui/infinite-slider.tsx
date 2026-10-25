"use client"
// Adapté pour Biotrace : mesure de la piste par ResizeObserver (pas de dépendance react-use-measure) ;
// arrêt du défilement si l'utilisateur demande moins de mouvement ; seconde copie des éléments
// masquée aux lecteurs d'écran (pas d'annonce en double) ; liste accessible via `label`.

import { cn } from "@/lib/utils"
import { animate, motion, useMotionValue, useReducedMotion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

type InfiniteSliderProps = {
  children: React.ReactNode
  gap?: number
  duration?: number
  durationOnHover?: number
  direction?: "horizontal" | "vertical"
  reverse?: boolean
  className?: string
  /** Nom accessible de la liste qui défile. */
  label?: string
}

export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = "horizontal",
  reverse = false,
  className,
  label,
}: InfiniteSliderProps) {
  const [currentDuration, setCurrentDuration] = useState(duration)
  const ref = useRef<HTMLDivElement>(null)
  const [{ width, height }, setSize] = useState({ width: 0, height: 0 })
  const translation = useMotionValue(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [key, setKey] = useState(0)
  const reduit = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    if (reduit) {
      translation.set(0)
      return
    }
    const size = direction === "horizontal" ? width : height
    if (!size) return
    const contentSize = size + gap
    const from = reverse ? -contentSize / 2 : 0
    const to = reverse ? 0 : -contentSize / 2

    const controls = isTransitioning
      ? animate(translation, [translation.get(), to], {
          ease: "linear",
          duration: currentDuration * Math.abs((translation.get() - to) / contentSize),
          onComplete: () => {
            setIsTransitioning(false)
            setKey((prevKey) => prevKey + 1)
          },
        })
      : animate(translation, [from, to], {
          ease: "linear",
          duration: currentDuration,
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 0,
          onRepeat: () => {
            translation.set(from)
          },
        })

    return controls.stop
  }, [key, translation, currentDuration, width, height, gap, isTransitioning, direction, reverse, reduit])

  const hoverProps = durationOnHover
    ? {
        onHoverStart: () => {
          setIsTransitioning(true)
          setCurrentDuration(durationOnHover)
        },
        onHoverEnd: () => {
          setIsTransitioning(true)
          setCurrentDuration(duration)
        },
      }
    : {}

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        className="flex w-max"
        style={{
          ...(direction === "horizontal" ? { x: translation } : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === "horizontal" ? "row" : "column",
        }}
        ref={ref}
        {...hoverProps}
      >
        <ul aria-label={label} className="contents">
          {children}
        </ul>
        <ul aria-hidden className="contents">
          {children}
        </ul>
      </motion.div>
    </div>
  )
}
