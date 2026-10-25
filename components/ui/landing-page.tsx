"use client";

// Adapté pour Biotrace : liens réels pour les actions (href), image par section,
// sphère personnalisable, un seul <h1>, textes du héros configurables,
// typage compatible TypeScript strict / React 19.

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Globe from "@/components/ui/globe";
import { cn } from "@/lib/utils";

export interface ScrollGlobeSection {
  id: string;
  badge?: string;
  title: string;
  subtitle?: string;
  description: string;
  align?: "left" | "center" | "right";
  features?: { title: string; description: string }[];
  actions?: { label: string; variant: "primary" | "secondary"; href?: string; onClick?: () => void }[];
  /** Image illustrant la section. */
  media?: { src: string; alt: string; width: number; height: number; caption?: string };
}

// Reusable ScrollGlobe component following shadcn/ui patterns
interface ScrollGlobeProps {
  sections: ScrollGlobeSection[];
  globeConfig?: {
    positions: {
      top: string;
      left: string;
      scale: number;
    }[];
  };
  /** Contenu flottant (par défaut : le globe terrestre). */
  globe?: React.ReactNode;
  /** Petites mentions sous le texte de la première section. */
  heroNotes?: string[];
  className?: string;
  globeClassName?: string;
  progressClassName?: string;
  titleClassName?: string;
  /** Largeur max du contenu des sections alignées à gauche/droite. */
  contentClassName?: string;
}

const defaultGlobeConfig = {
  positions: [
    { top: "50%", left: "75%", scale: 1.4 }, // Hero: Right side, balanced
    { top: "25%", left: "50%", scale: 0.9 }, // Innovation: Top side, subtle
    { top: "15%", left: "90%", scale: 2 }, // Discovery: Left side, medium
    { top: "50%", left: "50%", scale: 1.8 }, // Future: Center, large backdrop
  ],
};

// Parse percentage string to number
const parsePercent = (str: string): number => parseFloat(str.replace("%", ""));

