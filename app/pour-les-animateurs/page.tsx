import type { Metadata } from 'next';
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

export const metadata: Metadata = {
  title: 'Logiciel Quiz pour Animateurs — Quiz Image, Blind Test & IA',
  description: 'MuzQuiz est l\'outil des animateurs professionnels : créez des quiz personnalisés, quiz image, blind tests musicaux et animations assistées par IA. Préparez et animez depuis une seule interface.',
  keywords: [
    'logiciel quiz animateur', 'quiz événementiel', 'blind test animateur',
    'animation quiz professionnel', 'quiz image', 'quiz interactif smartphone',
    'outil animateur quiz', 'création quiz IA', 'quiz soirée entreprise',
    'animation quiz mariage', 'logiciel animation', 'quiz personnalisé',
    'quiz sans installation', 'animateur professionnel quiz',
  ],
  alternates: { canonical: 'https://www.muzquiz.fr/pour-les-animateurs' },
  openGraph: {
    title: 'MuzQuiz pour les Animateurs — Quiz Image, Blind Test & IA',
    description: 'Créez un quiz image, un blind test musical ou un quiz personnalisé en quelques minutes. Animez depuis une seule interface. Essai gratuit.',
    url: 'https://www.muzquiz.fr/pour-les-animateurs',
  },
};

const AVANTAGES = [
  {
    emoji: '✏️',
    title: 'Quiz personnalisés',
    desc: 'Créez vos propres quiz selon votre événement, votre client ou votre public. Chaque animation est unique : questions sur mesure, thème adapté, ton qui colle à l\'ambiance. Vous arrêtez de recycler les mêmes contenus génériques.',
  },
  {
    emoji: '🖼️',
    title: 'Quiz image interactifs',
    desc: 'Ajoutez des images, logos, célébrités, films, objets, lieux ou marques pour rendre vos animations plus immersives. Un quiz image capte immédiatement l\'attention et différencie vos prestations de celles qui reposent uniquement sur du texte.',
  },
  {
    emoji: '🎵',
    title: 'Blind tests musicaux',
    desc: 'Créez vos propres blind tests ou utilisez les contenus existants pour animer facilement vos soirées. Musique, années, genres, artistes : construisez des sessions musicales qui correspondent vraiment à votre audience.',
  },
  {
    emoji: '🏆',
    title: 'Classement en direct',
    desc: 'Affichez les scores en temps réel sur écran géant afin de maintenir la compétition jusqu\'à la dernière question. Vos participants vivent l\'événement intensément, et votre animation gagne en spectaculaire sans aucun effort supplémentaire de votre part.',
  },
  {
    emoji: '🎛️',
    title: 'Contrôle total de l\'animation',
    desc: 'Lancez, mettez en pause, reprenez ou passez à la question suivante depuis votre interface animateur. Vous gardez la maîtrise totale du rythme et du déroulé — pour coller à l\'énergie de la salle à chaque instant.',
  },
  {
    emoji: '🤖',
    title: 'Création rapide avec l\'IA',
    desc: 'Générez des questions et des quiz complets à partir d\'un simple thème afin de gagner un temps précieux dans la préparation de vos événements. Ce qui prenait une heure se fait en quelques minutes. Plus de temps pour votre animation, moins pour la préparation.',
  },
];

const COMPARAISON = [
  { label: 'Quiz personnalisés',           muz: true,  other: false },
  { label: 'Quiz image',                   muz: true,  other: false },
  { label: 'Blind Tests musicaux',         muz: true,  other: false },
  { label: 'Création assistée par IA',     muz: true,  other: false },
  { label: 'Classement en direct',         muz: true,  other: true  },
  { label: 'Contrôle de l\'animation',     muz: true,  other: true  },
  { label: 'Compatible smartphone',        muz: true,  other: false },
  { label: 'Sans installation',            muz: true,  other: false },
  { label: 'Import CSV / Excel',           muz: true,  other: false },
  { label: 'Gratuit pour commencer',       muz: true,  other: false },
];

