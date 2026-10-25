"use client"

import { useEffect, useState } from "react"

/** Au-delà de ce défilement (px), la longue barre laisse place au bouton menu. */
const SEUIL_BAS = 140
/** En remontant, la longue barre revient sous ce défilement (presque tout en haut). */
const SEUIL_HAUT = 40

/**
 * Vrai quand l'utilisateur a quitté le haut de la page. Deux seuils (hystérésis)
 * pour éviter que la navigation clignote autour d'une seule valeur.
 * Partagé par la longue barre (Header) et le menu vert (MenuImmersif).
 */
export function useDefilement() {
  const [defile, setDefile] = useState(false)

  useEffect(() => {
    // Lecture directe (setState ne déclenche un rendu que si la valeur change).
    const lire = () => {
      const y = window.scrollY
      setDefile((avant) => (avant ? y > SEUIL_HAUT : y > SEUIL_BAS))
    }
    lire()
    window.addEventListener("scroll", lire, { passive: true })
    return () => window.removeEventListener("scroll", lire)
  }, [])

  return defile
}
