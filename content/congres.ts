/**
 * Bio-Innov 2027.
 *
 * Tant qu'une information n'est pas confirmée, laissez la liste vide :
 * le site affichera « Programme à venir » / « Annonce à venir ».
 */

export type Intervenant = { nom: string; titre: string; structure?: string; photo?: string }
export type Creneau = { jour: string; horaire: string; titre: string; intervenant?: string }
export type Partenaire = {
  nom: string
  /** Logo (chemin depuis /public) et ses dimensions d'origine, en pixels. */
  logo?: { src: string; largeur: number; hauteur: number }
  url?: string
}

export const congres = {
  nom: "Bio-Innov 2027",
  edition: "21e édition",
  theme: "Biomatériaux",
  sousTitre: "De la conception à l’application",
  dates: "1er et 2 février 2027",
  datesCourtes: { debut: "2027-02-01", fin: "2027-02-02" },
  /**
   * Compte à rebours (heure de Paris). L'heure d'ouverture n'est pas encore connue :
   * minuit le 1er février par défaut — à remplacer par l'heure réelle (ex. "2027-02-01T09:00:00+01:00").
   */
  compteARebours: {
    debut: "2027-02-01T00:00:00+01:00",
    fin: "2027-02-03T00:00:00+01:00",
  },
  lieu: {
    nom: "Faculté des Sciences de Montpellier",
    detail: "Campus Triolet — bâtiment 36",
    ville: "Montpellier",
  },
  mention: "Congrès scientifique organisé par les étudiants du Master IBION-Tec, avec le soutien financier de l’association Biotrace.",
  affiche: {
    src: "/images/congres/bio-innov-2027-affiche.jpg",
    alt: "Affiche officielle du congrès Bio-Innov 2027, 21e édition, sur les biomatériaux : de la conception à l’application. 1er et 2 février 2027, Faculté des Sciences, Campus Triolet, bâtiment 36, Montpellier. Conférences, thèse en 180 secondes, posters.",
  },
  /** Formats annoncés sur l'affiche officielle. */
  formats: [
    { titre: "Conférences", texte: "Des interventions autour des biomatériaux." },
    { titre: "Thèse en 180 secondes", texte: "Des travaux de recherche présentés en trois minutes chrono." },
    { titre: "Posters", texte: "Une session de présentation de posters scientifiques." },
  ],
  programme: [] as Creneau[],
  intervenants: [] as Intervenant[],
  /** Partenaires confirmés : logos fournis par l'association (dossier public/images/partenaires). */
  partenaires: [
    { nom: "Bio-MV", logo: { src: "/images/partenaires/bio-mv.png", largeur: 204, hauteur: 204 } },
    { nom: "Bio-BE", logo: { src: "/images/partenaires/bio-be.png", largeur: 200, hauteur: 200 } },
    {
      nom: "Montpellier Méditerranée Métropole et Ville de Montpellier",
      logo: { src: "/images/partenaires/montpellier-metropole.png", largeur: 760, hauteur: 408 },
    },
  ] as Partenaire[],
  /**
   * Lien du formulaire officiel d'inscription : à renseigner uniquement lorsqu'il est actif.
   * Tant qu'il vaut null, la page du congrès affiche « Les inscriptions ouvrent bientôt ! ».
   * Dès qu'il est collé ici (ex. "https://…"), le QR code, le bouton « S'inscrire au congrès »
   * et les boutons « S'inscrire » de la page apparaissent automatiquement.
   */
  inscriptionUrl: null as string | null,
  /**
   * Site du congrès indiqué sur l'affiche. Au 19 octobre 2026, ce domaine ne répond plus :
   * passez `siteOfficielActif` à true une fois le site de nouveau en ligne.
   */
  siteOfficiel: "https://www.congres-biotrace.org/",
  siteOfficielActif: false,
}
