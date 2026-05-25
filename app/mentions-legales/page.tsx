// app/mentions-legales/page.tsx
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

export const metadata = {
  title: 'Mentions légales — MUZQUIZ',
  alternates: { canonical: 'https://www.muzquiz.fr/mentions-legales' },
};

const SECTIONS = [
  {
    num: '1',
    title: 'Éditeur du site',
    content: (
      <>
        <p>
          Le site <strong style={{ color: '#F0F4FF' }}>MUZ QUIZ</strong>, accessible à l&apos;adresse{' '}
          <a href="https://www.muzquiz.fr" className="underline" style={{ color: '#8B5CF6' }}>https://www.muzquiz.fr</a>,
          est édité par :
        </p>
        <div className="mt-4 p-4 rounded-xl text-sm flex flex-col gap-1.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p><strong style={{ color: '#F0F4FF' }}>La Caravane Game</strong></p>
          <p><span style={{ color: 'rgba(240,244,255,0.5)' }}>Exploitant :</span> Dimitri Bouville</p>
          <p><span style={{ color: 'rgba(240,244,255,0.5)' }}>Statut :</span> Micro-entrepreneur</p>
          <p><span style={{ color: 'rgba(240,244,255,0.5)' }}>SIRET :</span> 80424567800029</p>
          <p><span style={{ color: 'rgba(240,244,255,0.5)' }}>Adresse :</span> 29 rue du Traité de Rome, 14370 Moult-Chicheboville, France</p>
          <p><span style={{ color: 'rgba(240,244,255,0.5)' }}>E-mail :</span>{' '}
            <a href="mailto:lacaravanegame@gmail.com" className="underline" style={{ color: '#8B5CF6' }}>lacaravanegame@gmail.com</a>
          </p>
          <p><span style={{ color: 'rgba(240,244,255,0.5)' }}>Directeur de la publication :</span> Dimitri Bouville</p>
        </div>
      </>
    ),
  },
  {
    num: '2',
    title: 'Hébergement',
    content: (
      <>
        <p>Le site est hébergé par :</p>
        <div className="mt-4 p-4 rounded-xl text-sm flex flex-col gap-1.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p><strong style={{ color: '#F0F4FF' }}>Vercel Inc.</strong></p>
          <p><span style={{ color: 'rgba(240,244,255,0.5)' }}>Adresse :</span> 340 Pine Street, Suite 701, San Francisco, CA 94104, États-Unis</p>
          <p><span style={{ color: 'rgba(240,244,255,0.5)' }}>Site :</span>{' '}
            <a href="https://vercel.com" target="_blank" rel="noreferrer" className="underline" style={{ color: '#8B5CF6' }}>https://vercel.com</a>
          </p>
        </div>
      </>
    ),
  },
  {
    num: '3',
    title: 'Prestataires techniques',
    content: (
      <>
        <p>Le fonctionnement de MUZ QUIZ peut faire appel aux services suivants :</p>
        <div className="mt-4 flex flex-col gap-3">
          {[
            {
              name: 'Supabase Inc.',
              services: ['base de données', 'authentification des utilisateurs', 'stockage de fichiers', 'sécurisation des données'],
              url: 'https://supabase.com',
            },
            {
              name: 'Stripe Payments Europe Ltd.',
              services: ['traitement sécurisé des paiements', 'gestion des abonnements', 'facturation'],
              url: 'https://stripe.com',
            },
            {
              name: 'Google LLC',
              services: ['authentification Google', 'statistiques de fréquentation (Google Analytics)', 'services techniques associés'],
              url: 'https://policies.google.com',
            },
            {
              name: 'Discord Inc.',
              services: ['authentification utilisateur facultative'],
              url: 'https://discord.com',
            },
          ].map(p => (
            <div key={p.name} className="p-4 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="font-black mb-2" style={{ color: '#F0F4FF' }}>{p.name}</p>
              <p className="mb-1" style={{ color: 'rgba(240,244,255,0.5)' }}>Services utilisés :</p>
              <ul className="flex flex-col gap-0.5 mb-2 ml-3">
                {p.services.map(s => (
                  <li key={s} style={{ color: 'rgba(240,244,255,0.65)' }}>— {s}</li>
                ))}
              </ul>
              <p><span style={{ color: 'rgba(240,244,255,0.5)' }}>Site :</span>{' '}
                <a href={p.url} target="_blank" rel="noreferrer" className="underline" style={{ color: '#8B5CF6' }}>{p.url}</a>
              </p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    num: '4',
    title: 'Objet du site',
    content: (
      <>
        <p>MUZ QUIZ est une plateforme de quiz interactifs permettant notamment :</p>
        <ul className="mt-3 flex flex-col gap-1 ml-3">
          {[
            'la création de quiz personnalisés',
            'l\'organisation de parties multijoueurs',
            'l\'utilisation d\'un système de buzzer virtuel',
            'la création de blind tests',
            'l\'accès à des fonctionnalités premium par abonnement',
            'la gestion de classements et statistiques de jeu',
          ].map(item => (
            <li key={item} style={{ color: 'rgba(240,244,255,0.65)' }}>— {item}</li>
          ))}
        </ul>
        <p className="mt-3">Le service est destiné exclusivement aux personnes majeures.</p>
      </>
    ),
  },
  {
    num: '5',
    title: 'Propriété intellectuelle',
    content: (
      <>
        <p>
          L&apos;ensemble des éléments présents sur le site MUZ QUIZ est protégé par les dispositions du Code de la propriété intellectuelle et les conventions internationales applicables.
        </p>
        <p className="mt-3">Sont notamment protégés :</p>
        <ul className="mt-2 flex flex-col gap-1 ml-3">
          {[
            'le nom MUZ QUIZ',
            'les logos',
            'les graphismes',
            'les illustrations',
            'les interfaces',
            'les bases de données',
            'les logiciels',
            'les contenus créés par l\'éditeur',
            'les éléments sonores et visuels',
          ].map(item => (
            <li key={item} style={{ color: 'rgba(240,244,255,0.65)' }}>— {item}</li>
          ))}
        </ul>
        <p className="mt-3">
          Toute reproduction, représentation, diffusion, adaptation ou exploitation, totale ou partielle, sans autorisation écrite préalable de l&apos;éditeur est strictement interdite.
        </p>
        <p className="mt-2">
          Toute utilisation non autorisée est susceptible d&apos;engager la responsabilité civile et pénale de son auteur.
        </p>
      </>
    ),
  },
  {
    num: '6',
    title: 'Contenus publiés par les utilisateurs',
    content: (
      <>
        <p>Les utilisateurs peuvent créer, importer ou publier des contenus dans le cadre du service.</p>
        <p className="mt-3">Chaque utilisateur demeure seul responsable :</p>
        <ul className="mt-2 flex flex-col gap-1 ml-3">
          {[
            'des contenus qu\'il publie',
            'des droits attachés à ces contenus',
            'du respect de la législation applicable',
          ].map(item => (
            <li key={item} style={{ color: 'rgba(240,244,255,0.65)' }}>— {item}</li>
          ))}
        </ul>
        <p className="mt-3">
          L&apos;utilisateur garantit disposer de l&apos;ensemble des droits nécessaires concernant les textes, images, musiques ou autres éléments qu&apos;il utilise.
        </p>
        <p className="mt-3">L&apos;éditeur se réserve le droit de supprimer tout contenu illicite, frauduleux, diffamatoire, discriminatoire, violent ou contraire aux présentes conditions d&apos;utilisation.</p>
      </>
    ),
  },
  {
    num: '7',
    title: 'Responsabilité',
    content: (
      <>
        <p>
          L&apos;éditeur met en œuvre les moyens raisonnables nécessaires afin d&apos;assurer le bon fonctionnement du service. Toutefois, il ne garantit pas l&apos;absence d&apos;erreurs, d&apos;interruptions, ni la disponibilité permanente du site.
        </p>
        <p className="mt-3">L&apos;éditeur ne pourra être tenu responsable :</p>
        <ul className="mt-2 flex flex-col gap-1 ml-3">
          {[
            'd\'une interruption temporaire du service',
            'd\'une panne de réseau',
            'd\'une défaillance d\'un prestataire tiers',
            'd\'une mauvaise utilisation du site par l\'utilisateur',
            'd\'un cas de force majeure',
            'de dommages indirects résultant de l\'utilisation du service',
          ].map(item => (
            <li key={item} style={{ color: 'rgba(240,244,255,0.65)' }}>— {item}</li>
          ))}
        </ul>
      </>
    ),
  },
  {
    num: '8',
    title: 'Données personnelles',
    content: (
      <p>
        Les modalités de collecte et de traitement des données personnelles sont décrites dans la{' '}
        <Link href="/confidentialite" className="underline" style={{ color: '#8B5CF6' }}>Politique de confidentialité</Link>{' '}
        accessible sur le site. L&apos;utilisateur est invité à la consulter afin de connaître ses droits et les conditions de traitement de ses données.
      </p>
    ),
  },
  {
    num: '9',
    title: 'Cookies',
    content: (
      <p>
        Le site utilise des cookies et technologies similaires nécessaires à son fonctionnement et, le cas échéant, à la mesure d&apos;audience. Les modalités détaillées sont présentées dans la Politique de cookies disponible sur le site.
      </p>
    ),
  },
  {
    num: '10',
    title: 'Sécurité',
    content: (
      <p>
        L&apos;éditeur met en œuvre des mesures techniques et organisationnelles destinées à protéger les données et les systèmes informatiques contre les accès non autorisés, les pertes, les altérations ou les divulgations non autorisées. Malgré ces mesures, aucun système informatique ne peut garantir une sécurité absolue.
      </p>
    ),
  },
  {
    num: '11',
    title: 'Liens externes',
    content: (
      <p>
        Le site peut contenir des liens vers des sites internet tiers. L&apos;éditeur n&apos;exerce aucun contrôle sur ces sites et décline toute responsabilité concernant leur contenu, leur disponibilité, leurs pratiques ou leurs politiques de confidentialité.
      </p>
    ),
  },
  {
    num: '12',
    title: 'Force majeure',
    content: (
      <>
        <p>La responsabilité de l&apos;éditeur ne pourra être engagée lorsqu&apos;un manquement résulte d&apos;un événement indépendant de sa volonté, notamment :</p>
        <ul className="mt-2 flex flex-col gap-1 ml-3">
          {[
            'catastrophe naturelle',
            'panne majeure',
            'cyberattaque',
            'conflit social',
            'décision administrative',
            'défaillance d\'un prestataire essentiel',
          ].map(item => (
            <li key={item} style={{ color: 'rgba(240,244,255,0.65)' }}>— {item}</li>
          ))}
        </ul>
      </>
    ),
  },
  {
    num: '13',
    title: 'Droit applicable',
    content: (
      <p>
        Les présentes mentions légales sont régies par le droit français. Tout litige relatif à leur interprétation ou à leur exécution relève de la compétence des juridictions françaises, sous réserve des dispositions légales impératives applicables aux consommateurs.
      </p>
    ),
  },
  {
    num: '14',
    title: 'Contact',
    content: (
      <div className="p-4 rounded-xl text-sm flex flex-col gap-1.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p><strong style={{ color: '#F0F4FF' }}>La Caravane Game</strong></p>
        <p><span style={{ color: 'rgba(240,244,255,0.5)' }}>Dimitri Bouville</span></p>
        <p><span style={{ color: 'rgba(240,244,255,0.5)' }}>E-mail :</span>{' '}
          <a href="mailto:lacaravanegame@gmail.com" className="underline" style={{ color: '#8B5CF6' }}>lacaravanegame@gmail.com</a>
        </p>
      </div>
    ),
  },
];

export default function MentionsLegales() {
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>
      <div className="max-w-2xl mx-auto px-6 py-12">

        {/* Nav */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="text-sm font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
            style={{ background: 'rgba(255,0,170,0.08)', color: 'rgba(255,0,170,0.7)', border: '1px solid rgba(255,0,170,0.2)' }}>
            ← Accueil
          </Link>
          <MuzquizLogo width={80} textSize="1.2rem" />
        </div>

        <h1 className="text-3xl font-black mb-2" style={{ color: '#F0F4FF' }}>Mentions légales</h1>
        <p className="text-sm mb-10" style={{ color: 'rgba(240,244,255,0.35)' }}>Dernière mise à jour : mai 2026</p>

        <div className="flex flex-col gap-8" style={{ color: 'rgba(240,244,255,0.72)', lineHeight: '1.75', fontSize: '0.9rem' }}>
          {SECTIONS.map(s => (
            <section key={s.num}>
              <h2 className="text-base font-black mb-4" style={{ color: '#FF00AA' }}>
                {s.num}. {s.title}
              </h2>
              {s.content}
            </section>
          ))}
        </div>

        {/* Footer liens */}
        <div className="mt-14 pt-6 flex flex-wrap gap-4 text-xs font-bold"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: 'rgba(240,244,255,0.3)' }}>
          <Link href="/cgu" className="hover:opacity-80">CGU</Link>
          <Link href="/cgv" className="hover:opacity-80">CGV</Link>
          <Link href="/confidentialite" className="hover:opacity-80">Confidentialité</Link>
        </div>

      </div>
    </div>
  );
}
