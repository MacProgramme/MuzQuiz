// app/cookies/page.tsx
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

export const metadata = {
  title: 'Politique de cookies — MUZQUIZ',
  alternates: { canonical: 'https://www.muzquiz.fr/cookies' },
};

const list = (items: string[]) => (
  <ul className="mt-2 flex flex-col gap-1 ml-3">
    {items.map(i => <li key={i} style={{ color: 'rgba(240,244,255,0.65)' }}>— {i}</li>)}
  </ul>
);

const SECTIONS = [
  {
    num: '1', title: "Qu'est-ce qu'un cookie ?",
    content: (
      <>
        <p>Un cookie est un petit fichier texte déposé sur votre appareil (ordinateur, smartphone ou tablette) lors de votre navigation sur le site MUZ QUIZ.</p>
        <p className="mt-3">Les cookies permettent notamment :</p>
        {list(["d'assurer le bon fonctionnement du site", "de mémoriser certaines préférences", "d'améliorer l'expérience utilisateur", "de mesurer l'audience et les performances du service", "de renforcer la sécurité"])}
        <p className="mt-3">Le terme « cookies » désigne également les technologies similaires telles que le localStorage ou les identifiants techniques utilisés par certains services.</p>
      </>
    ),
  },
  {
    num: '2', title: 'Responsable du traitement',
    content: (
      <div className="p-4 rounded-xl text-sm flex flex-col gap-1.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p><strong style={{ color: '#F0F4FF' }}>Dimitri Bouville – La Caravane Game</strong></p>
        <p><span style={{ color: 'rgba(240,244,255,0.5)' }}>SIRET :</span> 80424567800029</p>
        <p><span style={{ color: 'rgba(240,244,255,0.5)' }}>Adresse :</span> 29 rue du Traité de Rome, 14370 Moult-Chicheboville, France</p>
        <p><span style={{ color: 'rgba(240,244,255,0.5)' }}>E-mail :</span>{' '}
          <a href="mailto:lacaravanegame@gmail.com" className="underline" style={{ color: '#8B5CF6' }}>lacaravanegame@gmail.com</a>
        </p>
      </div>
    ),
  },
  {
    num: '3', title: 'Les cookies utilisés',
    content: (
      <>
        {[
          { label: 'Cookies strictement nécessaires', text: 'Ces cookies sont indispensables au fonctionnement du site. Conformément à la réglementation, ils ne nécessitent pas de consentement préalable.', items: ["l'authentification des utilisateurs", "le maintien de la session", "la sécurisation des connexions", "la sauvegarde des préférences essentielles", "le fonctionnement des quiz et parties en cours", "la gestion des abonnements"] },
          { label: 'Cookies de sécurité', text: 'Ces cookies sont nécessaires à la sécurité du service.', items: ["prévenir les accès frauduleux", "détecter les comportements suspects", "protéger les comptes utilisateurs", "limiter les abus et tentatives d'attaque"] },
          { label: 'Cookies de mesure d\'audience', text: 'MUZ QUIZ peut utiliser Google Analytics. Ces cookies sont déposés uniquement après obtention du consentement lorsque celui-ci est requis.', items: ["pages consultées", "durée de navigation", "type d'appareil", "navigateur utilisé", "provenance approximative des visites", "événements de navigation"] },
          { label: 'Stockage local (localStorage)', text: 'Le site peut utiliser le stockage local du navigateur afin de mémoriser certaines préférences et l\'état de jeu. Aucun consentement préalable n\'est requis lorsque ces données sont strictement nécessaires.', items: [] },
        ].map(g => (
          <div key={g.label} className="mt-4">
            <p className="font-bold" style={{ color: '#F0F4FF' }}>{g.label}</p>
            <p className="mt-1">{g.text}</p>
            {g.items.length > 0 && list(g.items)}
          </div>
        ))}
      </>
    ),
  },
  {
    num: '4', title: 'Cookies tiers',
    content: (
      <>
        <p>Certains services intégrés au site peuvent déposer leurs propres cookies.</p>
        <div className="mt-4 flex flex-col gap-3">
          {[
            { name: 'Google', services: ['Google Analytics', 'authentification Google', 'services techniques associés'], url: 'https://policies.google.com/privacy' },
            { name: 'Stripe', services: ['assurer la sécurité des paiements', 'prévenir la fraude', 'permettre le traitement des transactions'], url: 'https://stripe.com/privacy' },
            { name: 'Supabase', services: ['l\'authentification', 'la gestion des sessions', 'la sécurisation des connexions'], url: 'https://supabase.com/privacy' },
            { name: 'Discord', services: ['cookies techniques lors de la connexion', 'échange d\'informations d\'authentification'], url: 'https://discord.com/privacy' },
          ].map(p => (
            <div key={p.name} className="p-4 rounded-xl text-sm" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="font-black mb-1" style={{ color: '#F0F4FF' }}>{p.name}</p>
              {list(p.services)}
              <p className="mt-2"><span style={{ color: 'rgba(240,244,255,0.5)' }}>Politique de confidentialité :</span>{' '}
                <a href={p.url} target="_blank" rel="noreferrer" className="underline" style={{ color: '#8B5CF6' }}>{p.url}</a>
              </p>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    num: '5', title: 'Gestion du consentement',
    content: <p>Lors de votre première visite sur le site, un bandeau d&apos;information peut vous permettre d&apos;accepter les cookies facultatifs, de les refuser ou de personnaliser vos choix. Votre décision est conservée pendant une durée conforme à la réglementation applicable. Vous pouvez modifier votre choix à tout moment depuis les paramètres prévus à cet effet lorsqu&apos;ils sont disponibles.</p>,
  },
  {
    num: '6', title: 'Durée de conservation',
    content: <p>Les cookies sont conservés pendant une durée limitée proportionnée à leur finalité. Les durées exactes peuvent varier selon le type de cookie, le navigateur utilisé et les paramètres définis par les prestataires concernés. Les informations liées au consentement sont conservées conformément aux recommandations de la CNIL.</p>,
  },
  {
    num: '7', title: 'Paramétrage du navigateur',
    content: <>
      <p>Vous pouvez configurer votre navigateur afin de :</p>
      {list(['refuser tout ou partie des cookies', 'supprimer les cookies déjà enregistrés', 'être informé avant le dépôt d\'un cookie'])}
      <p className="mt-3">Le refus de certains cookies peut toutefois entraîner une dégradation du fonctionnement du service.</p>
    </>,
  },
  {
    num: '8', title: 'Vos droits',
    content: <>
      <p>Les traitements réalisés au moyen de cookies contenant des données personnelles sont soumis au RGPD. Vous disposez notamment :</p>
      {list(["d'un droit d'accès", "d'un droit de rectification", "d'un droit d'effacement", "d'un droit d'opposition", "d'un droit à la limitation", "d'un droit à la portabilité lorsque celui-ci est applicable"])}
    </>,
  },
  {
    num: '9', title: 'Contact',
    content: <p>Pour toute question relative aux cookies ou à la protection des données : <a href="mailto:lacaravanegame@gmail.com" className="underline" style={{ color: '#8B5CF6' }}>lacaravanegame@gmail.com</a></p>,
  },
  {
    num: '10', title: 'Modification de la politique de cookies',
    content: <p>La présente politique peut être modifiée à tout moment afin de tenir compte des évolutions légales, d&apos;intégrer de nouveaux services ou d&apos;améliorer la transparence des traitements réalisés. La date figurant en tête du document sera mise à jour lors de chaque modification.</p>,
  },
];

export default function CookiesPage() {
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
        <h1 className="text-3xl font-black mb-2" style={{ color: '#F0F4FF' }}>Politique de cookies</h1>
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
          <Link href="/confidentialite" className="hover:opacity-80">Confidentialité</Link>
          <Link href="/cgu" className="hover:opacity-80">CGU</Link>
          <Link href="/cgv" className="hover:opacity-80">CGV</Link>
        </div>
      </div>
    </div>
  );
}
