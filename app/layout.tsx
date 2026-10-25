import type { Metadata, Viewport } from "next"
import { Anton, Caveat, DM_Sans, Space_Mono } from "next/font/google"
import { Header } from "@/components/site/header"
import { MenuImmersif } from "@/components/site/menu-immersif"
import { SpotlightPointer } from "@/components/site/spotlight-pointer"
import { Footer } from "@/components/site/footer"
import { MotionProvider } from "@/components/site/motion-provider"
import { site } from "@/content/site"
import "./globals.css"

const display = Anton({ variable: "--font-display", weight: "400", subsets: ["latin"] })
const body = DM_Sans({ variable: "--font-body", subsets: ["latin"] })
const hand = Caveat({ variable: "--font-hand", subsets: ["latin"], weight: ["500", "700"] })
const mono = Space_Mono({ variable: "--font-mono-lab", subsets: ["latin"], weight: ["400", "700"] })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  // Avant le lancement officiel : pas d'indexation (voir site.ouvertAuxMoteursDeRecherche).
  ...(site.ouvertAuxMoteursDeRecherche ? {} : { robots: { index: false, follow: false } }),
  title: {
    default: "Biotrace Montpellier — Association étudiante du Master IBION-Tec",
    template: "%s · Biotrace Montpellier",
  },
  description:
    "Biotrace Montpellier, association étudiante du Master IBION-Tec (Ingénierie Biomoléculaire & Nanobiotechnologies) à la Faculté des Sciences de l’Université de Montpellier, depuis 2005. Équipe, événements et congrès Bio-Innov 2027.",
  keywords: [
    "Biotrace",
    "Biotrace Montpellier",
    "IBION-Tec",
    "association étudiante",
    "biotechnologies",
    "nanobiotechnologies",
    "Université de Montpellier",
    "Bio-Innov 2027",
    "congrès biomatériaux",
  ],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Biotrace Montpellier",
    images: [{ url: "/images/logos/biotrace.jpg", width: 671, height: 457, alt: "Logo Biotrace" }],
  },
}

export const viewport: Viewport = {
  themeColor: "#f7f2e6",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="fr"
      className={`${display.variable} ${body.variable} ${hand.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#contenu"
          className="sr-only z-[100] rounded-full bg-ink px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Aller au contenu
        </a>
        <SpotlightPointer />
        <MotionProvider>
          <Header />
          <MenuImmersif />
          <main id="contenu" className="flex-1">
            {children}
          </main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  )
}
