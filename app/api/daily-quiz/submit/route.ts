// app/api/daily-quiz/submit/route.ts
// POST → valide les réponses côté serveur, calcule le score dégressif, enregistre, retourne les résultats
export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const TIMER_DURATION = 20; // secondes — doit correspondre à DailyQuiz.tsx

function todayStr(): string {
  return new Date().toLocaleDateString('fr-CA', { timeZone: 'Europe/Paris' });
}

/** Score dégressif : correct + timeLeft → entre 10 et 100 pts. Incorrect → 0. */
function calcScore(correct: boolean, timeLeft: number): number {
  if (!correct) return 0;
  return Math.max(10, Math.round(100 * timeLeft / TIMER_DURATION));
}

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

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
  const answers: number[]  = body.answers  ?? [];
  const timings: number[]  = body.timings  ?? []; // secondes restantes au moment de la réponse
  const nickname: string   = body.nickname ?? 'Joueur';

  const date = todayStr();

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

  if (answers.length !== questions.length) {
    return NextResponse.json({ error: 'Nombre de réponses incorrect' }, { status: 400 });
  }

  // 3. Calculer le score dégressif
  const results       = questions.map((q: any, i: number) => answers[i] === q.correct);
  const correctCount  = results.filter(Boolean).length;
  const timeLefts     = timings.length === questions.length ? timings : questions.map(() => 0);

  const totalScore = results.reduce((acc, correct, i) => {
    return acc + calcScore(correct, timeLefts[i] ?? 0);
  }, 0);

  // 4. Enregistrer le score
  const { error: insertErr } = await authClient
    .from('daily_quiz_scores')
    .insert({ user_id: user.id, nickname, date, score: totalScore });

  if (insertErr) {
    console.error('Insert error:', insertErr);
    return NextResponse.json({ error: 'Erreur lors de la sauvegarde' }, { status: 500 });
  }

  // 5. Retourner les résultats
  return NextResponse.json({
    score: totalScore,
    correctCount,
    total: questions.length,
    results,
    correctAnswers: questions.map((q: any) => q.correct),
  });
}
