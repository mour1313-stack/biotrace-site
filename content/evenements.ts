/**
 * Événements, archives du congrès et galerie.
 *
 * Règle : n'indiquez une date ou un lieu que s'ils sont confirmés.
 * Laissez `date` vide sinon : la carte affichera « Date à venir ».
 * Un événement est classé « à venir » ou « passé » selon `statut`.
 */

export type Categorie = "Congrès scientifique" | "Vie associative" | "Action étudiante"

export type Evenement = {
  id: string
  titre: string
  categorie: Categorie
  statut: "a-venir" | "passe" | "recurrent"
  date?: string
  lieu?: string
  description: string
  image?: { src: string; alt: string }
  /** Lien vers les détails (page interne ou externe vérifiée). */
  lien?: { href: string; label: string }
}

export const evenements: Evenement[] = [
  {
    id: "bio-innov-2027",
    titre: "Bio-Innov 2027 — Biomatériaux",
    categorie: "Congrès scientifique",
    statut: "a-venir",
    date: "1er et 2 février 2027",
    lieu: "Faculté des Sciences de Montpellier — Campus Triolet, bâtiment 36",
    description:
      "21e édition du congrès scientifique organisé par les étudiants du Master IBION-Tec — l’association Biotrace aide à le financer. Thème : les biomatériaux, de la conception à l’application.",
    image: {
      src: "/images/congres/bio-innov-2027-affiche.jpg",
      alt: "Affiche du congrès Bio-Innov 2027 sur les biomatériaux, les 1er et 2 février 2027 à la Faculté des Sciences de Montpellier.",
    },
    lien: { href: "/bio-innov-2027", label: "Découvrir le congrès" },
  },
  {
    id: "crepes-gaufres",
    titre: "Ventes de crêpes et de gaufres",
    categorie: "Action étudiante",
    statut: "recurrent",
    description:
      "Des ventes gourmandes pour faire vivre l’association… et s’offrir une pause sucrée entre deux TP. Les prochaines dates sont annoncées sur notre Instagram.",
    image: {
      src: "/images/vie-associative/foodtruck-equipe-sourires.jpg",
      alt: "Quatre membres de Biotrace sourient derrière le comptoir du food truck Food’Sciences, pendant une vente de crêpes et de gaufres.",
    },
    lien: { href: "https://www.instagram.com/biotrace_mtp/", label: "Suivre les annonces sur Instagram" },
  },
]

/** Archives du congrès, d’après les affiches officielles des éditions précédentes. */
export type EditionCongres = {
  annee: string
  edition?: string
  theme: string
  date: string
  lieu?: string
  affiche: string
}

export const archivesCongres: EditionCongres[] = [
  {
    annee: "2026",
    edition: "20e édition",
    theme: "Voyage vers un futur guidé par les biotechnologies",
    date: "2 et 3 février 2026",
    lieu: "Amphithéâtre 36.01",
    affiche: "/images/archives/congres-2026.jpg",
  },
  {
    annee: "2024",
    edition: "19e édition",
    theme: "Plongée au cœur des biotechnologies bleues",
    date: "30 et 31 janvier 2024",
    lieu: "Amphithéâtre 36.01, bâtiment 36 — Faculté des Sciences de Montpellier",
    affiche: "/images/archives/congres-2024.jpg",
  },
  {
    annee: "2023",
    edition: "18e édition",
    theme: "La place des biotechnologies dans la conquête spatiale",
    date: "7 et 8 février 2023",
    lieu: "Faculté des Sciences de Montpellier — bâtiment 36, amphithéâtre 36.01",
    affiche: "/images/archives/congres-2023.jpg",
  },
  {
    annee: "2022",
    edition: "17e édition",
    theme: "La valorisation du vivant, vectrice d’innovations technologiques et industrielles",
    date: "1er et 2 février 2022",
    lieu: "En ligne, sur ClickMeeting",
    affiche: "/images/archives/congres-2022.jpg",
  },
  {
    annee: "2021",
    edition: "16e édition",
    theme: "Les « microbiotechnologies », des outils au carrefour des sciences innovantes",
    date: "10 et 11 février 2021",
    lieu: "En ligne, sous forme de webinaire",
    affiche: "/images/archives/congres-2021.jpg",
  },
  {
    annee: "2020",
    edition: "15e édition",
    theme: "Révolution biologique : vers un homme augmenté au cœur d’une planète dépolluée",
    date: "12 et 13 février 2020",
    lieu: "Amphithéâtre Serge Peytavin, Polytech",
    affiche: "/images/archives/congres-2020.jpg",
  },
  {
    annee: "2019",
    theme: "Biotechnologies : de l’innovation au dispositif pour la santé et l’environnement",
    date: "7 février 2019",
    lieu: "Amphithéâtre Serge Peytavin, Polytech bâtiment 31",
    affiche: "/images/archives/congres-2019.jpg",
  },
]

export type CategorieGalerie = "Congrès" | "Équipe" | "Stands & vie associative"

export type ImageGalerie = {
  src: string
  alt: string
  legende: string
  categorie: CategorieGalerie
}

