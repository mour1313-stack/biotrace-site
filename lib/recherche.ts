/**
 * Index de recherche du site, construit uniquement à partir des fichiers de /content :
 * mettre à jour le contenu met donc automatiquement la recherche à jour.
 */
import { congres } from "@/content/congres"
import { promotionActuelle } from "@/content/equipe"
import { archivesCongres, evenements } from "@/content/evenements"
import { missions, navigation, site } from "@/content/site"

export type ResultatRecherche = {
  titre: string
  extrait: string
  href: string
  type: "Page" | "Mission" | "Équipe" | "Pôle" | "Événement" | "Archives"
  /** Texte supplémentaire pris en compte pour la recherche, non affiché. */
  motsCles?: string
}

const descriptionsPages: Record<string, string> = {
  "/": site.accroche,
  "/association": "Qui sommes-nous, nos missions et le Master IBION-Tec.",
  "/equipe": `${promotionActuelle.titre} — équipe ${promotionActuelle.annee}, le bureau et les quatre pôles.`,
  "/bio-innov-2027": `${congres.theme} — ${congres.dates}, ${congres.lieu.nom}.`,
  "/evenements": "Événements à venir, archives du congrès et galerie photo.",
  "/contact": `Écrire à l’association : ${site.email}.`,
}

const index: ResultatRecherche[] = [
  ...navigation.map(({ label, href }) => ({
    titre: label,
    extrait: descriptionsPages[href] ?? "",
    href,
    type: "Page" as const,
  })),
  {
    titre: "Les biomatériaux en images",
    extrait: "Le thème de Bio-Innov 2027 présenté en images.",
    href: "/biomateriaux",
    type: "Page",
    motsCles: "biomateriaux theme globe",
  },
  {
    titre: "Mentions légales",
    extrait: "Éditeur du site, hébergement et confidentialité.",
    href: "/mentions-legales",
    type: "Page",
    motsCles: "confidentialite donnees",
  },
  ...missions.map((m) => ({ titre: m.titre, extrait: m.texte, href: "/association", type: "Mission" as const })),
  ...promotionActuelle.poles.map((p) => ({
    titre: `Pôle ${p.nom}`,
    extrait: p.mission,
    href: `/equipe#pole-${p.id}`,
    type: "Pôle" as const,
    motsCles: [p.accroche, ...p.motsCles, ...p.membres.map((m) => m.nom)].join(" "),
  })),
  ...promotionActuelle.poles.flatMap((p) =>
    p.membres.map((m) => ({
      titre: m.nom,
      extrait: [m.fonction, `Pôle ${p.nom}`].filter(Boolean).join(" · "),
      href: `/equipe#pole-${p.id}`,
      type: "Équipe" as const,
    })),
  ),
  ...evenements.map((e) => ({
    titre: e.titre,
    extrait: [e.date, e.description].filter(Boolean).join(" — "),
    href: e.lien?.href.startsWith("/") ? e.lien.href : "/evenements",
    type: "Événement" as const,
    motsCles: [e.categorie, e.lieu].filter(Boolean).join(" "),
  })),
  ...archivesCongres.map((e) => ({
    titre: `Congrès ${e.annee}${e.edition ? ` (${e.edition})` : ""}`,
    extrait: e.theme,
    href: "/evenements#archives",
    type: "Archives" as const,
    motsCles: [e.date, e.lieu].filter(Boolean).join(" "),
  })),
]

/** Minuscules, sans accents ni ponctuation, pour une recherche tolérante. */
function normaliser(texte: string) {
  return texte
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
}

const indexNormalise = index.map((r) => ({
  r,
  titre: normaliser(r.titre),
  tout: normaliser(`${r.titre} ${r.extrait} ${r.type} ${r.motsCles ?? ""}`),
}))

/** Tous les mots de la requête doivent être trouvés ; les correspondances dans le titre passent en premier. */
export function rechercher(requete: string, limite = 8): ResultatRecherche[] {
  const mots = normaliser(requete).split(" ").filter(Boolean)
  if (mots.length === 0) return []
  return indexNormalise
    .filter(({ tout }) => mots.every((m) => tout.includes(m)))
    .map((e) => ({
      r: e.r,
      score: mots.reduce((s, m) => s + (e.titre.startsWith(m) ? 3 : e.titre.includes(m) ? 2 : 0), 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limite)
    .map(({ r }) => r)
}
