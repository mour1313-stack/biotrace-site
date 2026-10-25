import { cn } from "@/lib/utils"

/* Petites illustrations « dessinées à la main », décoratives (aria-hidden). */

type P = { className?: string }

export function FlecheDessinee({ className }: P) {
  return (
    <svg viewBox="0 0 120 60" fill="none" aria-hidden="true" className={cn("text-lab-blue", className)}>
      <path
        className="trait-anime"
        style={{ "--longueur": 160 } as React.CSSProperties}
        d="M4 40c22-26 58-34 98-14"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="5 6"
      />
      <path d="M92 14l12 12-16 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Mot entouré au stylo bleu. */
export function Entoure({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("relative inline-block px-2", className)}>
      <span className="relative z-10">{children}</span>
      <svg
        viewBox="0 0 200 70"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-2 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1rem)] text-lab-blue"
      >
        <path
          className="trait-anime"
          style={{ "--longueur": 520 } as React.CSSProperties}
          d="M18 38C14 18 70 6 118 8c46 2 76 14 74 30-2 18-52 26-104 25C40 62 6 54 10 34 13 20 50 10 92 9"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}

export function Helice({ className }: P) {
  return (
    <svg viewBox="0 0 60 160" fill="none" aria-hidden="true" className={className}>
      <path d="M12 6c0 40 36 44 36 74s-36 34-36 74" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      <path d="M48 6c0 40-36 44-36 74s36 34 36 74" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
      {[24, 46, 80, 114, 136].map((y) => (
        <path key={y} d={`M20 ${y}h20`} stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" opacity="0.6" />
      ))}
    </svg>
  )
}

export function Circuit({ className }: P) {
  return (
    <svg viewBox="0 0 120 80" fill="none" aria-hidden="true" className={className}>
      <path d="M0 20h40l10 10h30" stroke="currentColor" strokeWidth="2" />
      <path d="M0 44h28l8-8h44" stroke="currentColor" strokeWidth="2" />
      <path d="M0 64h50l10 8h36" stroke="currentColor" strokeWidth="2" />
      <circle cx="84" cy="30" r="4" fill="currentColor" />
      <circle cx="100" cy="72" r="4" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export function Molecule({ className }: P) {
  return (
    <svg viewBox="0 0 80 80" fill="none" aria-hidden="true" className={className}>
      <path d="M40 40L18 22M40 40l26-10M40 40l-6 28M40 40l22 22" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="40" cy="40" r="9" fill="currentColor" />
      <circle cx="18" cy="22" r="6" stroke="currentColor" strokeWidth="2.5" fill="var(--paper)" />
      <circle cx="66" cy="30" r="5" stroke="currentColor" strokeWidth="2.5" fill="var(--paper)" />
      <circle cx="34" cy="68" r="6" stroke="currentColor" strokeWidth="2.5" fill="var(--paper)" />
      <circle cx="62" cy="62" r="4" fill="currentColor" />
    </svg>
  )
}

export function Fiole({ className }: P) {
  return (
    <svg viewBox="0 0 64 80" fill="none" aria-hidden="true" className={className}>
      <path d="M24 6h16M27 6v22L10 62a8 8 0 0 0 7 12h30a8 8 0 0 0 7-12L37 28V6" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M16 52h32l5 10a6 6 0 0 1-5 8H16a6 6 0 0 1-5-8z" fill="var(--lab-lime)" />
      <circle cx="28" cy="58" r="2.5" fill="currentColor" />
      <circle cx="37" cy="63" r="1.8" fill="currentColor" />
    </svg>
  )
}

/** Règle graduée, comme au bas des affiches. */
export function Regle({ className }: P) {
  return (
    <svg viewBox="0 0 160 22" aria-hidden="true" className={className}>
      <rect x="1" y="1" width="158" height="20" rx="2" fill="var(--lab-lime)" stroke="var(--ink)" strokeWidth="1.5" />
      {Array.from({ length: 31 }, (_, i) => (
        <line key={i} x1={6 + i * 5} x2={6 + i * 5} y1="1" y2={i % 5 === 0 ? 12 : 7} stroke="var(--ink)" strokeWidth="1" />
      ))}
    </svg>
  )
}
