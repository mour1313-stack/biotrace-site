import { cn } from "@/lib/utils";

// Marquee (style Magic UI), non fourni avec team.tsx (importé depuis "@/demos/ui/marquee").
// Le contenu est répété pour un défilement continu ; seules les copies après la première
// sont masquées aux lecteurs d'écran. Sous « réduire les animations », le défilement
// s'arrête et la rangée devient défilable à la main.

interface MarqueeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  vertical?: boolean;
  repeat?: number;
  children: React.ReactNode;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  vertical = false,
  repeat = 4,
  children,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        vertical ? "flex-col" : "flex-row",
        "motion-reduce:overflow-x-auto",
        className
      )}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          aria-hidden={i > 0 ? true : undefined}
          className={cn(
            "flex shrink-0 justify-around [gap:var(--gap)]",
            vertical ? "animate-marquee-vertical flex-col" : "animate-marquee flex-row",
            pauseOnHover && "group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]",
            "motion-reduce:animate-none",
            i > 0 && "motion-reduce:hidden"
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
