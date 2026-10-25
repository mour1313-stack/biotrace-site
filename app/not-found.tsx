import type { Metadata } from "next"
import { NotFound } from "@/components/ui/not-found-2"

export const metadata: Metadata = { title: "Page introuvable", robots: { index: false } }

/** Page 404 du site (d'après not-found-2), aux couleurs du cahier de labo. */
export default function PageIntrouvable() {
  return (
    <NotFound
      className="min-h-[calc(100svh-5rem)] xl:min-h-[calc(100svh-6rem)]"
      eyebrow={<p className="etiquette text-lab-blue">Échantillon introuvable</p>}
      description={
        <>
          Cette page n’existe pas, ou elle a été déplacée.
          <br />
          Retournons au carnet principal.
        </>
      }
      home={{ label: "Retour à l’accueil", href: "/" }}
      explore={{ label: "Voir les événements", href: "/evenements" }}
    />
  )
}
