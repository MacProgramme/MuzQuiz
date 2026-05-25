import type { Metadata } from 'next';
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

export const metadata: Metadata = {
  title: 'Quiz Bar : Organisez un Pub Quiz & Blind Test sur Smartphone',
  description: 'MuzQuiz transforme votre bar ou restaurant en scène de jeu. Organisez un quiz bar, pub quiz ou blind test sur smartphone en quelques minutes. Sans matériel. Sans installation.',
  keywords: [
    'quiz bar', 'pub quiz', 'blind test bar', 'animation bar restaurant',
    'quiz sur smartphone', 'blind test sur smartphone', 'logiciel de quiz',
    'quiz interactif', 'animation quiz', 'jeu interactif', 'QR code quiz',
    'sans matériel', 'smartphone buzzer', 'animation établissement',
    'fidélisation clients', 'soirée quiz', 'animation restaurant', 'quiz musical',
    'classement en direct',
  ],
  alternates: { canonical: 'https://www.muzquiz.fr/pour-les-bars' },
  openGraph: {
    title: 'Quiz Bar & Pub Quiz sur Smartphone — MuzQuiz',
    description: 'Organisez un quiz bar ou blind test musical en quelques minutes. Vos clients jouent depuis leur smartphone, aucun matériel requis. Essai gratuit.',
    url: 'https://www.muzquiz.fr/pour-les-bars',
  },
};

const AVANTAGES = [
  {
    emoji: '📱',
    title: 'Quiz sur smartphone',
    desc: 'Vos clients répondent et buzzent directement depuis leur téléphone. Pas de boîtiers à distribuer, pas de piles à changer, pas de matériel à ranger. Ils pointent leur caméra sur un QR code et la partie commence.',
  },
  {
    emoji: '🎵',
    title: 'Blind test musical',
    desc: 'Créez des blind tests qui correspondent vraiment à votre clientèle : Années 80, Rock Français, Pop Internationale, Rap, Variété... Des packs musicaux thématiques prêts à jouer, ou composez votre propre playlist de questions.',
  },
  {
    emoji: '🏆',
    title: 'Classement en direct',
    desc: 'Chaque bonne réponse fait évoluer le tableau en temps réel sur votre écran. Vos clients surveillent leur position, commentent, se chamaillent — et commandent une autre tournée le temps de souffler.',
  },
  {
    emoji: '⚡',
    title: 'Lancement en quelques minutes',
    desc: 'Pas de formation, pas de technicien, pas de notice de 30 pages. Vous créez une partie, vous partagez le code avec la salle, vous lancez. C\'est tout. En moins de cinq minutes, votre soirée quiz est lancée.',
  },
  {
    emoji: '🎨',
    title: 'Personnalisation complète',
    desc: 'Créez vos propres questions, adaptez les thèmes à votre établissement, modifiez les packs selon l\'humeur de la soirée. MuzQuiz s\'adapte à votre identité, pas l\'inverse.',
  },
  {
    emoji: '👥',
    title: 'Participants illimités',
    desc: 'Que vous ayez 10 habitués autour du bar ou 200 personnes un soir de grande affluence, MuzQuiz gère. Pas de limite cachée, pas de supplément par joueur. L\'outil tient la charge.',
  },
];

