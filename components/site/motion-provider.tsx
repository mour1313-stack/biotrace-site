"use client"

import { MotionConfig, motion, type HTMLMotionProps } from "framer-motion"

/** Respecte automatiquement « réduire les animations » du système. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

/** Apparition douce au défilement. */
export function Reveal({
  delay = 0,
  className,
  children,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/** Variante pour les éléments de liste (<li>). */
export function RevealItem({
  delay = 0,
  className,
  children,
  ...props
}: HTMLMotionProps<"li"> & { delay?: number }) {
  return (
    <motion.li
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
      {...props}
    >
      {children}
    </motion.li>
  )
}
