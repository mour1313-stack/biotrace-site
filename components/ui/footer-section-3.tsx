"use client";
// Adapté pour Biotrace : colonnes, réseaux, bloc d'introduction et copyright en props ;
// la newsletter ne s'affiche que si une adresse d'envoi réelle est fournie (`newsletter.action`) ;
// pas de `new Date()` au rendu (copyright fourni en texte) ; id du filtre SVG unique.
// `motion/react` est le nouveau nom de `framer-motion`, déjà installé : import depuis framer-motion.
import React, { useId, useRef } from "react";
import Link from "next/link";
import { motion, useInView, type Variants } from "framer-motion";
import { SocialCloud, type SocialLink } from "@/components/ui/footer-section-3-utils/social-cloud";
import { AnimatedGroup } from "@/components/ui/animated-group"; //from motion-primitives
import { cn } from "@/lib/utils";

export type FooterColumn = {
  title: string;
  links: { label: string; href: string }[];
};

const demoLinks = (items: string[]) => items.map((label) => ({ label, href: "#" }));

const defaultColumns: FooterColumn[] = [
  { title: "Product", links: demoLinks(["Features", "Solution", "Customers", "Pricing", "Help", "Terms"]) },
  { title: "Company", links: demoLinks(["About", "Careers", "Blogs", "Press", "Contact", "Privacy"]) },
  { title: "Social", links: demoLinks(["X", "LinkedIn", "Facebook", "Threads", "Instagram", "Youtube"]) },
];

export interface Footer3Props {
  title?: string;
  /** Couleur du bandeau (valeur CSS). */
  accentColor?: string;
  columns?: FooterColumn[];
  socials?: SocialLink[];
  copyright?: React.ReactNode;
  /** Contenu libre au-dessus des réseaux (présentation, adresse…). */
  intro?: React.ReactNode;
  /** Formulaire d'inscription, seulement s'il est relié à un vrai service. */
  newsletter?: { action: string; title?: string; placeholder?: string; submitLabel?: string };
  className?: string;
  titleClassName?: string;
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  const className = "hover:text-black dark:hover:text-white transition-colors underline-offset-4 hover:underline";
  if (/^(https?:|mailto:)/.test(href)) {
    const external = href.startsWith("http");
    return (
      <a href={href} className={className} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        {children}
        {external && <span className="sr-only"> (nouvel onglet)</span>}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function Footer3({
  title = "Build Tastefully Crafted UIs",
  accentColor = "#003AF9",
  columns = defaultColumns,
  socials = [],
  copyright = "© SolaceUI, All rights reserved",
  intro,
  newsletter,
  className,
  titleClassName,
}: Footer3Props) {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true, margin: "-100px" });
  const noiseId = `noise-${useId().replace(/:/g, "")}`;

  return (
    <footer
      className={cn("py-12 px-4", className)}
      style={{ "--color-primary": accentColor } as React.CSSProperties}
    >
      <motion.div
        className="container mx-auto max-w-7xl"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {/* 1. Upper div with noise and text */}
        <motion.div
          className="relative w-full overflow-hidden rounded-xl bg-(--color-primary) h-[140px] md:h-[300px]"
          variants={itemVariants}
        >
          {/* SVG Noise Overlay */}
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full opacity-90 pointer-events-none mix-blend-multiply"
            xmlns="http://www.w3.org/2000/svg"
          >
            <filter id={noiseId}>
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter={`url(#${noiseId})`} />
          </svg>

          {/* Centered Text */}
          <div ref={titleRef} className="absolute inset-0 flex items-center justify-center px-4 pointer-events-none">
            <p className="sr-only">{title}</p>
            {isTitleInView && (
              <AnimatedGroup
                className={cn(
                  "text-2xl md:text-4xl lg:text-5xl font-bold text-white text-center flex flex-wrap justify-center gap-x-3",
                  titleClassName
                )}
                preset="slide"
              >
                {title.split(" ").map((word, i) => (
                  <span key={`${word}-${i}`} aria-hidden="true" className="inline-block">
                    {word}
                  </span>
                ))}
              </AnimatedGroup>
            )}
          </div>
        </motion.div>

        {/* 2 & 3. Bottom Section */}
        <div className="mt-8 md:mt-16 flex flex-col md:flex-row justify-between gap-12 lg:gap-8">
          {/* 2. Below Left Section */}
          <motion.div className="flex flex-col justify-between space-y-10 lg:w-1/3" variants={itemVariants}>
            {intro}

            {newsletter && (
              <form action={newsletter.action} method="post" className="space-y-4">
                <label htmlFor={`${noiseId}-email`} className="block text-xl font-bold text-black dark:text-white">
                  {newsletter.title ?? "Newsletter"}
                </label>
                <div className="flex items-center gap-4 max-w-md">
                  <input
                    id={`${noiseId}-email`}
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder={newsletter.placeholder ?? "Enter Your Email"}
                    className="flex-1 rounded-lg border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white bg-transparent dark:bg-neutral-900 text-black dark:text-white"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-black text-white dark:bg-white dark:text-black px-6 py-2 text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    {newsletter.submitLabel ?? "Submit"}
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-4 md:space-y-6">
              <SocialCloud links={socials} className="text-neutral-600 dark:text-neutral-400 gap-3" />
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{copyright}</p>
            </div>
          </motion.div>

          {/* 3. Below Right Section */}
          <motion.nav
            aria-label="Liens du pied de page"
            className="flex flex-wrap gap-8 lg:gap-20 lg:w-1/2 lg:justify-end"
            variants={itemVariants}
          >
            {columns.map((column) => (
              <div key={column.title} className="flex flex-col space-y-4">
                <h2 className="text-lg font-bold text-black dark:text-white">{column.title}</h2>
                <ul className="flex flex-col space-y-2 text-neutral-700 dark:text-neutral-400">
                  {column.links.map((link) => (
                    <li key={link.label + link.href}>
                      <FooterLink href={link.href}>{link.label}</FooterLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.nav>
        </div>
      </motion.div>
    </footer>
  );
}
