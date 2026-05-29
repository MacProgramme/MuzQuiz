// app/weekly-quiz/page.tsx
"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MuzquizLogo } from '@/components/MuzquizLogo';
import { normalizeTier, SubscriptionTier, TIER_LIMITS } from '@/types';
import Link from 'next/link';

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
const DAYS_SHORT = ['LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM', 'DIM'];

const TIER_QUIZ_LIMITS: Record<SubscriptionTier, { quizPerWeek: number; maxPlayers: number | null; label: string }> = {
  decouverte: { quizPerWeek: 1,  maxPlayers: 100,  label: '1 quiz/semaine · 100 joueurs max' },
  essentiel:  { quizPerWeek: 3,  maxPlayers: 250,  label: '3 quiz/semaine · 250 joueurs max' },
  pro:        { quizPerWeek: 7,  maxPlayers: null, label: '7 quiz/semaine · illimité' },
  expert:     { quizPerWeek: 7,  maxPlayers: null, label: '7 quiz/semaine · illimité' },
};

interface Pack { id: string; name: string; mode: string; question_count: number }
interface Slot  { id: string; day_of_week: number; pack_id: string | null; pack?: Pack }
interface WeeklyQuiz { id: string; name: string; slots: Slot[] }

const MODE_LABEL: Record<string, string> = {
  qcm: 'Quiz', buzz: 'Buzz Quiz', quiz: 'Quiz',
  blind_test: 'Blind Test', buzz_quiz: 'Buzz Quiz', buzz_blind_test: 'Buzz Blind Test',
};

function getTodayIndex() {
  const day = new Date().getDay(); // 0=Dimanche, 1=Lundi…
  return day === 0 ? 6 : day - 1;   // → 0=Lundi, 6=Dimanche
}

