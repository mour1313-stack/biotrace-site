/**
 * Équipe Biotrace.
 *
 * Nouvelle année : dupliquez l’objet de `promotionActuelle`, mettez-le à jour,
 * puis déplacez l’ancienne promotion dans `promotionsArchivees`
 * (une photo de groupe suffit pour l’archive).
 * Les photos se rangent dans /public/images/equipe/<année>/.
 */

export type Membre = {
  nom: string
  /** Laisser vide si aucune fonction n'est indiquée. */
  fonction?: string
  /** Chemin depuis /public. Sans photo, une carte avec initiales s'affiche. */
  photo?: string
  /** Adresse du profil LinkedIn (facultatif) : une icône cliquable s'affiche à côté du nom. */
  linkedin?: string
}

export type Pole = {
  id: string
  nom: string
  /** Couleur de fond du pôle (classe CSS définie dans globals.css). */
  couleur: "violet" | "orange" | "rose" | "jaune" | "vert"
  mission: string
  accroche: string
  motsCles: string[]
  /** Fiche d'origine du pôle (affiche), consultable en grand. */
  affiche?: string
  membres: Membre[]
}

export type Promotion = {
  annee: string
  titre: string
  sousTitre: string
  bureau: {
    photo: string
    alt: string
    accroche: string
    motsCles: string[]
    affiche?: string
  }
  poles: Pole[]
}

const dossier = "/images/equipe/2026-2027"

export const promotionActuelle: Promotion = {
  annee: "2026–2027",
  titre: "Les visages de Biotrace",
  sousTitre: "Une équipe, quatre pôles, des projets plein la tête !",
  bureau: {
    photo: `${dossier}/bureau-photo-equipe-hd.jpg`,
    alt: "Photo de groupe du bureau Biotrace 2026–2027 : huit membres posent ensemble devant le logo de l’Université de Montpellier.",
    accroche: "Des projets plein la tête, des cernes sous les yeux !",
    motsCles: ["Leadership", "Responsabilité", "Organisation"],
    affiche: `${dossier}/bureau-affiche.jpg`,
  },
  poles: [
    {
      id: "administration",
      nom: "Administration",
      couleur: "violet",
      mission: "Coordonner les équipes et assurer le suivi des projets.",
      accroche: "On garde le cap… et les dossiers !",
      motsCles: ["Collaboration", "Entraide", "Coordination", "Réactivité"],
      affiche: `${dossier}/administration-affiche.jpg`,
      membres: [
        { nom: "Egida Saja", fonction: "Présidente", photo: `${dossier}/administration-egida-saja-hd.jpg`, linkedin: "https://www.linkedin.com/in/egida-saja/" },
        { nom: "Théo Morel", fonction: "Vice-président", photo: `${dossier}/administration-theo-morel-hd.jpg`, linkedin: "https://www.linkedin.com/in/theo-morel-385a12260/" },
        { nom: "Matéo Lefebvre", fonction: "Vice-président", photo: `${dossier}/administration-mateo-lefebvre-hd.jpg`, linkedin: "https://www.linkedin.com/in/mateo-lefebvre-84240536b/" },
        { nom: "Léa Galinier", fonction: "Secrétaire", photo: `${dossier}/administration-lea-galinier-hd.jpg`, linkedin: "https://www.linkedin.com/in/l%C3%A9a-galinier-051294355/" },
      ],
    },
    {
      id: "tresorerie",
      nom: "Trésorerie",
      couleur: "orange",
      mission: "Veiller à la bonne gestion financière de l’association.",
      accroche: "Chaque euro compte… et on les compte tous !",
      motsCles: ["Budget", "Comptabilité", "Rigueur", "Anticipation"],
      affiche: `${dossier}/tresorerie-affiche.jpg`,
      membres: [
        { nom: "Gatien Fosset", fonction: "Responsable", photo: `${dossier}/tresorerie-gatien-fosset-hd.jpg`, linkedin: "https://www.linkedin.com/in/gatien-fosset/" },
        { nom: "Sacha Ouakil", photo: `${dossier}/tresorerie-sacha-ouakil-hd.jpg`, linkedin: "https://www.linkedin.com/in/sacha-ouakil-58910436b/" },
        { nom: "Jean-Nicolas Taboada", photo: `${dossier}/tresorerie-jean-nicolas-taboada-hd.jpg`, linkedin: "https://www.linkedin.com/in/jean-nicolas-taboada-79a9ba332/" },
      ],
    },
    {
      id: "communication",
      nom: "Communication",
      couleur: "rose",
      mission:
        "Faire connaître Biotrace et valoriser ses actions grâce aux contenus, aux visuels et aux réseaux sociaux.",
      accroche: "Hollywood avec moins de budget !",
      motsCles: ["Créativité", "Partage", "Bonne humeur"],
      affiche: `${dossier}/communication-affiche.jpg`,
      membres: [
        { nom: "Chloé Joffreau", fonction: "Responsable", photo: `${dossier}/communication-chloe-joffreau-hd.jpg`, linkedin: "https://www.linkedin.com/in/chlo%C3%A9-joffreau-5bba90273/" },
        { nom: "Coralie Houamria", photo: `${dossier}/communication-coralie-houamria-hd.jpg`, linkedin: "https://www.linkedin.com/in/coraliehouamria/" },
        { nom: "Amel Joualli", photo: `${dossier}/communication-amel-joualli-hd.jpg`, linkedin: "https://www.linkedin.com/in/amel-joualli/" },
        { nom: "Léa Pascal", photo: `${dossier}/communication-lea-pascal-hd.jpg`, linkedin: "https://www.linkedin.com/in/lea-pascal2003/" },
      ],
    },
    {
      id: "evenementiel",
      nom: "Événementiel",
      couleur: "jaune",
      mission: "Imaginer et organiser les événements, favoriser la cohésion et faire vivre l’association.",
      accroche: "Des événements pour se retrouver et partager.",
      motsCles: ["Organisation", "Logistique", "Cohésion", "Énergie"],
      affiche: `${dossier}/evenementiel-affiche.jpg`,
      membres: [
        {
          nom: "Alexandre Lacarrieu",
          fonction: "Responsable",
          photo: `${dossier}/evenementiel-alexandre-lacarrieu-hd.jpg`,
          linkedin: "https://www.linkedin.com/in/alexandre-lacarrieu-7ba811369/",
        },
        { nom: "Sarha Le Mestique", photo: `${dossier}/evenementiel-sarha-le-mestique-hd.jpg`, linkedin: "https://www.linkedin.com/in/sarha-le-mestique/" },
      ],
    },
  ],
}

export type PromotionArchivee = {
  annee: string
  photo: string
  alt: string
  legende: string
}

export const promotionsArchivees: PromotionArchivee[] = [
  {
    annee: "2025–2026",
    photo: "/images/equipe/2025-2026/bureau-2025-2026.jpg",
    alt: "Trombinoscope de l’équipe Biotrace 2025–2026 : quinze portraits en hexagones, avec le prénom et le rôle de chaque membre.",
    legende: "Publication « Biotrace vous présente ses membres pour l’année 2025–2026 ».",
  },
]
