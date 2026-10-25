"use client"
// Adapté pour Biotrace : framer-motion (déjà installé, même API que « motion/react ») ;
// diapositive active contrôlable de l'extérieur (value / onValueChange) ; hook de contexte exporté ;
// HoverSliderPanel pour une diapositive sans image ; texte animé masqué aux lecteurs d'écran
// au profit du texte complet ; ref transmise ; animations coupées si moins de mouvement demandé.

import * as React from "react"
import { type HTMLMotionProps, MotionConfig, motion, useReducedMotion } from "framer-motion"
import { cn } from "@/lib/utils"

interface TextStaggerHoverProps {
  text: string
  index: number
}
interface HoverSliderImageProps {
  index: number
  imageUrl?: string
}
interface HoverSliderProps {
  /** Diapositive active (mode contrôlé). */
  value?: number
  onValueChange?: (index: number) => void
}
interface HoverSliderContextValue {
  activeSlide: number
  changeSlide: (index: number) => void
}

function splitText(text: string) {
  const words = text.split(" ").map((word) => word.concat(" "))
  const characters = words.map((word) => word.split("")).flat(1)
  return { words, characters }
}

const HoverSliderContext = React.createContext<HoverSliderContextValue | undefined>(undefined)

export function useHoverSliderContext() {
  const context = React.useContext(HoverSliderContext)
  if (context === undefined) {
    throw new Error("useHoverSliderContext must be used within a HoverSliderProvider")
  }
  return context
}

export const HoverSlider = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & HoverSliderProps>(
  ({ children, className, value, onValueChange, ...props }, ref) => {
    const [interne, setInterne] = React.useState<number>(0)
    const activeSlide = value ?? interne
    const changeSlide = React.useCallback(
      (index: number) => {
        setInterne(index)
        onValueChange?.(index)
      },
      [onValueChange],
    )
    return (
      <HoverSliderContext.Provider value={{ activeSlide, changeSlide }}>
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </HoverSliderContext.Provider>
    )
  },
)
HoverSlider.displayName = "HoverSlider"

export const TextStaggerHover = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & TextStaggerHoverProps
>(({ text, index, className, ...props }, ref) => {
  const { activeSlide, changeSlide } = useHoverSliderContext()
  const reduit = useReducedMotion()
  const { words } = splitText(text)
  const isActive = activeSlide === index
  return (
    <span
      className={cn("relative inline-block origin-bottom overflow-hidden", className)}
      {...props}
      ref={ref}
      onMouseEnter={() => changeSlide(index)}
    >
      <span className="sr-only">{text}</span>
      {/* Lettres groupées par mot : le retour à la ligne se fait entre les mots, jamais au milieu. */}
      <span aria-hidden>
        {words.map((word, w) => {
          const debut = words.slice(0, w).join("").length
          return (
            <span key={`${word}-${w}`} className="inline-block whitespace-nowrap">
              {word.split("").map((char, j) => {
                const i = debut + j
                return (
                  <span key={`${char}-${i}`} className="relative inline-block overflow-hidden">
                    <MotionConfig
                      transition={
                        reduit ? { duration: 0 } : { delay: i * 0.025, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }
                      }
                    >
                      <motion.span
                        className="inline-block opacity-20"
                        initial={{ y: "0%" }}
                        animate={isActive ? { y: "-110%" } : { y: "0%" }}
                      >
                        {char === " " ? <>&nbsp;</> : char}
                      </motion.span>
                      <motion.span
                        className="absolute top-0 left-0 inline-block opacity-100"
                        initial={{ y: "110%" }}
                        animate={isActive ? { y: "0%" } : { y: "110%" }}
                      >
                        {char === " " ? <>&nbsp;</> : char}
                      </motion.span>
                    </MotionConfig>
                  </span>
                )
              })}
            </span>
          )
        })}
      </span>
    </span>
  )
})
TextStaggerHover.displayName = "TextStaggerHover"

export const clipPathVariants = {
  visible: { clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)" },
  hidden: { clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0px)" },
}

export const HoverSliderImageWrap = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "grid overflow-hidden [&>*]:col-start-1 [&>*]:col-end-1 [&>*]:row-start-1 [&>*]:row-end-1 [&>*]:size-full",
        className,
      )}
      {...props}
    />
  ),
)
HoverSliderImageWrap.displayName = "HoverSliderImageWrap"

export const HoverSliderImage = React.forwardRef<HTMLImageElement, HTMLMotionProps<"img"> & HoverSliderImageProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- imageUrl gardé pour compatibilité avec l'API d'origine
  ({ index, imageUrl, className, ...props }, ref) => {
    const { activeSlide } = useHoverSliderContext()
    const reduit = useReducedMotion()
    return (
      <motion.img
        className={cn("inline-block align-middle", className)}
        transition={reduit ? { duration: 0 } : { ease: [0.33, 1, 0.68, 1], duration: 0.8 }}
        variants={clipPathVariants}
        initial={false}
        animate={activeSlide === index ? "visible" : "hidden"}
        ref={ref}
        {...props}
      />
    )
  },
)
HoverSliderImage.displayName = "HoverSliderImage"

/** Diapositive libre (sans image), même révélation que HoverSliderImage. */
export const HoverSliderPanel = React.forwardRef<HTMLDivElement, HTMLMotionProps<"div"> & { index: number }>(
  ({ index, className, ...props }, ref) => {
    const { activeSlide } = useHoverSliderContext()
    const reduit = useReducedMotion()
    return (
      <motion.div
        className={className}
        transition={reduit ? { duration: 0 } : { ease: [0.33, 1, 0.68, 1], duration: 0.8 }}
        variants={clipPathVariants}
        initial={false}
        animate={activeSlide === index ? "visible" : "hidden"}
        ref={ref}
        {...props}
      />
    )
  },
)
HoverSliderPanel.displayName = "HoverSliderPanel"