export function ScrollGlobe({
  sections,
  globeConfig = defaultGlobeConfig,
  globe,
  heroNotes = ["Interactive Experience", "Scroll to Explore"],
  className,
  globeClassName,
  progressClassName = "from-primary via-blue-600 to-blue-900",
  titleClassName,
  contentClassName = "max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl",
}: ScrollGlobeProps) {
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const animationFrameId = useRef<number | null>(null);

  // Pre-calculate positions for performance
  const calculatedPositions = useMemo(() => {
    return globeConfig.positions.map((pos) => ({
      top: parsePercent(pos.top),
      left: parsePercent(pos.left),
      scale: pos.scale,
    }));
  }, [globeConfig.positions]);

  const lastIndex = sections.length - 1;
  const pos = calculatedPositions[Math.min(activeSection, calculatedPositions.length - 1)];
  const globeTransform = `translate3d(${pos.left}vw, ${pos.top}vh, 0) translate3d(-50%, -50%, 0) scale3d(${pos.scale}, ${pos.scale}, 1)`;

  // Simple, direct scroll tracking
  const updateScrollPosition = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;

    setScrollProgress(progress);

    // Simple section detection
    const viewportCenter = window.innerHeight / 2;
    let newActiveSection = 0;
    let minDistance = Infinity;

    sectionRefs.current.forEach((ref, index) => {
      if (ref) {
        const rect = ref.getBoundingClientRect();
        const sectionCenter = rect.top + rect.height / 2;
        const distance = Math.abs(sectionCenter - viewportCenter);

        if (distance < minDistance) {
          minDistance = distance;
          newActiveSection = index;
        }
      }
    });

    setActiveSection(newActiveSection);
  }, []);

  // Throttled scroll handler with RAF
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        animationFrameId.current = requestAnimationFrame(() => {
          updateScrollPosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    animationFrameId.current = requestAnimationFrame(updateScrollPosition); // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (animationFrameId.current !== null) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [updateScrollPosition]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full max-w-screen overflow-x-clip min-h-screen bg-background text-foreground", className)}
    >
      {/* Progress Bar */}
      <div aria-hidden className="fixed top-0 left-0 w-full h-0.5 bg-gradient-to-r from-border/20 via-border/40 to-border/20 z-[75]">
        <div
          className={cn("h-full bg-gradient-to-r will-change-transform shadow-sm", progressClassName)}
          style={{
            transform: `scaleX(${scrollProgress})`,
            transformOrigin: "left center",
            transition: "transform 0.15s ease-out",
          }}
        />
      </div>

      {/* Section navigation with auto-hiding labels */}
      <nav aria-label="Étapes de la page" className="hidden sm:flex fixed right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-40">
        <ul className="space-y-3 sm:space-y-4 lg:space-y-6">
          {sections.map((section, index) => (
            <li key={section.id} className="relative group">
              <div
                aria-hidden
                className={cn(
                  "absolute right-5 sm:right-6 lg:right-8 top-1/2 -translate-y-1/2",
                  "px-2 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap",
                  "bg-background/95 backdrop-blur-md border border-border/60 shadow-xl z-50 pointer-events-none",
                  activeSection === index ? "animate-fadeOut" : "opacity-0 group-hover:opacity-100"
                )}
              >
                <div className="flex items-center gap-1 sm:gap-1.5 lg:gap-2">
                  <div className="w-1 sm:w-1.5 lg:w-2 h-1 sm:h-1.5 lg:h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs sm:text-sm lg:text-base">{section.badge || `Section ${index + 1}`}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  sectionRefs.current[index]?.scrollIntoView({
                    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                    block: "center",
                  });
                }}
                className={cn(
                  "relative block w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full border-2 transition-all duration-300 hover:scale-125",
                  "before:absolute before:-inset-2 before:rounded-full",
                  activeSection === index
                    ? "bg-primary border-primary shadow-lg"
                    : "bg-transparent border-muted-foreground/40 hover:border-primary/60 hover:bg-primary/10"
                )}
                aria-label={`Aller à : ${section.badge || `section ${index + 1}`}`}
                aria-current={activeSection === index ? "step" : undefined}
              />
            </li>
          ))}
        </ul>

        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 lg:w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent -translate-x-1/2 -z-10" />
      </nav>

      {/* Floating globe */}
      <div
        aria-hidden
        className={cn(
          "fixed top-0 left-0 z-10 pointer-events-none will-change-transform transition-all duration-[1400ms] ease-[cubic-bezier(0.23,1,0.32,1)]",
          globeClassName
        )}
        style={{
          transform: globeTransform,
          opacity: activeSection === lastIndex ? 0.4 : 0.9,
        }}
      >
        <div className="scale-75 sm:scale-90 lg:scale-100">{globe ?? <Globe />}</div>
      </div>

      {/* Dynamic sections */}
      {sections.map((section, index) => {
        const Heading = index === 0 ? "h1" : "h2";
        return (
          <section
            key={section.id}
            id={section.id}
            aria-labelledby={`${section.id}-titre`}
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
            className={cn(
              "relative min-h-screen flex flex-col justify-center px-4 sm:px-6 md:px-8 lg:px-12 z-20 py-12 sm:py-16 lg:py-20",
              "w-full max-w-full",
              section.align === "center" && "items-center text-center",
              section.align === "right" && "items-end text-right",
              section.align !== "center" && section.align !== "right" && "items-start text-left"
            )}
          >
            <div
              className={cn(
                "w-full",
                section.align === "center" ? "max-w-sm sm:max-w-lg md:max-w-2xl lg:max-w-4xl" : contentClassName
              )}
            >
              {section.badge && (
                <p className="etiquette mb-4 text-lab-blue">
                  {String(index + 1).padStart(2, "0")} · {section.badge}
                </p>
              )}
              <Heading
                id={`${section.id}-titre`}
                className={cn(
                  "font-bold mb-6 sm:mb-8 leading-[1.05] tracking-tight",
                  index === 0
                    ? "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
                    : "text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
                  titleClassName
                )}
              >
                <span className="block">{section.title}</span>
                {section.subtitle && (
                  <span className="mt-1 block text-[0.55em] font-medium tracking-wide text-muted-foreground sm:mt-2">
                    {section.subtitle}
                  </span>
                )}
              </Heading>

              <div
                className={cn(
                  "text-muted-foreground leading-relaxed mb-8 sm:mb-10 text-base sm:text-lg lg:text-xl",
                  section.align === "center" ? "mx-auto" : ""
                )}
              >
                <p className="mb-3 sm:mb-4">{section.description}</p>
                {index === 0 && heroNotes.length > 0 && (
                  <ul className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6">
                    {heroNotes.map((note, i) => (
                      <li key={note} className="flex items-center gap-1.5 sm:gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" style={{ animationDelay: `${i * 0.5}s` }} />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {section.media && (
                <figure className="mb-8 sm:mb-10">
                  <div className="overflow-hidden rounded-2xl border-[1.5px] border-ink bg-card shadow-[4px_4px_0_0_var(--ink)]">
                    <Image
                      src={section.media.src}
                      alt={section.media.alt}
                      width={section.media.width}
                      height={section.media.height}
                      sizes="(min-width: 1024px) 640px, 92vw"
                      className="h-auto w-full"
                    />
                  </div>
                  {section.media.caption && (
                    <figcaption className="etiquette mt-2 text-muted-foreground">{section.media.caption}</figcaption>
                  )}
                </figure>
              )}

              {section.features && (
                <ul className="grid gap-3 sm:gap-4 mb-8 sm:mb-10">
                  {section.features.map((feature) => (
                    <li
                      key={feature.title}
                      className="group p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl border bg-card/80 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-primary/60 mt-1.5 sm:mt-2 group-hover:bg-primary transition-colors flex-shrink-0" />
                        <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
                          <h3 className="font-semibold text-card-foreground text-base sm:text-lg">{feature.title}</h3>
                          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{feature.description}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {section.actions && (
                <div
                  className={cn(
                    "flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4",
                    section.align === "center" && "justify-center",
                    section.align === "right" && "justify-end",
                    (!section.align || section.align === "left") && "justify-start"
                  )}
                >
                  {section.actions.map((action) => {
                    const classes = cn(
                      "glow group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base w-full sm:w-auto border-2",
                      action.variant === "primary"
                        ? "bg-primary text-primary-foreground border-primary hover:bg-primary/90"
                        : "border-foreground bg-background/60 backdrop-blur-sm hover:bg-accent text-foreground"
                    );
                    return action.href ? (
                      <a key={action.label} href={action.href} onClick={action.onClick} className={classes}>
                        {action.label}
                      </a>
                    ) : (
                      <button key={action.label} type="button" onClick={action.onClick} className={classes}>
                        {action.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}

// Demo component showcasing the ScrollGlobe
export default function GlobeScrollDemo() {
  const demoSections: ScrollGlobeSection[] = [
    {
      id: "hero",
      badge: "Welcome",
      title: "Explore",
      subtitle: "Our World",
      description:
        "Journey through an immersive experience where technology meets innovation. Watch as perspectives shift and possibilities unfold with every interaction.",
      align: "left",
      actions: [
        { label: "Begin Journey", variant: "primary", href: "#innovation" },
        { label: "Learn More", variant: "secondary", href: "#discovery" },
      ],
    },
    {
      id: "innovation",
      badge: "Innovation",
      title: "Connected Worldwide",
      description: "From every corner of the globe, we witness the interconnected web of human achievement.",
      align: "center",
    },
    {
      id: "discovery",
      badge: "Discovery",
      title: "Expanding",
      subtitle: "Possibilities",
      description: "As we push beyond familiar boundaries, new worlds of opportunity emerge from the horizon.",
      align: "left",
      features: [
        { title: "Limitless Exploration", description: "Discover new dimensions of possibility and innovation" },
        { title: "Seamless Integration", description: "Where cutting-edge technology meets human intuition" },
        { title: "Future-Ready Solutions", description: "Built for tomorrow's challenges and opportunities" },
      ],
    },
    {
      id: "future",
      badge: "Future",
      title: "Our Shared",
      subtitle: "Tomorrow",
      description: "In this moment of unity, we see not just a planet, but a canvas of infinite human potential.",
      align: "center",
      actions: [{ label: "Join the Movement", variant: "primary", href: "#hero" }],
    },
  ];

  return <ScrollGlobe sections={demoSections} className="bg-gradient-to-br from-background via-muted/20 to-background" />;
}
