"use client"

import { MeshGradient, PulsingBorder } from "@paper-design/shaders-react"
import { useReducedMotion } from "framer-motion"

/**
 * Fond animé inspiré de `hero.tsx` (ShaderShowcase), décliné en vert pour Bio-Innov 2027.
 * L'animation s'arrête si l'utilisateur a demandé à réduire les animations.
 */
export function FondShaderVert({ className }: { className?: string }) {
  const reduit = useReducedMotion()
  return (
    <div aria-hidden className={className}>
      <MeshGradient
        className="absolute inset-0 h-full w-full"
        colors={["#06301a", "#14532d", "#3fae5a", "#0f3d24", "#c8f56a"]}
        speed={reduit ? 0 : 0.25}
        distortion={0.7}
        swirl={0.35}
      />
      <MeshGradient
        className="absolute inset-0 h-full w-full opacity-40 mix-blend-soft-light"
        colors={["#06301a", "#f7f2e6", "#3fae5a", "#c8f56a"]}
        speed={reduit ? 0 : 0.15}
        distortion={0.9}
        swirl={0.7}
      />
    </div>
  )
}

/** Petit badge pulsant, repris du composant hero. */
export function BadgePulsant({ className }: { className?: string }) {
  const reduit = useReducedMotion()
  return (
    <PulsingBorder
      aria-hidden
      className={className}
      colors={["#c8f56a", "#3fae5a", "#ffffff", "#ffd94a"]}
      colorBack="#00000000"
      speed={reduit ? 0 : 1.2}
      roundness={1}
      thickness={0.1}
      softness={0.2}
      intensity={4}
      spots={5}
      spotSize={0.1}
      pulse={0.1}
      smoke={0.5}
      smokeSize={4}
      scale={0.65}
      style={{ width: "72px", height: "72px", borderRadius: "50%" }}
    />
  )
}
