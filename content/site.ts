/**
 * Informations générales de l'association.
 * Modifiez ce fichier pour mettre à jour les coordonnées, liens et réseaux.
 */
export const site = {
  nom: "Biotrace Montpellier",
  nomCourt: "Biotrace",
  // Adresse publique du site : définir NEXT_PUBLIC_SITE_URL lors de la mise en ligne.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  /**
   * Interrupteur de lancement : tant qu'il vaut false, le site demande à Google et aux autres
   * moteurs de recherche de ne pas l'indexer (robots.txt + balise noindex), même s'il est déjà
   * en ligne pour un test. Le passer à true le jour de l'ouverture officielle.
   */
  ouvertAuxMoteursDeRecherche: false as boolean,
  statut: "Association loi 1901",
  creation: "novembre 2005",
  formation: "Master IBION-Tec — Ingénierie Biomoléculaire & Nanobiotechnologies",
  universite: "Université de Montpellier",
  signature: "Association étudiante du Master IBION-Tec — Université de Montpellier",
  accroche: "Depuis 2005, la science nous rassemble.",
  presentation:
    "Créée en novembre 2005, Biotrace est l’association étudiante du Master IBION-Tec de l’Université de Montpellier. Au croisement de l’ingénierie biomoléculaire et des nanobiotechnologies, elle rassemble les étudiants autour de projets scientifiques et associatifs, favorise les rencontres et valorise la formation auprès des étudiants, des chercheurs et des professionnels.",
  adresse: {
    lieu: "Faculté des Sciences",
    rue: "Place Eugène Bataillon",
    ville: "34090 Montpellier",
  },
  email: "association.biotrace@gmail.com",
  reseaux: {
    instagram: "https://www.instagram.com/biotrace_mtp/",
    linkedin: "https://www.linkedin.com/in/association-biotrace-63767a173/",
  },
} as const

export const missions = [
  {
    titre: "Représenter la formation",
    texte: "Représenter et promouvoir le Master IBION-Tec auprès des étudiants, des chercheurs et des professionnels.",
    icone: "graduation",
  },
  {
    titre: "Créer des rencontres",
    texte: "Favoriser les échanges entre étudiants et professionnels des biotechnologies.",
    icone: "handshake",
  },
  {
    titre: "Partager les sciences",
    texte: "Faire découvrir les avancées des biotechnologies, au-delà des salles de cours.",
    icone: "microscope",
  },
  {
    titre: "Faire vivre l’asso",
    texte: "Développer des projets collectifs et animer la vie associative du master.",
    icone: "users",
  },
] as const

export const navigation = [
  { label: "Accueil", href: "/" },
  { label: "L’association", href: "/association" },
  { label: "Notre équipe", href: "/equipe" },
  { label: "Bio-Innov 2027", href: "/bio-innov-2027" },
  { label: "Événements", href: "/evenements" },
  { label: "Contact", href: "/contact" },
] as const
