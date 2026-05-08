// app/api/suggest-start-time/route.ts
// Suggère (via Claude) le meilleur point de départ pour une chanson en blind test.
// 1. Récupère le titre via l'API oEmbed YouTube (sans clé API)
// 2. Demande à Claude d'estimer le timestamp du refrain ou de la partie la plus reconnaissable
export const dynamic = 'force-dynamic';

import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { youtubeUrl } = await req.json();

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

  if (!videoTitle) {
    // Impossible d'identifier la chanson, on retourne une valeur par défaut utile
    return NextResponse.json({
      suggestedTime: 30,
      reason: 'Titre introuvable — suggestion par défaut à 0:30 (juste après l\'intro habituelle).',
    });
  }

  // ── 2. Demander à Claude d'estimer le timestamp du refrain ──────────────────
  const prompt = `Tu es un expert en musique.
Pour la chanson dont le titre YouTube est : "${videoTitle}"

Estime à quelle seconde commence le refrain principal (ou la partie la plus facilement reconnaissable, celle qu'on entend dans une intro de blind test).

Réponds UNIQUEMENT avec ce JSON valide, rien d'autre :
{"seconds": <entier entre 0 et 300>, "reason": "<une phrase courte en français expliquant ton choix>"}

Si tu ne connais pas cette chanson précisément, estime une valeur typique selon la structure musicale habituelle (intro ~15-20s, premier couplet ~15-30s, refrain souvent vers 45-75s).`;

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
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
