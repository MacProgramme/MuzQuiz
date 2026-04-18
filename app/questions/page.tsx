// app/questions/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { QuestionPack, CustomQuestion, SubscriptionTier, TIER_LIMITS } from '@/types';
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

type View = 'packs' | 'questions';

const MODE_LABEL: Record<string, string> = { qcm: '🎵 Quiz Blind Test', buzz: '🔔 Buzz Quiz' };
const LABELS = ['A', 'B', 'C', 'D'];
const TIER_COLORS: Record<SubscriptionTier, { bg: string; text: string; label: string }> = {
  free:    { bg: 'rgba(255,255,255,0.06)',  text: 'rgba(240,244,255,0.5)', label: 'Gratuit' },
  pro:     { bg: 'rgba(0,229,209,0.12)',    text: '#00E5D1',              label: 'Pro' },
  premium: { bg: 'rgba(245,158,11,0.12)',   text: '#F59E0B',              label: 'Premium' },
};

function inputStyle(focused: boolean) {
  return {
    background: 'rgba(255,255,255,0.06)',
    border: `1.5px solid ${focused ? '#8B5CF6' : 'rgba(139,92,246,0.25)'}`,
    color: '#F0F4FF',
    borderRadius: '0.75rem',
    padding: '0.625rem 1rem',
    width: '100%',
    outline: 'none',
    fontSize: '0.875rem',
  } as React.CSSProperties;
}

