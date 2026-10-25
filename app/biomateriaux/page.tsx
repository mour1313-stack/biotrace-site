import type { Metadata } from "next"
import Globe from "@/components/ui/globe"
import { BiomaterialTexture } from "@/components/ui/biomaterial-texture"
import { ScrollGlobe, type ScrollGlobeSection } from "@/components/ui/landing-page"
import { congres } from "@/content/congres"
import { site } from "@/content/site"

export const metadata: Metadata = {
  title: "Biomatériaux — le thème de Bio-Innov 2027",
  description:
    "De la conception à l’application : découvrez en images le parcours d’un biomatériau, thème du congrès Bio-Innov 2027 organisé par les étudiants du Master IBION-Tec à Montpellier.",
}

const sections: ScrollGlobeSection[] = [
  {
    id: "theme",
    badge: "Le thème",
    title: "Biomatériaux",
    subtitle: "De la conception à l’application",
    description: `Thème de ${congres.nom}, le congrès scientifique organisé par les étudiants du Master IBION-Tec. Suivez le parcours d’un biomatériau, de la molécule jusqu’au contact du vivant.`,
    align: "left",
    actions: [
      { label: "Commencer la visite", variant: "primary", href: "#conception" },
      { label: "Découvrir le congrès", variant: "secondary", href: "/bio-innov-2027" },
    ],
  },
  {
    id: "conception",
    badge: "Conception",
    title: "Imaginer",
    subtitle: "à l’échelle moléculaire",
    description:
      "Tout commence par le choix des briques : polymères naturels ou synthétiques, céramiques, hydrogels… Leur structure chimique détermine la façon dont le matériau sera toléré par l’organisme, sa résistance ou encore sa vitesse de dégradation.",
    align: "left",
    media: {
      src: "/images/biomateriaux/reseau-moleculaire.webp",
      alt: "Vue rapprochée d’un réseau de molécules translucides reliées entre elles, sur fond turquoise.",
      width: 1136,
      height: 638,
      caption: "Illustration · réseau moléculaire",
    },
  },
  {
    id: "fabrication",
    badge: "Fabrication",
    title: "Fabriquer",
    subtitle: "couche par couche",
    description:
      "Moulage, électrofilage, bio-impression 3D : les procédés de fabrication donnent au matériau sa forme et sa porosité. Des pores bien dimensionnés permettent aux cellules de coloniser le support et aux nutriments de circuler.",
    align: "left",
    media: {
      src: "/images/biomateriaux/bio-impression.webp",
      alt: "Une buse de bio-imprimante dépose un gel rosé sur un support poreux dans une boîte de Petri, tenue par des mains gantées de bleu.",
      width: 1282,
      height: 728,
      caption: "Illustration · bio-impression d’un support poreux",
    },
  },
  {
    id: "application",
    badge: "Application",
    title: "Soigner",
    subtitle: "au contact du vivant",
    description:
      "Substituts de peau, implants osseux, dispositifs qui libèrent un médicament au bon endroit : une fois évalués et validés, les biomatériaux servent à réparer ou à remplacer des tissus.",
    align: "left",
    media: {
      src: "/images/biomateriaux/greffe-tissu.webp",
      alt: "Une pince soulève une fine membrane de tissu rosée au-dessus d’une boîte de Petri, avec un schéma holographique des couches de la peau.",
      width: 1008,
      height: 674,
      caption: "Illustration · membrane de tissu en culture",
    },
  },
  {
    id: "rendez-vous",
    badge: congres.nom,
    title: "Rendez-vous",
    subtitle: `les ${congres.dates}`,
    description: `Conférences, thèse en 180 secondes et posters : venez explorer les biomatériaux à la ${congres.lieu.nom} (${congres.lieu.detail}). Programme à venir.`,
    align: "center",
    actions: [
      { label: "Le congrès", variant: "primary", href: "/bio-innov-2027" },
      { label: "Nous écrire", variant: "secondary", href: `mailto:${site.email}?subject=Bio%20Innov%202027` },
    ],
  },
]

// Sphère « biomatériau » : texture poreuse du site projetée sur une boule.
const sphere = (
  <Globe
    shadow="0 28px 60px rgba(20,83,45,0.22), inset -28px -32px 55px rgba(22,22,22,0.30), inset 20px 16px 32px rgba(255,255,255,0.55)"
  >
    <BiomaterialTexture sphere speed={0.8} />
  </Globe>
)

export default function Biomateriaux() {
  return (
    <ScrollGlobe
      sections={sections}
      globe={sphere}
      globeConfig={{
        positions: [
          { top: "50%", left: "76%", scale: 1.35 },
          { top: "40%", left: "82%", scale: 0.95 },
          { top: "60%", left: "84%", scale: 1.1 },
          { top: "42%", left: "81%", scale: 1.0 },
          { top: "50%", left: "50%", scale: 2.1 },
        ],
      }}
      heroNotes={[congres.dates, "Faites défiler pour explorer"]}
      className="bg-transparent"
      globeClassName="hidden lg:block"
      progressClassName="from-lab-green via-lab-lime to-lab-green-deep"
      titleClassName="font-display font-normal uppercase tracking-normal text-ink"
      contentClassName="max-w-xl lg:max-w-2xl"
    />
  )
}
