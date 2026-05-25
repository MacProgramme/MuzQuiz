// app/cgv/page.tsx
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

export const metadata = {
  title: 'Conditions Générales de Vente — MUZQUIZ',
  alternates: { canonical: 'https://www.muzquiz.fr/cgv' },
};

const list = (items: string[]) => (
  <ul className="mt-2 flex flex-col gap-1 ml-3">
    {items.map(i => <li key={i} style={{ color: 'rgba(240,244,255,0.65)' }}>— {i}</li>)}
  </ul>
);

const OFFRES = [
  {
    name: 'Moustachu Découverte',
    price: '0 €',
    items: ["jusqu'à 10 joueurs", 'Quiz', 'Buzz Quiz', 'création manuelle illimitée de questions et quiz'],
  },
  {
    name: 'Moustachu Essentiel',
    price: '9,99 € / mois',
    items: ["jusqu'à 20 joueurs", 'Quiz', 'Buzz Quiz', 'Quiz Image', 'saisie manuelle illimitée', 'import Excel illimité', 'génération IA limitée à 10 questions et 10 quiz par mois'],
  },
  {
    name: 'Moustachu Pro',
    price: '19,99 € / mois',
    items: ["jusqu'à 100 joueurs", 'Quiz', 'Buzz Quiz', 'Quiz Image', 'Blind Test Audio', 'saisie manuelle illimitée', 'import Excel illimité', 'génération IA limitée à 20 questions et 40 quiz par mois'],
  },
  {
    name: 'Moustachu Expert',
    price: '29,99 € / mois',
    items: ["jusqu'à 250 joueurs", 'Quiz', 'Buzz Quiz', 'Quiz Image', 'Blind Test Audio', 'saisie manuelle illimitée', 'import Excel illimité', 'génération IA limitée à 20 questions et 80 quiz par mois'],
  },
];