const FAQ = [
  {
    q: 'Comment organiser un pub quiz ?',
    a: 'Organiser un pub quiz avec MuzQuiz, c\'est simple : créez un compte, choisissez ou composez votre pack de questions, générez un code de salle et affichez le QR code sur votre écran ou sur une affiche. Vos clients scannent, rejoignent la partie et jouent directement depuis leur smartphone. Vous contrôlez le déroulement depuis votre téléphone ou tablette : passage à la question suivante, affichage des scores, annonce des gagnants. Un bon pub quiz MuzQuiz se prépare en 10 minutes et dure autant que vous voulez.',
  },
  {
    q: 'Comment animer un quiz dans un bar ?',
    a: 'Pour animer un quiz dans un bar avec MuzQuiz, branchez votre téléphone ou ordinateur sur votre télévision ou vidéoprojecteur via un câble HDMI ou en Chromecast. Lancez la partie côté animateur, affichez le QR code d\'accès à la salle, et vos clients rejoignent depuis leur propre smartphone. Vous pouvez commenter les questions, rythmer les temps de réponse, féliciter les meilleurs scores. MuzQuiz se charge du décompte, du classement et de l\'affichage. Vous, vous vous concentrez sur l\'ambiance.',
  },
  {
    q: 'Comment faire un blind test sur smartphone ?',
    a: 'MuzQuiz intègre un mode blind test musical où vous jouez des extraits audio et vos joueurs doivent identifier le titre ou l\'artiste. Pour lancer un blind test sur smartphone, sélectionnez le mode Blind Test dans MuzQuiz, choisissez un pack musical (ou créez vos propres questions avec extraits), et lancez la partie. Chaque joueur répond ou buzze depuis son téléphone. Les scores tombent en direct. Pour un meilleur rendu, connectez votre ordinateur à une enceinte de bonne qualité — c\'est le seul équipement vraiment utile.',
  },
  {
    q: 'Les joueurs doivent-ils installer une application ?',
    a: 'Non, aucune installation n\'est requise. Vos clients accèdent à MuzQuiz directement depuis le navigateur de leur smartphone — Chrome, Safari, Firefox, peu importe. Ils scannent le QR code ou tapent le code de salle sur muzquiz.fr et ils sont dans la partie. Pas de téléchargement, pas de compte à créer côté joueur, pas de barrière à l\'entrée. C\'est ce qui fait que même les moins technophiles de vos clients jouent sans hésiter.',
  },
  {
    q: 'Combien de personnes peuvent participer ?',
    a: 'Il n\'y a pas de limite de participants avec MuzQuiz. Que vous soyez 8 autour d\'un comptoir un mardi soir ou 150 personnes pour une soirée à thème, la plateforme s\'adapte. Les scores se mettent à jour en temps réel pour tout le monde simultanément. Pas de lag, pas de plantage. L\'outil est conçu pour les environnements bar : beaucoup de connexions simultanées, sur des réseaux wi-fi parfois chargés.',
  },
  {
    q: 'MuzQuiz fonctionne-t-il sur Android et iPhone ?',
    a: 'Oui, MuzQuiz fonctionne sur tous les appareils et tous les systèmes : iPhone, Android, tablette, voire ordinateur portable. Le jeu se déroule dans le navigateur, ce qui garantit une compatibilité totale. Vos clients n\'ont pas à se demander si leur téléphone est compatible — il l\'est. C\'est un avantage concret par rapport aux applications natives qui peuvent bugguer selon la version du système.',
  },
  {
    q: 'Peut-on personnaliser les questions ?',
    a: 'Absolument. MuzQuiz vous permet de créer vos propres packs de questions entièrement sur mesure. Vous pouvez intégrer des questions sur votre établissement, votre carte, votre quartier, vos habitués — ce que vous voulez. C\'est un excellent moyen de personnaliser l\'expérience et de renforcer l\'attachement de vos clients à votre bar. Vous pouvez aussi mélanger des packs existants avec vos propres questions pour varier les soirées.',
  },
  {
    q: 'Comment afficher les scores sur un écran ?',
    a: 'MuzQuiz dispose d\'un écran public dédié à l\'affichage des scores en direct. Connectez votre ordinateur ou smartphone à votre télévision ou vidéoprojecteur, ouvrez la vue "écran public" depuis le tableau de bord animateur, et le classement s\'affiche en grand format. Chaque bonne réponse met à jour le tableau instantanément. Cet écran est optimisé pour être lisible à distance, avec des contrastes forts et des animations pensées pour capter l\'attention dans une salle animée.',
  },
  {
    q: 'Peut-on organiser un quiz musical ?',
    a: 'Oui, le quiz musical est l\'un des formats les plus populaires sur MuzQuiz. Le mode Blind Test vous permet de créer des soirées entièrement musicales : extraits audio, devinettes sur les artistes, titres à compléter... MuzQuiz propose des packs musicaux thématiques couvrant différentes époques et genres, et vous pouvez créer vos propres packs avec les extraits de votre choix. Le quiz musical est particulièrement efficace dans les bars car il crée une atmosphère immédiate — la musique rassemble naturellement.',
  },
  {
    q: 'Pourquoi choisir MuzQuiz plutôt qu\'un système de buzzers physiques ?',
    a: 'Les buzzers physiques, c\'était bien — avant. Aujourd\'hui, ils représentent un coût matériel (achat, remplacement, batteries), une logistique en début et fin de soirée (distribution, collecte, rangement), et des bugs en pleine partie. Avec MuzQuiz, le smartphone de chaque joueur devient son buzzer. Aucun achat, aucune panne, aucune contrainte. Et le résultat est bien supérieur : classements animés, blind test musical intégré, modes de jeu variés, contrôle à distance pour l\'animateur. Pour un bar, passer aux buzzers virtuels, c\'est gagner du temps, réduire les coûts et offrir une meilleure expérience.',
  },
];

