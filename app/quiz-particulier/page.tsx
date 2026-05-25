import type { Metadata } from 'next';
import Link from 'next/link';


export const metadata: Metadata = {
  title: 'Quiz Entre Amis & Blind Test sur Smartphone — Soirées & Anniversaires',
  description: 'Créez un quiz entre amis, un quiz image ou un blind test musical en quelques minutes. Vos invités jouent depuis leur smartphone sans rien télécharger. Parfait pour les soirées et les anniversaires adultes.',
  keywords: [
    'quiz entre amis', 'blind test à la maison', 'quiz anniversaire adulte',
    'jeu de soirée smartphone', 'quiz smartphone', 'quiz musical',
    'quiz image', 'quiz photo', 'reconnaître un logo', 'reconnaître une célébrité',
    'reconnaître un film', 'animation anniversaire adulte', 'jeu pour soirée entre amis',
    'jeu de groupe smartphone', 'blind test soirée', 'quiz soirée',
  ],
  alternates: { canonical: 'https://www.muzquiz.fr/quiz-particulier' },
  openGraph: {
    title: 'Quiz Entre Amis & Blind Test sur Smartphone — MuzQuiz',
    description: 'Organisez un quiz entre amis, un quiz image ou un blind test en quelques minutes. Vos invités jouent depuis leur téléphone, sans télécharger quoi que ce soit.',
    url: 'https://www.muzquiz.fr/quiz-particulier',
  },
};

const AVANTAGES = [
  {
    title: 'Soirées entre amis',
    desc: 'Fini les soirées qui manquent de piment. Un quiz MuzQuiz, c\'est une heure de fous rires garantis, de clashs amicaux et de révélations surprenantes. Qui dans votre groupe connaît vraiment bien les années 90 ? C\'est le moment de le savoir.',
  },
  {
    title: 'Anniversaires adultes',
    desc: 'Pour un anniversaire adulte réussi, il faut quelque chose que tout le monde peut faire ensemble. Un quiz personnalisé sur la vie du fêté, ses souvenirs, ses passions — ça crée des moments uniques dont tout le monde se souviendra longtemps.',
  },
  {
    title: 'Quiz image interactif',
    desc: 'Reconnaître un logo, une célébrité, une affiche de film, un monument célèbre ou un objet de votre enfance — le quiz image, c\'est universel. Tout le monde joue, tout le monde a une chance, et les débats qui suivent sont souvent les meilleurs moments de la soirée.',
  },
  {
    title: 'Blind tests musicaux',
    desc: 'Deux notes et tout le monde se lève. Le blind test musical est le format qui embrase n\'importe quelle ambiance. Choisissez votre époque, votre genre, vos artistes favoris — et regardez vos amis s\'affronter sur les premières secondes de chaque morceau.',
  },
  {
    title: 'Création assistée par IA',
    desc: 'Pas d\'inspiration ? L\'IA de MuzQuiz génère un quiz complet à partir d\'un simple thème. Vous tapez "années 2000 Pop Française", vous obtenez des questions prêtes à jouer. Votre soirée est prête en quelques minutes, même en dernière minute.',
  },
  {
    title: 'Adapté à tous vos groupes',
    desc: 'Que vous soyez quatre autour d\'une table ou une vingtaine pour une fête d\'anniversaire, MuzQuiz s\'adapte à votre situation. Convient aussi bien aux soirées intimes qu\'aux événements plus importants — sans changer quoi que ce soit à votre façon d\'organiser.',
  },
];

