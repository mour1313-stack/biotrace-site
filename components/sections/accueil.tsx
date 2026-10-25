import { MissionsBento } from "@/components/sections/missions-bento"

/** Accueil, sous l'ouverture : missions, événements et congrès en mosaïque. */
export function Accueil() {
  return (
    <section id="accueil" aria-labelledby="titre-accueil" className="relative overflow-hidden">
      <div id="apercu" className="mx-auto max-w-7xl scroll-mt-28 px-4 pt-14 pb-24 sm:px-6">
        <MissionsBento />
      </div>
    </section>
  )
}
