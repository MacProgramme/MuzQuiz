// app/cgu/page.tsx
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

export const metadata = {
  title: "Conditions Générales d'Utilisation — MUZQUIZ",
  alternates: { canonical: 'https://www.muzquiz.fr/cgu' },
};

const list = (items: string[]) => (
  <ul className="mt-2 flex flex-col gap-1 ml-3">
    {items.map(i => <li key={i} style={{ color: 'rgba(240,244,255,0.65)' }}>— {i}</li>)}
  </ul>
);

const SECTIONS = [
  {
    num: '1', title: 'Objet',
    content: <><p>Les présentes Conditions Générales d&apos;Utilisation (CGU) ont pour objet de définir les conditions d&apos;accès et d&apos;utilisation de la plateforme MUZ QUIZ, éditée par Dimitri Bouville – La Caravane Game.</p><p className="mt-3">Toute utilisation du service implique l&apos;acceptation pleine et entière des présentes CGU. Si vous refusez tout ou partie de ces conditions, vous devez cesser immédiatement d&apos;utiliser le service.</p></>,
  },
  {
    num: '2', title: "Identification de l'éditeur",
    content: (
      <div className="p-4 rounded-xl text-sm flex flex-col gap-1.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p><strong style={{ color: '#F0F4FF' }}>La Caravane Game — Dimitri Bouville</strong></p>
        <p><span style={{ color: 'rgba(240,244,255,0.5)' }}>SIRET :</span> 80424567800029</p>
        <p><span style={{ color: 'rgba(240,244,255,0.5)' }}>Adresse :</span> 29 rue du Traité de Rome, 14370 Moult-Chicheboville, France</p>
        <p><span style={{ color: 'rgba(240,244,255,0.5)' }}>Contact :</span>{' '}<a href="mailto:lacaravanegame@gmail.com" className="underline" style={{ color: '#8B5CF6' }}>lacaravanegame@gmail.com</a></p>
        <p><span style={{ color: 'rgba(240,244,255,0.5)' }}>Site :</span>{' '}<a href="https://www.muzquiz.fr" className="underline" style={{ color: '#8B5CF6' }}>https://www.muzquiz.fr</a></p>
      </div>
    ),
  },
  {
    num: '3', title: 'Description du service',
    content: <><p>MUZ QUIZ est une plateforme de divertissement permettant notamment :</p>{list(['de créer des quiz personnalisés', 'de créer des blind tests', "d'organiser des parties multijoueurs", 'de participer à des quiz interactifs', "d'utiliser un système de buzzer virtuel", 'de gérer des classements', 'de partager des contenus de jeu', "d'accéder à des fonctionnalités premium via abonnement"])}<p className="mt-3">Les fonctionnalités disponibles peuvent varier selon l&apos;offre souscrite.</p></>,
  },
  {
    num: '4', title: "Conditions d'accès",
    content: <p>L&apos;accès au service nécessite une connexion Internet, un navigateur compatible et un équipement adapté. Certaines fonctionnalités nécessitent la création d&apos;un compte utilisateur. L&apos;utilisateur demeure responsable des coûts liés à sa connexion Internet et à son matériel.</p>,
  },
  {
    num: '5', title: 'Utilisateurs majeurs',
    content: <p>Le service est exclusivement réservé aux personnes âgées d&apos;au moins 18 ans. En utilisant MUZ QUIZ, l&apos;utilisateur déclare être majeur et disposer de la capacité juridique nécessaire. L&apos;éditeur peut suspendre ou supprimer tout compte dont il constate qu&apos;il a été créé par une personne mineure.</p>,
  },
  {
    num: '6', title: 'Création de compte',
    content: <><p>Lors de son inscription, l&apos;utilisateur s&apos;engage à :</p>{list(['fournir des informations exactes', 'maintenir ses informations à jour', "ne pas usurper l'identité d'un tiers", 'utiliser une adresse e-mail valide'])}<p className="mt-3">Chaque utilisateur ne peut créer un compte que pour son propre usage.</p></>,
  },
  {
    num: '7', title: 'Sécurité des identifiants',
    content: <p>L&apos;utilisateur est seul responsable de son mot de passe, de ses identifiants et des actions réalisées depuis son compte. Il s&apos;engage à conserver ses identifiants confidentiels, utiliser un mot de passe robuste et signaler immédiatement toute utilisation non autorisée.</p>,
  },
  {
    num: '8', title: 'Connexion via Google ou Discord',
    content: <p>MUZ QUIZ peut permettre l&apos;authentification via Google ou Discord. L&apos;utilisateur accepte que certaines données d&apos;identification nécessaires soient transmises par ces services. L&apos;utilisation de ces services reste soumise à leurs propres conditions d&apos;utilisation.</p>,
  },
  {
    num: '9', title: 'Règles de conduite',
    content: <><p>Il est notamment interdit :</p>{list(['de diffuser du contenu illicite', 'de publier des contenus haineux, discriminatoires ou diffamatoires', "d'usurper l'identité d'autrui", "de porter atteinte aux droits d'un tiers", "d'utiliser le service à des fins frauduleuses", 'de contourner les mesures de sécurité'])}</>,
  },
  {
    num: '10', title: 'Lutte contre la triche',
    content: <><p>Il est interdit :</p>{list(["d'utiliser des robots ou logiciels automatisés", 'de manipuler les scores', 'de contourner les limitations techniques', 'de créer plusieurs comptes dans un but frauduleux', 'de falsifier des résultats', "d'exploiter volontairement une faille technique"])}<p className="mt-3">En cas de fraude, l&apos;éditeur peut suspendre ou supprimer définitivement le compte sans remboursement.</p></>,
  },
  {
    num: '11', title: 'Contenus créés par les utilisateurs',
    content: <><p>L&apos;utilisateur reste propriétaire de ses contenus. Toutefois, il accorde à MUZ QUIZ une licence non exclusive, gratuite et mondiale permettant l&apos;hébergement, le stockage, l&apos;affichage et l&apos;utilisation technique nécessaire au fonctionnement du service.</p><p className="mt-3">L&apos;utilisateur garantit être titulaire des droits nécessaires sur les contenus qu&apos;il importe ou publie.</p></>,
  },
  {
    num: '12', title: 'Contenus interdits',
    content: <><p>Sont notamment interdits :</p>{list(['contenus illégaux', 'contenus pornographiques', 'contenus violents', 'contenus discriminatoires', 'contenus diffamatoires', "contenus portant atteinte à la propriété intellectuelle d'autrui", "contenus incitant à la haine ou à la violence"])}<p className="mt-3">L&apos;éditeur peut supprimer tout contenu contraire aux présentes CGU sans préavis.</p></>,
  },
  {
    num: '13', title: "Fonctionnalités basées sur l'intelligence artificielle",
    content: <p>Certaines fonctionnalités peuvent utiliser des systèmes d&apos;intelligence artificielle pour générer des questions ou des contenus d&apos;assistance. Les résultats peuvent contenir des erreurs. L&apos;utilisateur demeure responsable de la vérification des contenus qu&apos;il utilise ou publie.</p>,
  },
  {
    num: '14', title: 'Disponibilité du service',
    content: <p>L&apos;éditeur s&apos;efforce d&apos;assurer une disponibilité optimale du service. Toutefois, le service peut être interrompu pour maintenance, mise à jour, évolution technique ou incident. Aucune disponibilité permanente n&apos;est garantie.</p>,
  },
  {
    num: '15', title: 'Sauvegardes',
    content: <p>Des mécanismes de sauvegarde peuvent être mis en place. Toutefois, l&apos;éditeur ne garantit pas la récupération intégrale des données en cas d&apos;incident majeur.</p>,
  },
  {
    num: '16', title: 'Propriété intellectuelle',
    content: <p>Tous les éléments composant MUZ QUIZ sont protégés par les lois relatives à la propriété intellectuelle, notamment le nom MUZ QUIZ, les logos, l&apos;interface, les bases de données et les contenus créés par l&apos;éditeur. Toute reproduction ou exploitation sans autorisation écrite préalable est interdite.</p>,
  },
  {
    num: '17', title: 'Suspension ou suppression de compte',
    content: <p>L&apos;éditeur peut suspendre ou supprimer un compte notamment en cas de non-respect des présentes CGU, de fraude, de tentative de piratage, de comportement nuisible, de non-paiement d&apos;un abonnement ou d&apos;utilisation abusive. La suspension peut intervenir sans indemnité ni remboursement.</p>,
  },
  {
    num: '18', title: 'Responsabilité',
    content: <p>Le service est fourni « en l&apos;état ». La responsabilité de l&apos;éditeur est limitée aux dommages directs prouvés. En aucun cas elle ne pourra excéder le montant total effectivement payé par l&apos;utilisateur au cours des douze mois précédant le litige.</p>,
  },
  {
    num: '19', title: 'Force majeure',
    content: <p>L&apos;éditeur ne pourra être tenu responsable d&apos;un manquement résultant d&apos;un événement indépendant de sa volonté : catastrophe naturelle, panne majeure, cyberattaque, défaillance d&apos;un prestataire, conflit social ou décision administrative.</p>,
  },
  {
    num: '20', title: 'Modification des CGU',
    content: <p>Les présentes CGU peuvent être modifiées à tout moment. Les utilisateurs seront informés des modifications importantes. La poursuite de l&apos;utilisation du service après modification vaut acceptation des nouvelles CGU.</p>,
  },
  {
    num: '21', title: 'Droit applicable et règlement des litiges',
    content: <p>Les présentes CGU sont soumises au droit français. En cas de litige, les parties s&apos;efforceront de rechercher une solution amiable avant toute procédure judiciaire. Les juridictions françaises seront seules compétentes, sous réserve des dispositions légales impératives applicables aux consommateurs.</p>,
  },
  {
    num: '22', title: 'Contact',
    content: <p><a href="mailto:lacaravanegame@gmail.com" className="underline" style={{ color: '#8B5CF6' }}>lacaravanegame@gmail.com</a></p>,
  },
];

export default function CguPage() {
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
        <h1 className="text-3xl font-black mb-2" style={{ color: '#F0F4FF' }}>Conditions Générales d&apos;Utilisation</h1>
        <p className="text-sm mb-10" style={{ color: 'rgba(240,244,255,0.35)' }}>Dernière mise à jour : mai 2026</p>
        <div className="flex flex-col gap-8" style={{ color: 'rgba(240,244,255,0.72)', lineHeight: '1.75', fontSize: '0.9rem' }}>
          {SECTIONS.map(s => (
            <section key={s.num}>
              <h2 className="text-base font-black mb-4" style={{ color: '#FF00AA' }}>{s.num}. {s.title}</h2>
              {s.content}
            </section>
          ))}
        </div>
        <div className="mt-14 pt-6 flex flex-wrap gap-4 text-xs font-bold"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(240,244,255,0.3)' }}>
          <Link href="/mentions-legales" className="hover:opacity-80">Mentions légales</Link>
          <Link href="/cgv" className="hover:opacity-80">CGV</Link>
          <Link href="/confidentialite" className="hover:opacity-80">Confidentialité</Link>
          <Link href="/cookies" className="hover:opacity-80">Cookies</Link>
        </div>
      </div>
    </div>
  );
}
