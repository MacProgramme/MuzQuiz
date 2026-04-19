// app/api/generate-questions/route.ts
import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { theme, count = 10, mode = 'qcm' } = await req.json();

  if (!theme?.trim()) {
    return NextResponse.json({ error: 'Thème requis' }, { status: 400 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY non configurée dans .env.local' }, { status: 500 });
  }

  const prompt = `Tu es un expert en quiz. Génère exactement ${count} questions de quiz sur le thème : "${theme}".

Format de réponse : un tableau JSON uniquement, sans texte avant ni après, sans backticks.
Chaque question a la structure suivante :
{
  "question": "texte de la question",
  "choice_a": "réponse A",
  "choice_b": "réponse B",
  "choice_c": "réponse C",
  "choice_d": "réponse D",
  "correct_index": 0
}
(correct_index : 0=A, 1=B, 2=C, 3=D)

Règles :
- Questions variées, ni trop faciles ni trop difficiles
- Une seule bonne réponse par question
- Les 3 mauvaises réponses doivent être plausibles
- Questions concises (max 120 caractères)
- Réponses courtes (max 60 caractères chacune)
${mode === 'buzz' ? '- Questions adaptées au format buzz (réponse rapide)' : ''}`;

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = (message.content[0] as any).text?.trim() ?? '';

    // Nettoyer les backticks éventuels
    const cleaned = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

    let questions: any[];
    try {
      questions = JSON.parse(cleaned);
    } catch {
      return NextResponse.json({ error: 'Format invalide reçu de l\'IA', raw: text }, { status: 500 });
    }

    // Valider la structure
    const valid = questions.filter(q =>
      typeof q.question === 'string' &&
      typeof q.choice_a === 'string' &&
      typeof q.choice_b === 'string' &&
      typeof q.choice_c === 'string' &&
      typeof q.choice_d === 'string' &&
      [0, 1, 2, 3].includes(q.correct_index)
    );

    return NextResponse.json({ questions: valid });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Erreur IA' }, { status: 500 });
  }
}
