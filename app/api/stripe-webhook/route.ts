// app/api/stripe-webhook/route.ts
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

// Map price_id → tier Muzquiz
function getTierFromPriceId(priceId: string): string {
  if (priceId === process.env.STRIPE_PRICE_ID_ESSENTIEL) return 'essentiel';
  if (priceId === process.env.STRIPE_PRICE_ID_PRO)       return 'pro';
  if (priceId === process.env.STRIPE_PRICE_ID_EXPERT)    return 'expert';
  return 'decouverte';
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get('stripe-signature');

  if (!sig) return NextResponse.json({ error: 'Signature manquante' }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('[Stripe Webhook] Signature invalide:', message);
    return NextResponse.json({ error: `Webhook error: ${message}` }, { status: 400 });
  }

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  console.log('[Stripe Webhook] Event:', event.type);

  switch (event.type) {

    // ── Paiement initial validé ─────────────────────────────────────────────
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode !== 'subscription') break;

      const userId = session.metadata?.supabase_user_id;
      const tier   = session.metadata?.tier;
      if (!userId || !tier) {
        console.error('[Webhook] checkout.session.completed: metadata manquants');
        break;
      }

      const { error } = await adminClient
        .from('profiles')
        .update({
          subscription_tier:           tier,
          subscription_expires_at:     null,   // géré par Stripe — pas de date fixe
          stripe_customer_id:          session.customer as string,
          stripe_subscription_id:      session.subscription as string,
          // Effacer la réduction en attente après utilisation
          pending_discount_percent:    null,
          pending_discount_code_id:    null,
        })
        .eq('id', userId);

      if (error) console.error('[Webhook] Erreur mise à jour profil:', error.message);
      else console.log(`[Webhook] ✅ ${userId} → ${tier}`);
      break;
    }

    // ── Abonnement modifié (upgrade / downgrade / renouvellement) ──────────
    case 'customer.subscription.updated': {
      const sub    = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.supabase_user_id;
      if (!userId) {
        // Essayer de retrouver via stripe_customer_id
        const { data: profile } = await adminClient
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', sub.customer as string)
          .single();
        if (!profile) break;

        const priceId = sub.items.data[0]?.price.id ?? '';
        const tier    = getTierFromPriceId(priceId);
        const active  = ['active', 'trialing'].includes(sub.status);

        await adminClient
          .from('profiles')
          .update({
            subscription_tier:      active ? tier : 'decouverte',
            stripe_subscription_id: sub.id,
          })
          .eq('id', profile.id);
        break;
      }

      const priceId = sub.items.data[0]?.price.id ?? '';
      const tier    = getTierFromPriceId(priceId);
      const active  = ['active', 'trialing'].includes(sub.status);

      await adminClient
        .from('profiles')
        .update({
          subscription_tier:      active ? tier : 'decouverte',
          stripe_subscription_id: sub.id,
        })
        .eq('id', userId);

      console.log(`[Webhook] 🔄 ${userId} → ${active ? tier : 'decouverte'} (${sub.status})`);
      break;
    }

    // ── Abonnement annulé / expiré ─────────────────────────────────────────
    case 'customer.subscription.deleted': {
      const sub    = event.data.object as Stripe.Subscription;
      const userId = sub.metadata?.supabase_user_id;

      let targetId = userId;
      if (!targetId) {
        const { data: profile } = await adminClient
          .from('profiles')
          .select('id')
          .eq('stripe_customer_id', sub.customer as string)
          .single();
        if (!profile) break;
        targetId = profile.id;
      }

      await adminClient
        .from('profiles')
        .update({
          subscription_tier:        'decouverte',
          stripe_subscription_id:   null,
          subscription_expires_at:  null,
        })
        .eq('id', targetId);

      console.log(`[Webhook] ❌ ${targetId} → decouverte (abonnement annulé)`);
      break;
    }

    // ── Paiement échoué ────────────────────────────────────────────────────
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      console.warn('[Webhook] ⚠️ Paiement échoué pour:', invoice.customer);
      // Stripe envoie automatiquement un email de relance au client
      // On ne dégrade pas immédiatement — Stripe relance 3× avant d'annuler
      break;
    }

    default:
      console.log(`[Webhook] Événement ignoré: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}
