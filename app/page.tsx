import { Accueil } from "@/components/sections/accueil"
import { OuvertureEncre } from "@/components/sections/ouverture-encre"
import { CarrouselEquipe } from "@/components/sections/carrousel-equipe"
import { EncartCongres } from "@/components/sections/encart-congres"
import { site } from "@/content/site"

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.nom,
    description: site.presentation,
    email: site.email,
    foundingDate: "2005-11",
    url: site.url,
    logo: `${site.url}/images/logos/biotrace.jpg`,
    sameAs: [site.reseaux.instagram, site.reseaux.linkedin],
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.adresse.lieu}, ${site.adresse.rue}`,
      postalCode: "34090",
      addressLocality: "Montpellier",
      addressCountry: "FR",
    },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <OuvertureEncre />
      <Accueil />
      <CarrouselEquipe />
      <EncartCongres />
    </>
  )
}
