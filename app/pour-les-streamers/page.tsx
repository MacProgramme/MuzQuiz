import type { Metadata } from 'next';
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

export const metadata: Metadata = {
  title: 'Quiz & Blind Test pour Streamers et Créateurs',
  description: 'Engagez votre communauté avec des quiz et blind tests en direct. Vos viewers jouent depuis leur téléphone, les classements s\'affichent en temps réel sur votre stream.',
  keywords: ['quiz stream', 'quiz twitch', 'blind test stream', 'quiz viewers', 'quiz discord', 'animation stream quiz', 'jeu stream interactif'],
  alternates: { canonical: 'https://www.muzquiz.fr/pour-les-streamers' },
  openGraph: {
    title: 'MUZQUIZ pour Streamers — Engagez vos viewers avec des quiz',
    description: 'Organisez des quiz et blind tests avec votre communauté en direct. Vos viewers jouent depuis leur téléphone.',
    url: 'https://www.muzquiz.fr/pour-les-streamers',
  },
};

const FEATURES = [
  {
    title: 'Overlay stream-friendly',
    desc: 'Affichez le classement et les questions sur votre stream via l\'écran public. Simple à capturer dans OBS ou Streamlabs.',
  },
  {
    title: 'Jusqu\'à 250 viewers',
    desc: 'Accueillez jusqu\'à 250 participants simultanés dans une même partie. Idéal pour les streams de taille moyenne.',
  },
  {
    title: 'Blind Test avec votre musique',
    desc: 'Intégrez vos propres extraits YouTube pour des blind tests thématiques adaptés à votre audience.',
  },
  {
    title: 'Questions sur mesure',
    desc: 'Créez des questions sur vos inside jokes, vos emotes, votre communauté. Vos viewers adoreront.',
  },
  {
    title: 'Zéro friction pour les viewers',
    desc: 'Vos viewers rejoignent en tapant un simple code. Pas d\'application à télécharger, pas de compte requis.',
  },
];

export default function PourLesStreamersPage() {
  return (
    <main style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 60%, #0D1B3E 100%)', minHeight: '100vh' }}>

      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(245,158,11,0.15)' }}>
        <Link href="/"><MuzquizLogo width={120} textSize="1.8rem" /></Link>
        <div className="flex items-center gap-3">
          <Link href="/pricing" className="text-sm font-bold hidden sm:block" style={{ color: 'rgba(240,244,255,0.5)' }}>Tarifs</Link>
          <Link href="/signup" className="text-sm font-black px-4 py-2 rounded-xl" style={{ background: '#F59E0B', color: '#0D1B3E' }}>
            Essayer gratuitement →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
          style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.25)' }}>
          Pour les streamers
        </div>
        <h1 className="text-4xl sm:text-5xl font-black mb-6 leading-tight" style={{ color: '#F0F4FF' }}>
          Faites jouer votre chat<br />
          <span style={{ color: '#F59E0B' }}>en temps réel</span>
        </h1>
        <p className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(240,244,255,0.6)' }}>
          Quiz et blind tests — vos viewers participent depuis leur téléphone pendant votre stream. Créez des moments de jeu interactifs inoubliables avec votre communauté.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/signup"
            className="px-8 py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.03]"
            style={{ background: '#F59E0B', color: '#0D1B3E' }}>
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
          Fait pour le live
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(f => (
            <div key={f.title} className="p-5 rounded-2xl" style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)' }}>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.5)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comment intégrer */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-black text-center mb-8" style={{ color: '#F0F4FF' }}>Intégrer dans votre stream</h2>
        <div className="flex flex-col gap-4">
          {[
            { step: '1', title: 'Lancez une partie', desc: 'Créez votre quiz sur MUZQUIZ et partagez le code avec votre chat.' },
            { step: '2', title: 'Capturez l\'écran public', desc: 'Dans OBS, ajoutez une source "Fenêtre" ou "Navigateur" pointant vers l\'URL de l\'écran public MUZQUIZ.' },
            { step: '3', title: 'Vos viewers jouent', desc: 'Ils tapent le code sur muzquiz.fr depuis leur téléphone ou PC et rejoignent la partie instantanément.' },
          ].map(s => (
            <div key={s.step} className="flex gap-5 items-start p-5 rounded-2xl" style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg flex-shrink-0"
                style={{ background: '#F59E0B', color: '#0D1B3E' }}>{s.step}</div>
              <div>
                <h3 className="font-black text-base mb-1" style={{ color: '#F0F4FF' }}>{s.title}</h3>
                <p className="text-sm" style={{ color: 'rgba(240,244,255,0.55)' }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-2xl mx-auto px-6 pb-20 text-center">
        <div className="p-8 rounded-3xl" style={{ background: 'rgba(245,158,11,0.06)', border: '1.5px solid rgba(245,158,11,0.2)' }}>
          <h2 className="text-2xl font-black mb-3" style={{ color: '#F0F4FF' }}>Testez dès votre prochain stream</h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(240,244,255,0.5)' }}>
            Gratuit pour commencer. Vos viewers vont adorer.
          </p>
          <Link href="/signup"
            className="inline-block px-10 py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.03]"
            style={{ background: '#F59E0B', color: '#0D1B3E' }}>
            Créer mon compte gratuit →
          </Link>
        </div>
      </section>

      <footer className="text-center pb-8" style={{ color: 'rgba(240,244,255,0.2)', fontSize: '12px' }}>
        <div className="flex justify-center gap-6 mb-3 flex-wrap">
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
