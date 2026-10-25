"use client"
// Adapté pour Biotrace : directive client ; les petites animations sont exportées et
// paramétrables (texte, icônes, couleurs) pour être réutilisées ; plus de Math.random()
// au rendu (identifiants stables) ; contenu de démo inchangé dans l'export par défaut.

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Smartphone, Globe } from "lucide-react"
import { cn } from "@/lib/utils"

export function TypeTester({ text = "Aa", className }: { text?: string; className?: string }) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setScale((prev) => (prev === 1 ? 1.5 : 1))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-full items-center justify-center">
      <motion.span
        className={cn("font-serif text-6xl font-medium text-white md:text-8xl", className)}
        animate={{ scale }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        {text}
      </motion.span>
    </div>
  )
}

export function LayoutAnimation({
  items = [1, 2, 3],
  itemClassName = "bg-white/20 rounded-md h-5 w-full",
  renderItem,
}: {
  items?: number[]
  itemClassName?: string
  renderItem?: (i: number) => React.ReactNode
}) {
  const [layout, setLayout] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setLayout((prev) => (prev + 1) % 3)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const layouts = ["grid-cols-2", "grid-cols-3", "grid-cols-1"]

  return (
    <div className="flex h-full items-center justify-center">
      <motion.div
        className={`grid ${layouts[layout]} h-full w-full max-w-[140px] gap-1.5`}
        layout
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {items.map((i) => (
          <motion.div key={i} className={itemClassName} layout transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
            {renderItem?.(i)}
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export function SpeedIndicator() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="relative flex h-10 w-full items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loader"
              className="h-8 w-24 rounded bg-white/10"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.4, 0.7, 0.4] }}
              exit={{ opacity: 0, y: -20, position: "absolute" }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          ) : (
            <motion.span
              key="text"
              initial={{ y: 20, opacity: 0, filter: "blur(5px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              className="font-sans text-3xl font-medium text-white md:text-4xl"
            >
              100ms
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <span className="text-sm text-gray-400">Load Time</span>
      <div className="h-1.5 w-full max-w-[120px] overflow-hidden rounded-full bg-white/10">
        <motion.div
          className="h-full rounded-full bg-white"
          initial={{ width: 0 }}
          animate={{ width: loading ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 100, damping: 15, mass: 1 }}
        />
      </div>
    </div>
  )
}

/** Icônes qui s'allument l'une après l'autre, puis recommencent. */
export function SecurityBadge({
  icons = [Lock, Lock, Lock],
  activeClassName = "bg-white/20",
  idleClassName = "bg-white/5",
  iconActiveClassName = "text-white",
  iconIdleClassName = "text-gray-600",
}: {
  icons?: React.ElementType[]
  activeClassName?: string
  idleClassName?: string
  iconActiveClassName?: string
  iconIdleClassName?: string
}) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % (icons.length + 1))
    }, 800)
    return () => clearInterval(interval)
  }, [icons.length])

  return (
    <div className="flex h-full items-center justify-center gap-2">
      {icons.map((Icon, i) => {
        const active = i < step
        return (
          <motion.div
            key={i}
            className={cn("flex size-12 items-center justify-center rounded-lg", active ? activeClassName : idleClassName)}
            animate={{ scale: active ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Icon aria-hidden className={cn("size-5", active ? iconActiveClassName : iconIdleClassName)} />
          </motion.div>
        )
      })}
    </div>
  )
}

/** Icône centrale entourée d'ondes qui se propagent. */
export function GlobalNetwork({
  icon: Icon = Globe,
  iconClassName = "w-16 h-16 text-white/80",
  ringClassName = "border-white/30",
}: {
  icon?: React.ElementType
  iconClassName?: string
  ringClassName?: string
}) {
  const pulses = [0, 1, 2, 3, 4]

  return (
    <div className="relative flex h-full items-center justify-center">
      <Icon aria-hidden className={cn("z-10", iconClassName)} />
      {pulses.map((pulse) => (
        <motion.div
          key={pulse}
          aria-hidden
          className={cn("absolute size-16 rounded-full border-2", ringClassName)}
          initial={{ scale: 0.5, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: pulse * 0.8,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  )
}

function FeaturesSection() {
  return (
    <section className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 py-24">
      <div className="mx-auto w-full max-w-7xl">
        <motion.p
          className="mb-8 text-sm tracking-widest text-gray-400 uppercase"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Features
        </motion.p>

        <div className="grid auto-rows-[200px] grid-cols-1 gap-4 md:grid-cols-6">
          <motion.div
            className="flex cursor-pointer flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-8 transition-colors hover:border-zinc-700 md:col-span-2 md:row-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02, backgroundColor: "rgba(39, 39, 42, 1)" }}
          >
            <div className="flex-1">
              <TypeTester />
            </div>
            <div className="mt-4">
              <h3 className="font-serif text-xl font-medium text-white">Typography</h3>
              <p className="mt-1 text-sm text-gray-400">Beautiful, responsive type that scales perfectly.</p>
            </div>
          </motion.div>

          <motion.div
            className="flex cursor-pointer flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-8 transition-colors hover:border-zinc-700 md:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 0.98 }}
          >
            <div className="flex-1">
              <LayoutAnimation />
            </div>
            <div className="mt-4">
              <h3 className="font-serif text-xl font-medium text-white">Layouts</h3>
              <p className="mt-1 text-sm text-gray-400">Flexible grids that adapt.</p>
            </div>
          </motion.div>

          <motion.div
            className="flex cursor-pointer flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-colors hover:border-zinc-700 md:col-span-2 md:row-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
          >
            <div className="flex flex-1 items-center justify-center">
              <div className="relative">
                <GlobalNetwork />
              </div>
            </div>
            <div className="relative z-20 mt-auto rounded-lg bg-zinc-900/50 p-2 backdrop-blur-sm">
              <h3 className="flex items-center gap-2 font-serif text-xl font-medium text-white">
                <Globe className="size-5" />
                Global CDN
              </h3>
              <p className="mt-1 text-sm text-gray-400">Lightning-fast content delivery worldwide with edge locations.</p>
            </div>
          </motion.div>

          <motion.div
            className="flex cursor-pointer flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-8 transition-colors hover:border-zinc-700 md:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 0.98 }}
          >
            <div className="flex-1">
              <SpeedIndicator />
            </div>
            <div className="mt-4">
              <h3 className="font-serif text-xl font-medium text-white">Speed</h3>
              <p className="mt-1 text-sm text-gray-400">Blazing fast performance.</p>
            </div>
          </motion.div>

          <motion.div
            className="flex cursor-pointer flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-8 transition-colors hover:border-zinc-700 md:col-span-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 0.98 }}
          >
            <div className="flex-1">
              <SecurityBadge />
            </div>
            <div className="mt-4">
              <h3 className="flex items-center gap-2 font-serif text-xl font-medium text-white">
                <Lock className="size-5" />
                Security First
              </h3>
              <p className="mt-1 text-sm text-gray-400">Enterprise-grade encryption and data protection built-in.</p>
            </div>
          </motion.div>

          <motion.div
            className="flex cursor-pointer flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-8 transition-colors hover:border-zinc-700 md:col-span-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 0.98 }}
          >
            <div className="flex flex-1 items-center justify-center">
              <Smartphone className="size-16 text-white" />
            </div>
            <div className="mt-4">
              <h3 className="font-serif text-xl font-medium text-white">Mobile Ready</h3>
              <p className="mt-1 text-sm text-gray-400">Optimized for all devices and screen sizes.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default function App() {
  return <FeaturesSection />
}
