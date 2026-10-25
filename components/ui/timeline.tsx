// Built using Hyperiux Vault: https://vault.hyperiux.com
// Adapté pour Biotrace : étapes passées en props (réparties en alternance au-dessus et au-dessous
// de la ligne, nombre libre), mois libres (texte), next/image, useGSAP de @gsap/react, positions
// d'animation calculées selon le nombre d'étapes, classes des titres personnalisables,
// w-full au lieu de w-screen (pas de défilement horizontal parasite), coquille « tranlate » corrigée.
"use client"

import { type CSSProperties, useSyncExternalStore, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useGSAP } from "@gsap/react"
import { cn } from "@/lib/utils"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)
}

export type JourneyItem = {
  id: string
  year: string
  /** Texte libre affiché après l'année (ex. « novembre »). */
  month?: string
  content: string
}

type SplitTextInstance = InstanceType<typeof SplitText>

export type TimelineProps = {
  title?: string
  periodLabel?: string
  /** Étapes dans l'ordre chronologique : la 1re au-dessus de la ligne, la 2e au-dessous, etc. */
  items?: JourneyItem[]
  textColor?: string
  mutedTextColor?: string
  activeColor?: string
  backgroundColor?: string
  imageUrl?: string
  imageAlt?: string
  /** Reveal animation duration, in seconds. */
  duration?: number
  /** Fallback reveal duration when `duration` is omitted, in seconds. */
  scrollDuration?: number
  titleClassName?: string
  itemTitleClassName?: string
  className?: string
  /** Classes du bloc fixe pendant le défilement (ex. pour centrer la frise sous un en-tête). */
  stickyClassName?: string
  id?: string
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {}
  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY)
  mediaQueryList.addEventListener("change", callback)
  return () => mediaQueryList.removeEventListener("change", callback)
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false
  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false
}

function getServerReducedMotionSnapshot() {
  return false
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeToReducedMotion, getReducedMotionSnapshot, getServerReducedMotionSnapshot)
}

const defaultItems: JourneyItem[] = [
  { id: "2020-march", year: "2020", month: "March", content: "Signal research turns scattered notes into a clear product thesis" },
  { id: "2020-november", year: "2020", month: "November", content: "Prototype sprint validates the experience with real operators" },
  { id: "2021-july", year: "2021", month: "July", content: "Founding release ships with the first live customer journeys" },
  { id: "2022-october", year: "2022", month: "October", content: "Community feedback reshapes the roadmap into sharper releases" },
]

