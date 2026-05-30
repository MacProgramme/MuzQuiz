import type { Metadata } from 'next';
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

export const metadata: Metadata = {
  title: 'Quiz & Blind Test pour Soirées et Événements — MuzQuiz',
  description: 'Animez vos soirées, mariages, anniversaires, formations et événements professionnels avec des quiz interactifs, quiz image et blind tests musicaux sur smartphone. Créez votre animation en quelques minutes.',
  keywords: [
    'quiz soirée', 'quiz événement', 'blind test soirée', 'quiz anniversaire',
    'quiz mariage', 'quiz formation', 'quiz interactif smartphone', 'quiz image',
    'blind test musical', 'team building quiz', 'animation quiz', 'quiz QR code',
    'quiz association', 'quiz séminaire', 'quiz enseignant', 'quiz formateur',
  ],
  alternates: { canonical: 'https://www.muzquiz.fr/pour-les-evenements' },
  openGraph: {
    title: 'Quiz & Blind Test pour Soirées et Événements — MuzQuiz',
    description: 'Animez vos soirées, mariages, anniversaires, formations et événements avec des quiz interactifs, quiz image et blind tests musicaux sur smartphone.',
    url: 'https://www.muzquiz.fr/pour-les-evenements',
  },
};

const USECASES = [
  {
    title: 'Team Building',
    desc: 'Brisez la glace entre collègues grâce à des quiz interactifs qui favorisent l\'échange, la cohésion et l\'esprit d\'équipe. Une façon simple de transformer un moment professionnel en expérience mémorable.',
  },
  {
    title: 'Mariages',
    desc: 'Créez des quiz personnalisés sur les mariés, leurs anecdotes ou leurs souvenirs communs. Ajoutez un blind test musical pour faire participer toutes les générations.',
  },
  {
    title: 'Formations & Séminaires',
    desc: 'Dynamisez vos conférences, ateliers et séminaires avec des quiz interactifs qui stimulent l\'attention et renforcent la mémorisation.',
  },
  {
    title: 'Enseignants & Formateurs',
    desc: 'Transformez vos cours et formations en expériences participatives grâce aux quiz, quiz image et défis interactifs. Vérifiez les connaissances tout en maintenant l\'engagement du groupe.',
  },
  {
    title: 'Fêtes & Anniversaires',
    desc: 'Animez vos soirées avec des quiz sur les souvenirs, la culture populaire, les films, la musique ou les passions de vos invités. Une activité simple qui fait participer tout le monde.',
  },
  {
    title: 'Associations & Clubs',
    desc: 'Organisez facilement des soirées quiz thématiques pour fédérer vos membres et créer des rendez-vous réguliers appréciés par votre communauté.',
  },
  {
    title: 'Événements publics',
    desc: 'Festivals, foires, salons, médiathèques ou manifestations locales : attirez l\'attention du public grâce à des animations interactives accessibles à tous.',
  },
];

const FEATURES = [
  {
    title: 'Quiz générés avec l\'IA',
    desc: 'Créez rapidement des questions et des quiz complets à partir d\'un simple thème.',
  },
  {
    title: 'Quiz image interactifs',
    desc: 'Logos, célébrités, films, jeux vidéo ou monuments : ajoutez une dimension visuelle à vos animations.',
  },
  {
    title: 'Accès par smartphone',
    desc: 'Les participants rejoignent instantanément la partie via un QR Code, sans téléchargement.',
  },
  {
    title: 'Zéro matériel requis',
    desc: 'Aucun boîtier, aucune installation. Tout fonctionne directement dans le navigateur.',
  },
];

