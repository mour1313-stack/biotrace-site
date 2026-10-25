import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ArrowRight, ArrowUpRight, CakeSlice, CalendarDays, MapPin } from "lucide-react"
import { archivesCongres, evenements, galerie, type Evenement } from "@/content/evenements"
import { Galerie } from "@/components/site/galerie"
import { ImageZoom } from "@/components/site/lightbox"
import { Reveal, RevealItem } from "@/components/site/motion-provider"
import { SectionTitre } from "@/components/site/section-titre"
import { ShaderHero } from "@/components/ui/shader-hero"
import { AgendaBento } from "@/components/sections/agenda-bento"

/**
 * En-tête de la page : fond animé (d'après shader-hero.tsx).
 * Mettre à false pour revenir à l'ancien titre « Sur notre agenda », sans fond animé.
 */
const EN_TETE_ANIME = false

/**
 * Agenda en mosaïque (d'après bento-grid.tsx), sous le titre.
 * Mettre à false pour revenir aux deux colonnes « À venir » / « Tout au long de l'année ».
 */
const AGENDA_EN_MOSAIQUE = false

/**
 * Cartes « À venir », « Tout au long de l'année » et archives du congrès épurées :
 * images sans cadre (coins à peine arrondis, ombre douce), textes posés sur le fond.
 * Mettre à false pour revenir aux cartes à contour noir.
 */
const CARTES_EPUREES = true
const ombreDouce = "rounded-[3px] shadow-[0_1px_2px_rgba(22,22,22,0.10),0_10px_24px_-10px_rgba(22,22,22,0.35)]"

const sousTitre =
  "Rendez-vous scientifiques, vie associative et actions étudiantes : ce qui se prépare et ce que nous avons vécu."

function LienEvenement({ lien }: { lien: NonNullable<Evenement["lien"]> }) {
  const externe = lien.href.startsWith("http")
  const classes = CARTES_EPUREES
    ? "mt-4 inline-flex items-center gap-1.5 self-start font-semibold text-ink underline decoration-lab-lime decoration-2 underline-offset-[6px] transition hover:decoration-ink"
    : "bouton bouton-clair mt-5 self-start !min-h-10 !py-1.5 text-sm"
  return externe ? (
    <a href={lien.href} target="_blank" rel="noopener noreferrer" className={classes}>
      {lien.label} <ArrowUpRight aria-hidden className="size-4" />
      <span className="sr-only">(nouvel onglet)</span>
    </a>
  ) : (
    <Link href={lien.href} className={classes}>
      {lien.label} <ArrowRight aria-hidden className="size-4" />
    </Link>
  )
}