export default function Timeline({
  title = "Product Storyline",
  periodLabel = "2020-2026",
  items = defaultItems,
  textColor = "var(--color-foreground, #000000)",
  mutedTextColor = "var(--color-muted-foreground, #3f3f46)",
  activeColor = "#ff5f00",
  backgroundColor = "var(--color-background, #ffffff)",
  imageUrl = "https://cdn.21st.dev/assets/mirror/b0/b0c41784074f76ac5fb6b447da87780c901135841317a096241371f24bc13ddd.jpg",
  imageAlt = "Modern office workspace",
  duration,
  scrollDuration = 1.2,
  titleClassName,
  itemTitleClassName,
  className,
  stickyClassName,
  id = "journey",
}: TimelineProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const wholeSliderRef = useRef<HTMLDivElement>(null)
  const reducedMotion = usePrefersReducedMotion()
  const normalizedDuration = Math.max(0.2, duration ?? scrollDuration)

  const topItems = items.filter((_, i) => i % 2 === 0)
  const bottomItems = items.filter((_, i) => i % 2 === 1)
  const topIds = new Set(topItems.map((i) => i.id))
  // Largeur de la piste : proportionnelle au nombre d'étapes du haut (240vw / 800vw pour 4, comme l'original).
  const trackStyle = {
    "--piste": `${60 + topItems.length * 45}vw`,
    "--piste-mobile": `${140 + topItems.length * 165}vw`,
  } as CSSProperties

  const sectionStyle: CSSProperties = { color: textColor, backgroundColor }
  const activeStyle: CSSProperties = { backgroundColor: activeColor }
  const mutedTextStyle: CSSProperties = { color: mutedTextColor }

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section || !wholeSliderRef.current) return

      const isMobile = window.innerWidth < 600
      const lineStart = isMobile ? "top 30%" : "top 25%"
      const slideEnd = isMobile ? "82% 50%" : "bottom bottom"
      const lineEnd = isMobile ? "80% 50%" : "bottom bottom"
      const slider = wholeSliderRef.current
      const distance = () => -(slider.scrollWidth - section.clientWidth)

      gsap
        .timeline({
          scrollTrigger: { trigger: section, start: "top top", end: slideEnd, scrub: true, invalidateOnRefresh: true },
          defaults: { ease: "none" },
        })
        .fromTo(slider, { x: 0 }, { x: distance })

      if (reducedMotion) {
        gsap.set(".journey-line", { width: "98%" })
        return
      }

      gsap.to(".journey-line", {
        width: "98%",
        ease: "none",
        scrollTrigger: { trigger: section, start: lineStart, end: lineEnd, scrub: true },
      })
    },
    { dependencies: [reducedMotion, items.length], scope: sectionRef, revertOnUpdate: true },
  )

  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      if (reducedMotion) {
        items.forEach((item) => {
          gsap.set(`.jl-${item.id}`, { scaleY: 1 })
          gsap.set(`.jd-${item.id}`, { scale: 1 })
          gsap.set([`.title-${item.id}`, `.description-${item.id}`], { opacity: 1, clearProps: "transform" })
        })
        return
      }

      items.forEach((item) => {
        gsap.set(`.jl-${item.id}`, {
          scaleY: 0,
          transformOrigin: topIds.has(item.id) ? "bottom bottom" : "top top",
        })
        gsap.set(`.jd-${item.id}`, { scale: 0 })
        gsap.set([`.title-${item.id}`, `.description-${item.id}`], { opacity: 1 })
      })

      const titleSplits: Record<string, SplitTextInstance> = {}
      const descriptionSplits: Record<string, SplitTextInstance> = {}
      items.forEach((item) => {
        titleSplits[item.id] = new SplitText(`.title-${item.id}`, { type: "words, lines", mask: "lines" })
        descriptionSplits[item.id] = new SplitText(`.description-${item.id}`, { type: "words, lines", mask: "lines" })
      })

      // Fenêtres de défilement réparties régulièrement selon le nombre d'étapes.
      const isMobile = window.innerWidth < 600
      const [first, last, span] = isMobile ? [22, 69, 10] : [6, 65, 20]
      const step = items.length > 1 ? (last - first) / (items.length - 1) : 0

      items.forEach((item, index) => {
        const startPos = first + index * step
        gsap
          .timeline({
            scrollTrigger: { trigger: section, start: `${startPos}% 30%`, end: `${startPos + span}% 50%`, scrub: true },
          })
          .to(`.jl-${item.id}`, { scaleY: 1, duration: normalizedDuration * 0.4 })
          .to(`.jd-${item.id}`, { scale: 1, duration: normalizedDuration * 0.4 }, "<")
          .fromTo(
            titleSplits[item.id].lines,
            { y: 100 },
            { y: 0, delay: -0.8 * normalizedDuration, duration: normalizedDuration, stagger: 0.02, ease: "power2.out" },
          )
          .fromTo(
            descriptionSplits[item.id].lines,
            { y: 100 },
            { y: 0, duration: normalizedDuration, stagger: 0.02, ease: "power2.out" },
            "<",
          )
      })

      const handleResize = () => ScrollTrigger.refresh()
      window.addEventListener("resize", handleResize)

      return () => {
        Object.values(titleSplits).forEach((split) => split.revert())
        Object.values(descriptionSplits).forEach((split) => split.revert())
        window.removeEventListener("resize", handleResize)
      }
    },
    { dependencies: [normalizedDuration, reducedMotion, items.length], scope: sectionRef, revertOnUpdate: true },
  )

  const etape = (item: JourneyItem) => (
    <>
      <h3 className={cn(`title-${item.id} text-[2.5vw] leading-none max-[600px]:text-[6.4vw]`, itemTitleClassName)}>
        {item.year} {item.month}
      </h3>
      <p
        className={`description-${item.id} w-[90%] text-[1.5vw] leading-[1.15] max-[600px]:w-[90%] max-[600px]:text-[4.8vw]`}
        style={mutedTextStyle}
      >
        {item.content}
      </p>
    </>
  )

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-label={title}
      className={cn("relative h-[200vw] w-full max-[600px]:h-[400vh]", className)}
      style={sectionStyle}
    >
      <div className={cn("sticky top-[0%] h-screen w-full overflow-hidden pt-[10%] max-[600px]:top-[5%]", stickyClassName)}>
        <div
          ref={wholeSliderRef}
          style={trackStyle}
          className="mr-[2vw] flex h-[30vw] w-(--piste) items-center gap-[5vw] px-[5vw] max-[600px]:h-[80vh] max-[600px]:w-(--piste-mobile) max-[600px]:px-[7vw]"
        >
          <div className="relative h-full w-[30vw] shrink-0 overflow-hidden rounded-[1vw] max-[600px]:h-[65vw] max-[600px]:w-[85vw] max-[600px]:rounded-[5vw]">
            <Image src={imageUrl} alt={imageAlt} fill sizes="(max-width: 600px) 85vw, 30vw" draggable={false} className="object-cover" />
          </div>

          <div className="relative h-full w-full">
            <div className="absolute top-[49%] left-0 flex h-fit w-full -translate-y-1/2 items-center">
              <div className="h-[.8vw] w-[.8vw] rounded-full max-[600px]:h-[2vw] max-[600px]:w-[2vw]" style={activeStyle} />
              <div className="journey-line h-px w-[0%] rounded-full" style={activeStyle} />
              <div className="h-[.8vw] w-[.8vw] rounded-full max-[600px]:h-[2vw] max-[600px]:w-[2vw]" style={activeStyle} />
            </div>

            <div className="flex h-1/2 w-full items-center justify-start gap-[.5vw]">
              <div className="h-full w-[20%] shrink-0 pt-[2vw] max-[600px]:h-fit max-[600px]:pt-[5vw]">
                <h2 className={cn("w-[65%] text-[3vw] leading-[0.95] max-[600px]:text-[8.5vw]", titleClassName)}>{title}</h2>
              </div>

              <ol className="flex h-full w-full gap-x-[15vw] max-[600px]:gap-x-[40vw]">
                {topItems.map((item) => (
                  <li
                    key={`top-${item.id}`}
                    className="relative h-full w-[30vw] shrink-0 px-[3vw] max-[600px]:flex max-[600px]:w-[70vw] max-[600px]:flex-col max-[600px]:px-[7vw]"
                  >
                    <div aria-hidden className="absolute top-0 bottom-0 left-0 h-full w-full">
                      <div className={`jd-${item.id} relative aspect-square size-[1vw] -translate-x-1/2 rounded-full max-[600px]:size-[2.5vw]`} style={activeStyle} />
                      <div className={`jl-${item.id} h-[94%] w-px origin-bottom rounded-full`} style={activeStyle} />
                    </div>
                    <div className="mt-[-1vw] space-y-[1vw] max-[600px]:mt-[-2vw]">{etape(item)}</div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex h-1/2 w-full items-center justify-start">
              <div className="h-full w-[34%] shrink-0 pt-[2vw] max-[600px]:w-[30%] max-[600px]:pt-[5vw]">
                <p className="text-[1.65vw] leading-none max-[600px]:text-[4.2vw]" style={mutedTextStyle}>
                  {periodLabel}
                </p>
              </div>

              <ol className="ml-[7vw] flex h-full w-full gap-x-[20vw] max-[600px]:ml-[7vw] max-[600px]:gap-x-[40vw]">
                {bottomItems.map((item) => (
                  <li key={`bottom-${item.id}`} className="relative h-full w-[25vw] shrink-0 px-[3vw] max-[600px]:w-[70vw] max-[600px]:px-[7vw]">
                    <div aria-hidden className="absolute bottom-[-1%] left-0 h-full w-full">
                      <div className={`jl-${item.id} h-[94%] w-px origin-top rounded-full max-[600px]:h-full`} style={activeStyle} />
                      <div className={`jd-${item.id} relative aspect-square size-[1vw] w-auto -translate-x-1/2 rounded-full max-[600px]:size-[2.5vw]`} style={activeStyle} />
                    </div>
                    <div className="flex h-full w-full flex-col justify-end space-y-[1vw]">{etape(item)}</div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
