"use client";
// Adapté pour Biotrace : membres, titre, texte et icône en props ; titre en h2 par défaut ;
// témoignage optionnel (`quote`, à ne remplir qu'avec une vraie citation) ;
// couleur des fondus réglable ; portraits sans image -> initiales ;
// Marquee local (components/ui/marquee) au lieu de "@/demos/ui/marquee" ;
// icône lucide UserStar au lieu du SVG collé (attributs HTML invalides en JSX).

import Image from "next/image";
import { UserStar } from "lucide-react";

import { Marquee } from "@/components/ui/marquee";
import { cn } from "@/lib/utils";

export type MarqueeMember = {
  name: string;
  role?: string;
  image?: string;
  alt?: string;
};

const demoMembers: MarqueeMember[] = [
  {
    image: "https://cdn.21st.dev/assets/mirror/f4/f43137dada970ee6a29a0497d1f699d54b92e5381350eaa66dc827e3ffb11645.jpg",
    name: "Patrick Stewart",
    role: "CEO - Founder",
  },
  {
    image: "https://cdn.21st.dev/assets/mirror/d5/d549c11c16ad2335895c39339d1a4307b648b24a6baae68662246cf9bd37ac13.jpg",
    name: "Alena Rosser",
    role: "Director of Content",
  },
  {
    image: "https://cdn.21st.dev/assets/mirror/e0/e058437411e954b747056a494f26349751828f12c2137a883e5aebbd1fcf5eef.jpg",
    name: "Fletch Skinner",
    role: "Tech Manager",
  },
  {
    image: "https://cdn.21st.dev/assets/mirror/45/45ba21cbafae178989cd3652799f42123a80e0ac44065ac00cbb265ea948bc41.jpg",
    name: "Marc Spector",
    role: "Director of Content",
  },
  {
    image: "https://cdn.21st.dev/assets/mirror/90/904d97602d25b1b5ef0f4058abad6d8185d8cebd0750771404a934a44dd537fb.jpg",
    name: "Natalia Skinner",
    role: "Cnippet Researcher",
  },
  {
    image: "https://cdn.21st.dev/assets/mirror/3b/3b6a929c98b85177bcc2eb4606a71b7487011128756dbf0adda24e803ca70ed7.jpg",
    name: "David Kim",
    role: "Engineering Lead",
  },
];

export interface TeamMarqueeProps {
  members?: MarqueeMember[];
  /** null : pas d'en-tête (titre géré par la page). */
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  headingLevel?: "h1" | "h2" | "h3";
  headingId?: string;
  /** Citation réelle uniquement. */
  quote?: { text: string; author: string; role?: string; image?: string };
  /** Couleur du fondu sur les bords (doit correspondre au fond). */
  fadeColor?: string;
  /** Durée d'un tour complet du défilement. */
  duration?: string;
  className?: string;
  titleClassName?: string;
  iconClassName?: string;
  cardClassName?: string;
  imageWrapperClassName?: string;
  imageClassName?: string;
  captionClassName?: string;
  /** Dimensions intrinsèques des portraits. */
  imageSizes?: string;
}

function initiales(nom: string) {
  return nom
    .split(/[\s-]+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 3);
}

