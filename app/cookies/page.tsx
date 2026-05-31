// app/cookies/page.tsx
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

export const metadata = { title: 'Politique de cookies — MUZQUIZ' };

const sections = [
  { title: '1. Qu\'est-ce qu\'un cookie ?', content: `Un cookie est un petit fichier texte déposé sur votre appareil lors de votre navigation sur le site MUZ QUIZ. Les cookies permettent notamment : d'assurer le bon fonctionnement du site, de mémoriser certaines préférences, d'améliorer l'expérience utilisateur, de mesurer l'audience et les performances du service, de renforcer la sécurité.\n\nLe terme « cookies » désigne également les technologies similaires telles que le localStorage ou les identifiants techniques utilisés par certains services.` },
  { title: '2. Responsable du traitement', content: `Dimitri Bouville – La Caravane Game\nSIRET : 80424567800029\n29 rue du Traité de Rome, 14370 Moult-Chicheboville, France\nlacaravanegame@gmail.com` },
  { title: '3. Les cookies utilisés', content: `Cookies strictement nécessaires : indispensables au fonctionnement du site (authentification, maintien de la session, sécurisation des connexions, fonctionnement des quiz et parties en cours, gestion des abonnements). Ces cookies ne nécessitent pas de consentement préalable.\n\nCookies de sécurité : prévenir les accès frauduleux, détecter les comportements suspects, protéger les comptes utilisateurs, limiter les abus. Nécessaires à la sécurité du service.\n\nCookies de mesure d'audience : MUZ QUIZ peut utiliser Google Analytics pour mesurer la fréquentation, analyser l'utilisation des fonctionnalités et améliorer l'expérience utilisateur. Ces cookies sont déposés uniquement après obtention du consentement lorsque celui-ci est requis.\n\nStockage local (localStorage) : mémoriser certaines préférences utilisateur, l'état d'une partie, les paramètres de jeu. Lorsque ces données sont strictement nécessaires au fonctionnement, aucun consentement préalable n'est requis.` },
  { title: '4. Cookies tiers', content: `Google — Google Analytics, authentification Google, services techniques associés. Politique : https://policies.google.com/privacy\n\nStripe — sécurité des paiements, prévention de la fraude, traitement des transactions. Politique : https://stripe.com/privacy\n\nSupabase — authentification, gestion des sessions, sécurisation des connexions. Politique : https://supabase.com/privacy\n\nDiscord (connexion facultative) — cookies techniques d'authentification. Politique : https://discord.com/privacy` },
  { title: '5. Gestion du consentement', content: `Lors de votre première visite sur le site, un bandeau d'information peut vous permettre d'accepter les cookies facultatifs, de les refuser ou de personnaliser vos choix. Votre décision est conservée pendant une durée conforme à la réglementation applicable.` },
  { title: '6. Durée de conservation', content: `Les cookies sont conservés pendant une durée limitée proportionnée à leur finalité. Les durées exactes peuvent varier selon le type de cookie, le navigateur utilisé et les paramètres définis par les prestataires concernés.` },
  { title: '7. Paramétrage du navigateur', content: `Vous pouvez configurer votre navigateur afin de refuser tout ou partie des cookies, supprimer les cookies déjà enregistrés ou être informé avant le dépôt d'un cookie. Le refus de certains cookies peut toutefois entraîner une dégradation du fonctionnement du service.` },
  { title: '8. Vos droits', content: `Les traitements réalisés au moyen de cookies contenant des données personnelles sont soumis au RGPD. Vous disposez notamment d'un droit d'accès, de rectification, d'effacement, d'opposition, de limitation et de portabilité lorsqu'il est applicable.` },
  { title: '9. Contact', content: `Pour toute question relative aux cookies ou à la protection des données :\nlacaravanegame@gmail.com` },
  { title: '10. Modification de la politique de cookies', content: `La présente politique peut être modifiée à tout moment afin de tenir compte des évolutions légales, d'intégrer de nouveaux services ou d'améliorer la transparence des traitements réalisés. La date figurant en tête du document sera mise à jour lors de chaque modification.` },
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
          <Link href="/confidentialite" className="hover:opacity-70">Politique de confidentialité</Link>
          <Link href="/cgu" className="hover:opacity-70">CGU</Link>
          <Link href="/cgv" className="hover:opacity-70">CGV</Link>
        </div>
      </div>
    </div>
  );
}