const fichesEquipe: ImageGalerie[] = [
  ["bureau", "Le bureau"],
  ["administration", "Pôle Administration"],
  ["tresorerie", "Pôle Trésorerie"],
  ["communication", "Pôle Communication"],
  ["evenementiel", "Pôle Événementiel"],
].map(([fichier, nom]) => ({
  src: `/images/equipe/2026-2027/${fichier}-affiche.jpg`,
  alt: `Affiche de présentation « ${nom} » de l’équipe Biotrace 2026–2027, avec les portraits et les noms des membres.`,
  legende: `${nom} — équipe 2026–2027`,
  categorie: "Équipe" as const,
}))

export const galerie: ImageGalerie[] = [
  {
    src: "/images/congres/bio-innov-2027-affiche.jpg",
    alt: "Affiche officielle de Bio-Innov 2027 : biomatériaux, de la conception à l’application, 1er et 2 février 2027.",
    legende: "Bio-Innov 2027 — affiche officielle",
    categorie: "Congrès",
  },
  {
    src: "/images/equipe/2026-2027/bureau-photo-equipe-hd.jpg",
    alt: "Photo de groupe du bureau Biotrace 2026–2027.",
    legende: "Le bureau 2026–2027",
    categorie: "Équipe",
  },
  {
    src: "/images/equipe/2026-2027/equipe-complete.jpg",
    alt: "Photo de groupe de l’équipe Biotrace 2026–2027 devant le logo de l’Université de Montpellier.",
    legende: "L’équipe 2026–2027",
    categorie: "Équipe",
  },
  {
    src: "/images/equipe/2026-2027/equipe-escalier.jpg",
    alt: "L’équipe Biotrace 2026–2027 assise sur les gradins en bois d’un hall de la faculté.",
    legende: "L’équipe 2026–2027, sur les gradins",
    categorie: "Équipe",
  },
  {
    src: "/images/equipe/2026-2027/communication-photo.jpg",
    alt: "Les quatre membres du pôle Communication 2026–2027 devant le logo de l’Université de Montpellier.",
    legende: "Pôle Communication — 2026–2027",
    categorie: "Équipe",
  },
  {
    src: "/images/equipe/2026-2027/administration-photo.jpg",
    alt: "Les quatre membres du pôle Administration 2026–2027 devant le logo de l’Université de Montpellier.",
    legende: "Pôle Administration — 2026–2027",
    categorie: "Équipe",
  },
  {
    src: "/images/equipe/2026-2027/evenementiel-photo.jpg",
    alt: "Les deux membres du pôle Événementiel 2026–2027 devant le logo de l’Université de Montpellier.",
    legende: "Pôle Événementiel — 2026–2027",
    categorie: "Équipe",
  },
  {
    src: "/images/equipe/2026-2027/tresorerie-photo.jpg",
    alt: "Les trois membres du pôle Trésorerie 2026–2027 devant le logo de l’Université de Montpellier.",
    legende: "Pôle Trésorerie — 2026–2027",
    categorie: "Équipe",
  },
  ...fichesEquipe,
  ...[
    ["foodtruck-equipe-sourires", "Au food truck Food’Sciences : quatre membres de Biotrace sourient derrière le comptoir de la vente de crêpes.", "Vente de crêpes au food truck"],
    ["foodtruck-soiree-congres", "Le food truck Food’Sciences éclairé en fin de journée, pendant le 20e congrès : l’équipe sert des crêpes et des gaufres à la file d’attente.", "Le food truck pendant le congrès 2026"],
    ["foodtruck-service", "L’équipe Biotrace en plein service au food truck, devant l’affiche du 20e congrès.", "En plein service"],
    ["foodtruck-journee", "Le food truck Food’Sciences sur le campus de la Faculté des Sciences, avec trois membres de Biotrace au comptoir.", "Une journée crêpes sur le campus"],
    ["foodtruck-preparation-rires", "Fous rires et préparation des crêpes à l’intérieur du food truck Food’Sciences, vu de côté.", "Préparation des crêpes"],
    ["bon-crepe-gratuite-congres", "Le livret du 20e congrès et un « bon pour une crêpe gratuite » au food truck Biotrace, posés sur un tote bag Biotrace.", "Bon pour une crêpe gratuite — congrès 2026"],
  ].map(([fichier, alt, legende]) => ({
    src: `/images/vie-associative/${fichier}.jpg`,
    alt,
    legende,
    categorie: "Stands & vie associative" as const,
  })),
  ...archivesCongres.map((e) => ({
    src: e.affiche,
    alt: `Affiche du congrès ${e.annee} : ${e.theme}.`,
    legende: `Congrès ${e.annee}${e.edition ? ` (${e.edition})` : ""}`,
    categorie: "Congrès" as const,
  })),
  {
    src: "/images/equipe/2025-2026/bureau-2025-2026.jpg",
    alt: "Trombinoscope de l’équipe Biotrace 2025–2026.",
    legende: "L’équipe 2025–2026",
    categorie: "Équipe",
  },
]
