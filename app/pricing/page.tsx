// app/pricing/page.tsx
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MuzquizLogo } from '@/components/MuzquizLogo';
import { supabase } from '@/lib/supabase';

const PLANS = [
  {
    tier: 'decouverte',
    name: 'Moustachu Découverte',
    price: '0€',
    priceValue: 0,
    period: 'pour toujours',
    accent: '#8B5CF6',
    accentLight: 'rgba(139,92,246,0.10)',
    accentBorder: 'rgba(139,92,246,0.25)',
    badge: null,
    features: [
      { text: 'Modes Quiz & Blind Test', ok: true },
      { text: 'Questions Muzquiz prédéfinies', ok: true },
      { text: 'Parties illimitées', ok: true },
      { text: 'Packs de questions personnalisés', ok: true },
      { text: 'Création manuelle de questions', ok: true },
      { text: "Jusqu'à 10 joueurs par salle", ok: true },
      { text: 'Import CSV / Excel', ok: false },
      { text: 'Génération IA de questions', ok: false },
      { text: 'Blind Test', ok: false },
    ],
    cta: 'Commencer gratuitement →',
    ctaStyle: 'violet',
    paid: false,
  },
  {
    tier: 'essentiel',
    name: 'Moustachu Essentiel',
    price: '9,99€',
    priceValue: 9.99,
    period: '/ mois',
    accent: '#00E5D1',
    accentLight: 'rgba(0,229,209,0.08)',
    accentBorder: 'rgba(0,229,209,0.25)',
    badge: null,
    features: [
      { text: 'Modes Quiz & Blind Test', ok: true },
      { text: 'Questions Muzquiz prédéfinies', ok: true },
      { text: 'Parties illimitées', ok: true },
      { text: 'Packs de questions personnalisés', ok: true },
      { text: 'Création manuelle de questions', ok: true },
      { text: "Jusqu'à 30 joueurs par salle", ok: true },
      { text: 'Import CSV / Excel', ok: true },
      { text: 'IA : 20 questions × 10 fois/mois', ok: true },
      { text: 'Blind Test', ok: false },
    ],
    cta: 'Passer Essentiel →',
    ctaStyle: 'cyan',
    paid: true,
  },
  {
    tier: 'pro',
    name: 'Moustachu Pro',
    price: '19,99€',
    priceValue: 19.99,
    period: '/ mois',
    accent: '#FF00AA',
    accentLight: 'rgba(255,0,170,0.08)',
    accentBorder: 'rgba(255,0,170,0.3)',
    badge: 'Populaire',
    features: [
      { text: 'Modes Quiz & Blind Test', ok: true },
      { text: 'Questions Muzquiz prédéfinies', ok: true },
      { text: 'Parties illimitées', ok: true },
      { text: 'Packs de questions personnalisés', ok: true },
      { text: 'Création manuelle de questions', ok: true },
      { text: "Jusqu'à 100 joueurs par salle", ok: true },
      { text: 'Import CSV / Excel', ok: true },
      { text: 'IA : 20 questions × 40 fois/mois', ok: true },
      { text: 'Blind Test inclus', ok: true },
    ],
    cta: 'Passer Pro →',
    ctaStyle: 'pink',
    paid: true,
  },
  {
    tier: 'expert',
    name: 'Moustachu Expert',
    price: '29,99€',
    priceValue: 29.99,
    period: '/ mois',
    accent: '#F59E0B',
    accentLight: 'rgba(245,158,11,0.08)',
    accentBorder: 'rgba(245,158,11,0.3)',
    badge: null,
    features: [
      { text: 'Modes Quiz & Blind Test', ok: true },
      { text: 'Questions Muzquiz prédéfinies', ok: true },
      { text: 'Parties illimitées', ok: true },
      { text: 'Packs de questions personnalisés', ok: true },
      { text: 'Création manuelle de questions', ok: true },
      { text: "Jusqu'à 250 joueurs par salle", ok: true },
      { text: 'Import CSV / Excel', ok: true },
      { text: 'IA : 20 questions × 80 fois/mois', ok: true },
      { text: 'Support prioritaire', ok: true },
    ],
    cta: 'Passer Expert →',
    ctaStyle: 'gold',
    paid: true,
  },
];

