// components/animated-nav-framer.tsx
// Adapté pour Biotrace : liens, logo et bouton d'action en props ; version repliée
// utilisable au clavier (vrai bouton) ; liens masqués retirés de l'ordre de tabulation.
"use client";

import * as React from "react";
import NextLink from "next/link";
import { motion, useScroll, useMotionValueEvent, type Variants } from "framer-motion";
import { Navigation, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export type AnimatedNavItem = { name: string; href: string };

const defaultNavItems: AnimatedNavItem[] = [
  { name: "Home", href: "#" },
  { name: "About", href: "#" },
  { name: "Services", href: "#" },
  { name: "Contact", href: "#" },
];

const EXPAND_SCROLL_THRESHOLD = 80;
const COLLAPSE_AFTER = 150;

const containerVariants: Variants = {
  expanded: {
    y: 0,
    opacity: 1,
    width: "auto",
    transition: {
      y: { type: "spring", damping: 18, stiffness: 250 },
      opacity: { duration: 0.3 },
      type: "spring",
      damping: 20,
      stiffness: 300,
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  collapsed: {
    y: 0,
    opacity: 1,
    width: "3rem",
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const logoVariants: Variants = {
  expanded: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring", damping: 15 } },
  collapsed: { opacity: 0, x: -25, rotate: -180, transition: { duration: 0.3 } },
};

const itemVariants: Variants = {
  expanded: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", damping: 15 } },
  collapsed: { opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.2 } },
};

const collapsedIconVariants: Variants = {
  expanded: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  collapsed: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 300,
      delay: 0.15,
    },
  },
};

export interface AnimatedNavFramerProps {
  items?: AnimatedNavItem[];
  /** Élément affiché à gauche (logo). Icône Navigation par défaut. */
  logo?: React.ReactNode;
  /** Lien du logo (si fourni, le logo devient un lien). */
  logoHref?: string;
  logoLabel?: string;
  /** Lien d'action mis en avant à droite (ex. « Nous rejoindre »). */
  cta?: AnimatedNavItem;
  /** Nom accessible de la navigation. */
  label?: string;
  /** Texte du bouton affiché quand la barre est repliée. */
  expandLabel?: string;
  className?: string;
  navClassName?: string;
  linkClassName?: string;
  ctaClassName?: string;
  /** Lien de la section affichée (mis en évidence, aria-current). */
  activeHref?: string;
  activeLinkClassName?: string;
  /** Élément placé à droite de la barre, dans le même groupe centré (ex. recherche). */
  trailing?: React.ReactNode;
  /** Force la version repliée (ex. pour laisser la place à la recherche ouverte). */
  forceCollapsed?: boolean;
  /** Replie la barre en pastille au défilement (comportement d'origine). */
  collapseOnScroll?: boolean;
}

export function AnimatedNavFramer({
  items = defaultNavItems,
  logo,
  logoHref,
  logoLabel,
  cta,
  label = "Navigation principale",
  expandLabel = "Afficher le menu",
  className,
  navClassName,
  linkClassName,
  ctaClassName,
  activeHref,
  activeLinkClassName = "text-foreground",
  trailing,
  forceCollapsed = false,
  collapseOnScroll = true,
}: AnimatedNavFramerProps) {
  const [scrollExpanded, setExpanded] = React.useState(true);
  const isExpanded = scrollExpanded && !forceCollapsed;

  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const scrollPositionOnCollapse = React.useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!collapseOnScroll) return;
    const previous = lastScrollY.current;

    if (scrollExpanded && latest > previous && latest > COLLAPSE_AFTER) {
      setExpanded(false);
      scrollPositionOnCollapse.current = latest;
    } else if (!scrollExpanded && latest > scrollPositionOnCollapse.current) {
      // Point le plus bas atteint : la remontée se mesure à partir d'ici.
      scrollPositionOnCollapse.current = latest;
    } else if (
      !scrollExpanded &&
      (latest < COLLAPSE_AFTER ||
        (latest < previous && scrollPositionOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD))
    ) {
      setExpanded(true);
    }

    lastScrollY.current = latest;
  });

  const handleNavClick = (e: React.MouseEvent) => {
    if (!isExpanded) {
      e.preventDefault();
      setExpanded(true);
    }
  };

  // Liens masqués quand la barre est repliée : hors tabulation et hors arbre d'accessibilité.
  const hiddenProps = isExpanded ? {} : { tabIndex: -1, "aria-hidden": true as const };

  const logoContent = logo ?? <Navigation className="h-6 w-6" aria-hidden />;

  return (
    <div className={cn("fixed top-6 left-1/2 -translate-x-1/2 z-50 flex w-max items-center gap-3", className)}>
      <motion.nav
        aria-label={label}
        initial={{ y: -80, opacity: 0 }}
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={containerVariants}
        whileHover={!isExpanded ? { scale: 1.1 } : {}}
        whileTap={!isExpanded ? { scale: 0.95 } : {}}
        onClick={handleNavClick}
        className={cn(
          "relative flex items-center overflow-hidden rounded-full border bg-background/80 shadow-lg backdrop-blur-sm h-12",
          !isExpanded && "cursor-pointer justify-center",
          navClassName
        )}
      >
        <motion.div variants={logoVariants} className="flex-shrink-0 flex items-center font-semibold pl-4 pr-2">
          {logoHref ? (
            <NextLink
              href={logoHref}
              aria-label={logoLabel}
              onClick={(e) => isExpanded && e.stopPropagation()}
              {...hiddenProps}
              className="flex items-center rounded-full"
            >
              {logoContent}
            </NextLink>
          ) : (
            logoContent
          )}
        </motion.div>

        <motion.ul
          className={cn("flex items-center gap-1 sm:gap-4 pr-4", !isExpanded && "pointer-events-none")}
        >
          {items.map((item) => (
            <motion.li key={item.name} variants={itemVariants}>
              <NextLink
                href={item.href}
                onClick={(e) => e.stopPropagation()}
                {...hiddenProps}
                aria-current={activeHref === item.href ? "page" : undefined}
                className={cn(
                  "block whitespace-nowrap text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1",
                  linkClassName,
                  activeHref === item.href && activeLinkClassName
                )}
              >
                {item.name}
              </NextLink>
            </motion.li>
          ))}
          {cta && (
            <motion.li variants={itemVariants}>
              <NextLink href={cta.href} onClick={(e) => e.stopPropagation()} {...hiddenProps} className={cn("block whitespace-nowrap", ctaClassName)}>
                {cta.name}
              </NextLink>
            </motion.li>
          )}
        </motion.ul>

        {/* Version repliée : un vrai bouton, atteignable au clavier */}
        <motion.button
          type="button"
          variants={collapsedIconVariants}
          animate={isExpanded ? "expanded" : "collapsed"}
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(true);
          }}
          tabIndex={isExpanded ? -1 : 0}
          aria-hidden={isExpanded}
          aria-label={expandLabel}
          className={cn("absolute inset-0 flex items-center justify-center rounded-full", isExpanded && "pointer-events-none")}
        >
          <Menu className="h-6 w-6" aria-hidden />
        </motion.button>
      </motion.nav>
      {trailing}
    </div>
  );
}
