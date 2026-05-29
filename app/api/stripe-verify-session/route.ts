// app/api/stripe-verify-session/route.ts
// Fallback appelé depuis la page profil après un paiement Stripe réussi,
// au cas où le webhook n'aurait pas encore (ou jamais) traité l'événement.
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

function getTierFromPriceId(priceId: string): string {
  if (priceId === process.env.STRIPE_PRICE_ID_ESSENTIEL) return 'essentiel';
  if (priceId === process.env.STRIPE_PRICE_ID_PRO)       return 'pro';
  if (priceId === process.env.STRIPE_PRICE_ID_EXPERT)    return 'expert';
  return '';
}

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

  const { session_id, tier: tierHint } = await req.json();
  if (!session_id) return NextResponse.json({ error: 'session_id manquant' }, { status: 400 });

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe non configuré' }, { status: 500 });
  }

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // ── Récupérer la session Stripe ────────────────────────────────────────────
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['subscription'],
    });
  } catch (err: any) {
    console.error('[stripe-verify] Erreur retrieve session:', err.message);
    return NextResponse.json({ error: 'Session Stripe introuvable' }, { status: 404 });
  }

  // Vérifier que la session appartient bien à cet utilisateur
  const metaUserId = session.metadata?.supabase_user_id;
  if (metaUserId && metaUserId !== user.id) {
    return NextResponse.json({ error: 'Session ne vous appartient pas' }, { status: 403 });
  }

  // La session doit être complète
  if (session.payment_status !== 'paid' && session.status !== 'complete') {
    return NextResponse.json({ ok: false, reason: 'Paiement non confirmé', status: session.status });
  }

  // Déterminer le tier
  let tier = session.metadata?.tier ?? tierHint ?? '';
  if (!tier) {
    // Essayer via le price ID de la subscription
    const sub = session.subscription as Stripe.Subscription | null;
    const priceId = sub?.items?.data[0]?.price?.id ?? '';
    tier = getTierFromPriceId(priceId);
  }
  if (!tier) {
    return NextResponse.json({ error: 'Impossible de déterminer le tier' }, { status: 400 });
  }

  // Vérifier si le profil a déjà été mis à jour (le webhook a peut-être déjà traité)
  const { data: prof } = await adminClient
    .from('profiles')
    .select('subscription_tier')
    .eq('id', user.id)
    .single();

  if (prof?.subscription_tier === tier) {
    // Déjà activé (webhook a fait son travail)
    return NextResponse.json({ ok: true, tier, already_active: true });
  }

  // ── Mettre à jour Supabase (fallback webhook) ──────────────────────────────
  const sub = session.subscription as Stripe.Subscription | null;
  const { error: updateErr } = await adminClient
    .from('profiles')
    .update({
      subscription_tier:      tier,
      stripe_customer_id:     session.customer as string,
      stripe_subscription_id: sub?.id ?? null,
      pending_discount_percent:  null,
      pending_discount_code_id:  null,
    })
    .eq('id', user.id);

  if (updateErr) {
    console.error('[stripe-verify] Erreur update profil:', updateErr.message);
    return NextResponse.json({ error: 'Erreur mise à jour profil' }, { status: 500 });
  }

  console.log(`[stripe-verify] ✅ Fallback activé : ${user.id} → ${tier}`);
  return NextResponse.json({ ok: true, tier, fallback: true });
}
