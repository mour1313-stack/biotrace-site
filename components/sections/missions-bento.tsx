import Link from "next/link"
import { CalendarDays, FlaskConical, GraduationCap, Handshake, Mail, Microscope, Users, UsersRound } from "lucide-react"
import { FeaturesSectionWithHoverEffects, type Feature } from "@/components/ui/feature-section-with-hover-effects"
import { congres } from "@/content/congres"
import { missions } from "@/content/site"

const icones = { graduation: <GraduationCap />, handshake: <Handshake />, microscope: <Microscope />, users: <Users /> }

/** Accueil : « Nos missions, en bref » — grille épurée à fines bordures (d'après feature-section-with-hover-effects). */
export function MissionsBento() {
  const cases: Feature[] = [
    ...missions.map((m) => ({ title: m.titre, description: m.texte, icon: icones[m.icone] })),
    {
      title: congres.nom,
      description: `Le congrès du Master IBION-Tec sur les biomatériaux, les ${congres.dates}. Biotrace aide à le financer.`,
      icon: <FlaskConical />,
      href: "/bio-innov-2027",
    },
    {
      title: "Événements",
      description: "Congrès, ventes de crêpes et de gaufres, vie associative : ce qui se prépare et nos archives.",
      icon: <CalendarDays />,
      href: "/evenements",
    },
    {
      title: "Notre équipe",
      description: "Les étudiants du bureau et des quatre pôles qui font vivre l’association.",
      icon: <UsersRound />,
      href: "/equipe",
    },
    {
      title: "Nous contacter",
      description: "Une question, une envie de rejoindre l’équipe ou un projet avec le master ? Écrivez-nous.",
      icon: <Mail />,
      href: "/contact",
    },
  ]

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="etiquette text-lab-blue">L’essentiel de Biotrace</p>
          <h2 id="titre-accueil" className="titre-affiche mt-2 text-4xl sm:text-5xl">
            Nos missions, <span className="surligne">en bref</span>
          </h2>
        </div>
        <Link href="/association" className="lien-bleu font-semibold">
          En savoir plus sur l’association
        </Link>
      </div>

      <FeaturesSectionWithHoverEffects features={cases} />
    </div>
  )
}
