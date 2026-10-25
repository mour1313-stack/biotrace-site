"use client"
// Adapté pour Biotrace : textes, badge, couleurs et boutons passés en props ; liens Next.js avec
// les boutons du site (le Button du projet n'a pas d'asChild) ; plus d'écouteurs souris inutilisés
// ni de filtre SVG vide ; option `wireframe` retirée (absente de la version installée du shader) ;
// animation des lettres par mot (pas de coupure au milieu d'un mot) ; arrêt des animations si
// l'utilisateur demande moins de mouvement ; titre lisible en entier par les lecteurs d'écran.

import Link from "next/link"
import { motion, useReducedMotion, type Variants } from "framer-motion"
import { MeshGradient } from "@paper-design/shaders-react"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const letterAnimation: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const containerAnimation: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

type Lien = { label: string; href: string }

export function ShaderHero({
  title = "Elevate Your Experience",
  titleId,
  badge,
  description,
  primary,
  secondary,
  colors = ["#000000", "#1a1a1a", "#2e2e2e", "#ffffff"],
  overlayColors = ["#000000", "#ffffff", "#2e2e2e"],
  backgroundColor = "#000000",
  className,
  titleClassName,
}: {
  title?: string
  titleId?: string
  badge?: React.ReactNode
  description?: React.ReactNode
  primary?: Lien
  secondary?: Lien
  colors?: string[]
  overlayColors?: string[]
  backgroundColor?: string
  className?: string
  titleClassName?: string
}) {
  const reduit = useReducedMotion()
  const mots = title.split(" ")

  return (
    <div className={cn("relative min-h-screen w-full overflow-hidden", className)} style={{ backgroundColor }}>
      <div aria-hidden>
        <MeshGradient
          className="absolute inset-0 h-full w-full"
          colors={colors}
          speed={reduit ? 0 : 0.25}
          distortion={0.8}
          swirl={0.3}
        />
        <MeshGradient
          className="absolute inset-0 h-full w-full opacity-40 mix-blend-soft-light"
          colors={overlayColors}
          speed={reduit ? 0 : 0.15}
          distortion={1}
          swirl={0.7}
        />
        {/* Voile sombre au centre : le texte blanc reste lisible même sur les zones claires du fond. */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.55),rgba(0,0,0,0.15)_70%)]" />
      </div>

      <div className="relative z-10 flex min-h-[inherit] flex-col items-center justify-center px-4 text-center">
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-6 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-lg"
          >
            {badge}
          </motion.div>
        )}

        <motion.h1
          id={titleId}
          aria-label={title}
          variants={containerAnimation}
          initial="hidden"
          animate="visible"
          className={cn(
            "flex flex-wrap justify-center gap-x-[0.25em] text-5xl font-extrabold tracking-tight text-white drop-shadow-lg md:text-7xl",
            titleClassName,
          )}
        >
          {mots.map((mot, i) => (
            <span key={i} aria-hidden className="inline-flex">
              {mot.split("").map((char, j) => (
                <motion.span key={j} variants={letterAnimation}>
                  {char}
                </motion.span>
              ))}
            </span>
          ))}
        </motion.h1>

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-6 max-w-2xl text-lg text-white/80 md:text-xl"
          >
            {description}
          </motion.p>
        )}

        {(primary || secondary) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.8 }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            {primary && (
              <Link href={primary.href} className="bouton bouton-fluo">
                {primary.label} <ArrowRight aria-hidden className="size-5" />
              </Link>
            )}
            {secondary && (
              <Link href={secondary.href} className="bouton bouton-clair">
                {secondary.label}
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
