// app/pricing/page.tsx
"use client";

import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

const PLANS = [
  {
    tier: 'decouverte',
    name: 'Moustachu Découverte',
    price: '0€',
    period: 'pour toujours',
    accent: '#8B5CF6',
    accentLight: 'rgba(139,92,246,0.10)',
    accentBorder: 'rgba(139,92,246,0.25)',
    badge: null,
    features: [
      { text: 'Modes Quiz & Buzz Quiz', ok: true },
      { text: 'Questions Muzquiz prédéfinies', ok: true },
      { text: 'Parties illimitées', ok: true },
      { text: 'Packs de questions personnalisés', ok: true },
      { text: 'Création manuelle de questions', ok: true },
      { text: 'Jusqu\'à 10 joueurs par salle', ok: true },
      { text: 'Import CSV / Excel', ok: false },
      { text: 'Génération IA de questions', ok: false },
      { text: 'Blind Test & Buzz Blind Test', ok: false },
    ],
    cta: 'Commencer gratuitement',
    href: '/',
    ctaStyle: 'secondary',
  },
  {
    tier: 'essentiel',
    name: 'Moustachu Essentiel',
    price: '9,99€',
    period: 'par mois',
    accent: '#00E5D1',
    accentLight: 'rgba(0,229,209,0.08)',
    accentBorder: 'rgba(0,229,209,0.3)',
    badge: null,
    features: [
      { text: 'Tous les modes de jeu', ok: true },
      { text: 'Questions Muzquiz prédéfinies', ok: true },
      { text: 'Parties illimitées', ok: true },
      { text: 'Packs de questions illimités', ok: true },
      { text: 'Création manuelle de questions', ok: true },
      { text: 'Jusqu\'à 20 joueurs par salle', ok: true },
      { text: 'Import CSV / Excel', ok: true },
      { text: 'IA : 10 questions × 10 fois/mois', ok: true },
      { text: 'Blind Test & Buzz Blind Test', ok: true },
    ],
    cta: 'Passer Essentiel →',
    href: '#',
    ctaStyle: 'cyan',
  },
  {
    tier: 'pro',
    name: 'Moustachu Pro',
    price: '19,99€',
    period: 'par mois',
    accent: '#FF00AA',
    accentLight: 'rgba(255,0,170,0.10)',
    accentBorder: 'rgba(255,0,170,0.35)',
    badge: 'Populaire',
    features: [
      { text: 'Tous les modes de jeu', ok: true },
      { text: 'Questions Muzquiz prédéfinies', ok: true },
      { text: 'Parties illimitées', ok: true },
      { text: 'Packs de questions illimités', ok: true },
      { text: 'Création manuelle de questions', ok: true },
      { text: 'Jusqu\'à 100 joueurs par salle', ok: true },
      { text: 'Import CSV / Excel', ok: true },
      { text: 'IA : 20 questions × 40 fois/mois', ok: true },
      { text: 'Blind Test & Buzz Blind Test', ok: true },
    ],
    cta: 'Passer Pro →',
    href: '#',
    ctaStyle: 'pink',
  },
  {
    tier: 'expert',
    name: 'Moustachu Expert',
    price: '29,99€',
    period: 'par mois',
    accent: '#F59E0B',
    accentLight: 'rgba(245,158,11,0.08)',
    accentBorder: 'rgba(245,158,11,0.35)',
    badge: 'All-inclusive',
    features: [
      { text: 'Tous les modes de jeu', ok: true },
      { text: 'Questions Muzquiz prédéfinies', ok: true },
      { text: 'Parties illimitées', ok: true },
      { text: 'Packs de questions illimités', ok: true },
      { text: 'Création manuelle de questions', ok: true },
      { text: 'Jusqu\'à 250 joueurs par salle', ok: true },
      { text: 'Import CSV / Excel', ok: true },
      { text: 'IA : 20 questions × 80 fois/mois', ok: true },
      { text: 'Support prioritaire', ok: true },
    ],
    cta: 'Passer Expert →',
    href: '#',
    ctaStyle: 'gold',
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen p-6 py-12"
      style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 60%, #0D1B3E 100%)' }}>

      {/* Header */}
      <div className="text-center mb-12">
        <Link href="/"
          className="inline-flex items-center text-sm font-bold mb-6 px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
          style={{ background: 'rgba(255,0,170,0.08)', color: 'rgba(255,0,170,0.7)', border: '1px solid rgba(255,0,170,0.2)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <MuzquizLogo width={18} showText={false} />Accueil
          </span>
        </Link>
        <div className="mb-3">
          <MuzquizLogo width={160} textSize="3rem" animate />
        </div>
        <p className="text-2xl font-black mb-2" style={{ color: '#F0F4FF' }}>
          Choisissez votre formule
        </p>
        <p style={{ color: 'rgba(240,244,255,0.4)', letterSpacing: '0.02em' }}>
          Gratuit pour toujours. Plus de joueurs et d'IA quand tu veux aller plus loin.
        </p>
      </div>

      {/* Cards — grille 2×2 sur desktop, colonne sur mobile */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 max-w-6xl mx-auto items-stretch">
        {PLANS.map(plan => (
          <div key={plan.tier} className="relative flex flex-col rounded-2xl p-6 muz-card-lift"
            style={{
              background: plan.accentLight,
              border: `2px solid ${plan.accentBorder}`,
              boxShadow: plan.badge === 'Populaire' ? `0 8px 32px ${plan.accentLight}` : 'none',
            }}>

            {plan.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black whitespace-nowrap"
                style={{ background: plan.accent, color: plan.tier === 'expert' ? '#0D1B3E' : '#0D1B3E' }}>
                {plan.badge}
              </div>
            )}

            {/* Plan info */}
            <div className="text-center mb-6">
              <div className="flex justify-center mb-3">
                <MuzquizLogo width={44} showText={false} color={plan.accent} />
              </div>
              <h2 className="text-base font-black mb-2 leading-tight" style={{ color: plan.accent }}>
                {plan.name}
              </h2>
              <div>
                <span className="text-3xl font-black" style={{ color: '#F0F4FF' }}>{plan.price}</span>
                <span className="text-sm ml-1" style={{ color: 'rgba(240,244,255,0.4)' }}>{plan.period}</span>
              </div>
            </div>

            {/* Features */}
            <ul className="flex-1 flex flex-col gap-2 mb-6">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black mt-0.5"
                    style={{
                      background: f.ok ? `${plan.accent}22` : 'rgba(255,255,255,0.05)',
                      color: f.ok ? plan.accent : 'rgba(240,244,255,0.2)',
                    }}>
                    {f.ok ? '✓' : '✗'}
                  </span>
                  <span style={{ color: f.ok ? '#F0F4FF' : 'rgba(240,244,255,0.3)' }}>{f.text}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Link href={plan.href}
              className="block text-center font-black py-3.5 rounded-xl transition-all hover:scale-[1.02]"
              style={
                plan.ctaStyle === 'pink'
                  ? { background: '#FF00AA', color: 'white' }
                  : plan.ctaStyle === 'cyan'
                  ? { background: '#00E5D1', color: '#0D1B3E' }
                  : plan.ctaStyle === 'gold'
                  ? { background: '#F59E0B', color: '#0D1B3E' }
                  : { background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#8B5CF6' }
              }>
              {plan.cta}
            </Link>

            {plan.href === '#' && (
              <p className="text-center text-xs mt-2" style={{ color: 'rgba(240,244,255,0.25)' }}>
                Paiement sécurisé via Stripe
              </p>
            )}
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-2xl mx-auto mt-14">
        <h2 className="text-xl font-black text-center mb-6" style={{ color: '#F0F4FF' }}>
          Questions fréquentes
        </h2>
        <div className="flex flex-col gap-4">
          {[
            {
              q: "Est-ce que je peux créer des packs avec l'abonnement Découverte ?",
              a: "Oui ! Tous les abonnements permettent de créer des packs de questions illimités. La différence : Découverte est limité à la saisie manuelle, tandis que les autres abonnements débloquent l'import CSV et la génération par IA.",
            },
            {
              q: "Que signifie 'IA : 20 questions × 40 fois/mois' ?",
              a: "Avec Pro, vous pouvez utiliser la génération automatique par IA jusqu'à 40 fois par mois, et générer jusqu'à 20 questions à chaque fois. Le compteur se remet à zéro au début de chaque mois.",
            },
            {
              q: "La limite de joueurs, c'est par salle ou par compte ?",
              a: "Par salle créée. Avec Découverte vous pouvez avoir 10 joueurs par salle. Pro monte à 100, Expert à 250. Les joueurs rejoignent gratuitement — seul l'hôte a besoin d'un abonnement.",
            },
            {
              q: "Est-ce que je peux annuler à tout moment ?",
              a: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre espace client, sans frais ni engagement.",
            },
          ].map((item, i) => (
            <div key={i} className="muz-card muz-card-lift p-4">
              <p className="font-bold mb-1" style={{ color: '#F0F4FF' }}>{item.q}</p>
              <p className="text-sm" style={{ color: 'rgba(240,244,255,0.5)' }}>{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs mt-12" style={{ color: 'rgba(240,244,255,0.2)' }}>
        MUZQUIZ © 2025 — Quiz & Blind Test en temps réel
      </p>
    </main>
  );
}
