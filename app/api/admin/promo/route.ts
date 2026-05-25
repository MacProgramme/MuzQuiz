// app/api/admin/promo/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAILS = [
  'antoine.gegedu27@gmail.com',
  'dimitte-14@hotmail.fr',
  'lacaravanegame@gmail.com',
];

function adminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error('Configuration serveur manquante (SUPABASE_SERVICE_ROLE_KEY). Contactez l\'administrateur.');
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

async function verifyAdmin(callerToken: string): Promise<boolean> {
  const supabaseAuth = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data: { user } } = await supabaseAuth.auth.getUser(callerToken);
  return !!(user && ADMIN_EMAILS.includes(user.email ?? ''));
}

// POST → créer un code promo
export async function POST(req: NextRequest) {
  try {
    const { payload, callerToken } = await req.json();
    if (!(await verifyAdmin(callerToken))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const supabase = adminClient();
    const { error } = await supabase.from('promo_codes').insert(payload);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// PATCH → toggle is_active
export async function PATCH(req: NextRequest) {
  try {
    const { id, is_active, callerToken } = await req.json();
    if (!(await verifyAdmin(callerToken))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const supabase = adminClient();
    const { error } = await supabase.from('promo_codes').update({ is_active }).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

// DELETE → supprimer un code
export async function DELETE(req: NextRequest) {
  try {
    const { id, callerToken } = await req.json();
    if (!(await verifyAdmin(callerToken))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    const supabase = adminClient();
    const { error } = await supabase.from('promo_codes').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
