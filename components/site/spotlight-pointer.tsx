"use client"

import { useEffect } from "react"

const SELECTEUR = ".bouton, .glow"
const PORTEE = 160 // px autour du bouton où la lueur s'allume

/**
 * Lueur « spotlight » des boutons (d'après components/ui/spotlight-card.tsx).
 * Un seul écouteur pour tout le site : à chaque image, pour les boutons proches
 * du pointeur, on pose sa position locale (--gx, --gy, en px depuis le coin du bouton)
 * et sa position horizontale globale (--xp, 0 à 1) qui fait varier la teinte.
 * Positions locales plutôt que `background-attachment: fixed`, qui ne fonctionne pas
 * sur un élément transformé (les boutons se soulèvent au survol).
 */
export function SpotlightPointer() {
  useEffect(() => {
    const root = document.documentElement
    let frame = 0
    let x = -9999
    let y = -9999
    const allumes = new Set<HTMLElement>()

    const eteindre = (el: HTMLElement) => {
      el.style.removeProperty("--gx")
      el.style.removeProperty("--gy")
    }

    const apply = () => {
      frame = 0
      root.style.setProperty("--xp", (x / window.innerWidth).toFixed(3))
      const vus = new Set<HTMLElement>()
      document.querySelectorAll<HTMLElement>(SELECTEUR).forEach((el) => {
        const r = el.getBoundingClientRect()
        const proche =
          x > r.left - PORTEE && x < r.right + PORTEE && y > r.top - PORTEE && y < r.bottom + PORTEE
        if (!proche) return
        el.style.setProperty("--gx", `${(x - r.left).toFixed(1)}px`)
        el.style.setProperty("--gy", `${(y - r.top).toFixed(1)}px`)
        vus.add(el)
      })
      allumes.forEach((el) => {
        if (!vus.has(el)) eteindre(el)
      })
      allumes.clear()
      vus.forEach((el) => allumes.add(el))
    }

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply)
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      x = e.clientX
      y = e.clientY
      schedule()
    }
    const onLeave = () => {
      x = -9999
      y = -9999
      schedule()
    }

    // N'écrit sur les boutons qu'une fois la page chargée et hydratée : sinon les
    // variables posées pendant l'hydratation créent un écart serveur/client.
    let started = false
    const start = () => {
      if (started) return
      started = true
      document.addEventListener("pointermove", onMove, { passive: true })
      window.addEventListener("scroll", schedule, { passive: true })
      root.addEventListener("pointerleave", onLeave)
    }
    let timer = 0
    const arm = () => {
      timer = window.setTimeout(start, 800)
    }
    if (document.readyState === "complete") arm()
    else window.addEventListener("load", arm, { once: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener("load", arm)
      cancelAnimationFrame(frame)
      document.removeEventListener("pointermove", onMove)
      window.removeEventListener("scroll", schedule)
      root.removeEventListener("pointerleave", onLeave)
      allumes.forEach(eteindre)
    }
  }, [])

  return null
}
