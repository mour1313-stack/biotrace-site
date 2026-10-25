import Image from "next/image"
import { Molecule, Regle } from "@/components/site/doodles"
import { OrbiteMissions } from "@/components/site/orbite-missions"

/** Page L'association, après « Notre histoire » : les missions de l'association. */
export function Association() {
  return (
    <section
      id="missions"
      aria-labelledby="titre-missions"
      className="border-b-[1.5px] border-ink bg-[#fffdf7]/70 pt-12 pb-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Missions */}
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 id="titre-missions" className="titre-affiche text-4xl sm:text-5xl">
              Nos <span className="surligne">missions</span>
            </h2>
            <p className="mt-4 text-ink-soft">
              Quatre lignes directrices, notées en première page du carnet et transmises d’une promotion à l’autre.
            </p>
            <div className="mt-8 hidden items-center gap-4 lg:flex">
              <Image
                src="/images/logos/biotrace.jpg"
                alt="Logo Biotrace : une double hélice d’ADN entourée de motifs de circuits électroniques."
                width={671}
                height={457}
                className="h-auto w-56 mix-blend-multiply"
              />
              <Molecule className="h-14 text-lab-blue" />
            </div>
          </div>
          <OrbiteMissions />
        </div>
        <Regle className="mt-16 h-5 w-44" />
      </div>
    </section>
  )
}
