import type { Metadata } from 'next';
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

export const metadata: Metadata = {
  title: 'Quiz & Blind Test pour Événements & Soirées',
  description: 'Organisez des quiz et blind tests pour vos événements d\'entreprise, soirées privées, mariages ou team building. MUZQUIZ s\'adapte à tous les contextes.',
  keywords: ['quiz événement', 'blind test événement', 'team building quiz', 'quiz mariage', 'quiz soirée entreprise', 'animation événementielle quiz', 'quiz séminaire'],
  alternates: { canonical: 'https://www.muzquiz.fr/pour-les-evenements' },
  openGraph: {
    title: 'MUZQUIZ pour Événements — Quiz & Blind Test pour vos soirées',
    description: 'Mariages, team building, séminaires, soirées privées. MUZQUIZ anime tous vos événements avec quiz et blind test multijoueur.',
    url: 'https://www.muzquiz.fr/pour-les-evenements',
  },
};

const USECASES = [
  { title: 'Team Building', desc: 'Brisez la glace entre collègues. Un quiz d\'équipe qui crée de la cohésion et des souvenirs partagés.' },
  { title: 'Mariages', desc: 'Un blind test spécial couple, des quiz sur les mariés... Vos invités n\'oublieront pas la soirée.' },
  { title: 'Séminaires', desc: 'Dynamisez vos formations et conférences avec des quiz interactifs. L\'apprentissage par le jeu.' },
  { title: 'Fêtes & Anniversaires', desc: 'Des questions sur l\'anniversaire, la décennie de naissance, les souvenirs communs.' },
  { title: 'Associations & Clubs', desc: 'Engagez vos membres avec des soirées quiz thématiques régulières.' },
  { title: 'Événements publics', desc: 'Festivals, foires, salons... Attirez et retenez l\'attention de votre public.' },
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
          Pour les événements
        </div>
        <h1 className="text-4xl sm:text-5xl font-black mb-6 leading-tight" style={{ color: '#F0F4FF' }}>
          Le quiz qui s'adapte<br />
          <span style={{ color: '#00E5D1' }}>à tous vos événements</span>
        </h1>
        <p className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(240,244,255,0.6)' }}>
          Mariage, team building, séminaire ou soirée entre amis — MUZQUIZ transforme n'importe quel rassemblement en moment de jeu inoubliable. Aucun matériel requis.
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
      <section className="max-w-4xl mx-auto px-6 pb-16">
        <h2 className="text-2xl font-black text-center mb-10" style={{ color: '#F0F4FF' }}>
          Parfait pour tous vos événements
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {USECASES.map(u => (
            <div key={u.title} className="p-5 rounded-2xl" style={{ background: 'rgba(0,229,209,0.04)', border: '1px solid rgba(0,229,209,0.12)' }}>
              <h3 className="font-black text-base mb-2" style={{ color: '#F0F4FF' }}>{u.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,244,255,0.5)' }}>{u.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Chiffres */}
      <section className="max-w-3xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { value: '∞', label: 'Participants par partie' },
            { value: '4', label: 'Modes de jeu' },
            { value: '0', label: 'Matériel requis' },
          ].map(s => (
            <div key={s.label} className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="text-4xl font-black mb-2" style={{ color: '#00E5D1' }}>{s.value}</div>
              <div className="text-xs font-bold" style={{ color: 'rgba(240,244,255,0.45)' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="max-w-2xl mx-auto px-6 pb-20 text-center">
        <div className="p-8 rounded-3xl" style={{ background: 'rgba(0,229,209,0.06)', border: '1.5px solid rgba(0,229,209,0.18)' }}>
          <h2 className="text-2xl font-black mb-3" style={{ color: '#F0F4FF' }}>Votre prochain événement mérite mieux</h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(240,244,255,0.5)' }}>
            Créez votre compte gratuitement et préparez votre premier quiz en quelques minutes.
          </p>
          <Link href="/signup"
            className="inline-block px-10 py-4 rounded-2xl font-black text-base transition-all hover:scale-[1.03]"
            style={{ background: '#00E5D1', color: '#0D1B3E' }}>
            Créer mon compte gratuit →
          </Link>
        </div>
      </section>

      <footer className="text-center pb-8" style={{ color: 'rgba(240,244,255,0.2)', fontSize: '12px' }}>
        <div className="flex justify-center gap-6 mb-3 flex-wrap">
          <Link href="/" style={{ color: 'rgba(240,244,255,0.3)' }}>Accueil</Link>
          <Link href="/pour-les-bars" style={{ color: 'rgba(240,244,255,0.3)' }}>Bars & Restaurants</Link>
          <Link href="/pour-les-animateurs" style={{ color: 'rgba(240,244,255,0.3)' }}>Animateurs</Link>
          <Link href="/pour-les-streamers" style={{ color: 'rgba(240,244,255,0.3)' }}>Streamers</Link>
          <Link href="/pricing" style={{ color: 'rgba(240,244,255,0.3)' }}>Tarifs</Link>
        </div>
        MUZQUIZ © 2025 — Quiz & Blind Test en temps réel
      </footer>
    </main>
  );
}
