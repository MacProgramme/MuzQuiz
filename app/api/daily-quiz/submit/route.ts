// app/api/daily-quiz/submit/route.ts
// POST → valide les réponses côté serveur, enregistre le score, retourne les résultats
export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function todayStr(): string {
  // Utilise le fuseau Europe/Paris → change à minuit heure de Paris (pas UTC)
  return new Date().toLocaleDateString('fr-CA', { timeZone: 'Europe/Paris' });
}

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
  const answers: number[] = body.answers ?? [];
  const nickname: string = body.nickname ?? 'Joueur';

  const date = todayStr();

  // Client anonyme pour lire les données publiques
  const publicClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // 1. Vérifier si déjà joué
  const { data: existing } = await publicClient
    .from('daily_quiz_scores')
    .select('score')
    .eq('user_id', user.id)
    .eq('date', date)
    .single();

  if (existing) {
    return NextResponse.json({ error: 'Quiz déjà complété aujourd\'hui', score: existing.score }, { status: 409 });
  }

  // 2. Charger les questions du jour (avec correct_index)
  const { data: quiz } = await publicClient
    .from('daily_quizzes')
    .select('questions')
    .eq('date', date)
    .single();

  if (!quiz) {
    return NextResponse.json({ error: 'Quiz introuvable pour aujourd\'hui' }, { status: 404 });
  }

  const questions: any[] = quiz.questions;

  // 3. Valider les réponses
  if (answers.length !== questions.length) {
    return NextResponse.json({ error: 'Nombre de réponses incorrect' }, { status: 400 });
  }

  const results = questions.map((q: any, i: number) => answers[i] === q.correct);
  const correctCount = results.filter(Boolean).length;
  const score = correctCount * 10; // 0-100

  // 4. Enregistrer le score (via le client authentifié pour respecter RLS)
  const { error: insertErr } = await authClient
    .from('daily_quiz_scores')
    .insert({ user_id: user.id, nickname, date, score });

  if (insertErr) {
    console.error('Insert error:', insertErr);
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde' }, { status: 500 });
  }

  // 5. Retourner les résultats avec les bonnes réponses
  return NextResponse.json({
    score,
    correctCount,
    total: questions.length,
    results,
    correctAnswers: questions.map((q: any) => q.correct),
  });
}