export default function Component({
  members = demoMembers,
  title = "Creative Cnippet Members",
  description = "Cnippet connects you with the most advanced tech solutions, empowering seamless communication.",
  icon,
  headingLevel = "h2",
  headingId,
  quote,
  fadeColor = "var(--background)",
  duration = "40s",
  className,
  titleClassName,
  iconClassName,
  cardClassName,
  imageWrapperClassName,
  imageClassName,
  captionClassName,
  imageSizes = "256px",
}: TeamMarqueeProps) {
  const Heading = headingLevel;
  return (
    <section className={cn("relative w-full overflow-hidden bg-white py-12 md:py-24 dark:bg-background", className)}>
      <div aria-hidden="true">
        <svg
          className="absolute right-0 bottom-0 text-neutral-200 dark:text-neutral-800"
          fill="none"
          height="154"
          viewBox="0 0 460 154"
          width="460"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-87.463 458.432C-102.118 348.092 -77.3418 238.841 -15.0744 188.274C57.4129 129.408 180.708 150.071 351.748 341.128C278.246 -374.233 633.954 380.602 548.123 42.7707"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="40"
          />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {(title || description) && (
        <div className="mx-auto mb-16 flex max-w-5xl flex-col items-center px-6 text-center lg:px-0">
          <div
            className={cn(
              "mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white",
              iconClassName
            )}
          >
            {icon ?? <UserStar aria-hidden className="size-6" />}
          </div>

          <Heading
            id={headingId}
            className={cn(
              "relative isolate mb-4 font-medium text-4xl text-neutral-900 tracking-tight sm:text-5xl dark:text-neutral-100",
              titleClassName
            )}
          >
            {title}
            <svg
              aria-hidden="true"
              className="absolute -top-2 -right-8 -z-10 w-24 text-neutral-200 dark:text-neutral-700"
              fill="currentColor"
              height="86"
              viewBox="0 0 108 86"
              width="108"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M38.8484 16.236L15 43.5793L78.2688 15L18.1218 71L93 34.1172L70.2047 65.2739"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="28"
              />
            </svg>
          </Heading>
          {description && <div className="max-w-2xl text-neutral-600 dark:text-neutral-400">{description}</div>}
        </div>
        )}

        <div className="relative w-full">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-0 z-10 h-full w-16 sm:w-32 motion-reduce:hidden"
            style={{ backgroundImage: `linear-gradient(to right, ${fadeColor}, transparent)` }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 right-0 z-10 h-full w-16 sm:w-32 motion-reduce:hidden"
            style={{ backgroundImage: `linear-gradient(to left, ${fadeColor}, transparent)` }}
          />

          <Marquee className="[--gap:1.5rem]" style={{ "--duration": duration } as React.CSSProperties} pauseOnHover>
            {members.map((member) => (
              <figure className={cn("group/card flex w-64 shrink-0 flex-col", cardClassName)} key={member.name}>
                <div
                  className={cn(
                    "relative h-92 w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800",
                    imageWrapperClassName
                  )}
                >
                  {member.image ? (
                    <Image
                      alt={member.alt ?? `Portrait de ${member.name}`}
                      className={cn(
                        "h-full w-full object-cover grayscale transition-all duration-300 group-hover/card:grayscale-0",
                        imageClassName
                      )}
                      fill
                      sizes={imageSizes}
                      src={member.image}
                    />
                  ) : (
                    <span aria-hidden className="flex h-full items-center justify-center text-5xl font-semibold">
                      {initiales(member.name)}
                    </span>
                  )}
                  <figcaption
                    className={cn(
                      "absolute bottom-0 w-full rounded-lg bg-neutral-100/85 p-2 dark:bg-neutral-800/80",
                      captionClassName
                    )}
                  >
                    <span className="block font-semibold text-neutral-900 dark:text-neutral-100">{member.name}</span>
                    {member.role && (
                      <span className="block text-neutral-600 text-sm dark:text-neutral-400">{member.role}</span>
                    )}
                  </figcaption>
                </div>
              </figure>
            ))}
          </Marquee>
        </div>

        {quote && (
          <figure className="mx-auto mt-20 max-w-3xl px-6 text-center lg:px-0">
            <blockquote className="mb-8 font-medium text-lg text-neutral-900 leading-relaxed md:text-xl dark:text-neutral-100">
              {quote.text}
            </blockquote>
            <figcaption className="flex flex-col items-center gap-3">
              {quote.image && (
                <div className="relative h-14 w-14 overflow-hidden rounded-full">
                  <Image alt="" className="h-full w-full object-cover" fill sizes="56px" src={quote.image} />
                </div>
              )}
              <div className="text-center">
                <p className="font-semibold text-neutral-900 dark:text-neutral-100">{quote.author}</p>
                {quote.role && <p className="text-neutral-600 text-sm dark:text-neutral-400">{quote.role}</p>}
              </div>
            </figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}
