// app/api/create-checkout-session/route.ts
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const PRICE_IDS: Record<string, string> = {
  essentiel: process.env.STRIPE_PRICE_ID_ESSENTIEL!,
  pro:       process.env.STRIPE_PRICE_ID_PRO!,
  expert:    process.env.STRIPE_PRICE_ID_EXPERT!,
};

export async function POST(req: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────────
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });

  const authClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: { user }, error: userErr } = await authClient.auth.getUser();
  if (userErr || !user) return NextResponse.json({ error: 'Session invalide' }, { status: 401 });
  if (user.is_anonymous)
    return NextResponse.json({ error: "Connecte-toi avec un vrai compte pour t'abonner" }, { status: 403 });

  // ── Validation du plan ────────────────────────────────────────────────────
  const body = await req.json();
  const tier: string = (body.tier ?? '').toLowerCase();
  const priceId = PRICE_IDS[tier];
  if (!priceId) return NextResponse.json({ error: 'Plan invalide' }, { status: 400 });

  // Validation des variables d'environnement Stripe
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('[checkout] STRIPE_SECRET_KEY manquant');
    return NextResponse.json({ error: 'Stripe non configuré (clé manquante)' }, { status: 500 });
  }

  // ── Récupérer le profil (customer Stripe + réduction éventuelle) ──────────
  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profile } = await adminClient
    .from('profiles')
    .select('stripe_customer_id, pending_discount_percent, pending_discount_code_id')
    .eq('id', user.id)
    .single();

  // ── Créer ou réutiliser le customer Stripe ────────────────────────────────
  let customerId: string | undefined = profile?.stripe_customer_id ?? undefined;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email ?? undefined,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
    await adminClient
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id);
  } else {
    // Vérifier si l'utilisateur a déjà un abonnement actif sur ce plan
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      price: priceId,
      limit: 1,
    });
    if (subscriptions.data.length > 0) {
      return NextResponse.json({ error: 'Tu as déjà cet abonnement actif.' }, { status: 409 });
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.muzquiz.fr';

  // ── Appliquer la réduction en attente si elle existe ──────────────────────
  let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
  const pendingPct: number | null = profile?.pending_discount_percent ?? null;

  if (pendingPct && pendingPct > 0) {
    // Créer un coupon Stripe unique pour cette réduction
    const coupon = await stripe.coupons.create({
      percent_off: pendingPct,
      duration:    'once',           // s'applique uniquement au 1er paiement
      name:        `Code promo Muzquiz -${pendingPct}%`,
      max_redemptions: 1,            // usage unique
      metadata: {
        supabase_user_id:  user.id,
        promo_code_id:     profile?.pending_discount_code_id ?? '',
      },
    });
    discounts = [{ coupon: coupon.id }];
  }

  // ── Créer la Checkout Session ────────────────────────────────────────────
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    customer:             customerId,
    payment_method_types: ['card'],
    line_items:           [{ price: priceId, quantity: 1 }],
    mode:                 'subscription',
    success_url:          `${appUrl}/profile?subscription=success&tier=${tier}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:           `${appUrl}/pricing`,
    locale:               'fr',
    billing_address_collection: 'auto',
    subscription_data: {
      metadata: { supabase_user_id: user.id, tier },
    },
    metadata: { supabase_user_id: user.id, tier },
  };

  // Appliquer la réduction si elle existe
  // Note : discounts et allow_promotion_codes sont mutuellement exclusifs dans Stripe
  if (discounts) {
    sessionParams.discounts = discounts;
  } else {
    // Sans réduction pré-appliquée, permettre d'entrer un code promo Stripe natif
    sessionParams.allow_promotion_codes = true;
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  return NextResponse.json({ url: session.url });
}