export default function QuestionsPage() {
  const router = useRouter();
  const [tier, setTier] = useState<SubscriptionTier>('free');
  const [userId, setUserId] = useState<string | null>(null);
  const [packs, setPacks] = useState<(QuestionPack & { question_count: number })[]>([]);
  const [selectedPack, setSelectedPack] = useState<QuestionPack | null>(null);
  const [questions, setQuestions] = useState<CustomQuestion[]>([]);
  const [view, setView] = useState<View>('packs');
  const [loading, setLoading] = useState(true);

  // Formulaire pack
  const [showPackForm, setShowPackForm] = useState(false);
  const [packName, setPackName] = useState('');
  const [packDesc, setPackDesc] = useState('');
  const [packMode, setPackMode] = useState<'qcm' | 'buzz'>('qcm');
  const [packSaving, setPackSaving] = useState(false);

  // Formulaire question
  const [showQForm, setShowQForm] = useState(false);
  const [editingQ, setEditingQ] = useState<CustomQuestion | null>(null);
  const [qText, setQText] = useState('');
  const [qChoices, setQChoices] = useState(['', '', '', '']);
  const [qCorrect, setQCorrect] = useState<0|1|2|3>(0);
  const [qSaving, setQSaving] = useState(false);

  const limits = TIER_LIMITS[tier];

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user || user.is_anonymous) { router.push('/login'); return; }
      setUserId(user.id);

      const { data: profile } = await supabase.from('profiles').select('subscription_tier').eq('id', user.id).single();
      const userTier = (profile?.subscription_tier as SubscriptionTier) ?? 'free';

      // Les gratuits n'ont pas accès aux questions personnalisées
      if (!TIER_LIMITS[userTier].canCreate) {
        router.replace('/pricing');
        return;
      }

      setTier(userTier);
      await loadPacks(user.id);
      setLoading(false);
    };
    load();
  }, []);

  const loadPacks = async (uid: string) => {
    const { data } = await supabase
      .from('question_packs')
      .select('*')
      .eq('owner_id', uid)
      .order('created_at', { ascending: false });

    if (!data) return;

    const withCounts = await Promise.all(data.map(async (p) => {
      const { count } = await supabase
        .from('custom_questions')
        .select('id', { count: 'exact', head: true })
        .eq('pack_id', p.id);
      return { ...p, question_count: count ?? 0 };
    }));
    setPacks(withCounts as any);
  };

  const loadQuestions = async (packId: string) => {
    const { data } = await supabase
      .from('custom_questions')
      .select('*')
      .eq('pack_id', packId)
      .order('created_at', { ascending: true });
    if (data) setQuestions(data as CustomQuestion[]);
  };

  const openPack = async (pack: QuestionPack) => {
    setSelectedPack(pack);
    await loadQuestions(pack.id);
    setView('questions');
  };

  // === CRUD PACKS ===
  const createPack = async () => {
    if (!packName.trim() || !userId) return;
    if (!limits.canCreate) return; // Sécurité : gratuit bloqué
    if (limits.maxPacks !== Infinity && packs.length >= limits.maxPacks) return; // Pro : max 5 packs
    setPackSaving(true);
    const { data } = await supabase.from('question_packs').insert({
      owner_id: userId,
      name: packName.trim(),
      description: packDesc.trim(),
      mode: packMode,
    }).select('*').single();
    if (data) {
      await loadPacks(userId);
      setShowPackForm(false);
      setPackName(''); setPackDesc(''); setPackMode('qcm');
    }
    setPackSaving(false);
  };

  const deletePack = async (packId: string) => {
    if (!confirm('Supprimer ce pack et toutes ses questions ?')) return;
    await supabase.from('question_packs').delete().eq('id', packId);
    if (userId) await loadPacks(userId);
  };

  // === CRUD QUESTIONS ===
  const openQForm = (q?: CustomQuestion) => {
    if (q) {
      setEditingQ(q);
      setQText(q.question);
      setQChoices([q.choice_a, q.choice_b, q.choice_c, q.choice_d]);
      setQCorrect(q.correct_index);
    } else {
      setEditingQ(null);
      setQText(''); setQChoices(['', '', '', '']); setQCorrect(0);
    }
    setShowQForm(true);
  };

  const saveQuestion = async () => {
    if (!selectedPack || !userId || !qText.trim() || qChoices.some(c => !c.trim())) return;
    if (!limits.canCreate) return; // Sécurité : gratuit bloqué
    // Pro : max 30 questions par pack (sauf si on modifie une question existante)
    if (!editingQ && limits.maxQuestionsPerPack !== Infinity && questions.length >= limits.maxQuestionsPerPack) return;
    setQSaving(true);
    const payload = {
      pack_id: selectedPack.id,
      owner_id: userId,
      question: qText.trim(),
      choice_a: qChoices[0].trim(),
      choice_b: qChoices[1].trim(),
      choice_c: qChoices[2].trim(),
      choice_d: qChoices[3].trim(),
      correct_index: qCorrect,
    };
    if (editingQ) {
      await supabase.from('custom_questions').update(payload).eq('id', editingQ.id);
    } else {
      await supabase.from('custom_questions').insert(payload);
    }
    await loadQuestions(selectedPack.id);
    setShowQForm(false);
    setQSaving(false);
  };

  const deleteQuestion = async (qId: string) => {
    if (!confirm('Supprimer cette question ?')) return;
    await supabase.from('custom_questions').delete().eq('id', qId);
    if (selectedPack) await loadQuestions(selectedPack.id);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen" style={{ background: '#0D1B3E' }}>
      <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
        style={{ borderColor: '#8B5CF6', borderTopColor: 'transparent' }} />
    </div>
  );

  const tc = TIER_COLORS[tier];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 50%, #0D1B3E 100%)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
        <div className="flex items-center gap-3">
          {view === 'questions' ? (
            <button onClick={() => setView('packs')}
              className="text-sm font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(240,244,255,0.6)' }}>
              ← Packs
            </button>
          ) : (
            <Link href="/">
              <MuzquizLogo width={50} textSize="1rem" horizontal />
            </Link>
          )}
          <span className="text-sm font-bold" style={{ color: 'rgba(240,244,255,0.5)' }}>
            {view === 'packs' ? '📦 Mes packs' : `📝 ${selectedPack?.name}`}
          </span>
        </div>

        {/* Badge tier */}
        <span className="text-xs font-black px-3 py-1.5 rounded-full"
          style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.text}44` }}>
          {tc.label}
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* ===== VUE PACKS ===== */}
        {view === 'packs' && (
          <>
            {/* Bloc accès restreint pour le tier gratuit */}
            {!limits.canCreate && (
              <div className="muz-card p-6 mb-6 text-center"
                style={{ border: '1px solid rgba(245,158,11,0.3)', background: 'rgba(245,158,11,0.06)' }}>
                <div className="text-3xl mb-2">🔒</div>
                <h3 className="font-black text-lg mb-1" style={{ color: '#F59E0B' }}>Fonctionnalité Pro & Premium</h3>
                <p className="text-sm mb-4" style={{ color: 'rgba(240,244,255,0.5)' }}>
                  Passe à un abonnement supérieur pour créer tes propres packs de questions.
                </p>
                <Link href="/pricing" className="muz-btn-pink px-6 py-3 rounded-xl font-black text-sm inline-block">
                  Voir les abonnements →
                </Link>
              </div>
            )}

            {/* Barre limite */}
            {limits.canCreate && (
              <div className="flex items-center justify-between mb-5 px-1">
                <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>
                  <span style={{ color: '#F0F4FF', fontWeight: 700 }}>{packs.length}</span>
                  {limits.maxPacks === Infinity ? '' : ` / ${limits.maxPacks}`} pack{packs.length !== 1 ? 's' : ''}
                </p>
                {(limits.maxPacks === Infinity || packs.length < limits.maxPacks) && (
                  <button onClick={() => setShowPackForm(true)}
                    className="muz-btn-pink px-4 py-2 rounded-xl font-black text-sm">
                    + Nouveau pack
                  </button>
                )}
              </div>
            )}

            {/* Formulaire nouveau pack */}
            {showPackForm && (
              <div className="muz-card p-5 mb-4 muz-pop">
                <h3 className="font-black mb-4" style={{ color: '#F0F4FF' }}>Nouveau pack</h3>
                <div className="flex flex-col gap-3">
                  <input value={packName} onChange={e => setPackName(e.target.value)}
                    placeholder="Nom du pack (ex: Cinéma années 80)" style={inputStyle(false)} />
                  <input value={packDesc} onChange={e => setPackDesc(e.target.value)}
                    placeholder="Description (optionnel)" style={inputStyle(false)} />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2"
                      style={{ color: 'rgba(240,244,255,0.35)' }}>Mode de jeu</p>
                    <div className="flex gap-2">
                      {(['qcm', 'buzz'] as const).map(m => (
                        <button key={m} onClick={() => setPackMode(m)}
                          className="flex-1 py-2 rounded-xl text-sm font-bold transition-all"
                          style={{
                            background: packMode === m ? '#8B5CF6' : 'rgba(255,255,255,0.06)',
                            color: packMode === m ? 'white' : 'rgba(240,244,255,0.5)',
                            border: `1px solid ${packMode === m ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                          }}>
                          {MODE_LABEL[m]}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => setShowPackForm(false)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(240,244,255,0.5)' }}>
                      Annuler
                    </button>
                    <button onClick={createPack} disabled={!packName.trim() || packSaving}
                      className="flex-1 muz-btn-cyan py-2.5 rounded-xl font-black text-sm disabled:opacity-50">
                      {packSaving ? '...' : 'Créer →'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Liste des packs */}
            {packs.length === 0 && limits.canCreate && !showPackForm && (
              <div className="muz-card p-8 text-center">
                <div className="text-4xl mb-3">📦</div>
                <p className="font-bold mb-1" style={{ color: '#F0F4FF' }}>Aucun pack pour l'instant</p>
                <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>Crée ton premier pack de questions !</p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {packs.map(pack => (
                <div key={pack.id} className="muz-card p-4 flex items-center gap-4 cursor-pointer transition-all hover:scale-[1.01]"
                  onClick={() => openPack(pack)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-base" style={{ color: '#F0F4FF' }}>{pack.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{ background: 'rgba(139,92,246,0.12)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.25)' }}>
                        {MODE_LABEL[pack.mode]}
                      </span>
                    </div>
                    {pack.description && (
                      <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(240,244,255,0.4)' }}>{pack.description}</p>
                    )}
                    <p className="text-xs mt-1 font-bold" style={{ color: 'rgba(240,244,255,0.35)' }}>
                      {pack.question_count} question{pack.question_count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={e => { e.stopPropagation(); deletePack(pack.id); }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all hover:scale-110"
                      style={{ background: 'rgba(255,0,170,0.1)', color: '#FF00AA' }}>
                      🗑
                    </button>
                    <span style={{ color: 'rgba(240,244,255,0.3)', fontSize: '1.2rem' }}>›</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ===== VUE QUESTIONS ===== */}
        {view === 'questions' && selectedPack && (
          <>
            <div className="flex items-center justify-between mb-5 px-1">
              <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>
                <span style={{ color: '#F0F4FF', fontWeight: 700 }}>{questions.length}</span>
                {limits.maxQuestionsPerPack !== Infinity ? ` / ${limits.maxQuestionsPerPack}` : ''} question{questions.length !== 1 ? 's' : ''}
              </p>
              {(limits.maxQuestionsPerPack === Infinity || questions.length < limits.maxQuestionsPerPack) && (
                <button onClick={() => openQForm()}
                  className="muz-btn-pink px-4 py-2 rounded-xl font-black text-sm">
                  + Question
                </button>
              )}
            </div>

            {/* Formulaire question */}
            {showQForm && (
              <div className="muz-card p-5 mb-4 muz-pop">
                <h3 className="font-black mb-4" style={{ color: '#F0F4FF' }}>
                  {editingQ ? 'Modifier la question' : 'Nouvelle question'}
                </h3>
                <div className="flex flex-col gap-3">
                  <textarea value={qText} onChange={e => setQText(e.target.value)}
                    placeholder="La question..."
                    rows={2}
                    style={{ ...inputStyle(false), resize: 'none' }} />

                  <p className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: 'rgba(240,244,255,0.35)' }}>Réponses (clique sur la lettre pour marquer comme correcte)</p>

                  {qChoices.map((c, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <button onClick={() => setQCorrect(i as 0|1|2|3)}
                        className="w-9 h-9 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 transition-all"
                        style={{
                          background: qCorrect === i ? '#00E5D1' : 'rgba(255,255,255,0.08)',
                          color: qCorrect === i ? '#0D1B3E' : 'rgba(240,244,255,0.5)',
                          border: qCorrect === i ? 'none' : '1px solid rgba(255,255,255,0.1)',
                          boxShadow: qCorrect === i ? '0 0 12px rgba(0,229,209,0.4)' : 'none',
                        }}>
                        {LABELS[i]}
                      </button>
                      <input value={c} onChange={e => setQChoices(prev => prev.map((x, j) => j === i ? e.target.value : x))}
                        placeholder={`Réponse ${LABELS[i]}`}
                        style={{ ...inputStyle(false), flex: 1 }} />
                    </div>
                  ))}

                  <div className="flex gap-2 mt-1">
                    <button onClick={() => setShowQForm(false)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                      style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(240,244,255,0.5)' }}>
                      Annuler
                    </button>
                    <button onClick={saveQuestion}
                      disabled={!qText.trim() || qChoices.some(c => !c.trim()) || qSaving}
                      className="flex-1 muz-btn-cyan py-2.5 rounded-xl font-black text-sm disabled:opacity-50">
                      {qSaving ? '...' : editingQ ? 'Sauvegarder' : 'Ajouter →'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Liste questions */}
            {questions.length === 0 && !showQForm && (
              <div className="muz-card p-8 text-center">
                <div className="text-4xl mb-3">📝</div>
                <p className="font-bold mb-1" style={{ color: '#F0F4FF' }}>Aucune question</p>
                <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>Ajoute ta première question !</p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {questions.map((q, idx) => (
                <div key={q.id} className="muz-card p-4">
                  <div className="flex items-start gap-3">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5"
                      style={{ background: 'rgba(139,92,246,0.2)', color: '#8B5CF6' }}>
                      {idx + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm mb-2" style={{ color: '#F0F4FF' }}>{q.question}</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {[q.choice_a, q.choice_b, q.choice_c, q.choice_d].map((choice, i) => (
                          <div key={i} className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs"
                            style={{
                              background: q.correct_index === i ? 'rgba(0,229,209,0.12)' : 'rgba(255,255,255,0.04)',
                              border: `1px solid ${q.correct_index === i ? 'rgba(0,229,209,0.3)' : 'rgba(255,255,255,0.06)'}`,
                              color: q.correct_index === i ? '#00E5D1' : 'rgba(240,244,255,0.5)',
                            }}>
                            <span className="font-black">{LABELS[i]}</span>
                            <span className="truncate">{choice}</span>
                            {q.correct_index === i && <span className="ml-auto">✓</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-1 flex-shrink-0">
                      <button onClick={() => openQForm(q)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all hover:scale-110"
                        style={{ background: 'rgba(139,92,246,0.12)', color: '#8B5CF6' }}>✏</button>
                      <button onClick={() => deleteQuestion(q.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs transition-all hover:scale-110"
                        style={{ background: 'rgba(255,0,170,0.1)', color: '#FF00AA' }}>🗑</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
