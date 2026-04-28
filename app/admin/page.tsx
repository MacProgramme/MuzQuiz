// app/admin/page.tsx
"use client";

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { SubscriptionTier } from '@/types';
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

const ADMIN_EMAILS = ['antoine.gegedu27@gmail.com', 'dimitte-14@hotmail.fr'];

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserProfile {
  id: string;
  nickname: string;
  avatar_color: string;
  subscription_tier: SubscriptionTier;
  created_at: string;
}

type QuestionType = 'normal' | 'image' | 'blur_reveal';

interface QuizQuestion {
  question: string;
  choices: string[];
  correct: number;
  image_url?: string | null;
  question_type?: QuestionType;
}

interface DailyQuizEntry {
  id: string;
  date: string;
  theme: string;
  questions: QuizQuestion[];
  created_at: string;
}

const TIER_OPTIONS: { value: SubscriptionTier; label: string; color: string }[] = [
  { value: 'free',    label: 'Gratuit',  color: 'rgba(240,244,255,0.5)' },
  { value: 'pro',     label: 'Pro',      color: '#00E5D1' },
  { value: 'premium', label: 'Premium',  color: '#F59E0B' },
];

type AdminTab = 'users' | 'quizzes';

// ─── CSV Parser ───────────────────────────────────────────────────────────────

