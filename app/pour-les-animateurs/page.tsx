import type { Metadata } from 'next';
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

export const metadata: Metadata = {
  title: 'Quiz & Blind Test pour Animateurs',
  description: 'L\'outil des animateurs professionnels : créez et gérez vos propres packs de questions, organisez des blind tests musicaux, gérez plusieurs événements depuis un seul compte.',
  keywords: ['animateur quiz', 'outil animateur', 'logiciel quiz', 'blind test animateur', 'quiz événementiel', 'animation quiz professionnel'],
  alternates: { canonical: 'https://www.muzquiz.fr/pour-les-animateurs' },
  openGraph: {
    title: 'MUZQUIZ pour les Animateurs — Gérez vos événements quiz',
    description: 'Créez vos propres packs de questions, organisez blind tests et quiz professionnels. L\'outil conçu pour les animateurs.',
    url: 'https://www.muzquiz.fr/pour-les-animateurs',
  },
};

const FEATURES = [
  {
    title: 'Vos packs personnalisés',
    desc: 'Créez autant de packs de questions que vous voulez. Culture générale, thèmes spécifiques, questions sur mesure pour chaque client.',
  },
  {
    title: 'Blind Tests musicaux sur mesure',
    desc: 'Préparez vos propres sessions musicales, configurez vos extraits et animez vos parties avec un rythme adapté à votre public.',
  },
  {
    title: 'Quiz, Quiz image et Blind Tests',
    desc: 'Créez des quiz classiques, ajoutez des questions visuelles ou lancez des blind tests musicaux selon l\'ambiance de votre audience.',
  },
  {
    title: 'Classements en temps réel',
    desc: 'Affichez le classement sur n\'importe quel écran. Spectaculaire pour créer de la tension avant l\'annonce du vainqueur.',
  },
  {
    title: 'Contrôle total',
    desc: 'Avancez à votre rythme, pausez, revenez en arrière. Vous êtes maître du jeu depuis votre téléphone.',
  },
  {
    title: 'Jusqu\'à 250 participants',
    desc: 'Animez aussi bien des petits groupes que de grands événements. Le nombre de participants dépend de votre formule, avec des parties pouvant accueillir jusqu\'à 250 participants.',
  },
  {
    title: 'Quiz image interactifs',
    desc: 'Ajoutez des images à vos questions pour créer des animations plus immersives : logos, films, objets, personnages ou défis visuels.',
  },
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

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
          style={{ background: 'rgba(139,92,246,0.12)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.25)' }}>
          Pour les animateurs
        </div>
        <h1 className="text-4xl sm:text-5xl font-black mb-6 leading-tight" style={{ color: '#F0F4FF' }}>
          L'outil qu'il vous manquait<br />
          <span style={{ color: '#8B5CF6' }}>pour vos animations quiz</span>
        </h1>
        <p className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(240,244,255,0.6)' }}>
          Créez vos propres packs de questions, intégrez votre blind test, gérez vos soirées en temps réel. MUZQUIZ est conçu pour les animateurs qui veulent impressionner leur public.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/signup"
            className="px-8 py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.03]"
            style={{ background: '#8B5CF6', color: 'white' }}>
            Commencer gratuitement
          </Link>
          <Link href="/pricing"
            className="px-8 py-4 rounded-2xl font-black text-base"
            style={{ background: 'rgba(255,255,255,0.07)', color: '#F0F4FF', border: '1px solid rgba(255,255,255,0.12)' }}>
            Voir les tarifs
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-black text-center mb-10" style={{ color: '#F0F4FF' }}>
          Conçu pour les professionnels de l'animation
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.slice(0, 6).map(f => (
            <div key={f.title} className="p-5 rounded-2xl" style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)' }}>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.5)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
        {FEATURES.length > 6 && (
          <div className="flex justify-center mt-4">
            {FEATURES.slice(6).map(f => (
              <div key={f.title} className="p-5 rounded-2xl w-full sm:w-1/2 lg:w-1/3"
                style={{ background: 'rgba(139,92,246,0.05)', border: '1px solid rgba(139,92,246,0.15)' }}>
                <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.5)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Comparaison */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-black text-center mb-8" style={{ color: '#F0F4FF' }}>Pourquoi MUZQUIZ plutôt qu'un autre outil ?</h2>
        <div className="overflow-hidden rounded-2xl" style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(139,92,246,0.15)' }}>
                <th className="text-left px-5 py-3 font-black" style={{ color: 'rgba(240,244,255,0.5)' }}>Fonctionnalité</th>
                <th className="px-5 py-3 font-black text-center" style={{ color: '#8B5CF6' }}>MUZQUIZ</th>
                <th className="px-5 py-3 font-black text-center" style={{ color: 'rgba(240,244,255,0.3)' }}>Solutions classiques</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Blind Test YouTube intégré', true, false],
                ['Quiz image interactifs', true, false],
                ['Assistant IA', true, false],
                ['Packs personnalisés illimités', true, false],
                ['Gratuit pour démarrer', true, false],
                ['Compatible smartphone', true, true],
                ['Sans installation', true, true],
                ['Classement projeté', true, true],
              ].map(([label, muz, other], i) => (
                <tr key={i as number} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td className="px-5 py-3 font-bold" style={{ color: 'rgba(240,244,255,0.7)' }}>{label as string}</td>
                  <td className="px-5 py-3 text-center">{muz ? <span style={{ color: '#00E5D1' }}>✓</span> : <span style={{ color: 'rgba(255,80,80,0.6)' }}>✕</span>}</td>
                  <td className="px-5 py-3 text-center">{other ? <span style={{ color: '#00E5D1' }}>✓</span> : <span style={{ color: 'rgba(255,80,80,0.6)' }}>✕</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-2xl mx-auto px-6 pb-20 text-center">
        <div className="p-8 rounded-3xl" style={{ background: 'rgba(139,92,246,0.08)', border: '1.5px solid rgba(139,92,246,0.2)' }}>
          <h2 className="text-2xl font-black mb-3" style={{ color: '#F0F4FF' }}>Testez sur votre prochaine animation</h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(240,244,255,0.5)' }}>
            Créez votre compte, importez vos questions, lancez une partie test. En moins de 5 minutes.
          </p>
          <Link href="/signup"
            className="inline-block px-10 py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.03]"
            style={{ background: '#8B5CF6', color: 'white' }}>
            Créer mon compte gratuit →
          </Link>
        </div>
      </section>

      <footer className="text-center pb-8" style={{ color: 'rgba(240,244,255,0.2)', fontSize: '12px' }}>
        <div className="flex justify-center gap-6 mb-3 flex-wrap">
          <Link href="/" style={{ color: 'rgba(240,244,255,0.3)' }}>Accueil</Link>
          <Link href="/pour-les-bars" style={{ color: 'rgba(240,244,255,0.3)' }}>Bars & Restaurants</Link>
          <Link href="/pour-les-evenements" style={{ color: 'rgba(240,244,255,0.3)' }}>Événements</Link>
          <Link href="/pour-les-streamers" style={{ color: 'rgba(240,244,255,0.3)' }}>Streamers</Link>
          <Link href="/pricing" style={{ color: 'rgba(240,244,255,0.3)' }}>Tarifs</Link>
        </div>
        MUZQUIZ © 2025 — Quiz & Blind Test en temps réel
      </footer>
    </main>
  );
}
