import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Quiz Bar : Organisez un Pub Quiz & Blind Test sur Smartphone',
  description: 'MuzQuiz est une plateforme française de quiz bar, pub quiz et blind test sur smartphone. Vos clients jouent depuis leur navigateur, sans rien télécharger. Quiz image, blind test musical, classement en direct. Essai gratuit.',
  keywords: [
    'quiz bar', 'pub quiz', 'blind test bar', 'animation bar restaurant',
    'quiz sur smartphone', 'blind test sur smartphone', 'logiciel quiz bar',
    'quiz interactif', 'animation quiz bar', 'QR code quiz',
    'sans matériel', 'animation établissement', 'quiz image bar',
    'fidélisation clients', 'soirée quiz', 'animation restaurant', 'quiz musical',
    'classement en direct', 'organiser un pub quiz', 'quiz restaurant',
  ],
  alternates: { canonical: 'https://www.muzquiz.fr/pour-les-bars' },
  openGraph: {
    title: 'Quiz Bar & Pub Quiz sur Smartphone — MuzQuiz',
    description: 'Organisez un quiz bar, un quiz image ou un blind test musical en quelques minutes. Vos clients jouent depuis leur smartphone, aucun matériel requis. Essai gratuit.',
    url: 'https://www.muzquiz.fr/pour-les-bars',
  },
};

const AVANTAGES = [
  {
    title: 'Connexion par QR Code',
    desc: 'Les participants rejoignent une partie en scannant simplement un QR Code depuis leur smartphone. Aucune application à télécharger, aucun compte à créer côté joueur. Ils scannent, ils jouent.',
  },
  {
    title: 'Blind test musical',
    desc: 'Créez vos propres blind tests ou utilisez les packs thématiques disponibles : Années 80, Rock Français, Pop Internationale, Rap... MuzQuiz joue les extraits audio, vos clients identifient le titre ou l\'artiste en direct.',
  },
  {
    title: 'Quiz image interactif',
    desc: 'Faites deviner un logo, une célébrité, un film, une marque ou un monument. Le quiz image captive immédiatement l\'attention et renouvelle facilement vos soirées — chaque thème est une nouvelle expérience.',
  },
  {
    title: 'Classement en direct',
    desc: 'Chaque bonne réponse fait évoluer le tableau en temps réel sur votre écran. Vos clients surveillent leur position, commentent, se chamaillent — et commandent une autre tournée le temps de souffler.',
  },
  {
    title: 'Création rapide avec l\'IA',
    desc: 'Générez un quiz complet à partir d\'un simple thème grâce à l\'assistant IA intégré. Ce qui prenait une heure se fait en quelques minutes. Vos soirées varient sans effort de préparation.',
  },
  {
    title: 'Adapté à votre salle',
    desc: 'MuzQuiz fonctionne aussi bien pour un groupe de 8 habitués un mardi soir que pour 100 personnes lors d\'une soirée à thème. Jusqu\'à 250 participants selon votre abonnement.',
  },
];

