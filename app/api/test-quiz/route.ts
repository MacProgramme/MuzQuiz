// app/api/test-quiz/route.ts
// GET → retourne les questions du quiz du jour AVEC les bonnes réponses (mode test uniquement)
// ⚠️ À SUPPRIMER AVANT LE LANCEMENT DU SITE
export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

function todayStr(): string {
  return new Date().toLocaleDateString('fr-CA', { timeZone: 'Europe/Paris' });
}

export async function GET() {
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const date = todayStr();
  let { data: quiz } = await client
    .from('daily_quizzes')
    .select('date, theme, questions')
    .eq('date', date)
    .single();

  // Si pas de quiz aujourd'hui, prendre le plus proche
  if (!quiz) {
    const { data: next } = await client
      .from('daily_quizzes')
      .select('date, theme, questions')
      .order('date', { ascending: true })
      .limit(1)
      .single();
    quiz = next;
  }

  if (!quiz) {
    return NextResponse.json({ error: 'Aucun quiz disponible' }, { status: 404 });
  }

  return NextResponse.json({
    date: quiz.date,
    theme: quiz.theme,
    // Inclure les bonnes réponses (uniquement en mode test)
    questions: (quiz.questions as any[]).map((q: any, i: number) => ({
      id: i,
      question: q.question,
      choices: q.choices,
      correct: q.correct, // exposé uniquement en mode test
    })),
  });
}