function parseQuizCSV(text: string): { date: string; theme: string; questions: QuizQuestion[] }[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const sep = lines[0].includes(';') ? ';' : ',';
  const headers = lines[0].split(sep).map(h => h.trim().toLowerCase().replace(/['"]/g, ''));

  const idx = {
    date:     headers.findIndex(h => h === 'date'),
    theme:    headers.findIndex(h => h === 'theme'),
    question: headers.findIndex(h => ['question', 'q'].includes(h)),
    a:        headers.findIndex(h => ['choix_a', 'choice_a', 'a', 'reponse_a'].includes(h)),
    b:        headers.findIndex(h => ['choix_b', 'choice_b', 'b', 'reponse_b'].includes(h)),
    c:        headers.findIndex(h => ['choix_c', 'choice_c', 'c', 'reponse_c'].includes(h)),
    d:        headers.findIndex(h => ['choix_d', 'choice_d', 'd', 'reponse_d'].includes(h)),
    correct:  headers.findIndex(h => ['correct', 'correct_index', 'bonne_reponse'].includes(h)),
  };

  const byDate = new Map<string, { theme: string; questions: QuizQuestion[] }>();

  for (let i = 1; i < lines.length; i++) {
    const raw = lines[i];
    if (!raw.trim()) continue;
    const cols = raw.split(sep).map(c => c.trim().replace(/^["']|["']$/g, ''));
    if (cols.length < 7) continue;

    const date    = idx.date    >= 0 ? cols[idx.date]    : '';
    const theme   = idx.theme   >= 0 ? cols[idx.theme]   : 'Quiz';
    const question = idx.question >= 0 ? cols[idx.question] : '';
    const choices  = [
      idx.a >= 0 ? cols[idx.a] : '',
      idx.b >= 0 ? cols[idx.b] : '',
      idx.c >= 0 ? cols[idx.c] : '',
      idx.d >= 0 ? cols[idx.d] : '',
    ];
    const correct = idx.correct >= 0 ? parseInt(cols[idx.correct], 10) : 0;

    if (!date || !question) continue;

    if (!byDate.has(date)) byDate.set(date, { theme, questions: [] });
    const entry = byDate.get(date)!;
    if (entry.questions.length < 10) {
      entry.questions.push({ question, choices, correct: isNaN(correct) ? 0 : correct });
    }
  }

  return Array.from(byDate.entries())
    .map(([date, val]) => ({ date, ...val }))
    .filter(q => q.questions.length >= 5);
}

// ─── Composant principal ───────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter();
  const [adminTab, setAdminTab] = useState<AdminTab>('users');

  // ── Utilisateurs
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState<string | null>(null);

  // ── Quiz du Jour
  const [quizzes, setQuizzes] = useState<DailyQuizEntry[]>([]);
  const [quizzesLoading, setQuizzesLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // ── Création manuelle
  const [showCreate, setShowCreate] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newTheme, setNewTheme] = useState('');
  const [newQuestions, setNewQuestions] = useState<QuizQuestion[]>(
    Array.from({ length: 10 }, () => ({ question: '', choices: ['', '', '', ''], correct: 0 }))
  );
  const [createSaving, setCreateSaving] = useState(false);
  const [createError, setCreateError] = useState('');

  // ── Upload image (Quiz du Jour)
  const [uploadingImgIdx, setUploadingImgIdx] = useState<number | null>(null);
  const imgInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── Import CSV
  const csvRef = useRef<HTMLInputElement>(null);
  const [csvPreview, setCsvPreview] = useState<{ date: string; theme: string; questions: QuizQuestion[] }[]>([]);
  const [csvImporting, setCsvImporting] = useState(false);
  const [csvMsg, setCsvMsg] = useState('');

  // ─── Chargement initial ───────────────────────────────────────────────────

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) { router.push('/'); return; }

      const { data: profiles } = await supabase
        .from('profiles').select('*').order('created_at', { ascending: false });
      if (profiles) setUsers(profiles as UserProfile[]);
      setLoading(false);
    };
    load();
  }, []);

  const loadQuizzes = async () => {
    setQuizzesLoading(true);
    const { data } = await supabase
      .from('daily_quizzes')
      .select('*')
      .order('date', { ascending: false });
    if (data) setQuizzes(data as DailyQuizEntry[]);
    setQuizzesLoading(false);
  };

  useEffect(() => {
    if (adminTab === 'quizzes') loadQuizzes();
  }, [adminTab]);

  // ─── Utilisateurs ─────────────────────────────────────────────────────────

  const changeTier = async (userId: string, tier: SubscriptionTier) => {
    setSaving(userId);
    await supabase.from('profiles').update({ subscription_tier: tier }).eq('id', userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, subscription_tier: tier } : u));
    setSaving(null);
  };

  const filtered = users.filter(u => u.nickname.toLowerCase().includes(search.toLowerCase()));
  const counts = {
    free:    users.filter(u => u.subscription_tier === 'free').length,
    pro:     users.filter(u => u.subscription_tier === 'pro').length,
    premium: users.filter(u => u.subscription_tier === 'premium').length,
  };

  // ─── Quiz — suppression ───────────────────────────────────────────────────

  const deleteQuiz = async (id: string) => {
    if (!confirm('Supprimer ce quiz ?')) return;
    setDeletingId(id);
    await supabase.from('daily_quizzes').delete().eq('id', id);
    setQuizzes(prev => prev.filter(q => q.id !== id));
    setDeletingId(null);
  };

  // ─── Quiz — création manuelle ─────────────────────────────────────────────

  const updateQuestion = (i: number, field: 'question' | 'correct' | 'question_type' | 'image_url', val: string | number | null) => {
    setNewQuestions(prev => prev.map((q, idx) => idx === i ? { ...q, [field]: val } : q));
  };
  const updateChoice = (qi: number, ci: number, val: string) => {
    setNewQuestions(prev => prev.map((q, idx) => idx === qi
      ? { ...q, choices: q.choices.map((c, ci2) => ci2 === ci ? val : c) }
      : q
    ));
  };

  const uploadAdminImage = async (file: File, qi: number) => {
    setUploadingImgIdx(qi);
    try {
      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `admin/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from('question-images')
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) { console.error('Upload:', error.message); return; }
      const { data: urlData } = supabase.storage.from('question-images').getPublicUrl(path);
      updateQuestion(qi, 'image_url', urlData.publicUrl);
    } finally {
      setUploadingImgIdx(null);
    }
  };

  const saveManual = async () => {
    setCreateError('');
    if (!newDate) { setCreateError('Date requise'); return; }
    if (!newTheme.trim()) { setCreateError('Thème requis'); return; }
    const valid = newQuestions.filter(q => q.question.trim() && q.choices.every(c => c.trim()));
    if (valid.length < 5) { setCreateError('Minimum 5 questions complètes requises'); return; }

    setCreateSaving(true);
    const { data, error } = await supabase
      .from('daily_quizzes')
      .insert({ date: newDate, theme: newTheme.trim(), questions: valid.slice(0, 10) })
      .select('*')
      .single();

    if (error) {
      setCreateError(error.code === '23505' ? 'Un quiz existe déjà pour cette date.' : error.message);
    } else if (data) {
      setQuizzes(prev => [data as DailyQuizEntry, ...prev].sort((a, b) => b.date.localeCompare(a.date)));
      setShowCreate(false);
      setNewDate('');
      setNewTheme('');
      setNewQuestions(Array.from({ length: 10 }, () => ({ question: '', choices: ['', '', '', ''], correct: 0 })));
    }
    setCreateSaving(false);
  };

  // ─── Quiz — import CSV ────────────────────────────────────────────────────

  const handleCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCsvMsg('');
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      const parsed = parseQuizCSV(text);
      if (parsed.length === 0) {
        setCsvMsg('❌ Aucun quiz valide trouvé (minimum 5 questions par date).');
      } else {
        setCsvPreview(parsed);
      }
    };
    reader.readAsText(file, 'UTF-8');
    e.target.value = '';
  };

  const importCSV = async () => {
    if (csvPreview.length === 0) return;
    setCsvImporting(true);
    setCsvMsg('');
    let ok = 0, skip = 0;
    for (const quiz of csvPreview) {
      const { error } = await supabase
        .from('daily_quizzes')
        .insert({ date: quiz.date, theme: quiz.theme, questions: quiz.questions });
      if (error?.code === '23505') skip++;
      else if (!error) ok++;
    }
    setCsvPreview([]);
    setCsvMsg(`✅ ${ok} quiz importé${ok > 1 ? 's' : ''}${skip > 0 ? ` · ${skip} ignoré${skip > 1 ? 's' : ''} (date déjà existante)` : ''}`);
    await loadQuizzes();
    setCsvImporting(false);
  };

  // ─── Télécharger le template CSV ─────────────────────────────────────────

  const downloadTemplate = () => {
    const rows = [
      'date,theme,question,choix_a,choix_b,choix_c,choix_d,correct',
      '2026-05-01,Histoire de France,Qui a construit la Tour Eiffel ?,Gustave Eiffel,Victor Hugo,Napoléon Bonaparte,Haussmann,0',
      '2026-05-01,Histoire de France,En quelle année fut la Révolution française ?,1789,1804,1815,1848,0',
      '2026-05-01,Histoire de France,Quel roi fut guillotiné en 1793 ?,Louis XVI,Louis XIV,Charles X,Henri IV,0',
      '2026-05-02,Cinéma,Quel réalisateur a fait Titanic ?,James Cameron,Steven Spielberg,Christopher Nolan,Ridley Scott,0',
    ].join('\n');
    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'quiz_du_jour_template.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  // ─── Statut d'une date ────────────────────────────────────────────────────

  const today = new Date().toLocaleDateString('fr-CA');
  const dateStatus = (date: string) => {
    if (date === today) return { label: 'Aujourd\'hui', color: '#00E5D1', bg: 'rgba(0,229,209,0.12)' };
    if (date > today) return { label: 'Planifié', color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' };
    return { label: 'Passé', color: 'rgba(240,244,255,0.3)', bg: 'rgba(255,255,255,0.05)' };
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  if (loading) return (
    <div className="flex items-center justify-center h-screen" style={{ background: '#0D1B3E' }}>
      <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
        style={{ borderColor: '#FF00AA', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 50%, #0D1B3E 100%)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,0,170,0.2)' }}>
        <div className="flex items-center gap-3">
          <Link href="/"><MuzquizLogo width={60} textSize="1.1rem" horizontal /></Link>
          <span className="text-xs font-black px-3 py-1 rounded-full"
            style={{ background: 'rgba(255,0,170,0.15)', color: '#FF00AA', border: '1px solid rgba(255,0,170,0.3)' }}>
            Admin
          </span>
        </div>
        <Link href="/profile" className="text-sm font-bold" style={{ color: 'rgba(240,244,255,0.4)' }}>
          ← Mon profil
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Tabs */}
        <div className="flex mb-8 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {([
            { key: 'users',   label: '👥 Utilisateurs' },
            { key: 'quizzes', label: '🧠 Quiz du Jour' },
          ] as { key: AdminTab; label: string }[]).map(t => (
            <button key={t.key} onClick={() => setAdminTab(t.key)}
              className="flex-1 py-3 text-sm font-bold transition-all"
              style={{
                background: adminTab === t.key ? '#FF00AA' : 'transparent',
                color: adminTab === t.key ? 'white' : 'rgba(240,244,255,0.5)',
                borderRadius: '0.6rem',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══════════════ ONGLET UTILISATEURS ══════════════ */}
        {adminTab === 'users' && (
          <>
            <h1 className="text-2xl font-black mb-2" style={{ color: '#F0F4FF' }}>Gestion des utilisateurs</h1>
            <p className="text-sm mb-6" style={{ color: 'rgba(240,244,255,0.4)' }}>
              {users.length} compte{users.length > 1 ? 's' : ''} enregistré{users.length > 1 ? 's' : ''}
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[
                { label: 'Gratuit', value: counts.free,    color: 'rgba(240,244,255,0.5)' },
                { label: 'Pro',     value: counts.pro,     color: '#00E5D1' },
                { label: 'Premium', value: counts.premium, color: '#F59E0B' },
              ].map(s => (
                <div key={s.label} className="muz-card p-4 text-center">
                  <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs font-bold mt-1" style={{ color: 'rgba(240,244,255,0.4)' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher un pseudo..."
              className="w-full px-4 py-3 rounded-xl font-medium outline-none mb-4"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(139,92,246,0.25)', color: '#F0F4FF' }}
            />

            <div className="flex flex-col gap-3">
              {filtered.map(user => {
                const initial = user.nickname[0]?.toUpperCase() ?? '?';
                return (
                  <div key={user.id} className="muz-card p-4 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-lg flex-shrink-0"
                      style={{ background: user.avatar_color, color: '#0D1B3E' }}>
                      {initial}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm" style={{ color: '#F0F4FF' }}>{user.nickname}</p>
                      <p className="text-xs" style={{ color: 'rgba(240,244,255,0.35)' }}>
                        {new Date(user.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      {TIER_OPTIONS.map(tier => (
                        <button key={tier.value}
                          onClick={() => changeTier(user.id, tier.value)}
                          disabled={saving === user.id || user.subscription_tier === tier.value}
                          className="px-3 py-1.5 rounded-lg text-xs font-black transition-all"
                          style={{
                            background: user.subscription_tier === tier.value
                              ? tier.value === 'free' ? 'rgba(255,255,255,0.12)' : tier.value === 'pro' ? 'rgba(0,229,209,0.2)' : 'rgba(245,158,11,0.2)'
                              : 'rgba(255,255,255,0.04)',
                            color: user.subscription_tier === tier.value ? tier.color : 'rgba(240,244,255,0.3)',
                            border: `1px solid ${user.subscription_tier === tier.value ? tier.color + '55' : 'rgba(255,255,255,0.07)'}`,
                            cursor: user.subscription_tier === tier.value ? 'default' : 'pointer',
                          }}>
                          {tier.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <div className="muz-card p-8 text-center">
                  <p className="font-bold" style={{ color: 'rgba(240,244,255,0.5)' }}>Aucun résultat pour "{search}"</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* ══════════════ ONGLET QUIZ DU JOUR ══════════════ */}
        {adminTab === 'quizzes' && (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-black" style={{ color: '#F0F4FF' }}>Quiz du Jour</h1>
                <p className="text-sm mt-0.5" style={{ color: 'rgba(240,244,255,0.4)' }}>
                  {quizzes.length} quiz planifié{quizzes.length > 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex gap-2">
                <button onClick={downloadTemplate}
                  className="text-xs font-bold px-3 py-2 rounded-xl transition-all hover:opacity-80"
                  style={{ background: 'rgba(0,229,209,0.1)', color: '#00E5D1', border: '1px solid rgba(0,229,209,0.25)' }}>
                  ⬇ Template CSV
                </button>
                <button onClick={() => { setCsvPreview([]); setCsvMsg(''); csvRef.current?.click(); }}
                  className="text-xs font-bold px-3 py-2 rounded-xl transition-all hover:opacity-80"
                  style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.25)' }}>
                  📂 Importer CSV
                </button>
                <button onClick={() => { setShowCreate(v => !v); setCreateError(''); }}
                  className="text-xs font-bold px-3 py-2 rounded-xl transition-all hover:opacity-80"
                  style={{ background: showCreate ? 'rgba(255,0,170,0.2)' : 'rgba(255,0,170,0.1)', color: '#FF00AA', border: '1px solid rgba(255,0,170,0.3)' }}>
                  {showCreate ? '✕ Annuler' : '+ Créer'}
                </button>
              </div>
            </div>

            <input ref={csvRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleCSV} />

            {/* Message CSV */}
            {csvMsg && (
              <div className="muz-card p-4 mb-4 text-sm font-bold text-center" style={{ color: '#F0F4FF' }}>
                {csvMsg}
              </div>
            )}

            {/* Prévisualisation CSV */}
            {csvPreview.length > 0 && (
              <div className="muz-card p-5 mb-6" style={{ border: '1.5px solid rgba(139,92,246,0.3)' }}>
                <p className="font-black text-sm mb-3" style={{ color: '#8B5CF6' }}>
                  📋 Aperçu — {csvPreview.length} quiz à importer
                </p>
                <div className="flex flex-col gap-2 mb-4">
                  {csvPreview.map((q, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-2 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div>
                        <span className="font-black text-xs" style={{ color: '#F0F4FF' }}>{q.date}</span>
                        <span className="mx-2 text-xs" style={{ color: 'rgba(240,244,255,0.3)' }}>·</span>
                        <span className="text-xs" style={{ color: 'rgba(240,244,255,0.6)' }}>{q.theme}</span>
                      </div>
                      <span className="text-xs font-bold" style={{ color: '#00E5D1' }}>{q.questions.length} questions</span>
                    </div>
                  ))}
                </div>
                <button onClick={importCSV} disabled={csvImporting}
                  className="w-full py-3 rounded-xl font-black text-sm transition-all disabled:opacity-50"
                  style={{ background: '#8B5CF6', color: 'white' }}>
                  {csvImporting ? 'Importation...' : `✅ Importer ${csvPreview.length} quiz`}
                </button>
              </div>
            )}

            {/* Formulaire création manuelle */}
            {showCreate && (
              <div className="muz-card p-5 mb-6" style={{ border: '1.5px solid rgba(255,0,170,0.3)' }}>
                <p className="font-black text-sm mb-4" style={{ color: '#FF00AA' }}>✏️ Nouveau quiz</p>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest block mb-1.5"
                      style={{ color: 'rgba(240,244,255,0.4)' }}>Date</label>
                    <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,0,170,0.3)', color: '#F0F4FF' }} />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-widest block mb-1.5"
                      style={{ color: 'rgba(240,244,255,0.4)' }}>Thème</label>
                    <input value={newTheme} onChange={e => setNewTheme(e.target.value)}
                      placeholder="ex: Histoire de France"
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,0,170,0.3)', color: '#F0F4FF' }} />
                  </div>
                </div>

                <div className="flex flex-col gap-4 mb-4">
                  {newQuestions.map((q, qi) => (
                    <div key={qi} className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-black px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(255,0,170,0.15)', color: '#FF00AA' }}>Q{qi + 1}</span>
                        <input value={q.question} onChange={e => updateQuestion(qi, 'question', e.target.value)}
                          placeholder="Texte de la question"
                          className="flex-1 px-3 py-2 rounded-lg text-sm outline-none"
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#F0F4FF' }} />
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        {q.choices.map((c, ci) => (
                          <div key={ci} className="flex items-center gap-1.5">
                            <span className="text-xs font-black w-5 text-center flex-shrink-0"
                              style={{ color: q.correct === ci ? '#00E5D1' : 'rgba(240,244,255,0.3)' }}>
                              {['A', 'B', 'C', 'D'][ci]}
                            </span>
                            <input value={c} onChange={e => updateChoice(qi, ci, e.target.value)}
                              placeholder={`Choix ${['A', 'B', 'C', 'D'][ci]}`}
                              className="flex-1 px-2 py-1.5 rounded-lg text-xs outline-none"
                              style={{
                                background: q.correct === ci ? 'rgba(0,229,209,0.08)' : 'rgba(255,255,255,0.05)',
                                border: `1px solid ${q.correct === ci ? 'rgba(0,229,209,0.3)' : 'rgba(255,255,255,0.08)'}`,
                                color: '#F0F4FF',
                              }} />
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs" style={{ color: 'rgba(240,244,255,0.4)' }}>Bonne réponse :</span>
                        {['A', 'B', 'C', 'D'].map((l, ci) => (
                          <button key={ci} onClick={() => updateQuestion(qi, 'correct', ci)}
                            className="w-7 h-7 rounded-lg text-xs font-black transition-all"
                            style={{
                              background: q.correct === ci ? '#00E5D1' : 'rgba(255,255,255,0.06)',
                              color: q.correct === ci ? '#0D1B3E' : 'rgba(240,244,255,0.4)',
                            }}>
                            {l}
                          </button>
                        ))}
                      </div>

                      {/* Type de question */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs" style={{ color: 'rgba(240,244,255,0.4)' }}>Type :</span>
                        {([
                          { value: 'normal',     label: '📝 Normal' },
                          { value: 'image',      label: '🖼️ Image' },
                          { value: 'blur_reveal', label: '🔍 Flou' },
                        ] as { value: QuestionType; label: string }[]).map(opt => (
                          <button key={opt.value}
                            onClick={() => {
                              updateQuestion(qi, 'question_type', opt.value);
                              if (opt.value === 'normal') updateQuestion(qi, 'image_url', null);
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold transition-all"
                            style={{
                              background: (q.question_type ?? 'normal') === opt.value ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.05)',
                              color: (q.question_type ?? 'normal') === opt.value ? '#8B5CF6' : 'rgba(240,244,255,0.35)',
                              border: `1px solid ${(q.question_type ?? 'normal') === opt.value ? 'rgba(139,92,246,0.4)' : 'rgba(255,255,255,0.07)'}`,
                            }}>
                            {opt.label}
                          </button>
                        ))}
                      </div>

                      {/* Upload image (si type image ou blur) */}
                      {(q.question_type === 'image' || q.question_type === 'blur_reveal') && (
                        <div className="mt-2">
                          <input
                            ref={el => { imgInputRefs.current[qi] = el; }}
                            type="file" accept="image/*" className="hidden"
                            onChange={async e => {
                              const file = e.target.files?.[0];
                              if (file) await uploadAdminImage(file, qi);
                              e.target.value = '';
                            }}
                          />
                          {q.image_url ? (
                            <div className="relative rounded-xl overflow-hidden" style={{ maxHeight: '140px' }}>
                              <img src={q.image_url} alt="" className="w-full object-cover" style={{ maxHeight: '140px' }} />
                              <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 hover:opacity-100 transition-opacity"
                                style={{ background: 'rgba(13,27,62,0.75)' }}>
                                <button onClick={() => imgInputRefs.current[qi]?.click()}
                                  className="px-3 py-1.5 rounded-lg text-xs font-black"
                                  style={{ background: '#8B5CF6', color: 'white' }}>
                                  Changer
                                </button>
                                <button onClick={() => updateQuestion(qi, 'image_url', null)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-black"
                                  style={{ background: 'rgba(255,0,170,0.8)', color: 'white' }}>
                                  Supprimer
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => imgInputRefs.current[qi]?.click()}
                              disabled={uploadingImgIdx === qi}
                              className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                              style={{ background: 'rgba(139,92,246,0.08)', border: '1.5px dashed rgba(139,92,246,0.35)', color: '#8B5CF6' }}>
                              {uploadingImgIdx === qi ? '⏳ Upload...' : '📷 Ajouter une image'}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {createError && (
                  <p className="text-xs font-bold mb-3 text-center" style={{ color: '#FF00AA' }}>{createError}</p>
                )}

                <button onClick={saveManual} disabled={createSaving}
                  className="w-full py-3 rounded-xl font-black text-sm transition-all disabled:opacity-50"
                  style={{ background: '#FF00AA', color: 'white' }}>
                  {createSaving ? 'Enregistrement...' : '💾 Enregistrer le quiz'}
                </button>
              </div>
            )}

            {/* Liste des quiz */}
            {quizzesLoading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
                  style={{ borderColor: '#8B5CF6', borderTopColor: 'transparent' }} />
              </div>
            ) : quizzes.length === 0 ? (
              <div className="muz-card p-10 text-center">
                <p className="text-4xl mb-3">🧠</p>
                <p className="font-black mb-1" style={{ color: '#F0F4FF' }}>Aucun quiz planifié</p>
                <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>
                  Importe un CSV ou crée un quiz manuellement.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {quizzes.map(quiz => {
                  const st = dateStatus(quiz.date);
                  return (
                    <div key={quiz.id} className="muz-card p-4 flex items-center gap-4">
                      {/* Date */}
                      <div className="text-center flex-shrink-0 w-16">
                        <div className="font-black text-base" style={{ color: '#F0F4FF' }}>
                          {new Date(quiz.date + 'T12:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </div>
                        <div className="text-xs font-bold" style={{ color: 'rgba(240,244,255,0.35)' }}>
                          {new Date(quiz.date + 'T12:00:00').getFullYear()}
                        </div>
                      </div>

                      {/* Infos */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-black text-sm" style={{ color: '#F0F4FF' }}>{quiz.theme}</span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                            style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}44` }}>
                            {st.label}
                          </span>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(240,244,255,0.35)' }}>
                          {quiz.questions.length} question{quiz.questions.length > 1 ? 's' : ''}
                        </p>
                      </div>

                      {/* Supprimer */}
                      <button
                        onClick={() => deleteQuiz(quiz.id)}
                        disabled={deletingId === quiz.id}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0 transition-all hover:opacity-80 disabled:opacity-40"
                        style={{ background: 'rgba(255,0,170,0.08)', color: 'rgba(255,0,170,0.6)', border: '1px solid rgba(255,0,170,0.15)' }}>
                        {deletingId === quiz.id ? '...' : '🗑'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
