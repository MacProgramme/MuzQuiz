import type { Metadata } from 'next';
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

export const metadata: Metadata = {
  title: 'Quiz Twitch, Blind Test et Jeux Interactifs pour Streamers',
  description: 'Faites participer votre communauté en direct avec MuzQuiz : quiz Twitch, blind test musical, quiz image. Vos viewers jouent depuis leur smartphone sans rien télécharger.',
  keywords: [
    'quiz twitch', 'blind test twitch', 'jeu interactif twitch',
    'jeu pour streamer', 'jeu pour viewers', 'quiz communauté twitch',
    'quiz musical twitch', 'quiz image twitch', 'animation twitch',
    'quiz en direct', 'jeu interactif streaming', 'quiz youtube live',
    'quiz kick', 'jeu communauté streaming', 'quiz stream',
  ],
  alternates: { canonical: 'https://www.muzquiz.fr/quiz-streamer' },
  openGraph: {
    title: 'Quiz Twitch & Blind Test pour Streamers — MuzQuiz',
    description: 'Créez un quiz Twitch, un blind test musical ou un quiz image pour votre communauté. Vos viewers jouent depuis leur smartphone. Aucun téléchargement.',
    url: 'https://www.muzquiz.fr/quiz-streamer',
  },
};

const AVANTAGES = [
  {
    emoji: '✏️',
    title: 'Quiz personnalisés',
    desc: 'Créez des quiz autour de vos inside jokes, votre univers, vos emotes, votre historique de stream. Vos viewers répondent à des questions que seuls ceux qui vous suivent vraiment peuvent réussir — c\'est exactement ce qui crée de l\'engagement.',
  },
  {
    emoji: '🖼️',
    title: 'Quiz images interactifs',
    desc: 'Reconnaître un personnage de jeu vidéo, un logo de studio, une capture d\'écran floue, une célébrité de la scène gaming ou un mème culte — le quiz image sur Twitch crée des réactions immédiates dans le chat. Chaque image est une bombe à retardement.',
  },
  {
    emoji: '🎵',
    title: 'Blind tests musicaux',
    desc: 'OST de jeux vidéo, génériques cultes, musiques de votre playlist de stream — transformez votre bibliothèque musicale en blind test interactif. Vos viewers adorent prouver qu\'ils reconnaissent vos morceaux préférés en deux notes.',
  },
  {
    emoji: '🏆',
    title: 'Classement en direct',
    desc: 'Le leaderboard s\'affiche en temps réel pendant votre stream. Chaque question fait bouger le classement et relance la compétition. Vos viewers se battent pour leur position — et votre chat s\'enflamme à chaque changement de tête.',
  },
  {
    emoji: '🎛️',
    title: 'Contrôle total de l\'animation',
    desc: 'Vous avancez à votre rythme, pas à celui d\'un timer automatique. Pause quand vous commentez une réponse, question suivante quand vous sentez que la salle est prête. MuzQuiz s\'adapte à votre style de stream, pas l\'inverse.',
  },
  {
    emoji: '📱',
    title: 'Connexion rapide par smartphone',
    desc: 'Vos viewers scannent un QR code ou tapent un code sur muzquiz.fr depuis leur téléphone, tablette ou PC. Zéro téléchargement, zéro compte à créer. En dix secondes, ils sont dans la partie. La friction zéro, c\'est plus de participants.',
  },
];

