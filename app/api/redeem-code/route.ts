// app/api/redeem-code/route.ts
// POST → valide et active un code promo pour l'utilisateur connecté
export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  // Client authentifié avec le JWT du joueur
  const authClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: { user }, error: userErr } = await authClient.auth.getUser();
  if (userErr || !user) {
    return NextResponse.json({ error: 'Session invalide' }, { status: 401 });
  }

  const body = await req.json();
  const code: string = (body.code ?? '').trim().toUpperCase();

  if (!code) {
    return NextResponse.json({ error: 'Code manquant' }, { status: 400 });
  }

  // Client service role pour lire + modifier les codes et profils
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

  if (new Date(promoCode.expires_at) < new Date()) {
    return NextResponse.json({ error: 'Ce code a expiré' }, { status: 410 });
  }

  // 2. Vérifier que l'utilisateur ne l'a pas déjà utilisé
  const { data: alreadyUsed } = await adminClient
    .from('promo_code_uses')
    .select('id')
    .eq('code_id', promoCode.id)
    .eq('user_id', user.id)
    .single();

  if (alreadyUsed) {
    return NextResponse.json({ error: 'Tu as déjà utilisé ce code' }, { status: 409 });
  }

  // 3. Appliquer le tier au profil de l'utilisateur
  const { error: updateErr } = await adminClient
    .from('profiles')
    .update({ subscription_tier: promoCode.tier })
    .eq('id', user.id);

  if (updateErr) {
    return NextResponse.json({ error: 'Erreur lors de l\'activation' }, { status: 500 });
  }

  // 4. Enregistrer l'utilisation du code
  await adminClient
    .from('promo_code_uses')
    .insert({ code_id: promoCode.id, user_id: user.id });

  return NextResponse.json({
    success: true,
    tier: promoCode.tier,
    message: `Félicitations ! Ton compte est maintenant ${promoCode.tier === 'premium' ? 'Premium' : promoCode.tier === 'pro' ? 'Pro' : 'Free'}.`,
  });
}
