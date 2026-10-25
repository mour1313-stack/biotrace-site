import type { Metadata } from "next"
import Image from "next/image"
import { InscriptionsCongres } from "@/components/site/inscriptions-congres"
import { InfiniteSlider } from "@/components/ui/infinite-slider"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Clock,
  FileText,
  Handshake,
  Mail,
  MapPin,
  Mic,
  Presentation,
  Timer,
} from "lucide-react"
import { congres } from "@/content/congres"
import { site } from "@/content/site"
import { BadgePulsant, FondShaderVert } from "@/components/ui/shader-fond"
import { ImageZoom } from "@/components/site/lightbox"
import { CompteARebours } from "@/components/site/compte-a-rebours"
import TeamMarquee from "@/components/ui/team"
import { Reveal, RevealItem } from "@/components/site/motion-provider"
import { Fiole, Molecule } from "@/components/site/doodles"

export const metadata: Metadata = {
  title: "Bio-Innov 2027 — Congrès sur les biomatériaux",
  description:
    "Bio-Innov 2027, 21e édition du congrès scientifique organisé par les étudiants du Master IBION-Tec, avec le soutien financier de l’association Biotrace : les biomatériaux, de la conception à l’application. 1er et 2 février 2027, Faculté des Sciences de Montpellier.",
  openGraph: {
    images: [{ url: "/images/congres/bio-innov-2027-affiche.jpg", width: 1086, height: 1524, alt: "Affiche Bio-Innov 2027" }],
  },
}

const iconesFormats = [Mic, Timer, Presentation]