function CarteEvenement({ e }: { e: Evenement }) {
  if (CARTES_EPUREES) {
    return (
      <article className="flex h-full flex-col gap-5 sm:flex-row sm:gap-7">
        <div className={cn("relative shrink-0 overflow-hidden sm:w-44", ombreDouce, !e.image && "bg-pole-jaune")}>
          {e.image ? (
            <Image
              src={e.image.src}
              alt={e.image.alt}
              width={1086}
              height={1524}
              sizes="(min-width: 640px) 176px, 92vw"
              className="h-auto max-h-80 w-full object-cover object-top sm:max-h-none"
            />
          ) : (
            <span
              className="flex h-full min-h-44 flex-col items-center justify-center gap-2 p-8 text-center"
              aria-hidden
            >
              <CakeSlice className="size-12" />
              <span className="font-hand text-2xl font-bold">miam !</span>
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col">
          <p className="etiquette text-lab-blue">{e.categorie}</p>
          <h4 className="mt-2 text-2xl leading-tight font-bold">{e.titre}</h4>
          <ul className="mt-3 space-y-1.5 text-[0.95rem] text-ink-soft">
            <li className="flex gap-2">
              <CalendarDays aria-hidden className="mt-0.5 size-4 shrink-0 text-lab-blue" />
              <span>{e.date ?? (e.statut === "recurrent" ? "Dates annoncées sur Instagram" : "Date à venir")}</span>
            </li>
            {e.lieu && (
              <li className="flex gap-2">
                <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-lab-blue" />
                <span>{e.lieu}</span>
              </li>
            )}
          </ul>
          <p className="mt-3 text-ink-soft">{e.description}</p>
          {e.lien && <LienEvenement lien={e.lien} />}
        </div>
      </article>
    )
  }
  return (
    <article className="carte flex h-full flex-col overflow-hidden sm:flex-row">
      <div className="relative flex shrink-0 items-center justify-center border-b-[1.5px] border-ink bg-pole-jaune sm:w-56 sm:border-r-[1.5px] sm:border-b-0">
        {e.image ? (
          <Image
            src={e.image.src}
            alt={e.image.alt}
            width={1086}
            height={1524}
            sizes="(min-width: 640px) 224px, 92vw"
            className="h-full max-h-80 w-full object-cover object-top sm:max-h-none"
          />
        ) : (
          <span className="flex flex-col items-center gap-2 p-10 text-center" aria-hidden>
            <CakeSlice className="size-14" />
            <span className="font-hand text-2xl font-bold">miam !</span>
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="etiquette text-lab-blue">{e.categorie}</p>
        <h4 className="mt-2 text-2xl leading-tight font-bold">{e.titre}</h4>
        <ul className="mt-3 space-y-1.5 text-[0.95rem]">
          <li className="flex gap-2">
            <CalendarDays aria-hidden className="mt-0.5 size-4 shrink-0 text-lab-blue" />
            <span>{e.date ?? (e.statut === "recurrent" ? "Dates annoncées sur Instagram" : "Date à venir")}</span>
          </li>
          {e.lieu && (
            <li className="flex gap-2">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-lab-blue" />
              <span>{e.lieu}</span>
            </li>
          )}
        </ul>
        <p className="mt-3 text-ink-soft">{e.description}</p>
        {e.lien && <LienEvenement lien={e.lien} />}
      </div>
    </article>
  )
}

export function Evenements() {
  const aVenir = evenements.filter((e) => e.statut === "a-venir")
  const recurrents = evenements.filter((e) => e.statut === "recurrent")
  const passes = evenements.filter((e) => e.statut === "passe")

  return (
    <>
      {EN_TETE_ANIME && (
        <ShaderHero
          titleId="titre-evenements"
          title="Sur notre agenda"
          badge={
            <>
              <CalendarDays aria-hidden className="size-4" /> 04 · Événements
            </>
          }
          description={sousTitre}
          primary={{ label: "Ce qui arrive", href: "#a-venir" }}
          secondary={{ label: "Les archives du congrès", href: "#archives" }}
          // Noir et blanc du carnet : encre, gris anthracite et beige papier.
          colors={["#0d0d0d", "#161616", "#2e2e2e", "#f7f2e6"]}
          overlayColors={["#161616", "#f7f2e6", "#4a4740"]}
          backgroundColor="#161616"
          className="-mt-20 min-h-[88svh] border-b-[1.5px] border-ink xl:-mt-24"
          titleClassName="font-display font-normal uppercase tracking-normal"
        />
      )}
      <section
        id="evenements"
        aria-labelledby="titre-evenements"
        className={cn("bg-[#fffdf7]/70 py-24", EN_TETE_ANIME ? "pt-16" : "border-t-[1.5px] border-ink")}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          {!EN_TETE_ANIME && (
            <SectionTitre
              as="h1"
              id="titre-evenements"
              numero="04"
              surtitre="Événements"
              titre={
                <>
                  Sur notre <span className="surligne">agenda</span>
                </>
              }
              sousTitre={sousTitre}
            />
          )}

          {AGENDA_EN_MOSAIQUE && (
            <div id="a-venir" className={cn("scroll-mt-28", !EN_TETE_ANIME && "mt-14")}>
              <AgendaBento />
            </div>
          )}

          {!AGENDA_EN_MOSAIQUE && (
            <div className={cn("grid gap-10 lg:grid-cols-2", !EN_TETE_ANIME && "mt-14")}>
              <div id="a-venir" className="scroll-mt-28">
                <h3 className="titre-affiche text-3xl">
                  <span className="surligne">À venir</span>
                </h3>
                <ul className="mt-6 space-y-6">
                  {aVenir.map((e) => (
                    <RevealItem key={e.id}>
                      <CarteEvenement e={e} />
                    </RevealItem>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="titre-affiche text-3xl">
                  <span className="surligne surligne-jaune">Tout au long de l’année</span>
                </h3>
                <ul className="mt-6 space-y-6">
                  {recurrents.map((e) => (
                    <RevealItem key={e.id}>
                      <CarteEvenement e={e} />
                    </RevealItem>
                  ))}
                </ul>
                {passes.length > 0 && (
                  <>
                    <h3 className="titre-affiche mt-10 text-3xl">Passés</h3>
                    <ul className="mt-6 space-y-6">
                      {passes.map((e) => (
                        <RevealItem key={e.id}>
                          <CarteEvenement e={e} />
                        </RevealItem>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Archives du congrès */}
          <div id="archives" className="mt-20 scroll-mt-28">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h3 className="titre-affiche text-4xl sm:text-5xl">
                  Passés : les <span className="surligne">archives du congrès</span>
                </h3>
                <p className="mt-3 max-w-2xl text-ink-soft">
                  Organisé chaque année par les étudiants du Master IBION-Tec, le congrès s’appelait « Congrès Biotrace
                  » avant de devenir Bio-Innov. Voici les éditions dont nous avons retrouvé les affiches.
                </p>
              </div>
            </div>
            <ol className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-color:var(--ink)_transparent]">
              {archivesCongres.map((e) => (
                <li key={e.annee} className={cn("shrink-0 snap-start", CARTES_EPUREES ? "w-min pt-1" : "w-64")}>
                  <Reveal
                    className={CARTES_EPUREES ? "flex h-full flex-col" : "carte flex h-full flex-col overflow-hidden"}
                  >
                    <ImageZoom
                      src={e.affiche}
                      alt={`Affiche du congrès ${e.annee} : ${e.theme}.`}
                      legende={`Congrès ${e.annee} — ${e.theme}`}
                      width={714}
                      height={1000}
                      sizes="256px"
                      className={
                        CARTES_EPUREES
                          ? cn("h-72 w-max", ombreDouce)
                          : "aspect-[3/4] w-full border-b-[1.5px] border-ink bg-paper-deep"
                      }
                      imageClassName={CARTES_EPUREES ? "h-full w-auto max-w-none" : "h-full w-full object-cover object-top"}
                      label="Voir l’affiche"
                      labelClassName={
                        CARTES_EPUREES
                          ? "border-0 bg-[#fffdf7]/85 font-semibold opacity-0 backdrop-blur-sm group-hover:opacity-100"
                          : undefined
                      }
                    />
                    <div className={CARTES_EPUREES ? "flex flex-1 flex-col pt-4" : "flex flex-1 flex-col p-4"}>
                      <p className="etiquette text-lab-blue">
                        {e.annee}
                        {e.edition && ` · ${e.edition}`}
                      </p>
                      <p className="mt-1.5 leading-snug font-bold">{e.theme}</p>
                      <p className="mt-2 text-sm text-ink-soft">{e.date}</p>
                      {e.lieu && <p className="text-sm text-ink-soft">{e.lieu}</p>}
                    </div>
                  </Reveal>
                </li>
              ))}
            </ol>
            <p className="etiquette mt-2 text-ink-soft">
              ← Faites défiler → · Archives à compléter avec les éditions précédentes
            </p>
          </div>

          {/* Galerie */}
          <div id="galerie" className="mt-20">
            <h3 className="titre-affiche text-4xl sm:text-5xl">
              La <span className="surligne">galerie</span>
            </h3>
            <p className="mt-3 max-w-2xl text-ink-soft">Congrès, équipes et moments de vie associative.</p>
            <div className="mt-8">
              <Galerie images={galerie} />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
