import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Reveal } from "@/components/site/motion-provider"
import { ZoomParallax } from "@/components/ui/zoom-parallax"
import { archivesCongres } from "@/content/evenements"

/** Dimensions des affiches (public/images/archives), pour que chaque cadre ait leur forme exacte. */
const dimensions: Record<string, [number, number]> = {
  "2019": [715, 1059],
  "2020": [714, 1017],
  "2021": [716, 895],
  "2022": [714, 903],
  "2023": [715, 1029],
  "2024": [714, 1007],
  "2026": [714, 903],
}

/** La plus récente au centre (elle s'agrandit jusqu'à remplir l'écran), puis les éditions précédentes. */
const affiches = [...archivesCongres]
  .sort((a, b) => Number(b.annee) - Number(a.annee))
  .slice(0, 7)
  .map((e) => ({
    src: e.affiche,
    width: dimensions[e.annee]?.[0],
    height: dimensions[e.annee]?.[1],
    alt: `Affiche du congrès Biotrace ${e.annee}${e.edition ? ` (${e.edition})` : ""} : ${e.theme}.`,
  }))

/** Haut de la page L'association : le récit « Notre histoire », puis les affiches du congrès en zoom au défilement. */
export function NotreHistoire() {
  return (
    <section id="association" aria-labelledby="titre-notre-histoire" className="border-b-[1.5px] border-ink">
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-16 sm:px-6 sm:pt-20">
        <Reveal className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="etiquette text-lab-blue">01 · L’association — Notre histoire</p>
            <h1 id="titre-notre-histoire" className="titre-affiche mt-2 text-4xl sm:text-5xl lg:text-6xl">
              Depuis 2005, la science <span className="surligne">nous rassemble.</span>
            </h1>
            <p className="mt-8 font-hand text-3xl leading-snug font-bold text-lab-blue">
              C’est ainsi que naît BIOTRACE.
            </p>
          </div>
          <div className="space-y-5 text-lg text-ink-soft">
            <p>
              Tout commence en <strong className="text-ink">novembre 2005</strong>, à l’Université de Montpellier. Une
              ambition commune anime alors des étudiants passionnés de biotechnologies : faire vivre la science au-delà
              des amphithéâtres et créer des rencontres entre étudiants, chercheurs et professionnels.
            </p>
            <p>
              Dès 2006, une tradition voit le jour : l’organisation d’un congrès scientifique annuel, imaginé et porté
              par les étudiants. Au fil des années, les générations se succèdent, les thématiques évoluent et les
              découvertes se multiplient.
            </p>
            <p>
              Des biocapteurs aux nanotechnologies, des biomatériaux aux biotechnologies spatiales, chaque édition
              témoigne de notre curiosité pour les innovations qui façonnent le monde de demain.
            </p>
            <p>
              <strong className="text-ink">Plus de 20 ans après sa création</strong>, BIOTRACE continue de grandir,
              portée par la même énergie : celle d’étudiants qui souhaitent apprendre, partager et faire avancer les
              idées.
            </p>
          </div>
        </Reveal>

        <p className="etiquette mt-16 text-center text-ink-soft">
          Faites défiler : les affiches du congrès, de {affiches.at(-1)?.src.match(/\d{4}/)?.[0]} à{" "}
          {affiches[0]?.src.match(/\d{4}/)?.[0]}
        </p>
      </div>

      <ZoomParallax
        images={affiches}
        fit="contain"
        layout="portrait"
        // Affiches imprimées, sans contour : coins à peine arrondis, ombre douce et naturelle, très légère inclinaison.
        frameClassName="rounded-[3px] shadow-[0_1px_2px_rgba(22,22,22,0.12),0_12px_28px_-8px_rgba(22,22,22,0.35)]"
        tilts={[0, 1.5, -1.5, 1, -1, 1.2, -1.2]}
      />

      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <Reveal>
          <p className="text-xl text-ink-soft">Car BIOTRACE, c’est bien plus qu’une association scientifique.</p>
          <p className="titre-affiche mt-4 text-3xl sm:text-4xl">
            C’est une histoire de <span className="surligne">transmission</span>, de rencontres et de passion pour
            l’innovation.
          </p>
          <p className="mt-6 font-hand text-3xl font-bold text-lab-blue">
            Une nouvelle génération. De nouvelles idées. La même passion.
          </p>
          <Link href="/evenements#archives" className="bouton bouton-noir mt-10">
            Voir toutes les éditions du congrès <ArrowRight aria-hidden className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