function AVenir({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-lab-green-deep/40 bg-[#fffdf7]/70 p-6">
      <p className="titre-affiche text-2xl text-lab-green-deep">{children}</p>
      <p className="mt-2 text-ink-soft">
        Les informations seront publiées ici et sur{" "}
        <a href={site.reseaux.instagram} target="_blank" rel="noopener noreferrer" className="lien-bleu">
          notre Instagram<span className="sr-only"> (nouvel onglet)</span>
        </a>{" "}
        dès qu’elles seront confirmées.
      </p>
    </div>
  )
}

function TitreBloc({ numero, children, id }: { numero: string; children: React.ReactNode; id: string }) {
  return (
    <h2 id={id} className="titre-affiche flex items-baseline gap-4 text-4xl sm:text-5xl">
      <span className="etiquette shrink-0 rounded-full border-2 border-lab-green-deep px-2 py-0.5 text-lab-green-deep">{numero}</span>
      <span>{children}</span>
    </h2>
  )
}

export default function BioInnov2027() {
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: `${congres.nom} — ${congres.theme}`,
    description: `${congres.theme} : ${congres.sousTitre.toLowerCase()}. ${congres.mention}`,
    startDate: congres.datesCourtes.debut,
    endDate: congres.datesCourtes.fin,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      name: `${congres.lieu.nom} — ${congres.lieu.detail}`,
      address: { "@type": "PostalAddress", addressLocality: "Montpellier", addressCountry: "FR" },
    },
    image: [`${site.url}${congres.affiche.src}`],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }} />

      {/* En-tête animé */}
      <section aria-labelledby="titre-congres" className="relative isolate overflow-hidden border-b-[1.5px] border-ink bg-lab-green-deep text-[#f7f2e6]">
        <FondShaderVert className="absolute inset-0 -z-10" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-[#06301a]/90 via-[#06301a]/70 to-[#06301a]/20" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pt-10 pb-20 sm:px-6 lg:grid-cols-[1.35fr_1fr] lg:pt-14">
          <div>
            <Link href="/evenements" className="etiquette inline-flex items-center gap-2 text-[#f7f2e6]/80 hover:text-lab-lime">
              <ArrowLeft aria-hidden className="size-4" /> Retour aux événements
            </Link>
            <div className="mt-8 flex items-center gap-4">
              <BadgePulsant />
              <p className="etiquette text-lab-lime">Congrès scientifique · {congres.edition}</p>
            </div>
            <h1 id="titre-congres" className="titre-affiche mt-5 text-[clamp(3.5rem,10vw,8rem)] !text-[#f7f2e6]">
              {congres.nom}
            </h1>
            <p className="mt-3 text-[clamp(2rem,5vw,3.5rem)] leading-none font-black tracking-tight uppercase">
              <span className="rounded bg-lab-lime px-2 text-ink">{congres.theme}</span>
            </p>
            <p className="cadre-bleu mt-6 inline-block border-lab-lime px-4 py-2 text-lg font-semibold tracking-wide uppercase">
              {congres.sousTitre}
            </p>
            <p className="mt-6 max-w-xl text-lg text-[#f7f2e6]/90">{congres.mention}</p>
            <ul className="mt-8 flex flex-wrap gap-3">
              <li className="flex items-center gap-2 rounded-full border-[1.5px] border-lab-lime bg-[#06301a]/60 px-4 py-2 font-semibold">
                <CalendarDays aria-hidden className="size-4 text-lab-lime" /> {congres.dates}
              </li>
              <li className="flex items-center gap-2 rounded-full border-[1.5px] border-lab-lime bg-[#06301a]/60 px-4 py-2 font-semibold">
                <MapPin aria-hidden className="size-4 text-lab-lime" /> {congres.lieu.nom}
              </li>
            </ul>
            <div className="mt-8 flex flex-wrap gap-3">
              {congres.inscriptionUrl ? (
                <a href={congres.inscriptionUrl} target="_blank" rel="noopener noreferrer" className="bouton bouton-fluo">
                  S’inscrire <ArrowUpRight aria-hidden className="size-4" />
                  <span className="sr-only">(nouvel onglet)</span>
                </a>
              ) : null}
              <a href="#participer" className="bouton bouton-fluo">
                Participer au congrès
              </a>
              <a href="#programme" className="bouton border-[#f7f2e6] text-[#f7f2e6] hover:!shadow-[3px_3px_0_0_var(--lab-lime)]">
                Programme
              </a>
            </div>
          </div>
          <Reveal className="mx-auto w-full max-w-sm">
            <ImageZoom
              src={congres.affiche.src}
              alt={congres.affiche.alt}
              legende="Bio-Innov 2027 — affiche officielle"
              width={1086}
              height={1524}
              priority
              sizes="(min-width: 1024px) 384px, 85vw"
              className="rotate-[1.5deg] rounded-xl border-2 border-lab-lime shadow-[8px_8px_0_0_var(--lab-lime)]"
              imageClassName="h-auto w-full"
              label="Agrandir l’affiche"
            />
          </Reveal>
        </div>
      </section>

      <CompteARebours />

      <div className="bg-[linear-gradient(180deg,rgb(220_248_187/0.55),transparent_40%)]">
        <div className="mx-auto max-w-5xl space-y-24 px-4 py-20 sm:px-6">
          {/* Le thème */}
          <section aria-labelledby="theme" className="grid gap-10 md:grid-cols-[1.5fr_1fr]">
            <div>
              <TitreBloc numero="01" id="theme">
                Le thème : <span className="surligne">biomatériaux</span>
              </TitreBloc>
              <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
                <p>
                  Les biomatériaux sont des matériaux conçus pour interagir avec le vivant : remplacer ou réparer un tissu,
                  servir de support à la culture de cellules, libérer un médicament au bon endroit ou équiper un dispositif
                  médical.
                </p>
                <p>
                  Naturels ou synthétiques, ils mobilisent la biologie, la chimie, la physique et l’ingénierie. Avec le thème
                  « <strong className="text-ink">de la conception à l’application</strong> », cette 21e édition propose de
                  suivre leur parcours, du laboratoire jusqu’à leurs usages.
                </p>
              </div>
              <Link href="/biomateriaux" className="bouton bouton-noir mt-6">
                Explorer le thème en images <ArrowUpRight aria-hidden className="size-4" />
              </Link>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="carte relative w-full max-w-xs rotate-[2deg] bg-pole-vert p-6">
                <span className="scotch -top-3 left-1/2 -translate-x-1/2 -rotate-3" aria-hidden />
                <p className="font-hand text-3xl leading-tight font-bold text-lab-green-deep">
                  de l’idée au labo… et du labo à la vraie vie !
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <Molecule className="h-14 text-lab-green-deep" />
                  <Fiole className="h-14 text-lab-green-deep" />
                </div>
              </div>
            </div>
          </section>

          {/* Organisation */}
          <section aria-labelledby="organisation" className="rounded-[1.75rem] border-[1.5px] border-ink bg-[#fffdf7] p-6 sm:p-10">
            <TitreBloc numero="02" id="organisation">
              Qui organise ?
            </TitreBloc>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div className="flex flex-col rounded-2xl bg-pole-vert p-5">
                <div className="flex items-center gap-4">
                  <Image
                    src="/images/logos/ibion-tec.png"
                    alt="Logo du Master IBION-Tec"
                    width={430}
                    height={489}
                    className="h-20 w-auto rounded-xl bg-white p-1.5"
                  />
                  <div>
                    <p className="etiquette text-lab-green-deep">Organisateur</p>
                    <p className="mt-1 font-bold">Les étudiants du Master IBION-Tec</p>
                  </div>
                </div>
                <p className="mt-4 text-ink-soft">
                  Le congrès est organisé par les étudiants du Master IBION-Tec — Ingénierie Biomoléculaire &amp;
                  Nanobiotechnologies. Les éditions précédentes portaient le nom de « Congrès Biotrace ».
                </p>
              </div>
              <div className="flex flex-col rounded-2xl bg-paper-deep p-5">
                <div className="flex items-center gap-4">
                  <Image
                    src="/images/logos/biotrace.jpg"
                    alt="Logo de l’association Biotrace"
                    width={671}
                    height={457}
                    className="h-20 w-auto rounded-xl bg-white p-1.5"
                  />
                  <div>
                    <p className="etiquette text-lab-blue">Soutien financier</p>
                    <p className="mt-1 font-bold">L’association Biotrace</p>
                  </div>
                </div>
                <p className="mt-4 text-ink-soft">
                  L’association étudiante du master aide à financer le congrès et relaie ses informations sur ce site et sur
                  ses réseaux.
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border-[1.5px] border-dashed border-ink/30 p-5">
              <p className="etiquette text-ink-soft">Au sein de</p>
              <ul className="mt-4 flex flex-wrap items-center gap-x-10 gap-y-6">
                <li>
                  <Image
                    src="/images/logos/faculte-des-sciences.webp"
                    alt="Faculté des Sciences de Montpellier"
                    width={2000}
                    height={811}
                    className="h-16 w-auto mix-blend-multiply sm:h-20"
                  />
                </li>
                <li>
                  <Image
                    src="/images/logos/universite-montpellier.png"
                    alt="Université de Montpellier"
                    width={808}
                    height={295}
                    className="h-14 w-auto mix-blend-multiply sm:h-16"
                  />
                </li>
              </ul>
            </div>
          </section>

          {/* Programme */}
          <section id="programme" aria-labelledby="titre-programme">
            <TitreBloc numero="03" id="titre-programme">
              Programme
            </TitreBloc>
            <p className="mt-4 text-lg text-ink-soft">Formats annoncés sur l’affiche officielle :</p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-3">
              {congres.formats.map((f, i) => {
                const Icone = iconesFormats[i] ?? Mic
                return (
                  <RevealItem key={f.titre} delay={i * 0.06} className="carte p-5">
                    <span className="flex size-12 items-center justify-center rounded-full border-[1.5px] border-ink bg-lab-lime">
                      <Icone aria-hidden className="size-6" />
                    </span>
                    <p className="mt-4 text-lg font-bold">{f.titre}</p>
                    <p className="mt-1 text-ink-soft">{f.texte}</p>
                  </RevealItem>
                )
              })}
            </ul>
            <div className="mt-6">
              {congres.programme.length > 0 ? (
                <ol className="divide-y divide-dashed divide-ink/25 rounded-2xl border-[1.5px] border-ink bg-[#fffdf7]">
                  {congres.programme.map((c) => (
                    <li key={`${c.jour}-${c.horaire}`} className="grid gap-1 p-4 sm:grid-cols-[10rem_1fr]">
                      <span className="etiquette flex items-center gap-2 text-lab-green-deep">
                        <Clock aria-hidden className="size-4" /> {c.jour} · {c.horaire}
                      </span>
                      <span>
                        <span className="font-bold">{c.titre}</span>
                        {c.intervenant && <span className="block text-ink-soft">{c.intervenant}</span>}
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                <AVenir>Programme à venir</AVenir>
              )}
            </div>
          </section>

          {/* Intervenants */}
          <section aria-labelledby="intervenants">
            <TitreBloc numero="04" id="intervenants">
              Intervenants
            </TitreBloc>
            <div className="mt-6">
              {congres.intervenants.length > 0 ? (
                <TeamMarquee
                  title={null}
                  description={null}
                  members={congres.intervenants.map((p) => ({
                    name: p.nom,
                    role: [p.titre, p.structure].filter(Boolean).join(" · "),
                    image: p.photo,
                    alt: `Portrait de ${p.nom}`,
                  }))}
                  fadeColor="var(--paper)"
                  className="!bg-transparent !py-4"
                  cardClassName="w-52"
                  imageWrapperClassName="h-72 rounded-2xl border-[1.5px] border-ink bg-pole-vert"
                  imageClassName="object-top"
                  captionClassName="m-2 w-[calc(100%-1rem)] rounded-xl border-[1.5px] border-ink bg-[#fffdf7]/95"
                  imageSizes="208px"
                />
              ) : (
                <AVenir>Intervenants annoncés prochainement</AVenir>
              )}
            </div>
          </section>

          {/* Infos pratiques */}
          {/* Inscriptions : « ouvrent bientôt » tant que congres.inscriptionUrl est vide (content/congres.ts) */}
          <InscriptionsCongres />

          <section aria-labelledby="infos" className="grid gap-8 md:grid-cols-2">
            <div>
              <TitreBloc numero="05" id="infos">
                Infos pratiques
              </TitreBloc>
              <dl className="mt-6 space-y-4">
                <div className="flex gap-3">
                  <dt>
                    <CalendarDays aria-hidden className="mt-0.5 size-5 text-lab-green-deep" />
                    <span className="sr-only">Dates</span>
                  </dt>
                  <dd className="font-semibold">{congres.dates}</dd>
                </div>
                <div className="flex gap-3">
                  <dt>
                    <MapPin aria-hidden className="mt-0.5 size-5 text-lab-green-deep" />
                    <span className="sr-only">Lieu</span>
                  </dt>
                  <dd>
                    <span className="font-semibold">{congres.lieu.nom}</span>
                    <br />
                    {congres.lieu.detail}, {congres.lieu.ville}
                  </dd>
                </div>
                <div className="flex gap-3">
                  <dt>
                    <Clock aria-hidden className="mt-0.5 size-5 text-lab-green-deep" />
                    <span className="sr-only">Horaires</span>
                  </dt>
                  <dd className="text-ink-soft">Horaires à venir</dd>
                </div>
              </dl>
            </div>

            {/* Participation */}
            <div id="participer" className="carte bg-pole-vert p-6 sm:p-8">
              <h2 className="titre-affiche text-3xl">
                <span className="surligne">Participer</span>
              </h2>
              <p className="mt-4">
                Les modalités de participation et d’inscription seront précisées avec le programme. En attendant, une question
                sur le congrès ? Écrivez-nous.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {congres.inscriptionUrl && (
                  <a href={congres.inscriptionUrl} target="_blank" rel="noopener noreferrer" className="bouton bouton-noir">
                    S’inscrire <ArrowUpRight aria-hidden className="size-4" />
                    <span className="sr-only">(nouvel onglet)</span>
                  </a>
                )}
                <a href={`mailto:${site.email}?subject=Bio%20Innov%202027`} className="bouton bouton-noir">
                  <Mail aria-hidden className="size-4" /> Poser une question
                </a>
              </div>
              {congres.siteOfficielActif ? (
                <a href={congres.siteOfficiel} target="_blank" rel="noopener noreferrer" className="lien-bleu mt-5 inline-flex items-center gap-1 font-semibold">
                  Site officiel du congrès <ArrowUpRight aria-hidden className="size-4" />
                  <span className="sr-only">(nouvel onglet)</span>
                </a>
              ) : null}
            </div>
          </section>

          {/* Partenaires */}
          <section aria-labelledby="partenaires">
            <TitreBloc numero="06" id="partenaires">
              Partenaires
            </TitreBloc>
            <div className="mt-6">
              {congres.partenaires.length > 0 ? (
                <>
                  {/* Logos en défilement continu (d'après infinite-slider.tsx), ralenti au survol */}
                  <InfiniteSlider
                    label="Partenaires du congrès Bio-Innov 2027"
                    gap={56}
                    duration={30}
                    durationOnHover={60}
                    className="rounded-2xl bg-[#fffdf7]/80 py-8 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
                  >
                    {[...congres.partenaires, ...congres.partenaires].map((p, i) => (
                      <li key={`${p.nom}-${i}`} className="flex shrink-0 items-center px-2">
                        {p.logo ? (
                          <Image
                            src={p.logo.src}
                            alt={`Logo ${p.nom}`}
                            width={p.logo.largeur}
                            height={p.logo.hauteur}
                            sizes="240px"
                            className="h-16 w-auto object-contain sm:h-20"
                          />
                        ) : (
                          <span className="font-semibold">{p.nom}</span>
                        )}
                      </li>
                    ))}
                  </InfiniteSlider>
                  <p className="mt-4 text-sm text-ink-soft">
                    Merci à nos partenaires pour leur soutien. Vous souhaitez soutenir le congrès ?{" "}
                    <a href={`mailto:${site.email}?subject=Partenariat%20Bio-Innov%202027`} className="lien-bleu font-semibold">
                      Contactez-nous
                    </a>
                    .
                  </p>
                </>
              ) : (
                <div className="flex items-start gap-3 rounded-2xl border-2 border-dashed border-lab-green-deep/40 bg-[#fffdf7]/70 p-6">
                  <Handshake aria-hidden className="mt-0.5 size-6 shrink-0 text-lab-green-deep" />
                  <p className="text-ink-soft">
                    La liste des partenaires confirmés sera publiée prochainement. Vous souhaitez soutenir le congrès ?{" "}
                    <a href={`mailto:${site.email}?subject=Partenariat%20Bio%20Innov%202027`} className="lien-bleu font-semibold">
                      Contactez-nous
                    </a>
                    .
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Archives */}
          <section aria-labelledby="archives-congres" className="rounded-[1.75rem] border-[1.5px] border-ink bg-ink p-6 text-[#f7f2e6] sm:p-10">
            <FileText aria-hidden className="size-7 text-lab-lime" />
            <h2 id="archives-congres" className="titre-affiche mt-3 text-3xl !text-[#f7f2e6] sm:text-4xl">
              Les éditions précédentes
            </h2>
            <p className="mt-3 max-w-2xl text-[#f7f2e6]/85">
              Biotechnologies bleues, conquête spatiale, microbiotechnologies… Retrouvez les affiches des anciennes éditions
              dans nos archives.
            </p>
            <Link href="/evenements#archives" className="bouton bouton-fluo mt-6">
              Voir les archives
            </Link>
          </section>
        </div>
      </div>
    </>
  )
}
