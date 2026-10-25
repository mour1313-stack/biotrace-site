import type { Metadata } from "next"
import { site } from "@/content/site"

export const metadata: Metadata = {
  title: "Mentions légales et confidentialité",
  description: "Mentions légales et informations de confidentialité du site de l’association BIO TRACE, Montpellier.",
  robots: { index: false },
}

/** Les champs « À compléter » doivent être renseignés avec les informations officielles de l'association. */
function ACompleter({ children = "À compléter" }: { children?: React.ReactNode }) {
  return <span className="rounded bg-lab-yellow px-1.5 py-0.5 font-semibold">{children}</span>
}

function Section({ numero, titre, id, children }: { numero?: number; titre: string; id?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-28">
      <h2 className="text-xl font-bold">
        {numero !== undefined && <span className="etiquette mr-2 text-lab-blue">{String(numero).padStart(2, "0")}</span>}
        {titre}
      </h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  )
}

const Email = () => (
  <a href={`mailto:${site.email}`} className="lien-bleu">
    {site.email}
  </a>
)

export default function MentionsLegales() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="etiquette text-lab-blue">BIO TRACE — Association étudiante de Montpellier</p>
      <h1 className="titre-affiche mt-3 text-5xl sm:text-6xl">
        Mentions <span className="surligne">légales</span>
      </h1>
      <p className="mt-4 text-sm text-ink-soft">Dernière mise à jour : 22 octobre 2026</p>

      <div className="carte mt-10 space-y-10 p-6 leading-relaxed sm:p-10">
        <Section numero={1} titre="Éditeur du site">
          <p>
            Le présent site internet est édité par BIO TRACE, association déclarée régie par la loi du 1er juillet 1901
            relative au contrat d’association.
          </p>
          <p>
            Créée en novembre 2005, BIO TRACE est une association étudiante liée au Master IBION-Tec de la Faculté des
            Sciences de l’Université de Montpellier. Elle a notamment pour objectif de promouvoir la formation, de
            favoriser les échanges entre étudiants, chercheurs et professionnels et de contribuer à la vie scientifique
            et associative.
          </p>
          <p className="font-semibold">Identification de l’association :</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Dénomination officielle : BIO TRACE</li>
            <li>Statut juridique : Association déclarée — loi 1901</li>
            <li>Numéro SIREN : 522 211 499</li>
            <li>Numéro SIRET : 522 211 499 00010</li>
            <li>Numéro RNA : W343000104</li>
            <li>Code APE : 94.99Z</li>
            <li>
              Adresse administrative déclarée : CC 24, bâtiment 15, 3e étage, Place Eugène Bataillon, 34090 Montpellier,
              France
            </li>
            <li>Présidente de l’association : Egida Saja</li>
            <li>
              Directrice de la publication : Egida Saja, présidente de l’association
            </li>
            <li>
              Adresse électronique : <Email />
            </li>
          </ul>
          <p>
            Selon l’avis de situation SIRENE établi par l’INSEE le 2 mars 2026, l’association est active depuis le 19
            septembre 2008 dans ce répertoire.
          </p>
        </Section>

        <Section numero={2} titre="Hébergement du site">
          <p>Le site internet est hébergé par :</p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>Nom de l’hébergeur : Vercel Inc.</li>
            <li>Adresse : 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis</li>
            <li>
              Téléphone : <ACompleter />
            </li>
          </ul>
        </Section>

        <Section numero={3} titre="Objet du site">
          <p>
            Le site de BIO TRACE a pour vocation de présenter l’association, son histoire, ses membres, ses missions et
            ses activités.
          </p>
          <p>
            Il permet également de communiquer sur les événements scientifiques et associatifs, notamment le congrès
            Bio-Innov, organisé par les étudiants du Master IBION-Tec de l’Université de Montpellier.
          </p>
          <p>Les informations diffusées sont fournies à titre informatif et peuvent faire l’objet de modifications.</p>
        </Section>

        <Section numero={4} titre="Propriété intellectuelle">
          <p>
            Les textes, photographies, illustrations, affiches, logos et autres éléments présents sur le site sont
            protégés par les dispositions applicables du Code de la propriété intellectuelle.
          </p>
          <p>Toute reproduction, représentation ou réutilisation doit respecter les droits de leurs titulaires respectifs.</p>
          <p>
            Les contenus appartenant à l’Université de Montpellier, aux partenaires scientifiques ou à des tiers restent
            soumis à leurs propres droits.
          </p>
        </Section>

        <Section numero={5} titre="Protection des données personnelles">
          <p>
            Dans le cadre du fonctionnement du site, BIO TRACE peut collecter certaines données personnelles transmises
            volontairement par les visiteurs, notamment via le formulaire de contact ou les formulaires d’inscription aux
            événements.
          </p>
          <p>
            Ces données peuvent comprendre le nom, le prénom, l’adresse électronique et les informations nécessaires au
            traitement des demandes. Elles sont utilisées pour les finalités indiquées au moment de leur collecte.
          </p>
          <p>
            Conformément au Règlement général sur la protection des données (RGPD), les personnes concernées peuvent
            exercer les droits applicables à leur situation, notamment les droits d’accès, de rectification,
            d’effacement, d’opposition et de limitation du traitement.
          </p>
          <p>
            Pour toute demande relative aux données personnelles : <Email />
          </p>
          <p>
            Les personnes concernées peuvent également déposer une réclamation auprès de la CNIL :{" "}
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="lien-bleu">
              www.cnil.fr<span className="sr-only"> (nouvel onglet)</span>
            </a>
            .
          </p>
          <p>
            Les informations détaillées relatives aux traitements de données figurent dans la{" "}
            <a href="#confidentialite" className="lien-bleu">
              politique de confidentialité
            </a>{" "}
            ci-dessous.
          </p>
        </Section>

        <Section numero={6} titre="Cookies">
          <p>Le site peut utiliser des cookies ou traceurs nécessaires à son fonctionnement.</p>
          <p>
            Lorsque des traceurs soumis à consentement sont utilisés, les visiteurs sont informés de leur finalité et
            peuvent accepter ou refuser leur utilisation conformément à la réglementation applicable.
          </p>
        </Section>

        <Section numero={7} titre="Liens externes">
          <p>
            Le site peut proposer des liens vers des plateformes externes, notamment celles de l’Université de
            Montpellier, des partenaires scientifiques et des réseaux sociaux.
          </p>
          <p>
            BIO TRACE ne contrôle pas les contenus de ces plateformes et ne saurait être tenue responsable de leur
            contenu ou de leur disponibilité dans les limites prévues par la loi.
          </p>
        </Section>

        <Section numero={8} titre="Responsabilité">
          <p>BIO TRACE veille à proposer des informations fiables et régulièrement actualisées.</p>
          <p>
            Toutefois, l’association ne peut garantir l’absence d’erreurs, d’omissions ou d’interruptions temporaires du
            service. Les contenus peuvent être modifiés sans préavis.
          </p>
        </Section>

        <Section numero={9} titre="Contact">
          <address className="not-italic">
            BIO TRACE
            <br />
            CC 24, bâtiment 15, 3e étage
            <br />
            Place Eugène Bataillon
            <br />
            34090 Montpellier, France
          </address>
          <ul className="space-y-1.5">
            <li>
              Email : <Email />
            </li>
            <li>
              Instagram :{" "}
              <a href={site.reseaux.instagram} target="_blank" rel="noopener noreferrer" className="lien-bleu">
                @biotrace_mtp<span className="sr-only"> (nouvel onglet)</span>
              </a>
            </li>
            <li>
              LinkedIn :{" "}
              <a href={site.reseaux.linkedin} target="_blank" rel="noopener noreferrer" className="lien-bleu">
                Association Biotrace<span className="sr-only"> (nouvel onglet)</span>
              </a>
            </li>
          </ul>
        </Section>

        <Section titre="Politique de confidentialité" id="confidentialite">
          <p>
            À ce jour, ce site ne comporte ni compte utilisateur, ni outil de mesure d’audience, et ne dépose pas de
            cookie publicitaire. Le formulaire de la page Contact n’envoie rien au site : il prépare un e-mail dans votre
            propre messagerie, que vous choisissez ensuite d’envoyer. Lorsque vous nous écrivez par e-mail, votre adresse
            et votre message sont utilisés uniquement pour vous répondre.
          </p>
          <p>
            Les liens vers Instagram et LinkedIn mènent à des services tiers soumis à leurs propres politiques de
            confidentialité.
          </p>
        </Section>
      </div>

      <p className="mt-10 text-center font-hand text-2xl font-bold text-lab-blue">
        BIO TRACE — Depuis 2005, la science nous rassemble.
      </p>
    </div>
  )
}
