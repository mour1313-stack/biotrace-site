"use client"

import { Briefcase, Mail, MapPin } from "lucide-react"
import ContactWithGlobe from "@/components/ui/contact-with-globe"
import { IconeInstagram, IconeLinkedin } from "@/components/site/icones-reseaux"
import { site } from "@/content/site"

/** Page Contact : coordonnées, réseaux, globe centré sur Montpellier et formulaire (via la messagerie). */
export function Contact() {
  return (
    <ContactWithGlobe
      headingLevel="h1"
      headingId="titre-contact"
      subtitle="05 · Contact & participation"
      title={
        <>
          Envie de participer à l’aventure <span className="surligne">Biotrace</span> ?
        </>
      }
      description="Vous souhaitez participer à nos actions, proposer un projet ou en savoir plus sur l’association ? Écrivez-nous et échangeons !"
      introTitle="Nous joindre"
      introText="Par e-mail ou sur nos réseaux : l’équipe vous répond dès que possible."
      links={[
        { icon: Mail, label: site.email, href: `mailto:${site.email}` },
        { icon: IconeInstagram, label: "Instagram · @biotrace_mtp", href: site.reseaux.instagram },
        { icon: IconeLinkedin, label: "LinkedIn · Association Biotrace", href: site.reseaux.linkedin },
      ]}
      aside={
        <div className="space-y-4">
          <div className="flex gap-3 rounded-2xl border-[1.5px] border-dashed border-ink/40 p-4">
            <MapPin aria-hidden className="mt-0.5 size-5 shrink-0 text-lab-blue" />
            <p className="text-[0.95rem]">
              <span className="font-bold">{site.adresse.lieu}</span>
              <br />
              {site.adresse.rue}, {site.adresse.ville}
            </p>
          </div>
          <div className="rounded-2xl border-[1.5px] border-ink bg-pole-violet p-5">
            <Briefcase aria-hidden className="size-5" />
            <p className="mt-2 font-bold">Chercheurs, professionnels, structures</p>
            <p className="mt-1 text-[0.95rem] text-ink/85">
              Vous êtes chercheur, professionnel ou représentant d’une structure et souhaitez échanger avec notre équipe ?
              Contactez-nous pour discuter de vos idées et de nos projets.
            </p>
          </div>
        </div>
      }
      globe={{
        // Vue centrée un peu au sud de Montpellier pour que le marqueur tombe dans la partie visible du globe
        rotateToLocation: [22, 3.88],
        autoRotate: false,
        markers: [{ label: "Montpellier", coordinates: [43.6108, 3.8767] }],
        markerColor: "#c8f56a",
      }}
      form={{
        mailto: site.email,
        title: "Écrire un message",
        text: "Remplissez le formulaire : votre messagerie s’ouvrira avec le message prêt à être envoyé.",
        submitLabel: "Préparer l’e-mail",
        note: `Le message est envoyé depuis votre propre messagerie, à ${site.email}. Ce site n’enregistre aucune donnée.`,
        subjectPrefix: "Contact via le site Biotrace",
        labels: { name: "Nom et prénom", company: "Structure (facultatif)", email: "Votre e-mail", message: "Message" },
        placeholders: {
          name: "Camille Martin",
          company: "Laboratoire, entreprise…",
          email: "vous@exemple.fr",
          message: "Bonjour, je souhaiterais…",
        },
      }}
    />
  )
}
