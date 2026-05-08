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
  const prompt = `Chanson : "${videoTitle}"
Partie demandée : "${targetPart}"

À combien de secondes du début de la vidéo commence "${targetPart}" dans cette chanson ?

Repères typiques si tu n'es pas certain :
- Intro : 0–15s | 1er couplet : 15–40s | 1er refrain : 40–75s
- 2ème couplet : 75–110s | Pont/Break : 110–160s | Drop EDM : 30–60s
- Fin : ~210–240s pour une chanson de 3:30–4min

Réponds UNIQUEMENT avec ce JSON (rien d'autre, pas de texte avant ni après) :
{"seconds": <entier 0-300>, "reason": "<confirme la partie trouvée et explique en une phrase>"}`;

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 200,
      system: 'Tu es un expert en musique. Tu réponds UNIQUEMENT avec un JSON valide, jamais de texte libre.',
      messages: [{ role: 'user', content: prompt }],
    });

    const text = message.content[0]?.type === 'text' ? message.content[0].text : '';
    // Extraire le JSON même si Claude ajoute du texte autour
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const parsed = JSON.parse(jsonMatch[0]);
    const seconds = Math.max(0, Math.min(300, Math.round(Number(parsed.seconds) || 30)));

    return NextResponse.json({
      suggestedTime: seconds,
      reason: parsed.reason ?? '',
      videoTitle,
    });
  } catch (err: any) {
    return NextResponse.json({
      suggestedTime: 30,
      reason: 'Estimation automatique à 0:30.',
      videoTitle,
    });
  }
}
