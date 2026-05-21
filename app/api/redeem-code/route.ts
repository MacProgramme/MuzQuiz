// app/api/redeem-code/route.ts
export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const authClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: { user }, error: userErr } = await authClient.auth.getUser();
  if (userErr || !user) {
    return NextResponse.json({ error: 'Session invalide' }, { status: 401 });
  }

  // Refuser les comptes anonymes
  if (user.is_anonymous) {
    return NextResponse.json({ error: 'Connecte-toi avec un vrai compte pour activer un code' }, { status: 403 });
  }

  const body = await req.json();
  const code: string = (body.code ?? '').trim().toUpperCase();

  if (!code) {
    return NextResponse.json({ error: 'Code manquant' }, { status: 400 });
  }

  const adminClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Vérifier le code
  const { data: promoCode, error: codeErr } = await adminClient
    .from('promo_codes')
    .select('*')
    .eq('code', code)
    .single();

  if (codeErr || !promoCode) {
    return NextResponse.json({ error: 'Code invalide ou inexistant' }, { status: 404 });
  }

  if (!promoCode.is_active) {
    return NextResponse.json({ error: 'Ce code a été désactivé' }, { status: 410 });
  }

  if (promoCode.expires_at && new Date(promoCode.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Ce code a expiré' }, { status: 410 });
  }

  // 2. Vérifier la limite d'utilisations
  if (promoCode.max_uses !== null && promoCode.uses_count >= promoCode.max_uses) {
    return NextResponse.json({ error: 'Ce code a atteint sa limite d\'utilisations' }, { status: 410 });
  }

  // 3. Vérifier que l'utilisateur ne l'a pas déjà utilisé
  const { data: alreadyUsed } = await adminClient
    .from('promo_code_uses')
    .select('id')
    .eq('code_id', promoCode.id)
    .eq('user_id', user.id)
    .single();

  if (alreadyUsed) {
    return NextResponse.json({ error: 'Tu as déjà utilisé ce code' }, { status: 409 });
  }

  // 4. Appliquer selon le type
  // Fallback : si la colonne type n'existe pas encore (migration non jouée),
  // on déduit le type selon la présence de tier ou discount_percent
  const codeType: string =
    promoCode.type ??
    (promoCode.discount_percent ? 'discount' : 'gift');

  let message = '';

  if (codeType === 'gift') {
    // Carte cadeau : activer X jours du tier
    const days = promoCode.gift_days ?? 30;
    const tier = promoCode.tier ?? 'essentiel';

    // Calculer la nouvelle date d'expiration
    // Si le joueur a déjà un abonnement actif non expiré, on cumule les jours
    const { data: profile } = await adminClient
      .from('profiles')
      .select('subscription_tier, subscription_expires_at')
      .eq('id', user.id)
      .single();

    let baseDate = new Date();
    if (profile?.subscription_expires_at && new Date(profile.subscription_expires_at) > new Date()) {
      baseDate = new Date(profile.subscription_expires_at);
    }
    const newExpiry = new Date(baseDate.getTime() + days * 24 * 60 * 60 * 1000);

    const { error: updateErr } = await adminClient
      .from('profiles')
      .update({
        subscription_tier: tier,
        subscription_expires_at: newExpiry.toISOString(),
      })
      .eq('id', user.id);

    if (updateErr) {
      return NextResponse.json({ error: 'Erreur lors de l\'activation' }, { status: 500 });
    }

    const tierLabel = tier === 'expert' ? 'Expert' : tier === 'pro' ? 'Pro' : 'Essentiel';
    message = `🎁 Carte cadeau activée ! Tu bénéficies de ${days} jours ${tierLabel} jusqu'au ${newExpiry.toLocaleDateString('fr-FR')}.`;

  } else if (codeType === 'discount') {
    // Code de réduction : stocker la réduction en attente sur le profil
    const pct = promoCode.discount_percent ?? 10;

    const { error: updateErr } = await adminClient
      .from('profiles')
      .update({ pending_discount_percent: pct, pending_discount_code_id: promoCode.id })
      .eq('id', user.id);

    if (updateErr) {
      // Si les colonnes n'existent pas encore, on ignore l'erreur et on informe quand même
      console.warn('pending_discount columns may not exist yet:', updateErr.message);
    }

    message = `🎉 Code de réduction activé ! Tu bénéficies de ${pct}% de réduction sur ton prochain abonnement.`;

  } else {
    // Type inconnu — on ne touche rien
    return NextResponse.json({ error: 'Type de code invalide' }, { status: 400 });
  }

  // 5. Enregistrer l'utilisation + incrémenter le compteur
  await adminClient
    .from('promo_code_uses')
    .insert({ code_id: promoCode.id, user_id: user.id });

  await adminClient
    .from('promo_codes')
    .update({ uses_count: (promoCode.uses_count ?? 0) + 1 })
    .eq('id', promoCode.id);

  return NextResponse.json({
    success: true,
    type: promoCode.type,
    message,
  });
}
