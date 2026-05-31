// app/cgv/page.tsx
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

export const metadata = { title: 'Conditions Générales de Vente — MUZQUIZ' };

const sections = [
  { title: '1. Identification du vendeur', content: `Dimitri Bouville – La Caravane Game\nMicro-entrepreneur – SIRET : 80424567800029\n29 rue du Traité de Rome, 14370 Moult-Chicheboville, France\nlacaravanegame@gmail.com\n\nTVA non applicable, article 293 B du Code général des impôts.` },
  { title: '2. Objet', content: `Les présentes CGV définissent les conditions de souscription, de paiement, de renouvellement et de résiliation des abonnements proposés sur la plateforme MUZ QUIZ. Toute commande implique l'acceptation sans réserve des présentes CGV.` },
  { title: '3. Description des offres', content: `Moustachu Découverte — 0 €\nJusqu'à 10 joueurs, Quiz, Buzz Quiz, création manuelle illimitée de questions et quiz.\n\nMoustachu Essentiel — 9,99 € / mois\nJusqu'à 20 joueurs, Quiz, Buzz Quiz, Quiz Image, saisie manuelle et import Excel illimités, génération IA limitée à 10 questions et 10 quiz par mois.\n\nMoustachu Pro — 19,99 € / mois\nJusqu'à 100 joueurs, Quiz, Buzz Quiz, Quiz Image, Blind Test Audio, saisie manuelle et import Excel illimités, génération IA limitée à 20 questions et 40 quiz par mois.\n\nMoustachu Expert — 29,99 € / mois\nJusqu'à 250 joueurs, Quiz, Buzz Quiz, Quiz Image, Blind Test Audio, saisie manuelle et import Excel illimités, génération IA limitée à 20 questions et 80 quiz par mois.` },
  { title: '4. Évolution des offres', content: `Les fonctionnalités, limitations et caractéristiques des offres peuvent évoluer afin d'améliorer le service. Les modifications n'affecteront pas les périodes déjà facturées.` },
  { title: '5. Prix', content: `Les prix sont exprimés en euros. La TVA n'est pas applicable conformément à l'article 293 B du Code général des impôts. Les prix affichés sur le site sont ceux applicables au moment de la commande. Le vendeur peut modifier ses tarifs à tout moment ; toute modification prendra effet lors du prochain renouvellement de l'abonnement.` },
  { title: '6. Souscription', content: `La souscription d'un abonnement s'effectue directement depuis le site MUZ QUIZ. L'utilisateur doit disposer d'un compte valide, fournir des informations exactes, accepter les présentes CGV et effectuer le paiement demandé. La validation du paiement vaut conclusion du contrat.` },
  { title: '7. Paiement', content: `Les paiements sont réalisés de manière sécurisée via Stripe Payments Europe Ltd. MUZ QUIZ ne collecte ni ne conserve les numéros complets de cartes bancaires. Les données bancaires sont traitées directement par Stripe conformément à sa propre politique de confidentialité. En cas d'échec de paiement, certaines fonctionnalités peuvent être suspendues jusqu'à régularisation.` },
  { title: '8. Renouvellement automatique', content: `Les abonnements payants sont souscrits pour une durée mensuelle et renouvelés automatiquement à chaque échéance sauf résiliation par l'utilisateur avant la date de renouvellement. Le renouvellement entraîne le prélèvement automatique du montant correspondant à l'offre souscrite.` },
  { title: '9. Résiliation', content: `L'utilisateur peut résilier son abonnement à tout moment depuis son espace personnel ou en adressant une demande à lacaravanegame@gmail.com. La résiliation prend effet à la fin de la période déjà payée. L'utilisateur conserve l'accès aux fonctionnalités jusqu'à cette date.` },
  { title: '10. Absence de remboursement', content: `Sauf disposition légale contraire, aucun remboursement total ou partiel ne sera accordé : après activation du service, pour une période d'abonnement déjà commencée, en cas de non-utilisation du service ou en cas d'oubli de résiliation.` },
  { title: '11. Droit de rétractation', content: `Conformément aux articles L221-18 et suivants du Code de la consommation, le consommateur dispose en principe d'un délai de quatorze jours pour exercer son droit de rétractation. Toutefois, conformément à l'article L221-28, ce droit peut être perdu lorsque l'utilisateur demande expressément l'exécution immédiate du service et reconnaît perdre son droit de rétractation une fois l'exécution commencée.` },
  { title: '12. Suspension du service', content: `Le vendeur peut suspendre temporairement tout ou partie du service notamment pour maintenance, raisons de sécurité, incident technique, fraude ou non-paiement. Cette suspension ne donne droit à aucune indemnisation sauf disposition légale impérative contraire.` },
  { title: '13. Obligations de l\'utilisateur', content: `L'utilisateur s'engage à respecter les CGU, fournir des informations exactes, ne pas utiliser le service à des fins illicites, ne pas contourner les limitations techniques et ne pas perturber le fonctionnement du service. Toute violation peut entraîner la suspension ou la suppression du compte.` },
  { title: '14. Services utilisant l\'intelligence artificielle', content: `Certaines fonctionnalités permettent la génération de contenus assistée par intelligence artificielle. Les contenus générés peuvent contenir des erreurs, des approximations ou des incohérences. L'utilisateur demeure seul responsable de la vérification et de l'utilisation des contenus générés. Aucune garantie d'exactitude n'est accordée concernant ces résultats.` },
  { title: '15. Disponibilité du service', content: `Le vendeur met en œuvre les moyens raisonnables nécessaires pour assurer la disponibilité du service. Cependant, aucune garantie de disponibilité permanente n'est fournie.` },
  { title: '16. Responsabilité', content: `Le vendeur est soumis à une obligation de moyens. Dans tous les cas autorisés par la loi, l'indemnisation maximale pouvant être due à l'utilisateur est limitée au montant total effectivement payé au cours des douze derniers mois précédant le litige.` },
  { title: '17. Force majeure', content: `Le vendeur ne pourra être tenu responsable lorsqu'un manquement résulte d'un événement échappant raisonnablement à son contrôle : catastrophe naturelle, panne générale d'Internet, cyberattaque, conflit social, décision administrative, défaillance majeure d'un prestataire.` },
  { title: '18. Données personnelles', content: `Les données personnelles collectées dans le cadre de la souscription et de l'utilisation des abonnements sont traitées conformément à la Politique de confidentialité accessible sur le site.` },
  { title: '19. Médiation de la consommation', content: `Conformément aux articles L.612-1 et suivants du Code de la consommation, tout consommateur a le droit de recourir gratuitement à un médiateur de la consommation. Les coordonnées du médiateur seront communiquées sur simple demande à lacaravanegame@gmail.com.` },
  { title: '20. Plateforme européenne de règlement des litiges', content: `La Commission européenne met à disposition une plateforme de règlement en ligne des litiges : https://ec.europa.eu/consumers/odr` },
  { title: '21. Droit applicable et juridiction', content: `Les présentes CGV sont soumises au droit français. En cas de litige, les parties rechercheront d'abord une solution amiable. À défaut, les juridictions françaises compétentes seront seules habilitées à connaître du litige, sous réserve des dispositions protectrices applicables aux consommateurs.` },
  { title: '22. Contact', content: `Dimitri Bouville – La Caravane Game\nlacaravanegame@gmail.com` },
];

export default function CgvPage() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="text-sm font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
            style={{ background: 'rgba(255,0,170,0.08)', color: 'rgba(255,0,170,0.7)', border: '1px solid rgba(255,0,170,0.2)' }}>
            ← Accueil
          </Link>
          <MuzquizLogo width={80} textSize="1.2rem" />
        </div>
        <h1 className="text-3xl font-black mb-2" style={{ color: '#F0F4FF' }}>Conditions Générales de Vente</h1>
        <p className="text-sm mb-10" style={{ color: 'rgba(240,244,255,0.35)' }}>Dernière mise à jour : mai 2026</p>
        <div className="flex flex-col gap-8">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="text-base font-black mb-3" style={{ color: '#8B5CF6' }}>{s.title}</h2>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'rgba(240,244,255,0.65)' }}>{s.content}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 flex flex-wrap gap-4 text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(240,244,255,0.3)' }}>
          <Link href="/mentions-legales" className="hover:opacity-70">Mentions légales</Link>
          <Link href="/confidentialite" className="hover:opacity-70">Confidentialité</Link>
          <Link href="/cookies" className="hover:opacity-70">Cookies</Link>
          <Link href="/cgu" className="hover:opacity-70">CGU</Link>
        </div>
      </div>
    </div>
  );
}
