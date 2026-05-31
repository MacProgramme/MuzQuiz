// app/cgu/page.tsx
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

export const metadata = { title: 'Conditions Générales d\'Utilisation — MUZQUIZ' };

const sections = [
  { title: '1. Objet', content: `Les présentes Conditions Générales d'Utilisation (CGU) ont pour objet de définir les conditions d'accès et d'utilisation de la plateforme MUZ QUIZ, éditée par Dimitri Bouville – La Caravane Game.\n\nToute utilisation du service implique l'acceptation pleine et entière des présentes CGU.` },
  { title: '2. Identification de l\'éditeur', content: `La Caravane Game – Dimitri Bouville\nMicro-entrepreneur – SIRET : 80424567800029\n29 rue du Traité de Rome, 14370 Moult-Chicheboville, France\nlacaravanegame@gmail.com – https://www.muzquiz.fr` },
  { title: '3. Description du service', content: `MUZ QUIZ est une plateforme de divertissement permettant notamment : de créer des quiz personnalisés, de créer des blind tests, d'organiser des parties multijoueurs, de participer à des quiz interactifs, de gérer des classements, de partager des contenus de jeu et d'accéder à des fonctionnalités premium via abonnement.\n\nLes fonctionnalités disponibles peuvent varier selon l'offre souscrite.` },
  { title: '4. Conditions d\'accès', content: `L'accès au service nécessite une connexion Internet, un navigateur compatible et un équipement adapté. Certaines fonctionnalités nécessitent la création d'un compte utilisateur. L'utilisateur demeure responsable des coûts liés à sa connexion Internet et à son matériel.` },
  { title: '5. Utilisateurs majeurs', content: `Le service est exclusivement réservé aux personnes âgées d'au moins 18 ans. En utilisant MUZ QUIZ, l'utilisateur déclare être majeur et disposer de la capacité juridique nécessaire. L'éditeur peut suspendre ou supprimer tout compte créé par une personne mineure.` },
  { title: '6. Création de compte', content: `Lors de son inscription, l'utilisateur s'engage à : fournir des informations exactes, maintenir ses informations à jour, ne pas usurper l'identité d'un tiers, utiliser une adresse e-mail valide. Chaque utilisateur ne peut créer un compte que pour son propre usage.` },
  { title: '7. Sécurité des identifiants', content: `L'utilisateur est seul responsable de son mot de passe, de ses identifiants et des actions réalisées depuis son compte. Il s'engage à conserver ses identifiants confidentiels et à signaler immédiatement toute utilisation non autorisée. L'éditeur ne pourra être tenu responsable d'une utilisation frauduleuse résultant d'une négligence de l'utilisateur.` },
  { title: '8. Connexion via Google ou Discord', content: `MUZ QUIZ peut permettre l'authentification via des services tiers tels que Google et Discord. L'utilisateur accepte que certaines données d'identification nécessaires soient transmises par ces services. L'utilisation de ces services reste soumise à leurs propres conditions d'utilisation.` },
  { title: '9. Règles de conduite', content: `L'utilisateur s'engage à respecter les lois en vigueur, les autres utilisateurs et à utiliser le service de bonne foi.\n\nIl est notamment interdit de : diffuser du contenu illicite, publier des contenus haineux ou diffamatoires, usurper l'identité d'autrui, porter atteinte aux droits d'un tiers, utiliser le service à des fins frauduleuses, contourner les mesures de sécurité.` },
  { title: '10. Lutte contre la triche', content: `Il est interdit : d'utiliser des robots ou logiciels automatisés, de manipuler les scores, de contourner les limitations techniques, de créer plusieurs comptes dans un but frauduleux, de falsifier des résultats, d'exploiter volontairement une faille technique.\n\nEn cas de fraude, l'éditeur peut suspendre le compte, supprimer les résultats concernés, résilier l'accès au service sans remboursement.` },
  { title: '11. Contenus créés par les utilisateurs', content: `L'utilisateur garantit être titulaire des droits nécessaires sur les contenus qu'il crée ou importe. Il reste propriétaire de ses contenus mais accorde à MUZ QUIZ une licence non exclusive, gratuite et mondiale permettant l'hébergement, le stockage, l'affichage et l'utilisation technique nécessaire au fonctionnement du service.` },
  { title: '12. Contenus interdits', content: `Sont notamment interdits : contenus illégaux, pornographiques, violents, discriminatoires, diffamatoires, portant atteinte à la propriété intellectuelle d'autrui, incitant à la haine ou à la violence. L'éditeur peut supprimer tout contenu contraire aux présentes CGU sans préavis.` },
  { title: '13. Fonctionnalités basées sur l\'intelligence artificielle', content: `Certaines fonctionnalités utilisent des systèmes d'intelligence artificielle pour générer des questions, des propositions de quiz ou des contenus d'assistance. Les résultats générés peuvent contenir des erreurs, des approximations ou des informations incomplètes. L'utilisateur demeure responsable de la vérification des contenus qu'il utilise ou publie. L'éditeur ne garantit pas l'exactitude des contenus générés.` },
  { title: '14. Disponibilité du service', content: `L'éditeur s'efforce d'assurer une disponibilité optimale du service. Toutefois, le service peut être interrompu pour maintenance, mise à jour, évolution technique, incident technique ou raisons de sécurité. Aucune disponibilité permanente n'est garantie.` },
  { title: '15. Propriété intellectuelle', content: `Tous les éléments composant MUZ QUIZ sont protégés par les lois relatives à la propriété intellectuelle : le nom MUZ QUIZ, les logos, l'interface graphique, les bases de données, les éléments visuels, les textes, les logiciels et les contenus créés par l'éditeur. Toute reproduction ou exploitation sans autorisation écrite préalable est interdite.` },
  { title: '16. Suspension ou suppression de compte', content: `L'éditeur peut suspendre ou supprimer un compte notamment en cas de non-respect des présentes CGU, de fraude, de tentative de piratage, d'usurpation d'identité, de comportement nuisible, de non-paiement ou d'utilisation abusive. La suspension ou la suppression peut intervenir sans indemnité ni remboursement.` },
  { title: '17. Responsabilité', content: `Le service est fourni « en l'état ». La responsabilité de l'éditeur est limitée aux dommages directs prouvés. En aucun cas la responsabilité de l'éditeur ne pourra excéder le montant total effectivement payé par l'utilisateur au cours des douze mois précédant le litige.` },
  { title: '18. Force majeure', content: `L'éditeur ne pourra être tenu responsable d'un manquement résultant d'un événement indépendant de sa volonté : catastrophe naturelle, panne majeure, cyberattaque, défaillance d'un prestataire, conflit social, décision administrative.` },
  { title: '19. Modification des CGU', content: `Les présentes CGU peuvent être modifiées à tout moment. Les utilisateurs seront informés des modifications importantes par tout moyen approprié. La poursuite de l'utilisation du service après modification vaut acceptation des nouvelles CGU.` },
  { title: '20. Droit applicable et règlement des litiges', content: `Les présentes CGU sont soumises au droit français. En cas de litige, les parties s'efforceront de rechercher une solution amiable avant toute procédure judiciaire. Les juridictions françaises seront seules compétentes, sous réserve des dispositions légales impératives applicables aux consommateurs.` },
  { title: '21. Contact', content: `Dimitri Bouville – La Caravane Game\nlacaravanegame@gmail.com` },
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
        <h1 className="text-3xl font-black mb-2" style={{ color: '#F0F4FF' }}>Conditions Générales d'Utilisation</h1>
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
          <Link href="/cgv" className="hover:opacity-70">CGV</Link>
        </div>
      </div>
    </div>
  );
}