const FAQ = [
  {
    q: 'Comment organiser un pub quiz ?',
    a: 'Organiser un pub quiz avec MuzQuiz, c\'est simple : créez un compte, choisissez ou composez votre pack de questions, générez un code de salle et affichez le QR code sur votre écran ou sur une affiche. Vos clients scannent, rejoignent la partie et jouent directement depuis leur smartphone. Vous contrôlez le déroulement depuis votre téléphone ou tablette : passage à la question suivante, affichage des scores, annonce des gagnants. Un bon pub quiz MuzQuiz se prépare en 10 minutes et dure autant que vous voulez.',
  },
  {
    q: 'Comment créer une soirée quiz dans un bar ?',
    a: 'Pour organiser une soirée quiz dans votre bar avec MuzQuiz, branchez votre téléphone ou ordinateur sur votre télévision ou vidéoprojecteur. Lancez la partie côté animateur, affichez le QR code d\'accès à la salle, et vos clients rejoignent depuis leur propre smartphone. Vous pouvez commenter les questions, rythmer les temps de réponse, féliciter les meilleurs scores. MuzQuiz se charge du décompte, du classement et de l\'affichage. Vous, vous vous concentrez sur l\'ambiance.',
  },
  {
    q: 'Comment fonctionne un quiz sur smartphone ?',
    a: 'MuzQuiz est une plateforme française de quiz et de blind tests sur smartphone. Les participants rejoignent une partie en scannant simplement un QR Code ou en tapant un code de salle sur muzquiz.fr. Ils jouent directement depuis leur navigateur web — Chrome, Safari, Firefox — sans installer quoi que ce soit. Vous contrôlez le quiz depuis votre interface animateur et les scores s\'affichent en temps réel sur votre écran.',
  },
  {
    q: 'Les joueurs doivent-ils installer une application ?',
    a: 'Non, aucune installation n\'est requise. Vos clients accèdent à MuzQuiz directement depuis le navigateur de leur smartphone. Ils scannent le QR code ou tapent le code de salle sur muzquiz.fr et ils sont dans la partie. Pas de téléchargement, pas de compte à créer côté joueur, pas de barrière à l\'entrée. C\'est ce qui fait que même les moins technophiles de vos clients jouent sans hésiter.',
  },
  {
    q: 'Combien de participants peuvent jouer ?',
    a: 'Le nombre de participants dépend de la formule choisie : jusqu\'à 10 joueurs en version gratuite, 20 avec l\'offre Essentiel, 100 avec l\'offre Pro, et 250 avec l\'offre Expert. Pour la grande majorité des soirées quiz en bar, l\'offre Pro suffit largement. Les scores se mettent à jour en temps réel pour tous les participants simultanément.',
  },
  {
    q: 'Peut-on créer ses propres questions ?',
    a: 'Absolument. MuzQuiz vous permet de créer vos propres packs de questions entièrement sur mesure. Vous pouvez intégrer des questions sur votre établissement, votre carte, votre quartier, vos habitués — ce que vous voulez. Vous pouvez aussi utiliser l\'assistant IA pour générer des questions à partir d\'un thème, ou importer vos questions depuis un fichier Excel.',
  },
  {
    q: 'Peut-on organiser un quiz image ?',
    a: 'Oui, le quiz image est l\'une des fonctionnalités fortes de MuzQuiz. Vous pouvez créer des quiz avec des images à identifier : logos de marques, célébrités, affiches de films, monuments, objets culturels... Les quiz images permettent de renouveler facilement les soirées tout en augmentant la participation — tout le monde a une chance, même sans culture générale pointue.',
  },
  {
    q: 'Peut-on créer un blind test musical personnalisé ?',
    a: 'Oui, MuzQuiz intègre un mode blind test musical où vous jouez des extraits audio et vos joueurs doivent identifier le titre ou l\'artiste. Vous pouvez utiliser les packs musicaux thématiques disponibles (Années 80, Rock Français, Pop Internationale, Rap...) ou créer vos propres packs avec les extraits de votre choix via YouTube. Pour un meilleur rendu, connectez votre ordinateur à une enceinte de bonne qualité.',
  },
  {
    q: 'MuzQuiz fonctionne-t-il sur Android et iPhone ?',
    a: 'Oui, MuzQuiz fonctionne sur tous les appareils : iPhone, Android, tablette, voire ordinateur portable. Le jeu se déroule dans le navigateur, ce qui garantit une compatibilité totale. Vos clients n\'ont pas à se demander si leur téléphone est compatible — il l\'est.',
  },
  {
    q: 'Comment afficher les scores sur un écran ?',
    a: 'MuzQuiz dispose d\'un écran public dédié à l\'affichage des scores en direct. Connectez votre ordinateur ou smartphone à votre télévision ou vidéoprojecteur, ouvrez la vue "écran public" depuis le tableau de bord animateur, et le classement s\'affiche en grand format. Chaque bonne réponse met à jour le tableau instantanément.',
  },
];