const FAQ = [
  {
    q: 'Comment organiser un quiz entre amis à la maison ?',
    a: 'Avec MuzQuiz, c\'est simple : créez un compte gratuit, composez votre quiz (ou laissez l\'IA le faire), puis partagez le QR code avec vos amis. Ils scannent depuis leur téléphone et rejoignent la partie en quelques secondes. Vous contrôlez le déroulé depuis votre propre écran. Pas besoin de projeter quoi que ce soit, pas besoin de matériel particulier — votre téléphone suffit pour animer.',
  },
  {
    q: 'Comment faire un blind test à la maison ?',
    a: 'Dans MuzQuiz, sélectionnez le mode Blind Test, choisissez un thème musical ou créez vos propres questions avec extraits audio. Connectez votre ordinateur ou téléphone à une enceinte pour un meilleur rendu sonore, partagez le QR code avec vos invités, et lancez. Chaque participant répond depuis son smartphone. Le classement s\'affiche en direct. Pour un blind test vraiment mémorable, misez sur une playlist qui mélange les générations — ça crée toujours des surprises.',
  },
  {
    q: 'MuzQuiz fonctionne-t-il pour un quiz d\'anniversaire adulte ?',
    a: 'C\'est l\'un des usages les plus populaires. Vous pouvez créer un quiz entièrement personnalisé autour du fêté : questions sur sa vie, ses souvenirs, ses anecdotes, ses passions. Ajoutez des photos, des images, des extraits musicaux de ses artistes préférés. Résultat : une animation unique, au-delà du karaoké ou des jeux de société habituels. Et les images du fêté qui rate des questions sur lui-même restent toujours dans les annales.',
  },
  {
    q: 'Les invités doivent-ils télécharger une application ?',
    a: 'Non, rien à télécharger. Vos invités ouvrent simplement leur navigateur — Safari sur iPhone, Chrome sur Android — et scannent le QR code que vous partagez. En cinq secondes, ils sont dans la partie. C\'est ce qui rend MuzQuiz parfait pour des soirées où tout le monde n\'est pas ultra technophile. Zéro friction, zéro excuse pour ne pas jouer.',
  },
  {
    q: 'Qu\'est-ce qu\'un quiz image et comment ça fonctionne ?',
    a: 'Le quiz image, c\'est un format où chaque question est accompagnée d\'une image : un logo de marque à reconnaître, une célébrité, une affiche de film, un monument, un objet iconique... Les joueurs voient l\'image sur leur téléphone et doivent trouver la réponse. C\'est plus engageant qu\'un quiz texte classique, et ça tend les oreilles d\'un groupe que les questions culturelles auraient ennuyé. Avec MuzQuiz, vous ajoutez simplement une image à chaque question lors de la création.',
  },
  {
    q: 'Combien de personnes peuvent jouer en même temps ?',
    a: 'Le nombre de joueurs simultanés dépend de la formule choisie. L\'offre gratuite (Découverte) permet de jouer jusqu\'à 10 personnes — parfait pour une petite soirée. Les formules payantes montent progressivement : 20 joueurs en Essentiel, 100 en Pro, 250 en Expert. Quelle que soit votre situation, une formule correspond à votre groupe.',
  },
  {
    q: 'Peut-on créer un quiz sur mesure ou faut-il utiliser des packs existants ?',
    a: 'Les deux sont possibles. MuzQuiz propose des packs de questions thématiques prêts à l\'emploi si vous voulez gagner du temps. Mais vous pouvez aussi créer vos propres questions from scratch, les personnaliser complètement, ajouter des images, des extraits audio. Et si vous manquez d\'inspiration, l\'IA génère un quiz entier à partir d\'un thème que vous lui donnez. Total liberté.',
  },
  {
    q: 'MuzQuiz fonctionne-t-il sur iPhone et Android ?',
    a: 'Oui, MuzQuiz fonctionne sur tous les appareils et tous les navigateurs — iPhone, Android, tablette, ordinateur. Les joueurs n\'ont pas à vérifier leur compatibilité ou leur version d\'OS. Du moment qu\'ils ont un navigateur internet (ce qui est toujours le cas), ça marche. Et ça marche aussi sur le Wi-Fi de chez vous, sans configuration particulière.',
  },
  {
    q: 'Peut-on jouer sans connexion internet ?',
    a: 'MuzQuiz fonctionne en ligne — une connexion internet est nécessaire pour que les joueurs rejoignent la partie. À la maison, votre box Wi-Fi suffit amplement. Si vous organisez une soirée ailleurs, partagez simplement votre partage de connexion : MuzQuiz est très léger en données, ça tient sans problème.',
  },
  {
    q: 'Est-ce vraiment gratuit pour commencer ?',
    a: 'Oui. La formule Découverte est gratuite, sans carte bancaire requise. Vous pouvez créer votre compte, composer votre quiz et lancer votre première partie dès ce soir. Si vous souhaitez accueillir plus de joueurs ou accéder à des fonctionnalités avancées (import, packs premium, plus de joueurs), les formules payantes démarrent à un tarif accessible.',
  },
];

