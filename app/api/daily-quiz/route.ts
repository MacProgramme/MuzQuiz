// app/api/daily-quiz/route.ts
// GET  → questions du jour (sans correct_index) + statut du joueur connecté
export const dynamic = 'force-dynamic';

import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const THEMES = [
  'Culture générale française', 'Cinéma et Séries TV', 'Musique & Artistes',
  'Sport et Champions', 'Histoire de France', 'Géographie mondiale',
  'Sciences et Nature', 'Gastronomie et Cuisine', 'Technologie & Jeux vidéo',
  'Art, Littérature et Philosophie', 'Animaux et Environnement', 'Voyages et Pays du monde',
  'Mode et Pop culture', 'Mythologie et Légendes', 'Astronomie et Espace',
  'Économie et Sociétés', 'Médecine et Corps humain', 'Architecture et Monuments',
  'Langues et Étymologie', 'Internet et Réseaux sociaux',
];

function todayStr(): string {
  // Utilise le fuseau Europe/Paris → change à minuit heure de Paris (pas UTC)
  return new Date().toLocaleDateString('fr-CA', { timeZone: 'Europe/Paris' });
}

function themeForDate(dateStr: string): string {
  const day = parseInt(dateStr.replace(/-/g, ''), 10);
  return THEMES[day % THEMES.length];
}

function getUserToken(req: NextRequest): string | null {
  const auth = req.headers.get('Authorization');
  return auth?.startsWith('Bearer ') ? auth.slice(7) : null;
}

export async function GET(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const date = todayStr();

  // 1. Chercher les questions du jour en cache
  let { data: quiz } = await supabase
    .from('daily_quizzes')
    .select('*')
    .eq('date', date)
    .single();

  // 2. Générer si absent
  if (!quiz) {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY manquante dans .env.local' }, { status: 500 });
    }

    const theme = themeForDate(date);
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const prompt = `Tu es un expert en quiz. Génère exactement 10 questions de quiz sur le thème du jour : "${theme}".

Format : tableau JSON uniquement, sans texte avant/après ni backticks.
Chaque objet :
{ "question": "...", "choices": ["A","B","C","D"], "correct": 0 }
(correct : index 0-3 de la bonne réponse)

Règles :
- Variété dans la difficulté (3 faciles, 4 moyennes, 3 difficiles)
- Une seule bonne réponse par question
- Les 3 mauvaises doivent être plausibles
- Questions concises (max 120 caractères)
- Réponses courtes (max 50 caractères chacune)
- En français`;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    });

    const text = ((message.content[0] as any).text ?? '').trim()
      .replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();

    let questions: any[];
    try {
      questions = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: 'Format IA invalide' }, { status: 500 });
    }

    // Valider + normaliser
    const valid = questions
      .filter(q => typeof q.question === 'string' && Array.isArray(q.choices) && q.choices.length === 4 && [0,1,2,3].includes(q.correct))
      .slice(0, 10);

    if (valid.length < 5) {
      return NextResponse.json({ error: 'Questions générées insuffisantes' }, { status: 500 });
    }

    const { data: inserted } = await supabase
      .from('daily_quizzes')
      .insert({ date, theme, questions: valid })
      .select('*')
      .single();

    quiz = inserted;
  }

  if (!quiz) return NextResponse.json({ error: 'Impossible de charger le quiz' }, { status: 500 });

  // 3. Vérifier si l'utilisateur a déjà joué aujourd'hui
  let myScore: number | null = null;
  const token = getUserToken(req);
  if (token) {
    const authClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );
    const { data: { user } } = await authClient.auth.getUser();
    if (user) {
      const { data: existing } = await supabase
        .from('daily_quiz_scores')
        .select('score')
        .eq('user_id', user.id)
        .eq('date', date)
        .single();
      if (existing) myScore = existing.score;
    }
  }

  // 4. Retourner les questions avec la bonne réponse (le scoring reste serveur)
  const safeQuestions = (quiz.questions as any[]).map((q: any, i: number) => ({
    id: i,
    question: q.question,
    choices: q.choices,
    correct: q.correct,
  }));

  return NextResponse.json({
    date: quiz.date,
    theme: quiz.theme,
    questions: safeQuestions,
    totalQuestions: safeQuestions.length,
    alreadyCompleted: myScore !== null,
    myScore,
  });
}