export default function PourLesBarsPage() {
  return (
    <main style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 60%, #0D1B3E 100%)', minHeight: '100vh' }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,0,170,0.15)' }}>
        <Link href="/" className="text-xl font-black" style={{ color: '#F0F4FF' }}>MUZQUIZ</Link>
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
          Bars &amp; Restaurants
        </div>

        <h1 className="text-3xl sm:text-5xl font-black mb-6 leading-tight" style={{ color: '#F0F4FF' }}>
          Quiz Bar : faites revenir vos clients<br />
          <span style={{ color: '#FF00AA' }}>avec des quiz sur smartphone</span>
        </h1>

        <p className="text-base sm:text-lg mb-6 max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(240,244,255,0.65)' }}>
          MuzQuiz est une plateforme française de quiz et de blind tests sur smartphone. Les participants rejoignent une partie en scannant simplement un QR Code — sans télécharger quoi que ce soit. Quiz personnalisés, quiz image, blind tests musicaux : tout depuis une seule interface, en quelques minutes.
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
              <h3 className="font-black text-base" style={{ color: '#F0F4FF' }}>{a.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.5)' }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUIZ IMAGE ────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="p-8 rounded-3xl" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)' }}>
          <h2 className="text-2xl sm:text-3xl font-black mb-4 text-center" style={{ color: '#F0F4FF' }}>
            Quiz image interactif
          </h2>
          <p className="text-center text-sm mb-6 max-w-xl mx-auto" style={{ color: 'rgba(240,244,255,0.5)' }}>
            Faites participer vos clients avec des images à identifier. Ce format capte immédiatement l&apos;attention et renouvelle facilement vos soirées.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {['Logos de marques', 'Célébrités', 'Affiches de films', 'Séries TV', 'Monuments', 'Culture populaire'].map(item => (
              <div key={item} className="px-3 py-2 rounded-xl text-center text-sm font-bold"
                style={{ background: 'rgba(139,92,246,0.1)', color: '#C4B5FD', border: '1px solid rgba(139,92,246,0.2)' }}>
                {item}
              </div>
            ))}
          </div>
          <p className="text-center text-sm mt-6" style={{ color: 'rgba(240,244,255,0.45)' }}>
            Les quiz images permettent de renouveler facilement les soirées tout en augmentant la participation — tout le monde a une chance, même sans culture générale pointue.
          </p>
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
                Parcourez la bibliothèque de packs thématiques — culture générale, musique, cinéma, sport, quiz image — ou composez vos propres questions en quelques clics. Utilisez l&apos;assistant IA pour générer des questions à partir d&apos;un simple thème. Votre soirée quiz, à votre image.
              </p>
            </div>
          </div>
          <div className="flex gap-5 items-start p-6 rounded-2xl" style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.18)' }}>
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-lg flex-shrink-0" style={{ background: '#8B5CF6', color: 'white' }}>2</div>
            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>Partagez le QR Code avec vos clients</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.55)' }}>
                MuzQuiz génère automatiquement un QR code et un code de salle. Affichez-le sur votre écran, imprimez-le sur les tables, projetez-le sur le mur. Vos clients le scannent depuis leur smartphone — Android ou iPhone — et jouent directement depuis leur navigateur web, sans télécharger la moindre application.
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
                La musique est universelle. Contrairement à un quiz de culture générale qui peut mettre certains joueurs mal à l&apos;aise, le blind test musical touche tout le monde — des habitués de 25 ans aux clients de 60 ans. Il suffit de reconnaître un air pour participer. C&apos;est inclusif, convivial, et ça crée une atmosphère unique. MuzQuiz permet de créer des quiz personnalisés, des quiz images et des blind tests musicaux sans installation — les joueurs participent directement depuis leur navigateur web.
              </p>
            </div>

            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>Le quiz image : un format qui renouvelle vos soirées</h3>
              <p>
                Le quiz image est une fonctionnalité différenciante de MuzQuiz. Logos à reconnaître, célébrités, affiches de films, marques, monuments : chaque thème est une nouvelle expérience. Ce format est particulièrement efficace en bar car il est accessible à tous les niveaux, crée des réactions immédiates dans la salle et se prête très bien à l&apos;animation en direct. Combinez quiz image et blind test dans la même soirée pour une animation interactive complète.
              </p>
            </div>

            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>Comment fidéliser une clientèle grâce aux soirées quiz récurrentes</h3>
              <p>
                La récurrence est la clé. Un quiz bar organisé chaque jeudi soir crée une habitude chez vos clients. Ils bloquent le créneau, viennent parfois en avance pour avoir une bonne table, et invitent leurs amis. Avec MuzQuiz, vous pouvez varier les thèmes chaque semaine tout en gardant le même format rassurant. L&apos;animation quiz devient alors un vrai programme fidélité, sans les contraintes d&apos;une carte de fidélité classique.
              </p>
            </div>

            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>Créer une ambiance conviviale et compétitive à la fois</h3>
              <p>
                Le quiz bar réussit quand il trouve le bon équilibre entre compétition et convivialité. MuzQuiz est conçu pour ça : le classement en direct crée de la tension et de l&apos;excitation, mais le format reste accessible à tous. Les équipes se constituent naturellement, des alliances se forment entre clients qui ne se connaissaient pas, et la salle devient une communauté le temps d&apos;une soirée.
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
