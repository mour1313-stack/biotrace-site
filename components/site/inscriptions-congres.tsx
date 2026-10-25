"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode"
import { ArrowUpRight, Download, FlaskConical } from "lucide-react"
import { congres } from "@/content/congres"
import { site } from "@/content/site"
import { cn } from "@/lib/utils"

/**
 * Inscriptions au congrès Bio-Innov 2027 (page du congrès).
 *
 * Tant que `congres.inscriptionUrl` vaut null (content/congres.ts) : message « Les inscriptions
 * ouvrent bientôt ! » avec une animation discrète.
 * Dès qu'un lien y est collé : QR code scannable (fond blanc, téléchargeable en PNG et SVG)
 * et bouton « S'inscrire au congrès », vers ce même lien. Rien d'autre à modifier.
 */
export function InscriptionsCongres({ className }: { className?: string }) {
  const lien = congres.inscriptionUrl

  return (
    <section
      id="inscriptions"
      aria-labelledby="titre-inscriptions"
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] border-[1.5px] border-ink bg-[#fffdf7] p-6 sm:p-10",
        className,
      )}
    >
      {/* Quadrillage de cahier, très léger */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] [background-size:24px_24px]"
      />
      <div className="relative">{lien ? <Ouvertes lien={lien} /> : <Bientot />}</div>
    </section>
  )
}

/** Avant l'ouverture : message et animation discrète (respecte « réduire les animations »). */
function Bientot() {
  return (
    <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
      <div>
        <p className="etiquette flex items-center gap-2 text-lab-blue">
          <span aria-hidden className="relative flex size-2.5">
            <span className="absolute inline-flex size-full rounded-full bg-lab-lime opacity-75 motion-safe:animate-ping" />
            <span className="relative inline-flex size-2.5 rounded-full border border-ink bg-lab-lime" />
          </span>
          Inscriptions · {congres.nom}
        </p>
        <h2 id="titre-inscriptions" className="titre-affiche mt-3 text-4xl sm:text-5xl">
          Les inscriptions <span className="surligne surligne-anime">ouvrent bientôt !</span>
        </h2>
        <p className="mt-4 max-w-xl text-ink-soft">
          Le formulaire officiel sera mis en ligne ici dès l’ouverture, avec un QR code pour s’inscrire en un instant.
          D’ici là, suivez nos annonces sur{" "}
          <a href={site.reseaux.instagram} target="_blank" rel="noopener noreferrer" className="lien-bleu">
            Instagram<span className="sr-only"> (nouvel onglet)</span>
          </a>
          .
        </p>
      </div>

      {/* Petite fiole qui fait des bulles, en clin d'œil au laboratoire */}
      <div aria-hidden className="relative mx-auto h-36 w-28 md:mx-0">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="bulle absolute bottom-16 size-2.5 rounded-full border border-ink bg-lab-lime motion-reduce:hidden"
            style={{ left: `${38 + i * 9}%`, animationDelay: `${i * 0.9}s` }}
          />
        ))}
        <FlaskConical className="absolute bottom-0 left-1/2 size-24 -translate-x-1/2 text-ink" strokeWidth={1.25} />
      </div>
    </div>
  )
}

/** Après l'ouverture : QR code + bouton vers le même lien. */
function Ouvertes({ lien }: { lien: string }) {
  const [svg, setSvg] = useState<string | null>(null)

  useEffect(() => {
    let actif = true
    QRCode.toString(lien, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 2,
      color: { dark: "#161616", light: "#ffffff" },
    }).then((code) => actif && setSvg(code))
    return () => {
      actif = false
    }
  }, [lien])

  const telecharger = async (format: "png" | "svg") => {
    const a = document.createElement("a")
    if (format === "png") {
      a.href = await QRCode.toDataURL(lien, {
        errorCorrectionLevel: "M",
        margin: 4,
        width: 1200,
        color: { dark: "#161616", light: "#ffffff" },
      })
    } else {
      const code = await QRCode.toString(lien, { type: "svg", errorCorrectionLevel: "M", margin: 4 })
      a.href = URL.createObjectURL(new Blob([code], { type: "image/svg+xml" }))
    }
    a.download = `qr-inscription-bio-innov-2027.${format}`
    a.click()
    if (format === "svg") URL.revokeObjectURL(a.href)
  }

  return (
    <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
      <div>
        <p className="etiquette flex items-center gap-2 text-lab-blue">
          <span aria-hidden className="size-2.5 rounded-full border border-ink bg-lab-lime" />
          Inscriptions ouvertes · {congres.nom}
        </p>
        <h2 id="titre-inscriptions" className="titre-affiche mt-3 text-4xl sm:text-5xl">
          Inscrivez-vous au <span className="surligne">congrès</span>
        </h2>
        <p className="mt-4 max-w-xl text-ink-soft">
          {congres.dates} · {congres.lieu.nom}.
        </p>
      </div>

      <figure className="mx-auto flex w-64 flex-col items-center text-center md:mx-0">
        <figcaption className="etiquette mb-3 text-ink">Scannez pour vous inscrire au congrès</figcaption>
        <div
          role="img"
          aria-label={`QR code menant au formulaire d’inscription : ${lien}`}
          className="aspect-square w-full rounded-xl border-[1.5px] border-ink bg-white p-3 shadow-[3px_3px_0_0_var(--ink)] [&_svg]:h-full [&_svg]:w-full"
          // SVG produit par la bibliothèque qrcode à partir du lien du congrès (aucune donnée saisie par un visiteur).
          dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
        />
        {/* Bouton sous le QR code : sur téléphone, on peut s'inscrire d'un simple appui. */}
        <a href={lien} target="_blank" rel="noopener noreferrer" className="bouton bouton-noir mt-5">
          S’inscrire au congrès <ArrowUpRight aria-hidden className="size-4" />
          <span className="sr-only">(nouvel onglet)</span>
        </a>
        <div className="mt-3 flex gap-4 text-sm">
          <button type="button" onClick={() => telecharger("png")} className="lien-bleu inline-flex items-center gap-1">
            <Download aria-hidden className="size-3.5" /> PNG
          </button>
          <button type="button" onClick={() => telecharger("svg")} className="lien-bleu inline-flex items-center gap-1">
            <Download aria-hidden className="size-3.5" /> SVG
          </button>
        </div>
      </figure>
    </div>
  )
}