const FAQ = [
  {
    q: 'Comment intégrer un quiz sur Twitch ?',
    a: 'Avec MuzQuiz, lancez une partie depuis votre tableau de bord, puis partagez le code de salle avec votre chat dans le topic ou en message épinglé. Dans OBS ou Streamlabs, ajoutez une source "Navigateur" ou capturez la fenêtre de l\'écran public MuzQuiz pour afficher le classement en overlay sur votre stream. Vos viewers rejoignent depuis leur téléphone ou PC en quelques secondes, sans rien installer.',
  },
  {
    q: 'Comment faire participer son chat Twitch à un quiz ?',
    a: 'Affichez le QR code ou le code de salle MuzQuiz sur votre stream. Vos viewers ouvrent muzquiz.fr sur leur téléphone ou dans un onglet de leur navigateur, entrent le code, et les voilà dans la partie. Ils répondent aux questions en temps réel pendant que vous animez. Le classement se met à jour devant tout le monde — ça crée des échanges dans le chat qui durent toute la session.',
  },
  {
    q: 'Comment faire un blind test Twitch avec MuzQuiz ?',
    a: 'Dans MuzQuiz, sélectionnez le mode Blind Test et créez vos questions avec les extraits musicaux de votre choix : OST de jeux, morceaux de votre playlist, sons du gaming... Lancez la partie, partagez le code avec votre chat, et animez depuis votre interface. L\'audio passe par votre stream, vos viewers répondent depuis leur téléphone. Assurez-vous que l\'audio est bien capturé dans OBS pour que les viewers aient un bon rendu sonore.',
  },
  {
    q: 'Les viewers doivent-ils télécharger une application ?',
    a: 'Non. Vos viewers accèdent à MuzQuiz directement depuis leur navigateur — Chrome, Safari, Firefox, peu importe. Ils tapent le code de salle ou scannent le QR code affiché sur votre stream, et c\'est tout. Pas de compte, pas de téléchargement, pas de barrière à l\'entrée. C\'est ce qui fait que même vos viewers les plus passifs finissent par jouer.',
  },
  {
    q: 'Combien de viewers peuvent jouer simultanément ?',
    a: 'Le nombre de joueurs simultanés dépend de la formule choisie : jusqu\'à 10 joueurs en Découverte (gratuit), 20 en Essentiel, 100 en Pro, et 250 en Expert. Pour des streams avec une communauté active qui dépasse ces seuils, vous pouvez organiser des sessions tournantes ou utiliser le quiz comme animation récurrente sur plusieurs streams.',
  },
  {
    q: 'MuzQuiz fonctionne-t-il sur YouTube Live et Kick ?',
    a: 'Oui. MuzQuiz est indépendant de la plateforme de streaming. Que vous streamingiez sur Twitch, YouTube Live, Kick ou que vous animiez une communauté Discord, le principe est identique : vous lancez une partie MuzQuiz, partagez le code avec votre communauté, et vos viewers jouent depuis n\'importe quel appareil. Pas de plugin de plateforme requis.',
  },
  {
    q: 'Peut-on créer un quiz sur des jeux vidéo ou la culture gaming ?',
    a: 'Absolument. MuzQuiz vous laisse créer des questions sur n\'importe quel sujet : personnages de jeux vidéo, logos de studios, OST mythiques, captures d\'écran à identifier, mèmes gaming, historique de l\'esport... Vous pouvez aussi ajouter des images à chaque question pour rendre le quiz visuel. C\'est particulièrement efficace pour des communautés gaming où tout le monde pense tout savoir.',
  },
  {
    q: 'Comment afficher le classement dans OBS pendant le stream ?',
    a: 'MuzQuiz dispose d\'un écran public dédié avec une URL unique pour chaque partie. Dans OBS, ajoutez une source "Navigateur" et collez cette URL — le classement s\'affiche en temps réel et se met à jour automatiquement à chaque bonne réponse. Vous pouvez redimensionner et positionner cette source comme n\'importe quel autre élément de votre scène OBS.',
  },
  {
    q: 'MuzQuiz est-il utile pour fidéliser une communauté ?',
    a: 'Les streamers qui intègrent des sessions MuzQuiz régulières — une fois par semaine, en fin de stream, ou à chaque palier d\'abonnés — créent un rendez-vous attendu par leur communauté. Les viewers reviennent non seulement pour le contenu principal, mais pour le moment de jeu collectif. C\'est un levier d\'engagement qui va au-delà du simple quiz : ça crée de la mémoire collective et des sujets de conversation dans le chat entre les sessions.',
  },
  {
    q: 'Est-ce gratuit pour commencer ?',
    a: 'Oui. La formule Découverte est entièrement gratuite, sans carte bancaire requise. Vous pouvez créer votre compte, composer votre premier quiz et lancer votre première session avec votre communauté dès aujourd\'hui. Pour accueillir plus de joueurs simultanément, les formules payantes sont disponibles à partir d\'un tarif mensuel accessible.',
  },
];

