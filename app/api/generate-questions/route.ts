// app/api/generate-questions/route.ts
export const dynamic = 'force-dynamic';

import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { theme, count = 10, mode = 'qcm' } = await req.json();

  if (!theme?.trim()) {
    return NextResponse.json({ error: 'Thème requis' }, { status: 400 });
  }
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'ANTHROPIC_API_KEY manquante dans les variables d\'environnement' }, { status: 500 });
  }

  const isBlindTest = mode === 'blind_test' || mode === 'buzz_blind_test';

  // ── Prompt blind test ────────────────────────────────────────────────────────
  const blindTestPrompt = `Tu es un expert en musique et quiz. Génère exactement ${count} questions de blind test en français sur le thème : "${theme}".

Chaque question correspond à UNE chanson réelle et connue. Le joueur doit identifier soit l'artiste, soit le titre selon ce qui est le plus pertinent.

Réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ni après, sans backticks.
Chaque élément doit avoir exactement cette structure :
{"question":"texte de la question","choice_a":"choix A","choice_b":"choix B","choice_c":"choix C","choice_d":"choix D","correct_index":0,"youtube_hint":"Artiste - Titre exact de la chanson pour YouTube"}

Règles :
- correct_index : 0=A, 1=B, 2=C, 3=D
- La question demande soit "Quel artiste ?" soit "Quel titre ?" soit "De quelle année ?" — varier les formats
- Les 3 mauvaises réponses doivent être plausibles (même genre musical, même époque)
- youtube_hint : le texte exact à taper sur YouTube pour trouver la chanson (ex: "Daft Punk - Get Lucky", "Stromae - Alors on danse")
- Uniquement des chansons réelles et connues
- Varier les artistes, pas plus de 2 chansons du même artiste

Exemple :
[{"question":"Quel artiste a sorti ce titre ?","choice_a":"Stromae","choice_b":"Maître Gims","choice_c":"Jul","choice_d":"Nekfeu","correct_index":0,"youtube_hint":"Stromae - Alors on danse"}]`;

  // ── Prompt QCM standard ─────────────────────────────────────────────────────
  const qcmPrompt = `Tu es un expert en quiz. Génère exactement ${count} questions de quiz en français sur le thème : "${theme}".

Réponds UNIQUEMENT avec un tableau JSON valide, sans texte avant ni après, sans backticks, sans commentaires.
Chaque élément du tableau doit avoir exactement cette structure :
{"question":"texte","choice_a":"réponse A","choice_b":"réponse B","choice_c":"réponse C","choice_d":"réponse D","correct_index":0}

correct_index doit être un entier : 0 pour A, 1 pour B, 2 pour C, 3 pour D.

Règles :
- Uniquement en français
- Questions variées en difficulté
- Une seule bonne réponse, 3 mauvaises plausibles
- Questions courtes (max 120 caractères)
- Réponses courtes (max 60 caractères)
- INTERDIT : la bonne réponse ne doit JAMAIS apparaître textuellement dans la question.

Exemple de sortie attendue :
[{"question":"Quelle est la capitale de la France ?","choice_a":"Paris","choice_b":"Lyon","choice_c":"Marseille","choice_d":"Nice","correct_index":0}]`;

  const prompt = isBlindTest ? blindTestPrompt : qcmPrompt;

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    });

    const raw = (message.content[0] as any).text?.trim() ?? '';

    // Nettoyer : supprimer backticks et blocs ```json
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    // Extraire le tableau JSON même si du texte parasite est présent
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (!match) {
      return NextResponse.json({ error: 'L\'IA n\'a pas retourné de tableau JSON valide.', raw }, { status: 500 });
    }

    let questions: any[];
    try {
      questions = JSON.parse(match[0]);
    } catch {
      return NextResponse.json({ error: 'Impossible de parser la réponse de l\'IA.', raw }, { status: 500 });
    }

    if (!Array.isArray(questions)) {
      return NextResponse.json({ error: 'La réponse n\'est pas un tableau.', raw }, { status: 500 });
    }

    // Normaliser et valider — correct_index peut être string ou number selon le modèle
    const valid = questions
      .map(q => ({
        ...q,
        correct_index: typeof q.correct_index === 'string'
          ? parseInt(q.correct_index, 10)
          : q.correct_index,
      }))
      .filter(q =>
        typeof q.question === 'string' && q.question.trim() &&
        typeof q.choice_a === 'string' && q.choice_a.trim() &&
        typeof q.choice_b === 'string' && q.choice_b.trim() &&
        typeof q.choice_c === 'string' && q.choice_c.trim() &&
        typeof q.choice_d === 'string' && q.choice_d.trim() &&
        [0, 1, 2, 3].includes(q.correct_index)
      );

    if (valid.length === 0) {
      return NextResponse.json({ error: `Aucune question valide générée (${questions.length} reçues). Réessaie.`, raw }, { status: 500 });
    }

    return NextResponse.json({ questions: valid });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Erreur IA' }, { status: 500 });
  }
}
