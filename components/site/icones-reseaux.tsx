/* lucide-react ne fournit plus les icônes de marques : versions simplifiées au trait. */

type P = { className?: string }

export function IconeInstagram({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  )
}

export function IconeLinkedin({ className }: P) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <path d="M8 10.5V17M8 7.2v.1M12 17v-6.5M12 13.5c0-2 1.2-3 2.6-3s2.4 1 2.4 3V17" strokeLinecap="round" />
    </svg>
  )
}
