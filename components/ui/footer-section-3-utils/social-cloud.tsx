import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

// Fichier non fourni avec footer-section-3 : rangée d'icônes sociales.
// lucide-react n'ayant plus d'icônes de marques, Instagram et LinkedIn sont dessinées ici.

const icons = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="size-5">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="size-5">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10.5V17M8 7.2v.1M12 17v-6.5M12 13.5c0-2 1.2-3 2.6-3s2.4 1 2.4 3V17" strokeLinecap="round" />
    </svg>
  ),
  email: <Mail aria-hidden className="size-5" />,
};

export type SocialLink = { type: keyof typeof icons; href: string; label: string };

export function SocialCloud({ links = [], className }: { links?: SocialLink[]; className?: string }) {
  if (!links.length) return null;
  return (
    <ul className={cn("flex flex-wrap items-center", className)}>
      {links.map((link) => {
        const external = link.href.startsWith("http");
        return (
          <li key={link.href}>
            <a
              href={link.href}
              aria-label={link.label}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="flex size-10 items-center justify-center rounded-full border border-current/30 transition-colors hover:border-current hover:text-foreground"
            >
              {icons[link.type]}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
