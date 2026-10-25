"use client"

import { Mail } from "lucide-react"
import BeamWordmarkFooter from "@/components/ui/beam-wordmark-footer"
import { navigation, site } from "@/content/site"

/**
 * Pied de page du site : BeamWordmarkFooter aux couleurs de Biotrace
 * (même beige que le site, quadrillage de cahier, textes noirs, touches de vert fluo
 * sur les détails interactifs ; wordmark « BIOTRACE » beige un peu plus foncé). Voir .bwf-cahier dans globals.css.
 */
export function Footer() {
  return (
    <BeamWordmarkFooter
      className="bwf-cahier mt-auto"
      brand="Biotrace"
      wordmark="BIOTRACE"
      company={`${site.nom} — ${site.statut}`}
      year={null}
      background="#f7f2e6"
      ink="#161616"
      muted="#4a4740"
      accent="#c8f56a"
      wordTop="#e4d9c1"
      wordFoot="#efe7d4"
      fontSans="var(--font-body), ui-sans-serif, system-ui, sans-serif"
      wordFont="var(--font-display), Impact, sans-serif"
      wordWeight={400}
      cut={0.06}
      socials={[
        { label: "Instagram", href: site.reseaux.instagram, icon: "instagram" },
        { label: "LinkedIn", href: site.reseaux.linkedin, icon: "linkedin" },
        { label: "E-mail", href: `mailto:${site.email}`, icon: <Mail x={2} y={2} width={20} height={20} strokeWidth={1.5} /> },
      ]}
      credits={[
        { lead: "", label: site.accroche },
        { lead: "Association étudiante du ", label: "Master IBION-Tec", tail: ` — ${site.universite}` },
        { lead: `${site.adresse.lieu}, ${site.adresse.rue}, `, label: site.adresse.ville },
        { lead: "Écrire à ", label: site.email, href: `mailto:${site.email}` },
        { lead: "Association créée en ", label: site.creation },
      ]}
      columns={[
        {
          title: "Le site",
          links: navigation.map(({ label, href }) => ({ label, href })),
        },
        {
          title: "Bio-Innov 2027 & infos",
          links: [
            { label: "Le congrès", href: "/bio-innov-2027" },
            { label: "Le thème en images", href: "/biomateriaux" },
            { label: "Archives du congrès", href: "/evenements#archives" },
            { label: "Nous rejoindre", href: "/contact" },
            { label: "Mentions légales", href: "/mentions-legales" },
            { label: "Confidentialité", href: "/mentions-legales#confidentialite" },
          ],
        },
      ]}
    />
  )
}
