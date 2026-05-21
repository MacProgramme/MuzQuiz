import type { Metadata } from 'next';
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

export const metadata: Metadata = {
  title: 'Quiz & Blind Test pour Bars et Restaurants',
  description: 'Animez vos soirées bar avec MUZQUIZ : quiz et blind test multijoueur en temps réel. Vos clients jouent depuis leur smartphone, classements live, packs musicaux thématiques.',
  keywords: ['quiz bar', 'blind test bar', 'animation bar quiz', 'soirée quiz bar', 'quiz restaurant', 'blind test restaurant', 'animation soirée'],
  alternates: { canonical: 'https://www.muzquiz.fr/pour-les-bars' },
  openGraph: {
    title: 'MUZQUIZ pour les Bars & Restaurants — Animez vos soirées',
    description: 'Organisez des quiz et blind tests inoubliables dans votre établissement. Vos clients jouent depuis leur téléphone.',
    url: 'https://www.muzquiz.fr/pour-les-bars',
  },
};

const FEATURES = [
  {
    emoji: '📱',
    title: 'Zéro matériel',
    desc: 'Vos clients jouent directement depuis leur smartphone. Pas besoin de télécommandes, tablettes ou boîtiers physiques.',
  },
  {
    emoji: '🎵',
    title: 'Blind Test musical',
    desc: 'Des packs musicaux thématiques prêts à l\'emploi : Années 80, Pop, Rock Français, Rap... ou créez les vôtres.',
  },
  {
    emoji: '🏆',
    title: 'Classements en direct',
    desc: 'Un écran de classement projeté sur votre TV ou vidéoprojecteur. L\'ambiance monte d\'un cran à chaque question.',
  },
  {
    emoji: '⚡',
    title: 'Lancez en 2 minutes',
    desc: 'Créez une partie, partagez le code, c\'est parti. Pas de configuration technique, pas d\'installation.',
  },
  {
    emoji: '🎯',
    title: 'Mode Buzzer',
    desc: 'Le premier qui appuie remporte le point. Idéal pour créer de la compétition et de l\'excitation dans la salle.',
  },
  {
    emoji: '🔄',
    title: 'Illimité',
    desc: 'Pas de limite de participants ni de parties. Organisez chaque semaine sans surcoût.',
  },
];

const TESTIMONIALS = [
  {
    text: 'Nos soirées quiz du jeudi ont doublé notre fréquentation. Les clients reviennent chaque semaine !',
    author: 'Bar Le Moustachu, Lyon',
  },
  {
    text: 'Simple à installer, les clients adorent jouer depuis leur téléphone. On n\'a même pas besoin d\'écran séparé.',
    author: 'Restaurant La Brasserie, Paris',
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

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="inline-block mb-4 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
          style={{ background: 'rgba(255,0,170,0.12)', color: '#FF00AA', border: '1px solid rgba(255,0,170,0.25)' }}>
          🍺 Pour les bars & restaurants
        </div>
        <h1 className="text-4xl sm:text-5xl font-black mb-6 leading-tight" style={{ color: '#F0F4FF' }}>
          Des soirées quiz qui font<br />
          <span style={{ color: '#FF00AA' }}>revenir vos clients</span>
        </h1>
        <p className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(240,244,255,0.6)' }}>
          MUZQUIZ transforme votre établissement en scène de jeu. Quiz, blind test musical, buzzers virtuels — vos clients jouent depuis leur téléphone, vous animez depuis le vôtre.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/signup"
            className="px-8 py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.03]"
            style={{ background: '#FF00AA', color: 'white' }}>
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
          Tout ce dont vous avez besoin pour animer
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(f => (
            <div key={f.title} className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-3xl mb-3">{f.emoji}</div>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.5)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-black text-center mb-10" style={{ color: '#F0F4FF' }}>Comment ça marche ?</h2>
        <div className="flex flex-col gap-4">
          {[
            { step: '1', title: 'Créez votre partie', desc: 'Choisissez un pack de questions ou créez le vôtre. Quiz classique ou blind test musical.' },
            { step: '2', title: 'Partagez le code', desc: 'Vos clients scannent un QR code ou tapent le code sur muzquiz.fr — depuis leur propre téléphone.' },
            { step: '3', title: 'Lancez et animez', desc: 'Vous contrôlez le rythme depuis votre téléphone. Le classement s\'affiche en direct sur votre écran.' },
          ].map(s => (
            <div key={s.step} className="flex gap-5 items-start p-5 rounded-2xl" style={{ background: 'rgba(255,0,170,0.05)', border: '1px solid rgba(255,0,170,0.15)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center font-black text-lg flex-shrink-0"
                style={{ background: '#FF00AA', color: 'white' }}>{s.step}</div>
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
        <div className="p-8 rounded-3xl" style={{ background: 'rgba(255,0,170,0.08)', border: '1.5px solid rgba(255,0,170,0.2)' }}>
          <h2 className="text-2xl font-black mb-3" style={{ color: '#F0F4FF' }}>Prêt à animer votre prochain soir ?</h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(240,244,255,0.5)' }}>
            Lancez votre première partie gratuitement. Aucune carte bancaire requise.
          </p>
          <Link href="/signup"
            className="inline-block px-10 py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.03]"
            style={{ background: '#FF00AA', color: 'white' }}>
            Créer mon compte gratuit →
          </Link>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="text-center pb-8" style={{ color: 'rgba(240,244,255,0.2)', fontSize: '12px' }}>
        <div className="flex justify-center gap-6 mb-3">
          <Link href="/" style={{ color: 'rgba(240,244,255,0.3)' }}>Accueil</Link>
          <Link href="/pour-les-animateurs" style={{ color: 'rgba(240,244,255,0.3)' }}>Animateurs</Link>
          <Link href="/pour-les-evenements" style={{ color: 'rgba(240,244,255,0.3)' }}>Événements</Link>
          <Link href="/pour-les-streamers" style={{ color: 'rgba(240,244,255,0.3)' }}>Streamers</Link>
          <Link href="/pricing" style={{