const FAQ = [
  {
    q: 'Comment organiser un quiz pour une soirée entre amis ?',
    a: 'MuzQuiz permet de créer ou générer un quiz en quelques minutes. Les participants rejoignent la partie via leur smartphone et jouent directement depuis leur navigateur grâce à un simple QR Code.',
  },
  {
    q: 'Peut-on créer des quiz personnalisés ?',
    a: 'Oui. Vous pouvez créer vos propres questions, intégrer vos images et construire des animations entièrement adaptées à votre événement.',
  },
  {
    q: 'Peut-on utiliser MuzQuiz pour une formation ?',
    a: 'Oui. Les enseignants, formateurs et entreprises utilisent MuzQuiz pour rendre leurs contenus plus interactifs et favoriser la participation.',
  },
  {
    q: 'Les participants doivent-ils installer une application ?',
    a: 'Non. Tout fonctionne directement dans le navigateur web du téléphone grâce à un simple QR Code. Aucun téléchargement n\'est requis.',
  },
  {
    q: 'Peut-on organiser un blind test musical ?',
    a: 'Oui. MuzQuiz permet de créer et d\'animer des blind tests musicaux adaptés à tous types d\'événements.',
  },
];

export default function PourLesEvenementsPage() {
  return (
    <main style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 60%, #0D1B3E 100%)', minHeight: '100vh' }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(0,229,209,0.15)' }}>
        <Link href="/"><MuzquizLogo width={120} textSize="1.8rem" /></Link>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm font-bold hidden sm:block" style={{ color: 'rgba(240,244,255,0.5)' }}>Tarifs</Link>
          <Link href="/signup" className="text-sm font-black px-4 py-2 rounded-xl" style={{ background: '#00E5D1', color: '#0D1B3E' }}>
            Essayer gratuitement →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
          style={{ background: 'rgba(0,229,209,0.1)', color: '#00E5D1', border: '1px solid rgba(0,229,209,0.25)' }}>
          Soirées &amp; Événements
        </div>
        <h1 className="text-4xl sm:text-5xl font-black mb-6 leading-tight" style={{ color: '#F0F4FF' }}>
          Faites jouer, apprendre<br />
          <span style={{ color: '#00E5D1' }}>et partager autrement</span>
        </h1>
        <p className="text-base sm:text-lg mb-4 max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(240,244,255,0.65)' }}>
          Quiz, quiz image et blind tests musicaux sur smartphone pour les anniversaires, mariages, associations, formations, événements professionnels et soirées entre amis.
        </p>
        <p className="text-sm mb-10 max-w-xl mx-auto leading-relaxed" style={{ color: 'rgba(240,244,255,0.4)' }}>
          Créez votre animation en quelques minutes grâce à l'assistant IA. Les participants rejoignent la partie directement depuis leur téléphone, sans téléchargement ni matériel spécifique.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/signup"
            className="px-8 py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.03]"
            style={{ background: '#00E5D1', color: '#0D1B3E' }}>
            Commencer gratuitement
          </Link>
          <Link href="/pricing"
            className="px-8 py-4 rounded-2xl font-black text-base"
            style={{ background: 'rgba(255,255,255,0.07)', color: '#F0F4FF', border: '1px solid rgba(255,255,255,0.12)' }}>
            Voir les tarifs
          </Link>
        </div>
      </section>

      {/* Use cases */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <h2 className="text-2xl sm:text-3xl font-black text-center mb-4" style={{ color: '#F0F4FF' }}>
          Des animations pour tous les moments qui comptent
        </h2>
        <p className="text-center text-sm mb-10 max-w-xl mx-auto" style={{ color: 'rgba(240,244,255,0.45)' }}>
          MuzQuiz est une plateforme française de quiz et de blind tests sur smartphone qui s'adapte à tous vos contextes.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {USECASES.map(u => (
            <div key={u.title} className="p-5 rounded-2xl flex flex-col gap-2"
              style={{ background: 'rgba(0,229,209,0.04)', border: '1px solid rgba(0,229,209,0.12)' }}>
              <h3 className="font-black text-base" style={{ color: '#F0F4FF' }}>{u.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.5)' }}>{u.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map(f => (
            <div key={f.title} className="p-5 rounded-2xl text-center"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h3 className="font-black text-sm mb-2" style={{ color: '#00E5D1' }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(240,244,255,0.45)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section SEO */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="p-8 rounded-3xl flex flex-col gap-6"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="text-xl sm:text-2xl font-black" style={{ color: '#F0F4FF' }}>
            Pourquoi choisir MuzQuiz pour vos soirées et événements ?
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.6)' }}>
            MuzQuiz est une plateforme française de quiz et de blind tests sur smartphone qui réunit dans un seul outil tout ce dont vous avez besoin pour animer un groupe : quiz personnalisés, quiz image interactifs, blind tests musicaux, création assistée par IA, classement en direct et accès par QR Code.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.6)' }}>
            Les participants rejoignent une partie grâce à un QR Code sans téléchargement. Tout fonctionne sur smartphone, tablette et ordinateur. Que vous organisiez un anniversaire, une formation, un mariage, une soirée associative ou un événement professionnel, vous disposez d'un outil simple à prendre en main et rapide à mettre en place.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.6)' }}>
            L'assistant IA aide à générer rapidement des questions et des quiz complets à partir d'un simple thème. La plateforme s'adapte aussi bien aux soirées privées qu'aux formations et événements professionnels.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-2xl sm:text-3xl font-black text-center mb-4" style={{ color: '#F0F4FF' }}>
          Questions fréquentes
        </h2>
        <p className="text-center text-sm mb-10" style={{ color: 'rgba(240,244,255,0.4)' }}>
          Tout ce qu'on vous posera avant votre première soirée MuzQuiz.
        </p>
        <div className="flex flex-col gap-4">
          {FAQ.map((item, i) => (
            <div key={i} className="p-5 rounded-2xl"
              style={{ background: 'rgba(0,229,209,0.04)', border: '1px solid rgba(0,229,209,0.12)' }}>
              <p className="font-black text-sm mb-2" style={{ color: '#F0F4FF' }}>{item.q}</p>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.55)' }}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-2xl mx-auto px-6 pb-20 text-center">
        <div className="p-10 rounded-3xl"
          style={{ background: 'linear-gradient(135deg, rgba(0,229,209,0.1) 0%, rgba(139,92,246,0.08) 100%)', border: '1.5px solid rgba(0,229,209,0.25)' }}>
          <h2 className="text-2xl sm:text-3xl font-black mb-4" style={{ color: '#F0F4FF' }}>
            Votre prochain événement<br />commence ici
          </h2>
          <p className="text-sm sm:text-base mb-4 max-w-md mx-auto leading-relaxed" style={{ color: 'rgba(240,244,255,0.6)' }}>
            Créez votre compte gratuitement. Composez votre quiz en quelques minutes. Lancez votre première animation ce soir.
          </p>
          <p className="text-sm mb-8 max-w-md mx-auto" style={{ color: 'rgba(240,244,255,0.4)' }}>
            Pas besoin de carte bancaire pour commencer. Vos participants n'ont rien à installer.
          </p>
          <Link href="/signup"
            className="inline-block px-10 py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.03]"
            style={{ background: '#00E5D1', color: '#0D1B3E' }}>
            Créer mon compte gratuitement →
          </Link>
          <p className="mt-4 text-xs" style={{ color: 'rgba(240,244,255,0.3)' }}>
            Gratuit pour commencer · Sans installation · Prêt en 5 minutes
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center pb-8" style={{ color: 'rgba(240,244,255,0.2)', fontSize: '12px' }}>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-3 px-4">
          <Link href="/" style={{ color: 'rgba(240,244,255,0.3)' }}>Accueil</Link>
          <Link href="/pour-les-bars" style={{ color: 'rgba(240,244,255,0.3)' }}>Bars &amp; Restaurants</Link>
          <Link href="/pour-les-animateurs" style={{ color: 'rgba(240,244,255,0.3)' }}>Animateurs</Link>
          <Link href="/pour-les-streamers" style={{ color: 'rgba(240,244,255,0.3)' }}>Streamers</Link>
          <Link href="/pricing" style={{ color: 'rgba(240,244,255,0.3)' }}>Tarifs</Link>
        </div>
        MUZQUIZ © 2025 — Quiz &amp; Blind Test en temps réel
      </footer>
    </main>
  );
}
