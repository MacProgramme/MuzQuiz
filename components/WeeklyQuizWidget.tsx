// components/WeeklyQuizWidget.tsx
// Affiche le quiz de la semaine d'aujourd'hui sous le quiz du jour.
// Visible pour l'hôte (son propre quiz) ET pour tout le monde
// si un quiz public existe pour aujourd'hui.
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const MODE_LABEL: Record<string, string> = {
  qcm: 'Quiz', buzz: 'Buzz Quiz', quiz: 'Quiz',
  blind_test: 'Blind Test', buzz_quiz: 'Buzz Quiz', buzz_blind_test: 'Buzz Blind Test',
};
const MODE_COLOR: Record<string, string> = {
  qcm: '#00E5D1', buzz: '#FF00AA', quiz: '#00E5D1',
  blind_test: '#8B5CF6', buzz_quiz: '#FF00AA', buzz_blind_test: '#F59E0B',
};

function getTodayIndex() {
  const day = new Date().getDay();
  return day === 0 ? 6 : day - 1; // 0=Lundi … 6=Dimanche
}

interface TodaySlot {
  quizId: string;
  quizName: string;
  ownerId: string;
  ownerNickname: string;
  ownerColor: string;
  packId: string;
  packName: string;
  packMode: string;
  isHost: boolean;
  inviteLink: string;
}

interface Props {
  userId: string;
  userTier: string;
}

export function WeeklyQuizWidget({ userId, userTier }: Props) {
  const router = useRouter();
  const [slot, setSlot] = useState<TodaySlot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const todayIdx = getTodayIndex();
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.muzquiz.fr';

      // 1. Chercher un quiz dont l'utilisateur est l'hôte
      const { data: myQuiz } = await supabase
        .from('weekly_quizzes')
        .select('id, name, owner_id, weekly_quiz_slots!inner(pack_id, day_of_week, question_packs(id, name, mode))')
        .eq('owner_id', userId)
        .eq('weekly_quiz_slots.day_of_week', todayIdx)
        .limit(1)
        .single();

      if (myQuiz) {
        const s = (myQuiz as any).weekly_quiz_slots[0];
        const pack = Array.isArray(s.question_packs) ? s.question_packs[0] : s.question_packs;
        if (pack) {
          setSlot({
            quizId: myQuiz.id,
            quizName: myQuiz.name,
            ownerId: myQuiz.owner_id,
            ownerNickname: 'Toi',
            ownerColor: '#FF00AA',
            packId: pack.id,
            packName: pack.name,
            packMode: pack.mode,
            isHost: true,
            inviteLink: `${appUrl}/?invite_pack=${pack.id}&day=${DAYS[todayIdx]}`,
          });
          setLoading(false);
          return;
        }
      }

      // 2. Chercher un quiz public pour aujourd'hui (invitation reçue)
      const { data: publicSlots } = await supabase
        .from('weekly_quiz_slots')
        .select(`
          pack_id, day_of_week,
          question_packs(id, name, mode),
          weekly_quizzes!inner(id, name, owner_id, profiles(nickname, avatar_color))
        `)
        .eq('day_of_week', todayIdx)
        .not('pack_id', 'is', null)
        .limit(5);

      if (publicSlots && publicSlots.length > 0) {
        // Exclure ses propres quizzes (déjà traité)
        const others = publicSlots.filter((s: any) => {
          const wq = Array.isArray(s.weekly_quizzes) ? s.weekly_quizzes[0] : s.weekly_quizzes;
          return wq?.owner_id !== userId;
        });
        if (others.length > 0) {
          const s = others[0] as any;
          const wq = Array.isArray(s.weekly_quizzes) ? s.weekly_quizzes[0] : s.weekly_quizzes;
          const pack = Array.isArray(s.question_packs) ? s.question_packs[0] : s.question_packs;
          const prof = Array.isArray(wq?.profiles) ? wq.profiles[0] : wq?.profiles;
          if (pack && wq) {
            setSlot({
              quizId: wq.id,
              quizName: wq.name,
              ownerId: wq.owner_id,
              ownerNickname: prof?.nickname ?? 'Hôte',
              ownerColor: prof?.avatar_color ?? '#8B5CF6',
              packId: pack.id,
              packName: pack.name,
              packMode: pack.mode,
              isHost: false,
              inviteLink: `${appUrl}/?invite_pack=${pack.id}&day=${DAYS[todayIdx]}`,
            });
          }
        }
      }

      setLoading(false);
    };
    load();
  }, [userId]);

  if (loading) return null;
  if (!slot) {
    // Hôte sans quiz pour aujourd'hui → invite à en configurer un
    if (userTier === 'essentiel' || userTier === 'pro' || userTier === 'expert') {
      return (
        <div className="muz-card p-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-widest mb-1"
              style={{ color: 'rgba(0,229,209,0.6)' }}>Quiz de la semaine</p>
            <p className="text-sm font-bold" style={{ color: 'rgba(240,244,255,0.5)' }}>
              Aucun pack assigné pour aujourd'hui
            </p>
          </div>
          <Link href="/weekly-quiz"
            className="px-4 py-2 rounded-xl font-black text-sm flex-shrink-0 transition-all hover:opacity-80"
            style={{ background: 'rgba(0,229,209,0.1)', color: '#00E5D1', border: '1px solid rgba(0,229,209,0.25)' }}>
            Configurer →
          </Link>
        </div>
      );
    }
    return null;
  }

  const modeColor = MODE_COLOR[slot.packMode] ?? '#8B5CF6';
  const todayName = DAYS[getTodayIndex()];

  return (
    <div className="muz-card p-4 flex flex-col gap-3">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <p className="text-xs font-black uppercase tracking-widest"
          style={{ color: 'rgba(0,229,209,0.6)' }}>
          🗓 Quiz de la semaine · {todayName}
        </p>
        {slot.isHost && (
          <Link href="/weekly-quiz"
            className="text-xs font-bold px-2.5 py-1 rounded-lg transition-all hover:opacity-80"
            style={{ background: 'rgba(0,229,209,0.08)', color: 'rgba(0,229,209,0.6)', border: '1px solid rgba(0,229,209,0.2)' }}>
            Gérer →
          </Link>
        )}
      </div>

      {/* Pack du jour */}
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-black text-base truncate" style={{ color: '#F0F4FF' }}>{slot.packName}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs px-2 py-0.5 rounded-full font-bold"
              style={{ background: `${modeColor}22`, color: modeColor, border: `1px solid ${modeColor}44` }}>
              {MODE_LABEL[slot.packMode] ?? slot.packMode}
            </span>
            {!slot.isHost && (
              <span className="text-xs font-bold" style={{ color: 'rgba(240,244,255,0.35)' }}>
                par {slot.ownerNickname}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Boutons */}
      <div className="flex gap-2">
        <a href={slot.inviteLink}
          className="flex-1 py-2.5 rounded-xl font-black text-sm text-center transition-all hover:opacity-90 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #FF00AA, #8B5CF6)', color: '#fff' }}>
          Jouer maintenant →
        </a>
        {slot.isHost && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(slot.inviteLink);
            }}
            className="px-4 py-2.5 rounded-xl font-black text-sm transition-all hover:opacity-80"
            style={{ background: 'rgba(255,0,170,0.08)', color: '#FF00AA', border: '1px solid rgba(255,0,170,0.2)' }}
            title="Copier le lien d'invitation">
            🔗
          </button>
        )}
      </div>
    </div>
  );
}