export default function QuizStreamerPage() {
  return (
    <main style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 60%, #0D1B3E 100%)', minHeight: '100vh' }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(245,158,11,0.15)' }}>
        <Link href="/"><MuzquizLogo width={120} textSize="1.8rem" /></Link>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm font-bold hidden sm:block" style={{ color: 'rgba(240,244,255,0.5)' }}>Tarifs</Link>
          <Link href="/signup" className="text-sm font-black px-4 py-2 rounded-xl" style={{ background: '#F59E0B', color: '#0D1B3E' }}>
            Créer mon premier live interactif →
          </Link>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <div
          className="inline-block mb-5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
          style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.25)' }}
        >
          🎮 Pour les streamers
        </div>

        <h1 className="text-3xl sm:text-5xl font-black mb-6 leading-tight" style={{ color: '#F0F4FF' }}>
          Quiz Twitch, Blind Tests et jeux interactifs<br />
          <span style={{ color: '#F59E0B' }}>pour votre communauté</span>
        </h1>

        <p className="text-base sm:text-lg mb-6 max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(240,244,255,0.65)' }}>
          Votre chat qui joue en direct, des classements qui s&apos;enflamment en temps réel, des clips qui se créent tout seuls — MuzQuiz transforme n&apos;importe quel live en événement interactif. Vos viewers jouent depuis leur smartphone, sans rien télécharger.
        </p>
        <p className="text-sm mb-10 max-w-xl mx-auto" style={{ color: 'rgba(240,244,255,0.4)' }}>
          Compatible Twitch · YouTube Live · Kick · Discord
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signup"
            className="px-8 py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.03]"
            style={{ background: '#F59E0B', color: '#0D1B3E' }}
          >
            Créer mon premier live interactif →
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
          Fait pour le live, conçu pour votre communauté
        </h2>
        <p className="text-center text-sm mb-10 max-w-xl mx-auto" style={{ color: 'rgba(240,244,255,0.45)' }}>
          Chaque fonctionnalité a été pensée pour générer de l&apos;interaction, des réactions et des moments mémorables avec votre chat.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AVANTAGES.map(a => (
            <div
              key={a.title}
              className="p-6 rounded-2xl flex flex-col gap-3"
              style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)' }}
            >
              <div className="text-3xl">{a.emoji}</div>
              <h3 className="font-black text-base" style={{ color: '#F0F4FF' }}>{a.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.5)' }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION SEO FORTE — QUIZ IMAGE ────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="p-8 rounded-3xl flex flex-col gap-8" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-black mb-3" style={{ color: '#F0F4FF' }}>
              Quiz image Twitch : faites participer votre communauté en direct
            </h2>
            <p className="text-sm" style={{ color: 'rgba(240,244,255,0.5)' }}>
              Le format visuel est celui qui génère le plus de réactions immédiates sur un stream. Une image apparaît. Le chat explose. C&apos;est ça, un quiz image Twitch.
            </p>
          </div>

          <div className="flex flex-col gap-6 text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.6)' }}>
            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F59E0B' }}>🎮 Reconnaître un jeu vidéo</h3>
              <p>
                Un screenshot tronqué, un HUD partiel, une texture iconique — vos viewers gaming adorent prouver leur culture vidéoludique. Le quiz image sur les jeux crée immédiatement de la compétition entre vos viewers casualels et les hardcores. Et quand personne ne trouve, le débat dans le chat vaut souvent l&apos;animation elle-même.
              </p>
            </div>
            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F59E0B' }}>🧙 Reconnaître un personnage</h3>
              <p>
                Personnage de jeu vidéo, héros de manga, icône de la pop culture, personnage historique ou visage pixelisé d&apos;une star — le format est universel. Adaptez-le à votre audience et votre univers. Vos viewers les plus fidèles vont se défoncer pour être premiers.
              </p>
            </div>
            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F59E0B' }}>🏷️ Reconnaître un logo</h3>
              <p>
                Le quiz logo est redoutablement efficace en stream. Studios de jeux vidéo, éditeurs, marques gaming, constructeurs hardware — vos viewers pensent tout savoir. Un logo partiel ou défiguré et vous les avez. C&apos;est simple à préparer, immédiatement compréhensible, et ça génère une compétition saine qui dure plusieurs questions.
              </p>
            </div>
            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F59E0B' }}>🌟 Reconnaître une célébrité</h3>
              <p>
                Streamers, pros esport, personnalités gaming, acteurs ou chanteurs selon votre audience — le quiz célébrité crée des moments de légèreté qui changent le rythme d&apos;un live. Parfait comme transition entre deux segments, ou comme clôture de session avant d&apos;annoncer les résultats finaux.
              </p>
            </div>
            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F59E0B' }}>🎬 Reconnaître un film ou une série</h3>
              <p>
                Affiche minimaliste, plan iconique, décor caractéristique — le quiz film et série sur Twitch touche une corde sensible. Culture commune, nostalgie partagée, débats dans le chat qui durent après la session. C&apos;est le format qui fait dire &quot;encore un !&quot; à vos viewers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ─────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-2xl sm:text-3xl font-black text-center mb-4" style={{ color: '#F0F4FF' }}>
          Comment lancer un quiz en live ?
        </h2>
        <p className="text-center text-sm mb-10" style={{ color: 'rgba(240,244,255,0.4)' }}>
          Trois étapes. Votre communauté joue avant la fin du prochain commercial break.
        </p>
        <div className="flex flex-col gap-5">
          <div className="flex gap-5 items-start p-6 rounded-2xl" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.18)' }}>
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-lg flex-shrink-0" style={{ background: '#F59E0B', color: '#0D1B3E' }}>1</div>
            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>Créez votre quiz</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.55)' }}>
                Questions texte, images, extraits musicaux ou mix des trois — composez votre quiz en quelques minutes dans l&apos;interface MuzQuiz. Ou laissez l&apos;IA générer un quiz complet à partir d&apos;un thème : &quot;gaming années 2000&quot;, &quot;OST de RPG&quot;, &quot;logos de studios indé&quot;... Vous validez, vous ajustez, c&apos;est prêt.
              </p>
            </div>
          </div>
          <div className="flex gap-5 items-start p-6 rounded-2xl" style={{ background: 'rgba(255,0,170,0.05)', border: '1px solid rgba(255,0,170,0.18)' }}>
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-lg flex-shrink-0" style={{ background: '#FF00AA', color: 'white' }}>2</div>
            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>Affichez le jeu sur OBS</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.55)' }}>
                Dans OBS ou Streamlabs, ajoutez une source &quot;Navigateur&quot; pointant vers l&apos;URL de l&apos;écran public MuzQuiz. Le classement s&apos;affiche en temps réel sur votre stream, se met à jour automatiquement à chaque bonne réponse, et vos viewers voient les scores évoluer en direct. Partagez le code de salle dans votre topic ou en overlay.
              </p>
            </div>
          </div>
          <div className="flex gap-5 items-start p-6 rounded-2xl" style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.18)' }}>
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-lg flex-shrink-0" style={{ background: '#8B5CF6', color: 'white' }}>3</div>
            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>Votre communauté joue</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.55)' }}>
                Vos viewers scannent le QR code ou tapent le code sur muzquiz.fr depuis leur smartphone ou PC. Ils rejoignent la partie en quelques secondes, sans créer de compte, sans rien installer. Vous animez, vous commentez les réponses, vous provoquez le chat — le reste se fait tout seul.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION GEO / IA ──────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="p-7 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="text-xl font-black mb-5" style={{ color: '#F0F4FF' }}>
            Ce que les streamers demandent
          </h2>
          <div className="flex flex-col gap-4 text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.6)' }}>
            <p>
              <span style={{ color: '#F59E0B', fontWeight: 800 }}>Quel jeu faire sur Twitch pour engager son chat ?</span><br />
              MuzQuiz est l&apos;une des rares options qui ne nécessite aucune intégration technique complexe — pas de bot, pas de token API, pas de configuration Twitch. Vous lancez, vous partagez un code, votre chat joue. C&apos;est suffisamment simple pour être utilisé régulièrement, et suffisamment varié (texte, image, musique) pour ne jamais lasser.
            </p>
            <p>
              <span style={{ color: '#F59E0B', fontWeight: 800 }}>Comment faire participer son chat à un quiz en direct ?</span><br />
              La friction est l&apos;ennemi de la participation. Si vos viewers doivent créer un compte, télécharger une app ou naviguer dans un menu compliqué, ils abandonnent. Avec MuzQuiz, c&apos;est un QR code ou un code à taper. Dix secondes et ils sont dans la partie. Ce que vous voulez, c&apos;est le maximum de participants avec le minimum d&apos;effort demandé.
            </p>
            <p>
              <span style={{ color: '#F59E0B', fontWeight: 800 }}>Quel jeu interactif pour streamer sans investissement technique ?</span><br />
              MuzQuiz fonctionne entièrement dans le navigateur, des deux côtés. Vous n&apos;avez besoin que d&apos;un compte, d&apos;une connexion internet et d&apos;un onglet dans OBS. Pas de Webhook, pas de config, pas de dépendance à des services tiers. Pour des streamers qui veulent de l&apos;interaction sans complexité technique, c&apos;est précisément ce que MuzQuiz propose.
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-2xl sm:text-3xl font-black text-center mb-4" style={{ color: '#F0F4FF' }}>
          Questions fréquentes
        </h2>
        <p className="text-center text-sm mb-10" style={{ color: 'rgba(240,244,255,0.4)' }}>
          Ce que les streamers demandent avant leur premier live interactif MuzQuiz.
        </p>
        <div className="flex flex-col gap-4">
          {FAQ.map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl"
              style={{ background: 'rgba(245,158,11,0.03)', border: '1px solid rgba(245,158,11,0.1)' }}
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
            background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(255,0,170,0.07) 100%)',
            border: '1.5px solid rgba(245,158,11,0.28)',
          }}
        >
          <div className="text-4xl mb-4">🎮</div>
          <h2 className="text-2xl sm:text-3xl font-black mb-4" style={{ color: '#F0F4FF' }}>
            Prêt à faire participer votre<br />communauté en direct ?
          </h2>
          <p className="text-sm sm:text-base mb-4 max-w-md mx-auto leading-relaxed" style={{ color: 'rgba(240,244,255,0.6)' }}>
            Créez votre compte gratuitement, préparez votre premier quiz en quelques minutes, et lancez-le dès votre prochain live. Vos viewers n&apos;ont rien à installer. Vous n&apos;avez rien à configurer côté Twitch.
          </p>
          <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: 'rgba(240,244,255,0.4)' }}>
            La première session est gratuite. Sans carte bancaire. Sans engagement.
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.03]"
            style={{ background: '#F59E0B', color: '#0D1B3E' }}
          >
            Créer mon compte gratuitement →
          </Link>
          <p className="mt-4 text-xs" style={{ color: 'rgba(240,244,255,0.3)' }}>
            Compatible Twitch · YouTube Live · Kick · Discord · OBS intégration
          </p>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="text-center pb-8" style={{ color: 'rgba(240,244,255,0.2)', fontSize: '12px' }}>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-3 px-4">
          <Link href="/" style={{ color: 'rgba(240,244,255,0.3)' }}>Accueil</Link>
          <Link href="/pour-les-bars" style={{ color: 'rgba(240,244,255,0.3)' }}>Bars &amp; Restaurants</Link>
          <Link href="/pour-les-animateurs" style={{ color: 'rgba(240,244,255,0.3)' }}>Animateurs</Link>
          <Link href="/quiz-particulier" style={{ color: 'rgba(240,244,255,0.3)' }}>Particuliers</Link>
          <Link href="/pricing" style={{ color: 'rgba(240,244,255,0.3)' }}>Tarifs</Link>
        </div>
        MUZQUIZ © 2025 — Quiz &amp; Blind Test en temps réel
      </footer>

    </main>
  );
}
