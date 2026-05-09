// app/api/suggest-start-time/route.ts
// Suggère (via Claude) le meilleur point de départ pour une chanson en blind test.
// 1. Récupère le titre via l'API oEmbed YouTube (sans clé API)
// 2. Demande à Claude d'estimer le timestamp du refrain ou de la partie la plus reconnaissable
export const dynamic = 'force-dynamic';

import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { youtubeUrl, target } = await req.json();

  if (!youtubeUrl?.trim()) {
    return NextResponse.json({ error: 'URL YouTube requise' }, { status: 400 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY manquante' }, { status: 500 });
  }

  // ── 1. Récupérer le titre via oEmbed (API publique YouTube, pas de clé requise) ──
  let videoTitle = '';
  try {
    const oembedRes = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(youtubeUrl)}&format=json`,
      { headers: { 'User-Agent': 'MuzQuiz/1.0' } }
    );
    if (oembedRes.ok) {
      const oembed = await oembedRes.json();
      videoTitle = oembed.title ?? '';
    }
  } catch {
    // oEmbed indisponible → on continue sans titre
  }

  // Partie demandée par l'utilisateur (ex: "refrain", "2ème couplet", "pont")
  // Si vide, on vise la partie la plus reconnaissable par défaut
  const targetPart = target?.trim() || 'le refrain principal (ou la partie la plus reconnaissable)';

  if (!videoTitle) {
    // Impossible d'identifier la chanson, on retourne une valeur par défaut utile
    const defaultTime = targetPart.toLowerCase().includes('fin') ? 210
      : targetPart.toLowerCase().includes('pont') || targetPart.toLowerCase().includes('bridge') ? 120
      : targetPart.toLowerCase().includes('2') ? 90
      : targetPart.toLowerCase().includes('intro') ? 0
      : 45;
    return NextResponse.json({
      suggestedTime: defaultTime,
      reason: `Titre introuvable — estimation par défaut pour « ${targetPart} ».`,
    });
  }

  // ── 2. Demander à Claude d'estimer le timestamp ──────────────────────────────
  // On demande UNIQUEMENT un entier pour éviter tout problème de parsing JSON
  const prompt = `Chanson : "${videoTitle}"
Partie demandée : "${targetPart}"

À combien de secondes du début de cette chanson commence "${targetPart}" ?

Repères typiques :
- Intro : 0–15s | 1er couplet : 15–40s | 1er refrain : 40–75s
- 2ème couplet : 75–110s | Pont/Break : 110–160s | Drop EDM : 30–60s
- Fin : ~210–240s pour une chanson de 3:30–4min

Réponds UNIQUEMENT avec l'entier (nombre de secondes, entre 0 et 300), RIEN d'autre.
Exemple de réponse correcte : 47`;

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 20,
      system: 'Tu es un expert en musique. Tu réponds UNIQUEMENT avec un entier (nombre de secondes). Aucun texte, aucune ponctuation, juste le chiffre.',
      messages: [{ role: 'user', content: prompt }],
    });

    const text = (message.content[0]?.type === 'text' ? message.content[0].text : '').trim();

    // Extraire le premier nombre entier trouvé dans la réponse
    const numMatch = text.match(/\d+/);
    if (!numMatch) throw new Error(`No number in response: "${text}"`);

    const seconds = Math.max(0, Math.min(300, parseInt(numMatch[0], 10)));

    // Construire la raison côté serveur (pas de JSON à parser)
    const targetLabel = target?.trim() || 'partie la plus reconnaissable';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;
    const reason = `${targetLabel} estimé à ${timeStr} pour « ${videoTitle} »`;

    return NextResponse.json({
      suggestedTime: seconds,
      reason,
      videoTitle,
    });
  } catch (err: any) {
    // Fallback basé sur la partie demandée (heuristique simple)
    const t = targetPart.toLowerCase();
    const fallbackTime = t.includes('fin') ? 210
      : t.includes('pont') || t.includes('bridge') ? 120
      : t.includes('2') ? 90
      : t.includes('intro') ? 5
      : t.includes('drop') ? 45
      : 50; // refrain par défaut

    const targetLabel = target?.trim() || 'Refrain';
    const mins = Math.floor(fallbackTime / 60);
    const secs = fallbackTime % 60;
    const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`;

    return NextResponse.json({
      suggestedTime: fallbackTime,
      reason: `Estimation heuristique pour « ${targetLabel} » → ${timeStr}`,
      videoTitle,
    });
  }
}