export default function PricingPage() {
  const router = useRouter();

  // ── Promo code ───────────────────────────────────────────────────────────
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoResult, setPromoResult] = useState<{ success: boolean; message: string } | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [discountLoading, setDiscountLoading] = useState(false);

  // Charger le code promo en attente au montage
  useEffect(() => {
    const loadDiscount = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user || session.user.is_anonymous) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('pending_discount_percent')
        .eq('id', session.user.id)
        .single();
      if (profile?.pending_discount_percent) {
        setAppliedDiscount(profile.pending_discount_percent);
      }
    };
    loadDiscount();
  }, []);

  const clearDiscount = async () => {
    setDiscountLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase
        .from('profiles')
        .update({ pending_discount_percent: null, pending_discount_code_id: null })
        .eq('id', session.user.id);
    }
    setAppliedDiscount(null);
    setPromoResult(null);
    setDiscountLoading(false);
  };

  // ── Checkout Stripe ──────────────────────────────────────────────────────
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null); // tier en cours
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  // ── CGU ──────────────────────────────────────────────────────────────────
  const [acceptedCGU, setAcceptedCGU] = useState(false);

  const handleCheckout = async (tier: string) => {
    setCheckoutError(null);
    setCheckoutLoading(tier);

    // Vérifier l'acceptation des CGU
    if (!acceptedCGU) {
      setCheckoutError('Tu dois accepter les conditions générales d\'utilisation pour continuer.');
      setCheckoutLoading(null);
      return;
    }

    const { data: { session } } = await supabase.auth.getSession();

    // Pas connecté → rediriger vers login
    if (!session?.access_token || session.user?.is_anonymous) {
      router.push('/login?redirect=/pricing');
      return;
    }

    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ tier }),
    });

    const data = await res.json();

    if (!res.ok) {
      setCheckoutError(data.error ?? 'Une erreur est survenue, réessaie.');
      setCheckoutLoading(null);
      return;
    }

    // Redirection vers Stripe Checkout
    window.location.href = data.url;
  };

  const handlePromo = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoResult(null);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token || session.user?.is_anonymous) {
      setPromoResult({ success: false, message: 'Tu dois être connecté avec un vrai compte pour activer un code.' });
      setPromoLoading(false);
      return;
    }
    const res = await fetch('/api/redeem-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      body: JSON.stringify({ code: promoCode.trim().toUpperCase() }),
    });
    const data = await res.json();
    setPromoResult({ success: res.ok && data.success, message: data.message ?? data.error ?? 'Erreur inconnue' });
    if (res.ok && data.success) {
      setPromoCode('');
      if (data.type === 'discount' && data.discount_percent) {
        setAppliedDiscount(data.discount_percent);
      }
    }
    setPromoLoading(false);
  };

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
          Gratuit pour toujours. Plus de joueurs et d&apos;IA quand tu veux aller plus loin.
        </p>
      </div>

      {/* CGU + Newsletter */}
      <div className="max-w-md mx-auto mb-6 flex flex-col gap-3 px-2">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={acceptedCGU}
            onChange={e => { setAcceptedCGU(e.target.checked); setCheckoutError(null); }}
            className="mt-0.5 flex-shrink-0"
            style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#FF00AA' }}
          />
          <span className="text-sm font-bold" style={{ color: 'rgba(240,244,255,0.6)' }}>
            J&apos;accepte les{' '}
            <a href="/cgu" target="_blank" className="underline transition-opacity hover:opacity-80"
              style={{ color: '#FF00AA' }}>
              conditions générales d&apos;utilisation
            </a>
            {' '}et la{' '}
            <a href="/mentions-legales" target="_blank" className="underline transition-opacity hover:opacity-80"
              style={{ color: '#FF00AA' }}>
              politique de confidentialité
            </a>
          </span>
        </label>

      </div>

      {/* Erreur checkout globale */}
      {checkoutError && (
        <div className="max-w-md mx-auto mb-6 px-4 py-3 rounded-xl text-sm font-bold text-center"
          style={{ background: 'rgba(255,80,80,0.08)', border: '1px solid rgba(255,80,80,0.3)', color: '#FF6060' }}>
          {checkoutError}
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 max-w-6xl mx-auto items-stretch">
        {PLANS.map(plan => {
          const isLoadingThis = checkoutLoading === plan.tier;

          const ctaStyle =
            plan.ctaStyle === 'pink'      ? { background: '#FF00AA', color: 'white' }
            : plan.ctaStyle === 'cyan'    ? { background: '#00E5D1', color: '#0D1B3E' }
            : plan.ctaStyle === 'gold'    ? { background: '#FF9900', color: '#0D1B3E' }
            : { background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.3)', color: '#8B5CF6' };

          return (
            <div key={plan.tier} className="relative flex flex-col rounded-2xl p-6 muz-card-lift"
              style={{
                background: plan.accentLight,
                border: `2px solid ${plan.accentBorder}`,
                boxShadow: plan.badge === 'Populaire' ? `0 8px 32px ${plan.accentLight}` : 'none',
              }}>

              {plan.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black whitespace-nowrap"
                  style={{ background: plan.accent, color: '#0D1B3E' }}>
                  {plan.badge}
                </div>
              )}

              {/* Plan info */}
              <div className="text-center mb-6">
                <h2 className="text-base font-black mb-2 leading-tight" style={{ color: plan.accent }}>
                  {plan.name}
                </h2>
                {appliedDiscount && plan.paid && plan.priceValue > 0 ? (
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-0.5">
                      <span className="text-sm line-through" style={{ color: 'rgba(240,244,255,0.3)' }}>{plan.price}</span>
                      <span className="text-xs font-black px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,229,209,0.15)', color: '#00E5D1', border: '1px solid rgba(0,229,209,0.3)' }}>
                        -{appliedDiscount}%
                      </span>
                    </div>
                    <div>
                      <span className="text-3xl font-black" style={{ color: '#00E5D1' }}>
                        {(plan.priceValue * (1 - appliedDiscount / 100)).toFixed(2).replace('.', ',')}€
                      </span>
                      <span className="text-sm ml-1" style={{ color: 'rgba(240,244,255,0.4)' }}>{plan.period}</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <span className="text-3xl font-black" style={{ color: '#F0F4FF' }}>{plan.price}</span>
                    <span className="text-sm ml-1" style={{ color: 'rgba(240,244,255,0.4)' }}>{plan.period}</span>
                  </div>
                )}
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
              {plan.paid ? (
                <button
                  onClick={() => handleCheckout(plan.tier)}
                  disabled={!!checkoutLoading}
                  className="w-full text-center font-black py-3.5 rounded-xl transition-all hover:scale-[1.02] disabled:opacity-60 disabled:scale-100 disabled:cursor-not-allowed"
                  style={ctaStyle}>
                  {isLoadingThis ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      Redirection…
                    </span>
                  ) : plan.cta}
                </button>
              ) : (
                <Link href="/"
                  className="block text-center font-black py-3.5 rounded-xl transition-all hover:scale-[1.02]"
                  style={ctaStyle}>
                  {plan.cta}
                </Link>
              )}

              {plan.paid && (
                <p className="text-center text-xs mt-2" style={{ color: 'rgba(240,244,255,0.25)' }}>
                  🔒 Paiement sécurisé via Stripe
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Code promo */}
      <div className="max-w-md mx-auto mt-14 mb-4">
        <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1.5px solid rgba(255,0,170,0.18)' }}>
          <p className="text-xs font-black uppercase tracking-widest text-center mb-4" style={{ color: 'rgba(240,244,255,0.35)' }}>
            🎟 Tu as un code promo ?
          </p>

          {appliedDiscount ? (
            /* Code promo actif — afficher le badge + bouton Retirer */
            <div className="flex items-center justify-between px-4 py-3 rounded-xl"
              style={{ background: 'rgba(0,229,209,0.08)', border: '1.5px solid rgba(0,229,209,0.3)' }}>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(0,229,209,0.15)', color: '#00E5D1', border: '1px solid rgba(0,229,209,0.3)' }}>
                  -{appliedDiscount}%
                </span>
                <span className="text-sm font-bold" style={{ color: '#00E5D1' }}>Code promo actif</span>
              </div>
              <button
                onClick={clearDiscount}
                disabled={discountLoading}
                className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80 disabled:opacity-40"
                style={{ background: 'rgba(255,80,80,0.1)', color: '#FF6060', border: '1px solid rgba(255,80,80,0.2)' }}>
                {discountLoading ? '…' : '✕ Retirer'}
              </button>
            </div>
          ) : (
            /* Formulaire de saisie */
            <>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && handlePromo()}
                  placeholder="ex: MUZQUIZ2025"
                  className="min-w-0 flex-1 px-4 py-3 rounded-xl font-mono font-black text-sm text-center tracking-widest outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.1)', color: '#F0F4FF' }}
                />
                <button
                  onClick={handlePromo}
                  disabled={promoLoading || !promoCode.trim()}
                  className="px-5 py-3 rounded-xl font-black text-sm transition-all hover:scale-[1.03] disabled:opacity-40"
                  style={{ background: '#FF00AA', color: 'white' }}>
                  {promoLoading ? '…' : 'Activer'}
                </button>
              </div>
              {promoResult && (
                <div className="mt-3 px-4 py-3 rounded-xl text-sm font-bold text-center"
                  style={{
                    background: promoResult.success ? 'rgba(0,229,209,0.08)' : 'rgba(255,80,80,0.08)',
                    border: `1px solid ${promoResult.success ? 'rgba(0,229,209,0.3)' : 'rgba(255,80,80,0.3)'}`,
                    color: promoResult.success ? '#00E5D1' : '#FF6060',
                  }}>
                  {promoResult.message}
                </div>
              )}
            </>
          )}
        </div>
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
              a: "Oui ! Tous les abonnements permettent de créer des packs de questions. La différence : Découverte est limité à la saisie manuelle, tandis que les autres abonnements débloquent l'import CSV et la génération par IA.",
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
              a: "Oui, vous pouvez annuler votre abonnement à tout moment depuis votre espace client Stripe, sans frais ni engagement. L'accès reste actif jusqu'à la fin de la période payée.",
            },
            {
              q: "Est-ce que je reçois une facture après chaque paiement ?",
              a: "Oui ! Stripe envoie automatiquement une facture PDF par email après chaque prélèvement mensuel.",
            },
          ].map((item, i) => (
            <div key={i} className="muz-card muz-card-lift p-4">
              <p className="font-bold mb-1" style={{ color: '#F0F4FF' }}>{item.q}</p>
              <p className="text-sm" style={{ color: 'rgba(240,244,255,0.45)' }}>{item.a}</p>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}