export default function WeeklyQuizPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [tier, setTier] = useState<SubscriptionTier>('decouverte');
  const [loading, setLoading] = useState(true);

  const [myQuiz, setMyQuiz]   = useState<WeeklyQuiz | null>(null);
  const [packs, setPacks]      = useState<Pack[]>([]);
  const [quizName, setQuizName] = useState('Mon Quiz de la semaine');
  const [saving, setSaving]    = useState(false);

  // Invitation
  const [inviteCopied, setInviteCopied] = useState<number | null>(null);

  // Emails invitation
  const [inviteDay, setInviteDay]     = useState<number | null>(null);
  const [inviteEmails, setInviteEmails] = useState('');
  const [inviteSending, setInviteSending] = useState(false);
  const [inviteMsg, setInviteMsg]     = useState('');

  const tierLimits = TIER_QUIZ_LIMITS[tier];
  const todayIndex = getTodayIndex();

  const loadData = useCallback(async (uid: string, userTier: SubscriptionTier) => {
    // Charger les packs de l'utilisateur
    const { data: packsData } = await supabase
      .from('question_packs')
      .select('id, name, mode')
      .eq('owner_id', uid);

    // Compter les questions par pack
    if (packsData) {
      const packsWithCount = await Promise.all(packsData.map(async (p: any) => {
        const { count } = await supabase
          .from('custom_questions').select('*', { count: 'exact', head: true }).eq('pack_id', p.id);
        return { ...p, question_count: count ?? 0 };
      }));
      setPacks(packsWithCount);
    }

    // Charger le quiz de la semaine existant
    const { data: quizData } = await supabase
      .from('weekly_quizzes')
      .select('id, name')
      .eq('owner_id', uid)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (quizData) {
      const { data: slotsData } = await supabase
        .from('weekly_quiz_slots')
        .select('id, day_of_week, pack_id, question_packs(id, name, mode, question_count)')
        .eq('weekly_quiz_id', quizData.id)
        .order('day_of_week');

      const slots: Slot[] = Array.from({ length: 7 }, (_, i) => {
        const existing = slotsData?.find((s: any) => s.day_of_week === i);
        const packRaw = existing?.question_packs;
        const pack: Pack | undefined = Array.isArray(packRaw) ? packRaw[0] : packRaw ?? undefined;
        return {
          id: existing?.id ?? '',
          day_of_week: i,
          pack_id: existing?.pack_id ?? null,
          pack,
        };
      });
      setMyQuiz({ id: quizData.id, name: quizData.name, slots });
      setQuizName(quizData.name);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user || session.user.is_anonymous) { router.push('/login?redirect=/weekly-quiz'); return; }
      setUserId(session.user.id);
      const { data: prof } = await supabase.from('profiles').select('subscription_tier').eq('id', session.user.id).single();
      const userTier = normalizeTier(prof?.subscription_tier);
      setTier(userTier);
      // Seuls Essentiel, Pro et Expert peuvent créer/gérer des quiz de la semaine
      if (userTier === 'decouverte') { router.push('/pricing?from=weekly-quiz'); return; }
      await loadData(session.user.id, userTier);
    };
    init();
  }, [loadData]);

  const createOrSaveQuiz = async () => {
    if (!userId) return;
    setSaving(true);

    let quizId = myQuiz?.id ?? null;

    if (!quizId) {
      const { data } = await supabase
        .from('weekly_quizzes')
        .insert({ owner_id: userId, name: quizName })
        .select('id')
        .single();
      quizId = data?.id ?? null;
    } else {
      await supabase.from('weekly_quizzes').update({ name: quizName }).eq('id', quizId);
    }

    if (quizId && myQuiz) {
      // Upsert chaque slot
      for (const slot of myQuiz.slots) {
        if (slot.pack_id) {
          if (slot.id) {
            await supabase.from('weekly_quiz_slots').update({ pack_id: slot.pack_id }).eq('id', slot.id);
          } else {
            await supabase.from('weekly_quiz_slots').insert({ weekly_quiz_id: quizId, day_of_week: slot.day_of_week, pack_id: slot.pack_id });
          }
        } else if (slot.id) {
          await supabase.from('weekly_quiz_slots').delete().eq('id', slot.id);
        }
      }
      await loadData(userId, tier);
    } else if (quizId) {
      await loadData(userId, tier);
    }
    setSaving(false);
  };

  const setSlotPack = (dayIndex: number, packId: string | null) => {
    setMyQuiz(prev => {
      if (!prev) {
        // Créer un quiz vide avec les slots
        const slots: Slot[] = Array.from({ length: 7 }, (_, i) => ({ id: '', day_of_week: i, pack_id: i === dayIndex ? packId : null }));
        return { id: '', name: quizName, slots };
      }
      return {
        ...prev,
        slots: prev.slots.map(s => s.day_of_week === dayIndex ? { ...s, pack_id: packId, pack: packs.find(p => p.id === packId) } : s),
      };
    });
  };

  const getInviteLink = (dayIndex: number) => {
    const slot = myQuiz?.slots.find(s => s.day_of_week === dayIndex);
    if (!slot?.pack_id) return null;
    return `${process.env.NEXT_PUBLIC_APP_URL ?? 'https://www.muzquiz.fr'}/?invite_pack=${slot.pack_id}&day=${DAYS[dayIndex]}`;
  };

  const copyInviteLink = (dayIndex: number) => {
    const link = getInviteLink(dayIndex);
    if (!link) return;
    navigator.clipboard.writeText(link);
    setInviteCopied(dayIndex);
    setTimeout(() => setInviteCopied(null), 2000);
  };

  // Nombre de jours avec un pack assigné (= nombre de quiz planifiés)
  const assignedDays = myQuiz?.slots.filter(s => s.pack_id).length ?? 0;
  const canAssignMore = assignedDays < tierLimits.quizPerWeek;

  if (loading) return (
    <div className="flex items-center justify-center h-screen" style={{ background: '#0D1B3E' }}>
      <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
        style={{ borderColor: '#FF00AA', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="min-h-screen muz-fade-in"
      style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 50%, #0D1B3E 100%)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
        <Link href="/profile"
          className="text-sm font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
          style={{ background: 'rgba(255,0,170,0.08)', color: 'rgba(255,0,170,0.7)', border: '1px solid rgba(255,0,170,0.2)' }}>
          ← Profil
        </Link>
        <MuzquizLogo width={100} textSize="1.2rem" />
        <div style={{ width: 80 }} />
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Titre + limite tier */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-black mb-1" style={{ color: '#F0F4FF' }}>📅 Quiz de la semaine</h1>
          <p className="text-sm mb-3" style={{ color: 'rgba(240,244,255,0.4)' }}>
            Assigne un pack par jour et invite tes joueurs
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
            style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', color: '#C4B5FD' }}>
            <span>🎯</span>
            <span>{tierLimits.label}</span>
            <span style={{ color: 'rgba(240,244,255,0.3)' }}>·</span>
            <span style={{ color: assignedDays >= tierLimits.quizPerWeek ? '#FF00AA' : '#00E5D1' }}>
              {assignedDays}/{tierLimits.quizPerWeek} utilisés
            </span>
          </div>
          {tier === 'decouverte' && (
            <div className="mt-2">
              <Link href="/pricing" className="text-xs font-bold underline" style={{ color: '#F59E0B' }}>
                Passe à Essentiel pour 3 quiz/semaine →
              </Link>
            </div>
          )}
        </div>

        {/* Nom du quiz */}
        <div className="mb-5">
          <input
            value={quizName}
            onChange={e => setQuizName(e.target.value)}
            placeholder="Nom de ton quiz de la semaine"
            className="w-full px-4 py-3 rounded-xl font-bold outline-none"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1.5px solid rgba(139,92,246,0.3)',
              color: '#F0F4FF',
            }}
          />
        </div>

        {/* Grille des 7 jours */}
        <div className="flex flex-col gap-3 mb-6">
          {DAYS.map((day, i) => {
            const slot = myQuiz?.slots.find(s => s.day_of_week === i);
            const isToday = i === todayIndex;
            const hasPackToday = !!slot?.pack_id;
            const canAssignThisDay = !slot?.pack_id && canAssignMore;
            const inviteLink = getInviteLink(i);

            return (
              <div key={i}
                className="muz-card p-4"
                style={{
                  border: isToday ? '2px solid rgba(0,229,209,0.4)' : undefined,
                  background: isToday ? 'rgba(0,229,209,0.04)' : undefined,
                }}>
                <div className="flex items-center gap-3">
                  {/* Jour */}
                  <div className="w-12 flex-shrink-0 text-center">
                    <p className="text-xs font-black uppercase tracking-widest"
                      style={{ color: isToday ? '#00E5D1' : 'rgba(240,244,255,0.4)' }}>
                      {DAYS_SHORT[i]}
                    </p>
                    {isToday && <p className="text-xs font-bold" style={{ color: '#00E5D1' }}>Aujourd'hui</p>}
                  </div>

                  {/* Sélecteur de pack */}
                  <div className="flex-1 min-w-0">
                    <select
                      value={slot?.pack_id ?? ''}
                      onChange={e => setSlotPack(i, e.target.value || null)}
                      disabled={!canAssignThisDay && !slot?.pack_id}
                      className="w-full px-3 py-2 rounded-xl text-sm font-bold outline-none"
                      style={{
                        background: '#112247',
                        border: `1px solid ${hasPackToday ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.1)'}`,
                        color: hasPackToday ? '#F0F4FF' : 'rgba(240,244,255,0.5)',
                        cursor: !canAssignThisDay && !slot?.pack_id ? 'not-allowed' : 'pointer',
                        colorScheme: 'dark',
                      }}>
                      <option value="" style={{ background: '#112247', color: 'rgba(240,244,255,0.5)' }}>— Aucun pack —</option>
                      {packs.map(p => (
                        <option key={p.id} value={p.id} style={{ background: '#112247', color: '#F0F4FF' }}>
                          {p.name} ({MODE_LABEL[p.mode] ?? p.mode} · {p.question_count}q)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Bouton copier lien */}
                  {inviteLink && (
                    <button
                      onClick={() => copyInviteLink(i)}
                      title="Copier le lien d'invitation"
                      className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all hover:scale-110"
                      style={{
                        background: inviteCopied === i ? 'rgba(0,229,209,0.15)' : 'rgba(139,92,246,0.12)',
                        color: inviteCopied === i ? '#00E5D1' : '#8B5CF6',
                        border: `1px solid ${inviteCopied === i ? 'rgba(0,229,209,0.3)' : 'rgba(139,92,246,0.25)'}`,
                      }}>
                      {inviteCopied === i ? '✓' : '🔗'}
                    </button>
                  )}

                  {/* Bouton email */}
                  {inviteLink && (
                    <button
                      onClick={() => { setInviteDay(i); setInviteEmails(''); setInviteMsg(''); }}
                      title="Inviter par email"
                      className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm transition-all hover:scale-110"
                      style={{
                        background: 'rgba(255,0,170,0.1)',
                        color: '#FF00AA',
                        border: '1px solid rgba(255,0,170,0.25)',
                      }}>
                      ✉
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bouton sauvegarder */}
        <button
          onClick={createOrSaveQuiz}
          disabled={saving}
          className="w-full muz-btn-pink py-4 rounded-2xl font-black text-base disabled:opacity-50 mb-4">
          {saving ? '…' : myQuiz?.id ? '💾 Sauvegarder les modifications' : '🚀 Créer mon Quiz de la semaine'}
        </button>

        {/* Info limite */}
        {!canAssignMore && assignedDays > 0 && (
          <p className="text-center text-xs font-bold mb-4" style={{ color: 'rgba(245,158,11,0.7)' }}>
            Limite atteinte pour ton abonnement —{' '}
            <Link href="/pricing" style={{ color: '#F59E0B', textDecoration: 'underline' }}>
              Upgrader pour plus
            </Link>
          </p>
        )}

        {/* Info joueurs max */}
        {tierLimits.maxPlayers && (
          <div className="text-center text-xs px-4 py-2 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.03)', color: 'rgba(240,244,255,0.3)', border: '1px solid rgba(255,255,255,0.06)' }}>
            Tes salles acceptent jusqu'à <strong style={{ color: 'rgba(240,244,255,0.5)' }}>{tierLimits.maxPlayers} joueurs</strong>.
            {tier !== 'expert' && (
              <> <Link href="/pricing" style={{ color: '#8B5CF6' }}>Passer Pro/Expert</Link> pour illimité.</>
            )}
          </div>
        )}
      </div>

      {/* Modal invitation email */}
      {inviteDay !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(13,27,62,0.92)' }}>
          <div className="muz-card w-full max-w-md p-6">
            <h2 className="text-lg font-black mb-1" style={{ color: '#F0F4FF' }}>
              ✉ Inviter pour {DAYS[inviteDay]}
            </h2>
            <p className="text-xs mb-4" style={{ color: 'rgba(240,244,255,0.4)' }}>
              Entre les adresses email séparées par des virgules ou des retours à la ligne
            </p>

            {/* Lien copiable */}
            <div className="flex gap-2 mb-4">
              <div className="flex-1 px-3 py-2 rounded-xl text-xs font-mono truncate"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(240,244,255,0.5)' }}>
                {getInviteLink(inviteDay)}
              </div>
              <button
                onClick={() => copyInviteLink(inviteDay)}
                className="px-3 py-2 rounded-xl text-xs font-black flex-shrink-0"
                style={{ background: 'rgba(139,92,246,0.12)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.25)' }}>
                {inviteCopied === inviteDay ? '✓' : '🔗 Copier'}
              </button>
            </div>

            <textarea
              value={inviteEmails}
              onChange={e => setInviteEmails(e.target.value)}
              placeholder="email1@exemple.com, email2@exemple.com…"
              rows={4}
              className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none resize-none mb-3"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1.5px solid rgba(255,0,170,0.3)',
                color: '#F0F4FF',
              }}
            />

            {inviteMsg && (
              <p className="text-xs font-bold mb-3" style={{ color: inviteMsg.startsWith('✓') ? '#00E5D1' : '#FF6060' }}>
                {inviteMsg}
              </p>
            )}

            <div className="flex gap-3">
              <button onClick={() => setInviteDay(null)}
                className="flex-1 py-2.5 rounded-xl font-bold text-sm"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(240,244,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                Fermer
              </button>
              <button
                onClick={async () => {
                  // Pour l'instant : copie le lien et affiche les emails à contacter
                  // L'envoi réel d'emails nécessite une API email (Resend, SendGrid…)
                  const emails = inviteEmails.split(/[,\n]/).map(e => e.trim()).filter(Boolean);
                  if (emails.length === 0) { setInviteMsg('Entre au moins une adresse email.'); return; }
                  const link = getInviteLink(inviteDay!);
                  navigator.clipboard.writeText(link ?? '');
                  setInviteMsg(`✓ Lien copié ! Envoie-le à : ${emails.join(', ')}`);
                }}
                disabled={inviteSending}
                className="flex-1 muz-btn-pink py-2.5 rounded-xl font-black text-sm disabled:opacity-50">
                {inviteSending ? '…' : 'Copier le lien →'}
              </button>
            </div>
            <p className="text-xs text-center mt-3" style={{ color: 'rgba(240,244,255,0.25)' }}>
              L'envoi automatique d'emails sera disponible prochainement
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
