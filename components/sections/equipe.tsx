import Link from "next/link"
import { FileImage, UserPlus } from "lucide-react"
import { promotionActuelle, promotionsArchivees, type Pole } from "@/content/equipe"
import { BoutonVisionneuse, ImageZoom } from "@/components/site/lightbox"
import { Reveal } from "@/components/site/motion-provider"
import Members from "@/components/ui/members-03"
import { SectionTitre } from "@/components/site/section-titre"
import { OrbitePoles } from "@/components/site/orbite-poles"
import { cn } from "@/lib/utils"

const fonds: Record<Pole["couleur"], string> = {
  violet: "fond-violet",
  orange: "fond-orange",
  rose: "fond-rose",
  jaune: "fond-jaune",
  vert: "fond-vert",
}

function PanneauPole({ pole, numero }: { pole: Pole; numero: number }) {
  const n = pole.membres.length
  return (
    <Reveal>
      <article
        id={`pole-${pole.id}`}
        aria-labelledby={`titre-pole-${pole.id}`}
        className={cn("relative rounded-[1.75rem] border-[1.5px] border-ink p-4 sm:p-6", fonds[pole.couleur])}
      >
        {/* Organisation d'après members-03 : en-tête du pôle, puis grille des membres */}
        <Members
          titleId={`titre-pole-${pole.id}`}
          title={
            <span className="titre-affiche block text-3xl sm:text-4xl">
              Pôle <span className="surligne">{pole.nom}</span>
            </span>
          }
          meta={[`Équipe ${String(numero).padStart(2, "0")}`, `${n} membre${n > 1 ? "s" : ""}`]}
          actions={
            <>
              {pole.affiche && (
                <BoutonVisionneuse
                  image={{
                    src: pole.affiche,
                    alt: `Fiche originale du pôle ${pole.nom}, avec les portraits et les noms des membres.`,
                    legende: `Fiche du pôle ${pole.nom}`,
                  }}
                  className="bouton bouton-clair !min-h-10 !py-1.5 text-sm"
                >
                  <FileImage aria-hidden className="size-4" /> Voir la fiche
                </BoutonVisionneuse>
              )}
              <Link href="/contact" className="bouton bouton-noir !min-h-10 !py-1.5 text-sm">
                <UserPlus aria-hidden className="size-4" /> Nous rejoindre
              </Link>
            </>
          }
          headerClassName="rounded-2xl border-[1.5px] border-ink bg-[#fffdf7]/85 shadow-[3px_3px_0_0_var(--ink)]"
          metaClassName="etiquette mt-1 text-ink-soft"
          members={pole.membres.map((m) => ({
            name: m.nom,
            role: m.fonction,
            image: m.photo,
            alt: `Portrait de ${m.nom}${m.fonction ? `, ${m.fonction.toLowerCase()}` : ""}`,
          }))}
          // Même grille pour tous les pôles : les portraits gardent la même taille, quel que soit le nombre de membres.
          gridClassName="grid-cols-2 gap-x-3 gap-y-6 sm:gap-x-4 min-[32rem]:grid-cols-2 md:grid-cols-4 lg:grid-cols-4"
          imageWrapperClassName={cn(
            "group rounded-2xl border-[1.5px] border-ink shadow-[3px_3px_0_0_var(--ink)]",
            fonds[pole.couleur],
          )}
          imageClassName="rounded-none object-top transition-transform duration-500 group-hover:scale-[1.04]"
          nameClassName="text-base leading-tight font-bold text-lab-blue"
          roleClassName="etiquette mt-0.5 text-[0.68rem] text-ink"
          imageSizes="(min-width: 1024px) 280px, (min-width: 768px) 23vw, 46vw"
        >
          {/* Accroche, mission et mots-clés du pôle */}
          <div className="mt-5 grid gap-4 px-1 md:grid-cols-[auto_minmax(0,1fr)] md:items-start md:gap-8">
            <p className="cadre-bleu bg-[#fffdf7]/70 px-4 py-2.5 text-center font-semibold tracking-wide uppercase">
              {pole.accroche}
            </p>
            <dl className="space-y-3">
              <div>
                <dt className="etiquette font-bold">
                  <span className="surligne">Mission</span>
                </dt>
                <dd className="mt-1">{pole.mission}</dd>
              </div>
              <div>
                <dt className="sr-only">Mots-clés</dt>
                <dd>
                  <ul className="flex flex-wrap gap-2">
                    {pole.motsCles.map((m) => (
                      <li key={m} className="rounded-full border-[1.5px] border-ink bg-[#fffdf7] px-3 py-1 text-sm font-semibold">
                        {m}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </Members>
      </article>
    </Reveal>
  )
}

export function Equipe() {
  const promo = promotionActuelle
  return (
    <section id="equipe" aria-labelledby="titre-equipe" className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionTitre
          as="h1"
          id="titre-equipe"
          numero="02"
          surtitre={`Notre équipe ${promo.annee}`}
          titre={
            <>
              Les visages de <span className="surligne">Biotrace</span>
            </>
          }
          sousTitre={promo.sousTitre}
        />

        {/* Photo collective du bureau */}
        <Reveal className="mt-12">
          <figure className="fond-vert rounded-[1.75rem] border-[1.5px] border-ink p-4 sm:p-6">
            <ImageZoom
              src={promo.bureau.photo}
              alt={promo.bureau.alt}
              legende={`Le bureau ${promo.annee}`}
              width={1800}
              height={1195}
              priority
              sizes="(min-width: 1280px) 1180px, 92vw"
              className="rounded-2xl border-[1.5px] border-ink bg-[#fffdf7]"
              imageClassName="h-auto w-full"
              label="Agrandir"
            />
            <figcaption className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-1">
              <span className="font-hand text-2xl font-bold">
                Le bureau {promo.annee} · « {promo.bureau.accroche} »
              </span>
              {promo.bureau.affiche && (
                <BoutonVisionneuse
                  image={{ src: promo.bureau.affiche, alt: "Fiche originale de présentation du bureau.", legende: "Fiche « Le bureau »" }}
                  className="lien-bleu inline-flex items-center gap-2 font-semibold"
                >
                  <FileImage aria-hidden className="size-4" /> Voir la fiche originale du bureau
                </BoutonVisionneuse>
              )}
            </figcaption>
          </figure>
        </Reveal>

        {/* Les 4 pôles en orbite autour du bureau */}
        <Reveal className="mt-14 grid items-center gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div>
            <p className="etiquette text-lab-blue">Organisation</p>
            <h3 className="titre-affiche mt-2 text-4xl sm:text-5xl">
              Quatre pôles, <span className="surligne">une orbite</span>
            </h3>
            <p className="mt-4 max-w-md text-ink-soft">
              Autour du bureau gravitent quatre pôles complémentaires. Ouvrez-en un pour découvrir sa mission, son
              accroche et ses membres, puis rendez-vous sur sa fiche détaillée.
            </p>
          </div>
          <OrbitePoles poles={promo.poles} />
        </Reveal>

        <div className="mt-8 space-y-8">
          {promo.poles.map((pole, i) => (
            <PanneauPole key={pole.id} pole={pole} numero={i + 2} />
          ))}
        </div>

        {/* Archives des promotions */}
        {promotionsArchivees.length > 0 && (
          <div className="mt-16">
            <h3 className="titre-affiche text-3xl sm:text-4xl">
              Les promotions <span className="surligne-jaune surligne">précédentes</span>
            </h3>
            <p className="mt-2 text-ink-soft">Chaque équipe laisse sa trace : retrouvez ici les bureaux des années passées.</p>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {promotionsArchivees.map((p) => (
                <li key={p.annee} className="carte overflow-hidden">
                  <ImageZoom
                    src={p.photo}
                    alt={p.alt}
                    legende={`Équipe ${p.annee}`}
                    width={1126}
                    height={1310}
                    sizes="(min-width: 1024px) 380px, 92vw"
                    className="aspect-[4/3] w-full border-b-[1.5px] border-ink"
                    imageClassName="h-full w-full object-cover object-top"
                    label="Agrandir"
                  />
                  <div className="p-4">
                    <p className="titre-affiche text-2xl">Équipe {p.annee}</p>
                    <p className="mt-1 text-sm text-ink-soft">{p.legende}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