const SECTIONS = [
  {
    num: '1', title: 'Identification du vendeur',
    content: (
      <div className="p-4 rounded-xl text-sm flex flex-col gap-1.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p><strong style={{ color: '#F0F4FF' }}>Dimitri Bouville – La Caravane Game</strong></p>
        <p><span style={{ color: 'rgba(240,244,255,0.5)' }}>Statut :</span> Micro-entrepreneur</p>
        <p><span style={{ color: 'rgba(240,244,255,0.5)' }}>SIRET :</span> 80424567800029</p>
        <p><span style={{ color: 'rgba(240,244,255,0.5)' }}>Adresse :</span> 29 rue du Traité de Rome, 14370 Moult-Chicheboville, France</p>
        <p><span style={{ color: 'rgba(240,244,255,0.5)' }}>E-mail :</span>{' '}<a href="mailto:lacaravanegame@gmail.com" className="underline" style={{ color: '#8B5CF6' }}>lacaravanegame@gmail.com</a></p>
        <p className="mt-1 text-xs" style={{ color: 'rgba(240,244,255,0.4)' }}>TVA non applicable, article 293 B du Code général des impôts.</p>
      </div>
    ),
  },
  {
    num: '2', title: 'Objet',
    content: <p>Les présentes CGV définissent les conditions de souscription, de paiement, de renouvellement et de résiliation des abonnements proposés sur la plateforme MUZ QUIZ. Toute commande implique l&apos;acceptation sans réserve des présentes CGV.</p>,
  },
  {
    num: '3', title: 'Description des offres',
    content: (
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {OFFRES.map(o => (
          <div key={o.name} className="p-4 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="font-black" style={{ color: '#F0F4FF' }}>{o.name}</p>
            <p className="text-xs mt-0.5 mb-2" style={{ color: '#FF00AA' }}>{o.price}</p>
            {list(o.items)}
          </div>
        ))}
      </div>
    ),
  },
  {
    num: '4', title: 'Évolution des offres',
    content: <p>Les fonctionnalités, limitations et caractéristiques des offres peuvent évoluer afin d&apos;améliorer le service. Les modifications n&apos;affecteront pas les périodes déjà facturées.</p>,
  },
  {
    num: '5', title: 'Prix',
    content: <><p>Les prix sont exprimés en euros. La TVA n&apos;est pas applicable conformément à l&apos;article 293 B du Code général des impôts. Les prix affichés sont ceux applicables au moment de la commande.</p><p className="mt-2">Le vendeur peut modifier ses tarifs à tout moment. Toute modification prendra effet lors du prochain renouvellement de l&apos;abonnement.</p></>,
  },
  {
    num: '6', title: 'Souscription',
    content: <><p>La souscription s&apos;effectue directement depuis le site MUZ QUIZ. L&apos;utilisateur doit disposer d&apos;un compte valide, fournir des informations exactes, accepter les présentes CGV et effectuer le paiement demandé. La validation du paiement vaut conclusion du contrat.</p></>,
  },
  {
    num: '7', title: 'Paiement',
    content: <><p>Les paiements sont réalisés de manière sécurisée via <strong style={{ color: '#F0F4FF' }}>Stripe Payments Europe Ltd.</strong> MUZ QUIZ ne collecte ni ne conserve les numéros complets de cartes bancaires. En cas d&apos;échec de paiement, certaines fonctionnalités peuvent être suspendues jusqu&apos;à régularisation.</p></>,
  },
  {
    num: '8', title: 'Renouvellement automatique',
    content: <p>Les abonnements payants sont souscrits pour une durée mensuelle et renouvelés automatiquement à chaque échéance sauf résiliation par l&apos;utilisateur avant la date de renouvellement. Le renouvellement entraîne le prélèvement automatique du montant correspondant à l&apos;offre souscrite.</p>,
  },
  {
    num: '9', title: 'Résiliation',
    content: <><p>L&apos;utilisateur peut résilier son abonnement à tout moment depuis son espace personnel ou en adressant une demande à <a href="mailto:lacaravanegame@gmail.com" className="underline" style={{ color: '#8B5CF6' }}>lacaravanegame@gmail.com</a>.</p><p className="mt-2">La résiliation prend effet à la fin de la période déjà payée. L&apos;utilisateur conserve l&apos;accès aux fonctionnalités jusqu&apos;à cette date.</p></>,
  },
  {
    num: '10', title: 'Absence de remboursement',
    content: <><p>Sauf disposition légale contraire, aucun remboursement total ou partiel ne sera accordé :</p>{list(['après activation du service', "pour une période d'abonnement déjà commencée", "en cas de non-utilisation du service", "en cas d'oubli de résiliation"])}</>,
  },
  {
    num: '11', title: 'Droit de rétractation',
    content: <p>Conformément aux articles L221-18 et suivants du Code de la consommation, le consommateur dispose en principe d&apos;un délai de quatorze jours pour exercer son droit de rétractation. Toutefois, conformément à l&apos;article L221-28, ce droit peut être perdu lorsque l&apos;utilisateur demande expressément l&apos;exécution immédiate du service et reconnaît perdre son droit de rétractation une fois l&apos;exécution commencée.</p>,
  },
  {
    num: '12', title: 'Suspension du service',
    content: <p>Le vendeur peut suspendre temporairement tout ou partie du service pour maintenance, raisons de sécurité, incident technique, fraude ou non-paiement. Cette suspension ne donne droit à aucune indemnisation sauf disposition légale impérative contraire.</p>,
  },
  {
    num: '13', title: "Obligations de l'utilisateur",
    content: <><p>L&apos;utilisateur s&apos;engage à respecter les CGU, fournir des informations exactes et ne pas utiliser le service à des fins illicites. Toute violation peut entraîner la suspension ou la suppression du compte.</p></>,
  },
  {
    num: '14', title: "Services utilisant l'intelligence artificielle",
    content: <p>Certaines fonctionnalités permettent la génération de contenus assistée par IA. Les contenus générés peuvent contenir des erreurs ou des approximations. L&apos;utilisateur demeure seul responsable de la vérification et de l&apos;utilisation des contenus générés. Aucune garantie d&apos;exactitude n&apos;est accordée.</p>,
  },
  {
    num: '15', title: 'Disponibilité du service',
    content: <p>Le vendeur met en œuvre les moyens raisonnables pour assurer la disponibilité du service. Cependant, aucune garantie de disponibilité permanente n&apos;est fournie. Des interruptions peuvent intervenir pour maintenance, mises à jour ou incident indépendant de la volonté du vendeur.</p>,
  },
  {
    num: '16', title: 'Responsabilité',
    content: <p>Le vendeur est soumis à une obligation de moyens. Dans tous les cas autorisés par la loi, l&apos;indemnisation maximale pouvant être due à l&apos;utilisateur est limitée au montant total effectivement payé au cours des douze derniers mois précédant le litige.</p>,
  },
  {
    num: '17', title: 'Force majeure',
    content: <p>Le vendeur ne pourra être tenu responsable lorsqu&apos;un manquement résulte d&apos;un événement échappant raisonnablement à son contrôle : catastrophe naturelle, panne générale d&apos;Internet, cyberattaque, conflit social, décision administrative ou défaillance majeure d&apos;un prestataire.</p>,
  },
  {
    num: '18', title: 'Données personnelles',
    content: <p>Les données personnelles collectées dans le cadre des abonnements sont traitées conformément à la <Link href="/confidentialite" className="underline" style={{ color: '#8B5CF6' }}>Politique de confidentialité</Link> accessible sur le site.</p>,
  },
  {
    num: '19', title: 'Médiation de la consommation',
    content: <><p>Conformément aux articles L.612-1 et suivants du Code de la consommation, tout consommateur a le droit de recourir gratuitement à un médiateur de la consommation en vue de la résolution amiable d&apos;un litige.</p><p className="mt-2 text-sm p-3 rounded-lg" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: 'rgba(245,158,11,0.8)' }}>⚠ À compléter avec le nom et les coordonnées du médiateur choisi officiellement pour l&apos;activité.</p></>,
  },
  {
    num: '20', title: "Plateforme européenne de règlement des litiges",
    content: <p>La Commission européenne met à disposition une plateforme de règlement en ligne des litiges :{' '}<a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer" className="underline" style={{ color: '#8B5CF6' }}>https://ec.europa.eu/consumers/odr</a></p>,
  },
  {
    num: '21', title: 'Droit applicable',
    content: <p>Les présentes CGV sont soumises au droit français.</p>,
  },
  {
    num: '22', title: 'Juridiction compétente',
    content: <p>En cas de litige, les parties rechercheront d&apos;abord une solution amiable. À défaut, les juridictions françaises compétentes seront seules habilitées à connaître du litige, sous réserve des dispositions protectrices applicables aux consommateurs.</p>,
  },
  {
    num: '23', title: 'Contact',
    content: <p><a href="mailto:lacaravanegame@gmail.com" className="underline" style={{ color: '#8B5CF6' }}>lacaravanegame@gmail.com</a></p>,
  },
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
        <div className="flex flex-col gap-8" style={{ color: 'rgba(240,244,255,0.72)', lineHeight: '1.75', fontSize: '0.9rem' }}>
          {SECTIONS.map(s => (
            <section key={s.num}>
              <h2 className="text-base font-black mb-4" style={{ color: '#00E5D1' }}>{s.num}. {s.title}</h2>
              {s.content}
            </section>
          ))}
        </div>
        <div className="mt-14 pt-6 flex flex-wrap gap-4 text-xs font-bold"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(240,244,255,0.3)' }}>
          <Link href="/mentions-legales" className="hover:opacity-80">Mentions légales</Link>
          <Link href="/cgu" className="hover:opacity-80">CGU</Link>
          <Link href="/confidentialite" className="hover:opacity-80">Confidentialité</Link>
          <Link href="/cookies" className="hover:opacity-80">Cookies</Link>
        </div>
      </div>
    </div>
  );
}
