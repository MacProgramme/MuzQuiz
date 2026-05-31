import type { Metadata } from 'next';
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

export const metadata: Metadata = {
  title: "L'histoire de MuzQuiz : réinventer les quiz et blind tests sur smartphone",
  description: "Découvrez comment MuzQuiz est né en 2025 au sein de La Caravane Game : l'histoire d'un passionné de jeux qui a voulu rendre les quiz et blind tests accessibles depuis n'importe quel smartphone.",
  keywords: [
    'histoire muzquiz', 'à propos muzquiz', 'qui est muzquiz',
    'créateur quiz en ligne', 'blind test smartphone', 'quiz interactif smartphone',
    'La Caravane Game', 'quiz sans téléchargement', 'quiz en ligne france',
  ],
  alternates: { canonical: 'https://www.muzquiz.fr/histoire' },
  openGraph: {
    title: "L'histoire de MuzQuiz — Réinventer les quiz et blind tests sur smartphone",
    description: "Comment une idée née en 2025 dans La Caravane Game est devenue une plateforme de quiz et blind tests utilisée par des particuliers, bars, animateurs et streamers.",
    url: 'https://www.muzquiz.fr/histoire',
  },
};

export default function HistoirePage() {
  return (
    <main style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 60%, #0D1B3E 100%)', minHeight: '100vh' }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,0,170,0.15)' }}>
        <Link href="/"><MuzquizLogo width={120} textSize="1.8rem" /></Link>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm font-bold hidden sm:block" style={{ color: 'rgba(240,244,255,0.5)' }}>Tarifs</Link>
          <Link href="/signup" className="text-sm font-black px-4 py-2 rounded-xl" style={{ background: '#FF00AA', color: 'white' }}>
            Commencer gratuitement →
          </Link>
        </div>
      </nav>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
        <div
          className="inline-block mb-5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
          style={{ background: 'rgba(255,0,170,0.1)', color: '#FF00AA', border: '1px solid rgba(255,0,170,0.25)' }}
        >
          Notre histoire
        </div>
        <h1 className="text-3xl sm:text-4xl font-black mb-6 leading-tight" style={{ color: '#F0F4FF' }}>
          L&apos;histoire de MuzQuiz :<br />
          <span style={{ color: '#FF00AA' }}>réinventer les quiz et blind tests sur smartphone</span>
        </h1>
        <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'rgba(240,244,255,0.55)' }}>
          Comment une idée simple née en 2025 est devenue une plateforme de quiz et de blind tests utilisée par des particuliers, des bars, des animateurs, des associations et des streamers.
        </p>
      </section>

      {/* ── CONTENU PRINCIPAL ─────────────────────────────────────────────── */}
      <article className="max-w-2xl mx-auto px-6 pb-20">
        <div className="flex flex-col gap-14">

          {/* Section 1 — Les origines */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0" style={{ background: 'rgba(255,0,170,0.15)', color: '#FF00AA' }}></div>
              <h2 className="text-xl sm:text-2xl font-black" style={{ color: '#F0F4FF' }}>
                Une idée née d&apos;un constat simple
              </h2>
            </div>
            <div
              className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4 text-sm sm:text-base leading-relaxed"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(240,244,255,0.65)' }}
            >
              <p>
                MuzQuiz est né en 2025 au sein de <strong style={{ color: '#F0F4FF' }}>La Caravane Game</strong> avec une idée simple : rendre les quiz et les blind tests plus accessibles, plus immersifs et plus amusants.
              </p>
              <p>
                À l&apos;origine, le projet était conçu pour être utilisé lors d&apos;animations en présentiel avec un nombre limité de joueurs autour d&apos;un écran. Très vite, une évidence s&apos;est imposée : presque tout le monde possède déjà un smartphone dans sa poche.
              </p>
              <p style={{ color: '#F0F4FF', fontWeight: 700, fontSize: '1rem' }}>
                Pourquoi imposer du matériel spécifique quand les joueurs disposent déjà de l&apos;outil idéal pour participer ?
              </p>
              <p>
                C&apos;est à partir de cette réflexion que MuzQuiz a commencé sa transformation. Le projet a été entièrement repensé pour devenir une plateforme de quiz et de blind tests accessible directement depuis un navigateur web, sans téléchargement et sans installation compliquée.
              </p>
              <p>
                Ce qui n&apos;était au départ qu&apos;un concept utilisé dans le cadre de La Caravane Game est progressivement devenu un véritable créateur de quiz en ligne pensé pour les particuliers, les bars, les associations, les DJ, les streamers et les entreprises.
              </p>
            </div>
          </section>

          {/* Section 2 — La passion */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0" style={{ background: 'rgba(139,92,246,0.15)', color: '#8B5CF6' }}></div>
              <h2 className="text-xl sm:text-2xl font-black" style={{ color: '#F0F4FF' }}>
                Un créateur de quiz imaginé par un passionné de jeux
              </h2>
            </div>
            <div
              className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4 text-sm sm:text-base leading-relaxed"
              style={{ background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.12)', color: 'rgba(240,244,255,0.65)' }}
            >
              <p>
                Derrière MuzQuiz, il n&apos;y a pas une grande entreprise ou une équipe marketing. Le projet est né de la passion d&apos;un joueur qui aime les défis, la compétition et les concepts originaux.
              </p>
              <p>
                Depuis toujours, jouer ne consiste pas simplement à participer. Un bon jeu doit créer de l&apos;émotion, du suspense, des rebondissements et cette envie permanente de décrocher la première place.
              </p>
              <p>
                Cette vision a guidé chaque évolution de MuzQuiz. L&apos;objectif n&apos;a jamais été de créer un logiciel compliqué rempli d&apos;options techniques, mais une plateforme capable de réunir rapidement des personnes autour d&apos;une expérience de jeu simple, fluide et engageante.
              </p>
            </div>
          </section>

          {/* Section 3 — Le nom */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ background: 'rgba(0,229,209,0.15)', border: '2px solid rgba(0,229,209,0.3)' }} />
              <h2 className="text-xl sm:text-2xl font-black" style={{ color: '#F0F4FF' }}>
                Pourquoi le nom MuzQuiz ?
              </h2>
            </div>
            <div
              className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4 text-sm sm:text-base leading-relaxed"
              style={{ background: 'rgba(0,229,209,0.04)', border: '1px solid rgba(0,229,209,0.12)', color: 'rgba(240,244,255,0.65)' }}
            >
              <p>
                Le nom MuzQuiz trouve son origine dans une passion qui dépasse largement l&apos;univers du jeu : <strong style={{ color: '#F0F4FF' }}>le voyage</strong>.
              </p>
              <p>
                Curieux de découvrir de nouvelles cultures, de comprendre l&apos;histoire des régions du monde et d&apos;observer comment vivent les populations ailleurs, je passe beaucoup de temps à préparer de futurs voyages et à explorer des lieux parfois méconnus.
              </p>
              <p>
                C&apos;est lors de la préparation d&apos;un voyage au Mexique que je découvre la ville de <strong style={{ color: '#00E5D1' }}>Múzquiz</strong>. Le nom attire immédiatement mon attention.
              </p>
              <p>
                Quelques mois plus tard, lorsque vient le moment de baptiser le projet, cette référence revient naturellement à l&apos;esprit. Le nom est adapté pour donner naissance à MuzQuiz, une identité originale mêlant l&apos;univers du quiz, de la musique et du divertissement.
              </p>
              <p>
                Cette inspiration a également contribué à façonner l&apos;univers visuel de la plateforme, notamment autour de la célèbre moustache qui accompagne aujourd&apos;hui l&apos;identité de la marque.
              </p>
            </div>
          </section>

          {/* Section 4 — Les fonctionnalités */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0" style={{ background: 'rgba(255,0,170,0.15)', color: '#FF00AA' }}></div>
              <h2 className="text-xl sm:text-2xl font-black" style={{ color: '#F0F4FF' }}>
                Bien plus qu&apos;un simple quiz interactif
              </h2>
            </div>
            <div
              className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4 text-sm sm:text-base leading-relaxed"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(240,244,255,0.65)' }}
            >
              <p>
                Au fil du temps, MuzQuiz a beaucoup évolué. L&apos;objectif est devenu de réunir dans une seule plateforme tout ce qui permet de créer et d&apos;animer facilement une expérience de jeu moderne :
              </p>
              <ul className="flex flex-col gap-2 mt-1 ml-2">
                {[
                  'Quiz personnalisés',
                  'Quiz image interactifs',
                  'Blind tests musicaux',
                  "Assistant IA pour générer des questions et trouver des idées",
                  'Classements en direct',
                  'Création rapide de parties',
                  'Participation sur smartphone, tablette ou ordinateur',
                  'Accès simple sans téléchargement',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span style={{ color: '#FF00AA', flexShrink: 0, marginTop: '1px' }}>→</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2">
                Chaque fonctionnalité a été pensée avec la même philosophie : permettre à n&apos;importe qui de créer un jeu en quelques minutes et de commencer à jouer immédiatement.
              </p>
            </div>
          </section>

          {/* Section 5 — Pour tous */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0" style={{ background: 'rgba(139,92,246,0.15)', color: '#8B5CF6' }}></div>
              <h2 className="text-xl sm:text-2xl font-black" style={{ color: '#F0F4FF' }}>
                Une plateforme conçue pour tous les joueurs
              </h2>
            </div>
            <div
              className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4 text-sm sm:text-base leading-relaxed"
              style={{ background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.12)', color: 'rgba(240,244,255,0.65)' }}
            >
              <p>
                Que ce soit pour organiser un quiz entre amis, animer un bar, proposer un blind test musical lors d&apos;une soirée, créer une animation pour une association ou dynamiser une communauté en direct sur Twitch, les besoins restent souvent les mêmes : <strong style={{ color: '#F0F4FF' }}>simplicité, rapidité et plaisir de jouer</strong>.
              </p>
              <p>
                MuzQuiz a été conçu pour répondre à ces attentes sans imposer de contraintes techniques inutiles.
              </p>
              <p style={{ color: '#F0F4FF', fontWeight: 700 }}>
                L&apos;objectif est simple : consacrer moins de temps à la préparation et plus de temps au jeu.
              </p>
            </div>
          </section>

          {/* Section 6 — Avenir */}
          <section>
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ background: 'rgba(0,229,209,0.15)', border: '2px solid rgba(0,229,209,0.3)' }} />
              <h2 className="text-xl sm:text-2xl font-black" style={{ color: '#F0F4FF' }}>
                Une aventure qui ne fait que commencer
              </h2>
            </div>
            <div
              className="p-6 sm:p-8 rounded-2xl flex flex-col gap-4 text-sm sm:text-base leading-relaxed"
              style={{ background: 'rgba(0,229,209,0.04)', border: '1px solid rgba(0,229,209,0.12)', color: 'rgba(240,244,255,0.65)' }}
            >
              <p>
                La plus grande fierté derrière MuzQuiz aujourd&apos;hui n&apos;est pas un chiffre ou une statistique. C&apos;est de voir une idée imaginée en 2025 devenir un véritable produit, utilisé, testé et amélioré jour après jour.
              </p>
              <p>
                Le projet continue d&apos;évoluer en permanence avec de nouvelles fonctionnalités, de nouveaux outils et de nouvelles idées destinées à rendre les quiz et les blind tests toujours plus accessibles et plus amusants.
              </p>
              <p style={{ color: '#F0F4FF', fontWeight: 700 }}>
                L&apos;ambition reste la même qu&apos;au premier jour : faire de MuzQuiz la référence française du quiz et du blind test sur smartphone, et le premier nom auquel on pense lorsqu&apos;on veut organiser une partie entre amis, animer un événement ou créer un moment de jeu inoubliable.
              </p>
            </div>
          </section>

        </div>
      </article>

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
            Prêt à découvrir l&apos;univers MuzQuiz ?
          </h2>
          <p className="text-sm sm:text-base mb-8 max-w-md mx-auto leading-relaxed" style={{ color: 'rgba(240,244,255,0.55)' }}>
            Créez votre premier quiz gratuitement et découvrez une nouvelle façon de jouer, partager et défier vos proches grâce aux quiz, quiz image et blind tests musicaux sur smartphone.
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.03]"
            style={{ background: '#FF00AA', color: 'white' }}
          >
            Créer mon premier quiz gratuitement →
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
          <Link href="/pour-les-bars" style={{ color: 'rgba(240,244,255,0.3)' }}>Bars &amp; Restaurants</Link>
          <Link href="/pour-les-animateurs" style={{ color: 'rgba(240,244,255,0.3)' }}>Animateurs</Link>
          <Link href="/quiz-streamer" style={{ color: 'rgba(240,244,255,0.3)' }}>Streamers</Link>
          <Link href="/pricing" style={{ color: 'rgba(240,244,255,0.3)' }}>Tarifs</Link>
        </div>
        MUZQUIZ © 2025 — Quiz &amp; Blind Test en temps réel
      </footer>

    </main>
  );
}