export default function PourLesAnimateursPage() {
  return (
    <main style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 60%, #0D1B3E 100%)', minHeight: '100vh' }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(139,92,246,0.2)' }}>
        <Link href="/"><MuzquizLogo width={120} textSize="1.8rem" /></Link>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm font-bold hidden sm:block" style={{ color: 'rgba(240,244,255,0.5)' }}>Tarifs</Link>
          <Link href="/signup" className="text-sm font-black px-4 py-2 rounded-xl" style={{ background: '#8B5CF6', color: 'white' }}>
            Essayer gratuitement →
          </Link>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <div
          className="inline-block mb-5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
          style={{ background: 'rgba(139,92,246,0.12)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.25)' }}
        >
          🎤 Pour les animateurs
        </div>

        <h1 className="text-3xl sm:text-5xl font-black mb-6 leading-tight" style={{ color: '#F0F4FF' }}>
          Préparez et animez vos quiz<br />
          <span style={{ color: '#8B5CF6' }}>depuis une seule interface</span>
        </h1>

        <p className="text-base sm:text-lg mb-6 max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(240,244,255,0.65)' }}>
          Quiz personnalisé, quiz image, blind test musical, génération par IA — MuzQuiz réunit tous vos outils d&apos;animation en un seul endroit. En quelques minutes, votre événement est prêt. Sur scène, vous restez concentré sur l&apos;essentiel : votre public.
        </p>
        <p className="text-sm sm:text-base mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(240,244,255,0.4)' }}>
          Moins de préparation. Des animations plus modernes. Des clients qui renouvellent.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signup"
            className="px-8 py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.03]"
            style={{ background: '#8B5CF6', color: 'white' }}
          >
            Commencer gratuitement →
          </Link>
          <Link
            href="/pricing"
            className="px-8 py-4 rounded-2xl font-black text-base"
            style={{ background: 'rgba(255,255,255,0.07)', color: '#F0F4FF', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            Voir les tarifs
          </Link>
        </div>
      </section>

      {/* ── AVANTAGES ─────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-2xl sm:text-3xl font-black text-center mb-4" style={{ color: '#F0F4FF' }}>
          Conçu pour les animateurs professionnels
        </h2>
        <p className="text-center text-sm mb-10 max-w-xl mx-auto" style={{ color: 'rgba(240,244,255,0.45)' }}>
          Chaque fonctionnalité a été pensée pour vous faire gagner du temps en préparation et pour offrir une meilleure expérience à votre public.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AVANTAGES.map(a => (
            <div
              key={a.title}
              className="p-6 rounded-2xl flex flex-col gap-3"
              style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)' }}
            >
              <div className="text-3xl">{a.emoji}</div>
              <h3 className="font-black text-base" style={{ color: '#F0F4FF' }}>{a.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.5)' }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── POSITIONNEMENT ────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="p-8 rounded-3xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="text-2xl sm:text-3xl font-black mb-8 text-center" style={{ color: '#F0F4FF' }}>
            Pourquoi les animateurs choisissent MuzQuiz
          </h2>

          <div className="flex flex-col gap-6 text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.6)' }}>
            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>Un gain de temps réel sur chaque événement</h3>
              <p>
                Préparer une soirée quiz de qualité prenait des heures. Trouver les questions, les formater, les organiser, tester le déroulé... MuzQuiz compresse ce travail. L&apos;assistant IA génère des questions complètes en quelques secondes à partir d&apos;un thème. L&apos;import CSV ou Excel intègre vos contenus existants sans ressaisie. Et les packs réutilisables vous permettent de rentabiliser chaque contenu créé sur plusieurs événements. Résultat : vous passez moins de temps en coulisses et plus de temps à peaufiner votre animation.
              </p>
            </div>

            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>Des animations plus modernes que la concurrence</h3>
              <p>
                Un quiz papier ou une présentation PowerPoint statique, ça date. Vos clients — qu&apos;ils organisent un séminaire d&apos;entreprise, un mariage ou une soirée privée — s&apos;attendent aujourd&apos;hui à une expérience interactive. Avec MuzQuiz, chaque participant joue depuis son smartphone, sans rien installer. Les quiz image, les blind tests musicaux et le classement projeté en temps réel créent une atmosphère que les outils traditionnels ne peuvent pas reproduire. Vous proposez une prestation visiblement plus évoluée que ce qu&apos;ils ont déjà vécu.
              </p>
            </div>

            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>Une meilleure expérience pour votre public</h3>
              <p>
                L&apos;expérience joueur fait la réputation de l&apos;animateur. Quand les participants répondent depuis leur propre téléphone, voient leur score évoluer en direct et vivent la tension d&apos;un classement serré, ils s&apos;impliquent autrement. Plus de spectateurs passifs : tout le monde est dans la partie. Le quiz image ajoute une dimension visuelle immédiate. Le blind test musical crée des émotions collectives. Ces détails font la différence entre une animation correcte et une animation dont on parle encore la semaine suivante.
              </p>
            </div>

            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>Plus de valeur perçue, plus de renouvellements</h3>
              <p>
                Quand votre animation se différencie, votre tarif se justifie. Les clients qui ont vécu une soirée MuzQuiz comparent moins avec le prix d&apos;un quiz PowerPoint bricolé. Ils retiennent l&apos;expérience, l&apos;engagement, le côté professionnel. Et ils reviennent — pour le prochain séminaire, la prochaine fête de départ, le prochain événement. MuzQuiz n&apos;est pas juste un outil : c&apos;est un argument commercial qui renforce votre positionnement d&apos;animateur premium.
              </p>
            </div>

            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>Un contrôle complet, même dans les situations imprévues</h3>
              <p>
                Sur le terrain, tout ne se passe jamais exactement comme prévu. Une question ambiguë, un groupe qui avance trop vite, un temps mort à gérer. L&apos;interface animateur de MuzQuiz vous laisse la main à tout moment : vous pouvez passer une question, marquer une pause, revenir en arrière ou ajuster le rythme sans que le public voie quoi que ce soit. Vous gardez le contrôle de l&apos;animation, même quand vous improvisez.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TABLEAU COMPARATIF ────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-2xl sm:text-3xl font-black text-center mb-4" style={{ color: '#F0F4FF' }}>
          MuzQuiz vs. les solutions traditionnelles
        </h2>
        <p className="text-center text-sm mb-10" style={{ color: 'rgba(240,244,255,0.4)' }}>
          Ce que la plupart des outils existants ne font tout simplement pas.
        </p>
        <div className="overflow-hidden rounded-2xl" style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(139,92,246,0.15)' }}>
                <th className="text-left px-5 py-4 font-black" style={{ color: 'rgba(240,244,255,0.5)' }}>Fonctionnalité</th>
                <th className="px-4 py-4 font-black text-center" style={{ color: '#8B5CF6' }}>MuzQuiz</th>
                <th className="px-4 py-4 font-black text-center" style={{ color: 'rgba(240,244,255,0.3)' }}>Solutions traditionnelles</th>
              </tr>
            </thead>
            <tbody>
              {COMPARAISON.map((row, i) => (
                <tr
                  key={i}
                  style={{
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                  }}
                >
                  <td className="px-5 py-3.5 font-bold" style={{ color: 'rgba(240,244,255,0.7)' }}>{row.label}</td>
                  <td className="px-4 py-3.5 text-center text-base">
                    {row.muz
                      ? <span style={{ color: '#00E5D1' }}>✓</span>
                      : <span style={{ color: 'rgba(255,80,80,0.6)' }}>✕</span>}
                  </td>
                  <td className="px-4 py-3.5 text-center text-base">
                    {row.other
                      ? <span style={{ color: '#00E5D1' }}>✓</span>
                      : <span style={{ color: 'rgba(255,80,80,0.6)' }}>✕</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-2xl sm:text-3xl font-black text-center mb-4" style={{ color: '#F0F4FF' }}>
          Questions fréquentes
        </h2>
        <p className="text-center text-sm mb-10" style={{ color: 'rgba(240,244,255,0.4)' }}>
          Ce que les animateurs nous posent avant leur premier événement MuzQuiz.
        </p>
        <div className="flex flex-col gap-4">
          {[
            {
              q: 'Combien de joueurs peut-on avoir par partie ?',
              a: 'Le nombre de joueurs dépend de votre formule. L\'offre Découverte permet d\'accueillir jusqu\'à 10 joueurs simultanément — idéale pour tester l\'outil. L\'offre Essentiel monte jusqu\'à 20 joueurs, l\'offre Pro jusqu\'à 100 joueurs, et l\'offre Expert jusqu\'à 250 joueurs. Pour les grandes soirées d\'entreprise ou les événements à grande échelle, l\'offre Expert couvre la majorité des configurations rencontrées en animation professionnelle.',
            },
            {
              q: 'Peut-on créer un quiz image sur MuzQuiz ?',
              a: 'Oui, c\'est l\'une des fonctionnalités les plus utilisées par les animateurs. Vous pouvez intégrer des images directement dans vos questions : logos de marques, célébrités, monuments, affiches de films, objets iconiques... Le quiz image capte immédiatement l\'attention et diversifie votre animation au-delà des questions textuelles classiques.',
            },
            {
              q: 'L\'assistant IA génère vraiment des questions de qualité ?',
              a: 'L\'IA de MuzQuiz génère des questions complètes à partir d\'un thème ou d\'un contexte que vous lui donnez. Vous obtenez des propositions que vous pouvez valider, modifier ou compléter à votre convenance. L\'objectif n\'est pas de remplacer votre expertise, mais de vous éviter le travail de rédaction initiale — surtout pour des thèmes que vous traitez moins régulièrement.',
            },
            {
              q: 'Peut-on importer ses propres questions via Excel ou CSV ?',
              a: 'Oui. MuzQuiz accepte l\'import de questions depuis un fichier CSV ou Excel. Si vous avez déjà une base de questions dans un tableur, vous pouvez l\'intégrer directement sans tout ressaisir manuellement. C\'est un gain de temps significatif pour les animateurs qui ont constitué leur bibliothèque de contenu au fil des années.',
            },
            {
              q: 'Les participants doivent-ils installer une application ?',
              a: 'Non. Vos participants rejoignent la partie depuis leur navigateur web — Chrome, Safari, Firefox — en scannant un QR code ou en tapant un code sur muzquiz.fr. Pas de téléchargement, pas de compte à créer côté joueur. C\'est ce qui permet une mise en route rapide même avec un public peu technophile.',
            },
            {
              q: 'Peut-on utiliser MuzQuiz pour un événement d\'entreprise ?',
              a: 'Absolument. MuzQuiz est particulièrement adapté aux séminaires, team buildings, soirées de fin d\'année et événements corporate. Vous pouvez personnaliser intégralement les questions — y compris en intégrant des éléments spécifiques à l\'entreprise cliente : produits, historique, équipes, valeurs. C\'est ce qui fait toute la différence entre une animation générique et une animation mémorable.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl"
              style={{ background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.12)' }}
            >
              <h3 className="font-black text-sm sm:text-base mb-3" style={{ color: '#F0F4FF' }}>{item.q}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.55)' }}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────────────────── */}
      <section className="max-w-2xl mx-auto px-6 pb-20 text-center">
        <div
          className="p-10 rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(0,229,209,0.07) 100%)',
            border: '1.5px solid rgba(139,92,246,0.28)',
          }}
        >
          <div className="text-4xl mb-4">🎤</div>
          <h2 className="text-2xl sm:text-3xl font-black mb-4" style={{ color: '#F0F4FF' }}>
            Testez sur votre prochaine animation
          </h2>
          <p className="text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed" style={{ color: 'rgba(240,244,255,0.55)' }}>
            Créez votre compte, importez vos questions ou générez-en avec l&apos;IA, lancez une partie test. En moins de cinq minutes, vous savez exactement ce que MuzQuiz peut apporter à vos événements — sans avoir sorti votre carte bancaire.
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.03]"
            style={{ background: '#8B5CF6', color: 'white' }}
          >
            Créer mon compte gratuitement →
          </Link>
          <p className="mt-4 text-xs" style={{ color: 'rgba(240,244,255,0.3)' }}>
            Gratuit pour commencer · Sans installation · Import CSV inclus
          </p>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="text-center pb-8" style={{ color: 'rgba(240,244,255,0.2)', fontSize: '12px' }}>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-3 px-4">
          <Link href="/" style={{ color: 'rgba(240,244,255,0.3)' }}>Accueil</Link>
          <Link href="/pour-les-bars" style={{ color: 'rgba(240,244,255,0.3)' }}>Bars &amp; Restaurants</Link>
          <Link href="/pour-les-evenements" style={{ color: 'rgba(240,244,255,0.3)' }}>Événements</Link>
          <Link href="/pour-les-streamers" style={{ color: 'rgba(240,244,255,0.3)' }}>Streamers</Link>
          <Link href="/pricing" style={{ color: 'rgba(240,244,255,0.3)' }}>Tarifs</Link>
        </div>
        MUZQUIZ © 2025 — Quiz &amp; Blind Test en temps réel
      </footer>

    </main>
  );
}
