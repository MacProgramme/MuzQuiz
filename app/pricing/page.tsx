// app/pricing/page.tsx
"use client";

import Link from 'next/link';

const PLANS = [
  {
    name: 'Gratuit',
    emoji: '✨',
    price: '0€',
    period: 'pour toujours',
    accent: '#8B5CF6',
    accentLight: 'rgba(139,92,246,0.15)',
    accentBorder: 'rgba(139,92,246,0.3)',
    badge: null,
    features: [
      { text: 'Mode Buzz & QCM', ok: true },
      { text: 'Questions MUZQUIZ prédéfinies', ok: true },
      { text: 'Parties illimitées', ok: true },
      { text: 'Créateur de quiz perso', ok: false },
      { text: 'Packs de questions custom', ok: false },
      { text: 'Support prioritaire', ok: false },
    ],
    cta: 'Commencer gratuitement',
    href: '/',
    ctaStyle: 'secondary',
  },
  {
    name: 'Pro',
    emoji: '🔥',
    price: '9,99€',
    period: 'par mois',
    accent: '#FF00AA',
    accentLight: 'rgba(255,0,170,0.15)',
    accentBorder: 'rgba(255,0,170,0.4)',
    badge: 'Populaire',
    features: [
      { text: 'Mode Buzz & QCM', ok: true },
      { text: 'Questions MUZQUIZ prédéfinies', ok: true },
      { text: 'Parties illimitées', ok: true },
      { text: 'Créateur de quiz perso', ok: true },
      { text: "Jusqu'à 5 packs (30 questions chacun)", ok: true },
      { text: 'Support prioritaire', ok: false },
    ],
    cta: 'Passer Pro',
    href: '#',
    ctaStyle: 'pink',
  },
  {
    name: 'Premium',
    emoji: '👑',
    price: '19,99€',
    period: 'par mois',
    accent: '#F59E0B',
    accentLight: 'rgba(245,158,11,0.12)',
    accentBorder: 'rgba(245,158,11,0.4)',
    badge: 'All-inclusive',
    features: [
      { text: 'Mode Buzz & QCM', ok: true },
      { text: 'Questions MUZQUIZ prédéfinies', ok: true },
      { text: 'Parties illimitées', ok: true },
      { text: 'Créateur de quiz perso', ok: true },
      { text: 'Packs & questions illimités', ok: true },
      { text: 'Support prioritaire', ok: true },
    ],
    cta: 'Passer Premium',
    href: '#',
    ctaStyle: 'cyan',
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen p-6 py-12"
      style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 60%, #0D1B3E 100%)' }}>

      {/* Header */}
      <div className="text-center mb-12">
        <Link href="/"
          className="inline-flex items-center gap-1 text-sm font-bold mb-6 transition-all hover:opacity-80"
          style={{ color: 'rgba(139,92,246,0.7)' }}>
          ← Retour
        </Link>
        <h1 className="muz-logo text-5xl font-black mb-3" style={{ fontFamily: 'var(--font-black-han)' }}>
          MUZQUIZ
        </h1>
        <p className="text-2xl font-black mb-2" style={{ color: '#F0F4FF' }}>
          Choisissez votre formule
        </p>
        <p style={{ color: 'rgba(240,244,255,0.4)' }}>
          Testez gratuitement, payez quand vous êtes convaincu.
        </p>
      </div>

      {/* Cards */}
      <div className="flex flex-col md:flex-row gap-5 max-w-4xl mx-auto items-stretch">
        {PLANS.map(plan => (
          <div key={plan.name} className="relative flex-1 flex flex-col rounded-2xl p-6"
            style={{
              background: plan.accentLight,
              border: `2px solid ${plan.accentBorder}`,
              boxShadow: plan.badge === 'Populaire' ? `0 8px 32px ${plan.accentLight}` : 'none',
            }}>

            {plan.badge && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black"
                style={{ background: plan.accent, color: plan.name === 'Pro' ? '#0D1B3E' : 'white' }}>
                {plan.badge}
              </div>
            )}

            {/* Plan info */}
            <div className="text-center mb-6">
              <div className="text-4xl mb-2">{plan.emoji}</div>
              <h2 className="text-xl font-black mb-2" style={{ color: plan.accent }}>
                {plan.name}
              </h2>
              <div>
                <span className="text-4xl font-black" style={{ color: '#F0F4FF' }}>{plan.price}</span>
                <span className="text-sm ml-1" style={{ color: 'rgba(240,244,255,0.4)' }}>{plan.period}</span>
              </div>
            </div>

            {/* Features */}
            <ul className="flex-1 flex flex-col gap-2.5 mb-6">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-black"
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
              className={`block text-center font-black py-3.5 rounded-xl transition-all hover:scale-[1.02]
                ${plan.ctaStyle === 'pink' ? 'muz-btn-pink' : plan.ctaStyle === 'cyan' ? 'muz-btn-cyan' : ''}`}
              style={plan.ctaStyle === 'secondary' ? {
                background: 'rgba(139,92,246,0.15)',
                border: '1px solid rgba(139,92,246,0.3)',
                color: '#8B5CF6',
              } : {}}>
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
              q: "Est-ce que je peux annuler à tout moment ?",
              a: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre espace client, sans frais ni engagement.",
            },
            {
              q: "Quelle est la différence entre Pro et Premium ?",
              a: "Pro vous donne accès au créateur de quiz avec jusqu'à 5 packs (30 questions chacun). Premium lève toutes les limites : packs et questions illimités, plus le support prioritaire.",
            },
            {
              q: "Le créateur de quiz, ça fonctionne comment ?",
              a: "Avec Pro ou Premium, vous créez vos propres questions (Buzz ou QCM), les organisez en packs et les réutilisez dans n'importe quelle salle.",
            },
          ].map((item, i) => (
            <div key={i} className="muz-card p-4">
              <p className="font-bold mb-1" style={{ color: '#F0F4FF' }}>{item.q}</p>
              <p className="text-sm" style={{ color: 'rgba(240,244,255,0.5)' }}>{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs mt-12" style={{ color: 'rgba(240,244,255,0.2)' }}>
        MUZQUIZ © 2024 — Quiz & Blind Test en temps réel
      </p>
    </main>
  );
}