export default function PourLesBarsPage() {
  return (
    <main style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 60%, #0D1B3E 100%)', minHeight: '100vh' }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,0,170,0.15)' }}>
        <Link href="/"><MuzquizLogo width={120} textSize="1.8rem" /></Link>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm font-bold hidden sm:block" style={{ color: 'rgba(240,244,255,0.5)' }}>Tarifs</Link>
          <Link href="/signup" className="text-sm font-black px-4 py-2 rounded-xl" style={{ background: '#FF00AA', color: 'white' }}>
            Essayer gratuitement →
          </Link>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <div
          className="inline-block mb-5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
          style={{ background: 'rgba(255,0,170,0.12)', color: '#FF00AA', border: '1px solid rgba(255,0,170,0.25)' }}
        >
          🍺 Bars &amp; Restaurants
        </div>

        <h1 className="text-3xl sm:text-5xl font-black mb-6 leading-tight" style={{ color: '#F0F4FF' }}>
          Quiz Bar : faites revenir vos clients<br />
          <span style={{ color: '#FF00AA' }}>avec des quiz sur smartphone</span>
        </h1>

        <p className="text-base sm:text-lg mb-6 max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(240,244,255,0.65)' }}>
          MuzQuiz permet à n&apos;importe quel bar ou restaurant d&apos;organiser des quiz interactifs et des blind tests musicaux depuis les smartphones des clients — sans matériel, sans installation, en quelques minutes.
        </p>
        <p className="text-sm sm:text-base mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(240,244,255,0.45)' }}>
          Plus d&apos;ambiance dans la salle. Plus de participation spontanée. Des clients qui reviennent chaque semaine.
          Et zéro logistique côté établissement.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signup"
            className="px-8 py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.03]"
            style={{ background: '#FF00AA', color: 'white' }}
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
          Pourquoi les bars choisissent MuzQuiz ?
        </h2>
        <p className="text-center text-sm mb-10 max-w-xl mx-auto" style={{ color: 'rgba(240,244,255,0.45)' }}>
          Pas de la technologie pour faire de la technologie. Des fonctionnalités pensées pour une chose : remplir votre salle et fidéliser votre clientèle.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AVANTAGES.map(a => (
            <div
              key={a.title}
              className="p-6 rounded-2xl flex flex-col gap-3"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="text-3xl">{a.emoji}</div>
              <h3 className="font-black text-base" style={{ color: '#F0F4FF' }}>{a.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.5)' }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ─────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-2xl sm:text-3xl font-black text-center mb-4" style={{ color: '#F0F4FF' }}>
          Comment organiser un quiz bar avec MuzQuiz ?
        </h2>
        <p className="text-center text-sm mb-10 max-w-xl mx-auto" style={{ color: 'rgba(240,244,255,0.45)' }}>
          Trois étapes. Pas une de plus. Même le soir le plus chargé, vous êtes prêt.
        </p>
        <div className="flex flex-col gap-5">
          <div className="flex gap-5 items-start p-6 rounded-2xl" style={{ background: 'rgba(255,0,170,0.05)', border: '1px solid rgba(255,0,170,0.18)' }}>
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-lg flex-shrink-0" style={{ background: '#FF00AA', color: 'white' }}>1</div>
            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>Créez votre quiz ou choisissez un thème prêt à jouer</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.55)' }}>
                Parcourez la bibliothèque de packs thématiques — culture générale, musique, cinéma, sport, géographie — ou composez vos propres questions en quelques clics. Vous pouvez mélanger les genres, ajuster le nombre de questions, choisir entre QCM et mode buzzer. Votre soirée quiz, à votre image.
              </p>
            </div>
          </div>
          <div className="flex gap-5 items-start p-6 rounded-2xl" style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.18)' }}>
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-lg flex-shrink-0" style={{ background: '#8B5CF6', color: 'white' }}>2</div>
            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>Partagez le QR Code avec vos clients</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.55)' }}>
                MuzQuiz génère automatiquement un QR code et un code de salle à partager. Affichez-le sur votre écran, imprimez-le sur les tables, projetez-le sur le mur. Vos clients le scannent depuis leur smartphone — Android ou iPhone — et rejoignent la partie instantanément, sans télécharger la moindre application.
              </p>
            </div>
          </div>
          <div className="flex gap-5 items-start p-6 rounded-2xl" style={{ background: 'rgba(0,229,209,0.05)', border: '1px solid rgba(0,229,209,0.18)' }}>
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-lg flex-shrink-0" style={{ background: '#00E5D1', color: '#0D1B3E' }}>3</div>
            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>Animez votre soirée et affichez les scores en direct</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.55)' }}>
                Vous contrôlez le rythme depuis votre téléphone : question suivante, pause, comptage des points. Le classement s&apos;affiche en temps réel sur votre télévision ou vidéoprojecteur. La salle réagit, les équipes se forment naturellement, l&apos;ambiance monte. Vous animez. MuzQuiz s&apos;occupe du reste.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ARGUMENTAIRE SEO ─────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="p-8 rounded-3xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="text-2xl sm:text-3xl font-black mb-8 text-center" style={{ color: '#F0F4FF' }}>
            Une animation rentable pour votre établissement
          </h2>

          <div className="flex flex-col gap-6 text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.6)' }}>
            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>Pourquoi les soirées quiz attirent davantage de clients</h3>
              <p>
                Un bar qui propose une soirée quiz régulière crée un rendez-vous. Pas juste une raison de venir une fois — une raison de revenir chaque semaine, au même endroit, avec les mêmes amis ou collègues. C&apos;est l&apos;un des leviers les plus puissants de fidélisation client dans la restauration. Le quiz bar génère un trafic récurrent prévisible, souvent sur des soirs creux (lundi, mardi, jeudi) où l&apos;animation fait toute la différence. Des clients qui jouent consomment plus, restent plus longtemps, et recommandent l&apos;établissement.
              </p>
            </div>

            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>Pourquoi le blind test musical fonctionne si bien dans les bars</h3>
              <p>
                La musique est universelle. Contrairement à un quiz de culture générale qui peut mettre certains joueurs mal à l&apos;aise, le blind test musical touche tout le monde — des habitués de 25 ans aux clients de 60 ans. Il suffit de reconnaître un air pour participer. C&apos;est inclusif, convivial, et ça crée une atmosphère unique où des inconnus se retrouvent à fredonner le même refrain. Le quiz musical sur smartphone amplifie cet effet en rendant chaque joueur actif : plus de spectateurs passifs, tout le monde est dans la partie.
              </p>
            </div>

            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>Le smartphone remplace avantageusement les boîtiers physiques</h3>
              <p>
                Les systèmes de buzzers physiques ont longtemps été le standard pour les quiz en établissement. Mais ils ont des limites concrètes : coût d&apos;achat élevé, maintenance, batteries qui lâchent en pleine soirée, nombre limité de joueurs, logistique de distribution et de collecte. Le quiz sur smartphone résout tous ces problèmes d&apos;un coup. Chaque client dispose de son propre buzzer dans sa poche, toujours chargé, toujours fonctionnel. L&apos;animation quiz interactif via QR code est aujourd&apos;hui la solution adoptée par les bars qui cherchent à gagner du temps et à offrir une expérience moderne.
              </p>
            </div>

            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>Comment fidéliser une clientèle grâce aux soirées quiz récurrentes</h3>
              <p>
                La récurrence est la clé. Un quiz bar organisé chaque jeudi soir, par exemple, crée une habitude chez vos clients. Ils bloquent le créneau, viennent parfois en avance pour avoir une bonne table, et invitent leurs amis. Avec MuzQuiz, vous pouvez varier les thèmes chaque semaine tout en gardant le même format rassurant. Certains établissements créent des championnats sur plusieurs semaines avec classement cumulé — ce qui génère un engagement encore plus fort. L&apos;animation quiz devient alors un vrai programme fidélité, sans les contraintes d&apos;une carte de fidélité classique.
              </p>
            </div>

            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>Créer une ambiance conviviale et compétitive à la fois</h3>
              <p>
                Le quiz bar réussit quand il trouve le bon équilibre entre compétition et convivialité. MuzQuiz est conçu pour ça : le classement en direct crée de la tension et de l&apos;excitation, mais le format reste accessible à tous. Les équipes se constituent naturellement, des alliances se forment entre clients qui ne se connaissaient pas, et la salle devient une communauté le temps d&apos;une soirée. L&apos;animation restaurant ou bar réussie, c&apos;est celle où les gens repartent en parlant non seulement du quiz, mais aussi des personnes qu&apos;ils ont rencontrées.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-2xl sm:text-3xl font-black text-center mb-4" style={{ color: '#F0F4FF' }}>
          Questions fréquentes
        </h2>
        <p className="text-center text-sm mb-10" style={{ color: 'rgba(240,244,255,0.4)' }}>
          Tout ce que vous voulez savoir avant de lancer votre première soirée quiz.
        </p>
        <div className="flex flex-col gap-4">
          {FAQ.map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
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
            background: 'linear-gradient(135deg, rgba(255,0,170,0.1) 0%, rgba(139,92,246,0.08) 100%)',
            border: '1.5px solid rgba(255,0,170,0.25)',
          }}
        >
          <div className="text-4xl mb-4">🎤</div>
          <h2 className="text-2xl sm:text-3xl font-black mb-4" style={{ color: '#F0F4FF' }}>
            Prêt à lancer votre prochaine soirée quiz ?
          </h2>
          <p className="text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed" style={{ color: 'rgba(240,244,255,0.55)' }}>
            Des dizaines de bars et restaurants utilisent déjà MuzQuiz pour créer des soirées mémorables. Rejoignez-les aujourd&apos;hui. Votre première partie est gratuite — sans carte bancaire, sans engagement.
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.03]"
            style={{ background: '#FF00AA', color: 'white' }}
          >
            Créer mon compte gratuitement →
          </Link>
          <p className="mt-4 text-xs" style={{ color: 'rgba(240,244,255,0.3)' }}>
            Gratuit pour commencer · Aucune installation · Prêt en 5 minutes
          </p>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="text-center pb-8" style={{ color: 'rgba(240,244,255,0.2)', fontSize: '12px' }}>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-3 px-4">
          <Link href="/" style={{ color: 'rgba(240,244,255,0.3)' }}>Accueil</Link>
          <Link href="/pour-les-animateurs" style={{ color: 'rgba(240,244,255,0.3)' }}>Animateurs</Link>
          <Link href="/pour-les-evenements" style={{ color: 'rgba(240,244,255,0.3)' }}>Événements</Link>
          <Link href="/pour-les-streamers" style={{ color: 'rgba(240,244,255,0.3)' }}>Streamers</Link>
          <Link href="/pricing" style={{ color: 'rgba(240,244,255,0.3)' }}>Tarifs</Link>
        </div>
        MUZQUIZ © 2025 — Quiz &amp; Blind Test en temps réel
      </footer>

    </main>
  );
}