export default function QuizParticulierPage() {
  return (
    <main style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 60%, #0D1B3E 100%)', minHeight: '100vh' }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(0,229,209,0.15)' }}>
        <Link href="/" className="text-xl font-black" style={{ color: '#F0F4FF' }}>MUZQUIZ</Link>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm font-bold hidden sm:block" style={{ color: 'rgba(240,244,255,0.5)' }}>Tarifs</Link>
          <Link href="/signup" className="text-sm font-black px-4 py-2 rounded-xl" style={{ background: '#00E5D1', color: '#0D1B3E' }}>
            Créer une partie →
          </Link>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <div
          className="inline-block mb-5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
          style={{ background: 'rgba(0,229,209,0.1)', color: '#00E5D1', border: '1px solid rgba(0,229,209,0.25)' }}
        >
          Pour les particuliers
        </div>

        <h1 className="text-3xl sm:text-5xl font-black mb-6 leading-tight" style={{ color: '#F0F4FF' }}>
          Quiz entre amis et blind tests sur smartphone<br />
          <span style={{ color: '#00E5D1' }}>pour toutes vos soirées</span>
        </h1>

        <p className="text-base sm:text-lg mb-6 max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(240,244,255,0.65)' }}>
          Créez un quiz, un quiz image ou un blind test musical en quelques minutes. Vos invités jouent directement depuis leur téléphone grâce à un simple QR Code. Aucun téléchargement nécessaire.
        </p>
        <p className="text-sm mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(240,244,255,0.4)' }}>
          Des fous rires assurés. Des souvenirs gravés. Une soirée dont tout le monde reparlera.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signup"
            className="px-8 py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.03]"
            style={{ background: '#00E5D1', color: '#0D1B3E' }}
          >
            Créer une partie gratuitement →
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
          Une idée pour chaque occasion
        </h2>
        <p className="text-center text-sm mb-10 max-w-xl mx-auto" style={{ color: 'rgba(240,244,255,0.45)' }}>
          Soirée improvisée, anniversaire préparé de longue date ou repas de famille — MuzQuiz s&apos;adapte à ce que vous avez en tête.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AVANTAGES.map(a => (
            <div
              key={a.title}
              className="p-6 rounded-2xl flex flex-col gap-3"
              style={{ background: 'rgba(0,229,209,0.04)', border: '1px solid rgba(0,229,209,0.12)' }}
            >
              <h3 className="font-black text-base" style={{ color: '#F0F4FF' }}>{a.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.5)' }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ─────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-2xl sm:text-3xl font-black text-center mb-4" style={{ color: '#F0F4FF' }}>
          Prêt en trois étapes
        </h2>
        <p className="text-center text-sm mb-10" style={{ color: 'rgba(240,244,255,0.4)' }}>
          Pas besoin d&apos;être animateur professionnel pour créer une soirée mémorable.
        </p>
        <div className="flex flex-col gap-5">
          <div className="flex gap-5 items-start p-6 rounded-2xl" style={{ background: 'rgba(0,229,209,0.05)', border: '1px solid rgba(0,229,209,0.18)' }}>
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-lg flex-shrink-0" style={{ background: '#00E5D1', color: '#0D1B3E' }}>1</div>
            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>Créez votre quiz</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.55)' }}>
                Choisissez un pack prêt à jouer, rédigez vos propres questions, ajoutez des images ou des extraits musicaux, ou laissez l&apos;IA composer un quiz entier à partir d&apos;un thème que vous lui soufflez. Cinq minutes suffisent pour être prêt.
              </p>
            </div>
          </div>
          <div className="flex gap-5 items-start p-6 rounded-2xl" style={{ background: 'rgba(255,0,170,0.05)', border: '1px solid rgba(255,0,170,0.18)' }}>
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-lg flex-shrink-0" style={{ background: '#FF00AA', color: 'white' }}>2</div>
            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>Partagez le QR Code</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.55)' }}>
                MuzQuiz génère un QR code unique pour votre partie. Montrez-le sur votre téléphone ou imprimez-le. Vos amis le scannent depuis leur propre téléphone, sans installer quoi que ce soit, et les voilà dans la partie.
              </p>
            </div>
          </div>
          <div className="flex gap-5 items-start p-6 rounded-2xl" style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.18)' }}>
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-lg flex-shrink-0" style={{ background: '#8B5CF6', color: 'white' }}>3</div>
            <div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>Lancez la partie</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.55)' }}>
                Vous avancez question par question depuis votre écran, à votre rythme. Le classement s&apos;affiche en direct. Les réactions fusent. Vous pouvez projeter les scores sur une télévision ou laisser chacun suivre sur son téléphone — dans tous les cas, l&apos;ambiance est là.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION SEO ───────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="p-8 rounded-3xl flex flex-col gap-10" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>

          <div>
            <h2 className="text-xl sm:text-2xl font-black mb-4" style={{ color: '#F0F4FF' }}>
              Pourquoi organiser un quiz entre amis sur smartphone ?
            </h2>
            <div className="flex flex-col gap-3 text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.6)' }}>
              <p>
                Le quiz entre amis sur smartphone, c&apos;est la version moderne de ce qu&apos;on a toujours adoré faire en soirée — mais sans les contraintes. Pas de plateau de jeu à sortir, pas de cartes à mélanger, pas de règles à expliquer pendant dix minutes. Tout le monde a déjà son téléphone en main. Un QR code, et la partie commence.
              </p>
              <p>
                Ce format fonctionne parce qu&apos;il met tout le monde sur un pied d&apos;égalité. Pas besoin d&apos;être le plus cultivé du groupe pour s&apos;amuser — un quiz image sur les logos des années 90, un blind test sur les génériques de dessins animés ou un quiz photo sur les célébrités, et soudain tout le monde est compétitif. Y compris ceux qui se pensaient largués.
              </p>
              <p>
                Et puis il y a la dimension compétition. Voir son nom monter dans le classement en direct, doubler un ami sur la dernière question, rattraper son retard grâce à une réponse éclair — c&apos;est ce qui crée les moments dont on parle encore le lendemain. Le quiz smartphone transforme une soirée ordinaire en souvenir.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black mb-4" style={{ color: '#F0F4FF' }}>
              Comment créer un blind test à la maison ?
            </h2>
            <div className="flex flex-col gap-3 text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.6)' }}>
              <p>
                Organiser un blind test à la maison était autrefois compliqué : il fallait préparer une playlist sur un service de streaming, gérer les pauses, noter les scores à la main, gérer les contestations... Avec MuzQuiz, tout ça disparaît. Vous sélectionnez un pack blind test thématique ou vous créez vos propres questions avec les extraits de votre choix. Les scores se calculent automatiquement.
              </p>
              <p>
                Le blind test musical fonctionne sur tous les goûts et toutes les générations. Pop, rap, rock, variété française, années 80, bandes originales de films — choisissez ce qui correspond à votre groupe, ou mélangez les genres pour pimenter les débats. Le format est idéal pour les soirées d&apos;anniversaire adulte : chacun a une époque de référence, et les batailles intergénérationnelles sont toujours les plus drôles.
              </p>
              <p>
                Pour un rendu optimal à la maison, connectez votre téléphone ou ordinateur à une bonne enceinte bluetooth. Le reste, MuzQuiz s&apos;en occupe : chaque joueur voit la question sur son propre smartphone, répond, et le classement se met à jour en direct sur votre écran.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black mb-4" style={{ color: '#F0F4FF' }}>
              Le quiz image : l&apos;animation qui surprend toujours
            </h2>
            <div className="flex flex-col gap-3 text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.6)' }}>
              <p>
                Il y a quelque chose d&apos;universel dans le fait de reconnaître une image. Un logo partiel, une photo de célébrité floue, une affiche de film coupée au bon endroit — tout le monde s&apos;engage instinctivement. Le quiz image est sans doute le format qui crée le plus de réactions spontanées dans un groupe : les cris quand on reconnaît, les silences quand on sèche, les disputes douces sur "j&apos;allais dire ça".
              </p>
              <p>
                Avec MuzQuiz, créer un quiz image est aussi simple que de rédiger des questions texte. Vous ajoutez votre image (photo, capture d&apos;écran, logo, illustration) à chaque question, et les joueurs la voient s&apos;afficher sur leur téléphone au moment de répondre. Pas besoin de projeter quoi que ce soit — chaque participant a son propre écran.
              </p>
              <p>
                Pour un quiz anniversaire adulte, le quiz image autour du fêté est une valeur sûre : photos d&apos;enfance, anciens lieux de vacances, voitures ou objets de l&apos;époque, photos de groupe oubliées depuis longtemps... C&apos;est le genre d&apos;animation qui provoque des éclats de rire et des larmes de nostalgie en même temps. Et ça, aucun jeu de société classique ne peut l&apos;offrir.
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
          Tout ce qu&apos;on vous posera avant votre première soirée MuzQuiz.
        </p>
        <div className="flex flex-col gap-4">
          {FAQ.map((item, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl"
              style={{ background: 'rgba(0,229,209,0.03)', border: '1px solid rgba(0,229,209,0.1)' }}
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
            background: 'linear-gradient(135deg, rgba(0,229,209,0.1) 0%, rgba(139,92,246,0.08) 100%)',
            border: '1.5px solid rgba(0,229,209,0.25)',
          }}
        >
          <h2 className="text-2xl sm:text-3xl font-black mb-4" style={{ color: '#F0F4FF' }}>
            Votre prochaine soirée inoubliable<br />commence ici
          </h2>
          <p className="text-sm sm:text-base mb-4 max-w-md mx-auto leading-relaxed" style={{ color: 'rgba(240,244,255,0.6)' }}>
            Créez votre compte gratuitement. Composez votre quiz en quelques minutes. Lancez votre première partie ce soir.
          </p>
          <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: 'rgba(240,244,255,0.4)' }}>
            Pas besoin de carte bancaire pour commencer. Vos amis n&apos;ont rien à installer. Il ne manque plus que vous.
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.03]"
            style={{ background: '#00E5D1', color: '#0D1B3E' }}
          >
            Créer mon compte gratuitement →
          </Link>
          <p className="mt-4 text-xs" style={{ color: 'rgba(240,244,255,0.3)' }}>
            Gratuit pour commencer · Sans installation · Prêt en 5 minutes
          </p>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="text-center pb-8" style={{ color: 'rgba(240,244,255,0.2)', fontSize: '12px' }}>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-3 px-4">
          <Link href="/" style={{ color: 'rgba(240,244,255,0.3)' }}>Accueil</Link>
          <Link href="/pour-les-bars" style={{ color: 'rgba(240,244,255,0.3)' }}>Bars &amp; Restaurants</Link>
          <Link href="/pour-les-animateurs" style={{ color: 'rgba(240,244,255,0.3)' }}>Animateurs</Link>
          <Link href="/pour-les-evenements" style={{ color: 'rgba(240,244,255,0.3)' }}>Événements</Link>
          <Link href="/pricing" style={{ color: 'rgba(240,244,255,0.3)' }}>Tarifs</Link>
        </div>
        MUZQUIZ © 2025 — Quiz &amp; Blind Test en temps réel
      </footer>

    </main>
  );
}
