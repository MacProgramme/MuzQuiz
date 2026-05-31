// app/mentions-legales/page.tsx
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

export const metadata = { title: 'Mentions légales — MUZQUIZ' };

const sections = [
  { title: '1. Éditeur du site', content: `Le site MUZ QUIZ, accessible à l'adresse https://www.muzquiz.fr, est édité par :

La Caravane Game
Exploitant : Dimitri Bouville
Statut : Micro-entrepreneur
SIRET : 80424567800029
Adresse : 29 rue du Traité de Rome, 14370 Moult-Chicheboville, France
Adresse électronique : lacaravanegame@gmail.com
Directeur de la publication : Dimitri Bouville` },
  { title: '2. Hébergement', content: `Le site est hébergé par :

Vercel Inc.
340 Pine Street, Suite 701
San Francisco, CA 94104 – États-Unis
Site internet : https://vercel.com` },
  { title: '3. Prestataires techniques', content: `Le fonctionnement de MUZ QUIZ peut faire appel aux services suivants :

Supabase Inc. — base de données, authentification des utilisateurs, stockage de fichiers, sécurisation des données. (https://supabase.com)

Stripe Payments Europe Ltd. — traitement sécurisé des paiements, gestion des abonnements, facturation. (https://stripe.com)

Google LLC — authentification Google, statistiques de fréquentation, services techniques associés. (https://policies.google.com)

Discord Inc. — authentification utilisateur facultative. (https://discord.com)` },
  { title: '4. Objet du site', content: `MUZ QUIZ est une plateforme de quiz interactifs permettant notamment : la création de quiz personnalisés, l'organisation de parties multijoueurs, la création de blind tests, l'accès à des fonctionnalités premium par abonnement, la gestion de classements et statistiques de jeu.

Le service est destiné exclusivement aux personnes majeures.` },
  { title: '5. Propriété intellectuelle', content: `L'ensemble des éléments présents sur le site MUZ QUIZ est protégé par les dispositions du Code de la propriété intellectuelle et les conventions internationales applicables.

Sont notamment protégés : le nom MUZ QUIZ, les logos, les graphismes, les illustrations, les interfaces, les bases de données, les logiciels, les contenus créés par l'éditeur, les éléments sonores et visuels.

Toute reproduction, représentation, diffusion, adaptation ou exploitation, totale ou partielle, sans autorisation écrite préalable de l'éditeur est strictement interdite.` },
  { title: '6. Contenus publiés par les utilisateurs', content: `Les utilisateurs peuvent créer, importer ou publier des contenus dans le cadre du service. Chaque utilisateur demeure seul responsable des contenus qu'il publie, des droits attachés à ces contenus et du respect de la législation applicable.

L'utilisateur garantit disposer de l'ensemble des droits nécessaires concernant les textes, images, musiques ou autres éléments qu'il utilise.

L'éditeur se réserve le droit de supprimer tout contenu illicite, frauduleux, diffamatoire, discriminatoire, violent ou contraire aux présentes conditions d'utilisation.` },
  { title: '7. Responsabilité', content: `L'éditeur met en œuvre les moyens raisonnables nécessaires afin d'assurer le bon fonctionnement du service. Toutefois, il ne garantit pas l'absence d'erreurs, d'interruptions, la disponibilité permanente du site, ni l'absence totale de failles ou dysfonctionnements.

L'éditeur ne pourra être tenu responsable d'une interruption temporaire du service, d'une panne de réseau, d'une défaillance d'un prestataire tiers, d'une mauvaise utilisation du site par l'utilisateur, d'un cas de force majeure ou de dommages indirects résultant de l'utilisation du service.` },
  { title: '8. Données personnelles', content: `Les modalités de collecte et de traitement des données personnelles sont décrites dans la Politique de confidentialité accessible sur le site. L'utilisateur est invité à la consulter afin de connaître ses droits et les conditions de traitement de ses données.` },
  { title: '9. Cookies', content: `Le site utilise des cookies et technologies similaires nécessaires à son fonctionnement et, le cas échéant, à la mesure d'audience. Les modalités détaillées sont présentées dans la Politique de cookies disponible sur le site.` },
  { title: '10. Sécurité', content: `L'éditeur met en œuvre des mesures techniques et organisationnelles destinées à protéger les données et les systèmes informatiques contre les accès non autorisés, les pertes, les altérations ou les divulgations non autorisées. Malgré ces mesures, aucun système informatique ne peut garantir une sécurité absolue.` },
  { title: '11. Liens externes', content: `Le site peut contenir des liens vers des sites internet tiers. L'éditeur n'exerce aucun contrôle sur ces sites et décline toute responsabilité concernant leur contenu, leur disponibilité, leurs pratiques et leurs politiques de confidentialité.` },
  { title: '12. Force majeure', content: `La responsabilité de l'éditeur ne pourra être engagée lorsqu'un manquement résulte d'un événement indépendant de sa volonté, notamment : catastrophe naturelle, panne majeure, cyberattaque, conflit social, décision administrative, défaillance d'un prestataire essentiel.` },
  { title: '13. Droit applicable', content: `Les présentes mentions légales sont régies par le droit français. Tout litige relatif à leur interprétation ou à leur exécution relève de la compétence des juridictions françaises, sous réserve des dispositions légales impératives applicables aux consommateurs.` },
  { title: '14. Contact', content: `Pour toute question concernant le site ou les présentes mentions légales :

La Caravane Game – Dimitri Bouville
E-mail : lacaravanegame@gmail.com` },
];

export default function MentionsLegales() {
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

        <h1 className="text-3xl font-black mb-2" style={{ color: '#F0F4FF' }}>Mentions légales</h1>
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
          <Link href="/confidentialite" className="hover:opacity-70">Politique de confidentialité</Link>
          <Link href="/cookies" className="hover:opacity-70">Politique de cookies</Link>
          <Link href="/cgu" className="hover:opacity-70">CGU</Link>
          <Link href="/cgv" className="hover:opacity-70">CGV</Link>
        </div>
      </div>
    </div>
  );
}
