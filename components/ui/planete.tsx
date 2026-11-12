"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { geoGraticule10, geoOrthographic, geoPath } from "d3"
import { feature } from "topojson-client"
import type { GeometryCollection, Topology } from "topojson-specification"
import worldAtlas from "world-atlas/countries-110m.json"
import { useReducedMotion } from "framer-motion"

/**
 * Planète Terre qui tourne lentement (thème « biomatériaux innovants » : des matériaux
 * pensés pour le vivant et la planète). Carte locale (paquet world-atlas, aucun appel réseau),
 * océans bleu-vert, continents verts, halo d'atmosphère et ombre pour le volume.
 * Rotation coupée si l'utilisateur demande moins d'animations.
 */
export function Planete({ size = 340, speed = 6 }: { size?: number; speed?: number }) {
  const [rotation, setRotation] = useState(-10)
  const reduit = useReducedMotion()
  const frame = useRef(0)

  const terres = useMemo(() => {
    const topo = worldAtlas as unknown as Topology<{ countries: GeometryCollection }>
    return feature(topo, topo.objects.countries)
  }, [])

  useEffect(() => {
    if (reduit) return
    let precedent = performance.now()
    const tourner = (maintenant: number) => {
      const ecoule = Math.min(maintenant - precedent, 100)
      precedent = maintenant
      setRotation((r) => (r + (ecoule / 1000) * speed) % 360)
      frame.current = requestAnimationFrame(tourner)
    }
    frame.current = requestAnimationFrame(tourner)
    return () => cancelAnimationFrame(frame.current)
  }, [reduit, speed])

  const r = size / 2
  const projection = geoOrthographic().scale(r - 2).translate([r, r]).rotate([rotation, -18]).clipAngle(90)
  const chemin = geoPath(projection)

  return (
    <div className="relative" style={{ width: size, height: size }} aria-hidden>
      {/* Halo d'atmosphère */}
      <div
        className="absolute -inset-[8%] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(200,245,106,0.35) 52%, rgba(200,245,106,0) 70%)" }}
      />
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="relative">
        <defs>
          <radialGradient id="planete-ocean" cx="38%" cy="32%" r="75%">
            <stop offset="0%" stopColor="#2f7d8c" />
            <stop offset="60%" stopColor="#1b5563" />
            <stop offset="100%" stopColor="#0d2f38" />
          </radialGradient>
          <radialGradient id="planete-ombre" cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
            <stop offset="80%" stopColor="#06221a" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#06221a" stopOpacity="0.7" />
          </radialGradient>
        </defs>
        <circle cx={r} cy={r} r={r - 2} fill="url(#planete-ocean)" />
        <path d={chemin(geoGraticule10()) ?? undefined} fill="none" stroke="#ffffff" strokeOpacity="0.08" strokeWidth="0.6" />
        <path d={chemin(terres) ?? undefined} fill="#7cc35a" stroke="#4e8f3a" strokeWidth="0.5" />
        <circle cx={r} cy={r} r={r - 2} fill="url(#planete-ombre)" />
        <circle cx={r} cy={r} r={r - 2} fill="none" stroke="#c8f56a" strokeOpacity="0.5" strokeWidth="1.5" />
      </svg>
    </div>
  )
}
