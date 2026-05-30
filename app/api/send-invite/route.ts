// app/api/send-invite/route.ts
// Envoie les invitations par email pour le quiz de la semaine.
// Utilise l'API Resend (resend.com) via fetch simple — pas de SDK requis.
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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
  if (user.is_anonymous) return NextResponse.json({ error: 'Compte requis' }, { status: 403 });

  // ── Validation clé Resend ───────────────────────────────────────────────────
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ error: 'Service email non configuré (RESEND_API_KEY manquant)' }, { status: 503 });
  }

  // ── Paramètres ──────────────────────────────────────────────────────────────
  const body = await req.json();
  const { emails, day, packName, inviteLink, hostNickname } = body as {
    emails: string[];
    day: string;
    packName: string;
    inviteLink: string;
    hostNickname: string;
  };

  if (!emails?.length || !inviteLink) {
    return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
  }

  // Valider les emails (basique)
  const validEmails = emails.filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
  if (validEmails.length === 0) {
    return NextResponse.json({ error: 'Aucune adresse email valide' }, { status: 400 });
  }

  // Limiter à 50 emails par envoi
  const toSend = validEmails.slice(0, 50);

  // ── Template HTML ───────────────────────────────────────────────────────────
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invitation Quiz de la semaine — MuzQuiz</title>
</head>
<body style="margin:0;padding:0;background:#0D1B3E;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0D1B3E;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:520px;background:#112247;border-radius:20px;overflow:hidden;border:1px solid rgba(139,92,246,0.2);">

          <!-- Header -->
          <tr>
            <td style="padding:32px 32px 24px;text-align:center;border-bottom:1px solid rgba(255,255,255,0.06);">
              <div style="font-size:28px;font-weight:900;letter-spacing:-0.5px;color:#F0F4FF;">
                MUZ<span style="color:#FF00AA;">QUIZ</span>
              </div>
              <div style="font-size:12px;color:rgba(240,244,255,0.35);margin-top:4px;letter-spacing:2px;text-transform:uppercase;">
                Quiz de la semaine
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:900;color:#F0F4FF;line-height:1.3;">
                Tu es invité à jouer !
              </p>
              <p style="margin:0 0 24px;font-size:14px;color:rgba(240,244,255,0.55);line-height:1.6;">
                <strong style="color:#8B5CF6;">${hostNickname || 'Un hôte MuzQuiz'}</strong> t'invite à participer au quiz de la semaine du <strong style="color:#F0F4FF;">${day}</strong>.
              </p>

              <!-- Pack card -->
              <div style="background:rgba(255,0,170,0.08);border:1px solid rgba(255,0,170,0.2);border-radius:14px;padding:18px 20px;margin-bottom:28px;">
                <div style="font-size:11px;color:rgba(255,0,170,0.6);font-weight:700;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:6px;">
                  Pack du jour
                </div>
                <div style="font-size:18px;font-weight:900;color:#F0F4FF;">
                  ${packName || 'Quiz MuzQuiz'}
                </div>
              </div>

              <!-- CTA -->
              <div style="text-align:center;margin-bottom:28px;">
                <a href="${inviteLink}"
                  style="display:inline-block;background:linear-gradient(135deg,#FF00AA,#8B5CF6);color:white;font-size:16px;font-weight:900;padding:16px 40px;border-radius:14px;text-decoration:none;letter-spacing:0.3px;">
                  Rejoindre la partie →
                </a>
              </div>

              <p style="margin:0;font-size:12px;color:rgba(240,244,255,0.3);line-height:1.6;text-align:center;">
                Pas besoin de compte. Rejoins depuis ton téléphone ou ordinateur.<br>
                Lien valide pour le <strong style="color:rgba(240,244,255,0.5);">${day}</strong> uniquement.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <p style="margin:0;font-size:11px;color:rgba(240,244,255,0.2);">
                MuzQuiz — Quiz & Blind Test en temps réel · <a href="https://www.muzquiz.fr" style="color:rgba(240,244,255,0.3);">muzquiz.fr</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  // ── Envoi via Resend API ─────────────────────────────────────────────────────
  const errors: string[] = [];
  let sent = 0;

  // Envoyer en batch (Resend accepte jusqu'à 50 destinataires par appel)
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'MuzQuiz <noreply@muzquiz.fr>',
        to: toSend,
        subject: `${hostNickname || 'Quelqu\'un'} t'invite au Quiz de la semaine — ${day}`,
        html,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[send-invite] Resend error:', data);
      return NextResponse.json({ error: data?.message ?? 'Erreur lors de l\'envoi' }, { status: 500 });
    }

    sent = toSend.length;
  } catch (err: any) {
    console.error('[send-invite] Fetch error:', err.message);
    return NextResponse.json({ error: 'Erreur réseau lors de l\'envoi' }, { status: 500 });
  }

  return NextResponse.json({
    ok: true,
    sent,
    skipped: validEmails.length - toSend.length,
    invalid: emails.length - validEmails.length,
  });
}
