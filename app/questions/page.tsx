// app/questions/page.tsx
"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { QuestionPack, CustomQuestion, QuestionType, SubscriptionTier, TIER_LIMITS, normalizeTier } from '@/types';
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

type View = 'packs' | 'questions';
type AddMode = 'manual' | 'csv' | 'ai';
type SortKey = 'name' | 'created_at' | 'question_count' | 'mode';

const MODE_LABEL: Record<string, string> = { qcm: 'Quiz', buzz: 'Blind Test' };
const LABELS = ['A', 'B', 'C', 'D'];
const TIER_COLORS: Record<SubscriptionTier, { bg: string; text: string; label: string }> = {
  decouverte: { bg: 'rgba(255,255,255,0.06)',  text: 'rgba(240,244,255,0.5)', label: 'Découverte' },
  essentiel:  { bg: 'rgba(0,229,209,0.12)',    text: '#00E5D1',               label: 'Essentiel'  },
  pro:        { bg: 'rgba(139,92,246,0.12)',   text: '#8B5CF6',               label: 'Pro'        },
  expert:     { bg: 'rgba(245,158,11,0.12)',   text: '#F59E0B',               label: 'Expert'     },
};

function inputStyle(focused = false): React.CSSProperties {
  return {
    background: 'rgba(255,255,255,0.06)',
    border: `1.5px solid ${focused ? '#8B5CF6' : 'rgba(139,92,246,0.25)'}`,
    color: '#F0F4FF',
    borderRadius: '0.75rem',
    padding: '0.625rem 1rem',
    width: '100%',
    outline: 'none',
    fontSize: '0.875rem',
  };
}

// ─── CSV parsing ─────────────────────────────────────────────────────────────
interface ParsedQuestion {
  question: string;
  choice_a: string;
  choice_b: string;
  choice_c: string;
  choice_d: string;
  correct_index: 0 | 1 | 2 | 3;
  _selected: boolean;
}

function parseCSV(text: string): ParsedQuestion[] {
  const lines = text.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  // Détecter le séparateur (virgule ou point-virgule)
  const sep = lines[0].includes(';') ? ';' : ',';
  const header = lines[0].split(sep).map(h => h.trim().toLowerCase().replace(/^["']|["']$/g, ''));

  const idx = {
    q: header.findIndex(h => ['question', 'q'].includes(h)),
    a: header.findIndex(h => ['choix_a', 'choice_a', 'a', 'reponse_a'].includes(h)),
    b: header.findIndex(h => ['choix_b', 'choice_b', 'b', 'reponse_b'].includes(h)),
    c: header.findIndex(h => ['choix_c', 'choice_c', 'c', 'reponse_c'].includes(h)),
    d: header.findIndex(h => ['choix_d', 'choice_d', 'd', 'reponse_d'].includes(h)),
    correct: header.findIndex(h => ['correct', 'correct_index', 'bonne_reponse', 'answer'].includes(h)),
  };

  // Fallback : ordre positionnel si les colonnes ne sont pas trouvées
  if (idx.q < 0) idx.q = 0;
  if (idx.a < 0) idx.a = 1;
  if (idx.b < 0) idx.b = 2;
  if (idx.c < 0) idx.c = 3;
  if (idx.d < 0) idx.d = 4;
  if (idx.correct < 0) idx.correct = 5;

  return lines.slice(1).map(line => {
    const cols = line.split(sep).map(c => c.trim().replace(/^["']|["']$/g, ''));
    const raw = cols[idx.correct] ?? '0';
    // Accepte "0"/"1"/"2"/"3" ou "A"/"B"/"C"/"D"
    let ci: 0|1|2|3 = 0;
    if (['a', '0'].includes(raw.toLowerCase())) ci = 0;
    else if (['b', '1'].includes(raw.toLowerCase())) ci = 1;
    else if (['c', '2'].includes(raw.toLowerCase())) ci = 2;
    else if (['d', '3'].includes(raw.toLowerCase())) ci = 3;
    return {
      question: cols[idx.q] ?? '',
      choice_a: cols[idx.a] ?? '',
      choice_b: cols[idx.b] ?? '',
      choice_c: cols[idx.c] ?? '',
      choice_d: cols[idx.d] ?? '',
      correct_index: ci,
      _selected: true,
    };
  }).filter(q => q.question.trim() && q.choice_a.trim());
}

// ─── Composant principal ─────────────────────────────────────────────────────
export default function QuestionsPage() {
  const router = useRouter();
  const [tier, setTier] = useState<SubscriptionTier>('decouverte');
  const [userId, setUserId] = useState<string | null>(null);
  const [packs, setPacks] = useState<(QuestionPack & { question_count: number })[]>([]);
  const [selectedPack, setSelectedPack] = useState<QuestionPack | null>(null);
  const [questions, setQuestions] = useState<CustomQuestion[]>([]);
  const [view, setView] = useState<View>('packs');
  const [loading, setLoading] = useState(true);

  // Mode d'ajout de questions
  const [addMode, setAddMode] = useState<AddMode | null>(null);

  // Formulaire pack
  const [showPackForm, setShowPackForm] = useState(false);
  const [packName, setPackName] = useState('');
  const [packMode, setPackMode] = useState<'qcm' | 'buzz'>('qcm');
  const [packSaving, setPackSaving] = useState(false);

  // Formulaire question manuelle
  const [editingQ, setEditingQ] = useState<CustomQuestion | null>(null);
  const [qText, setQText] = useState('');
  const [qChoices, setQChoices] = useState(['', '', '', '']);
  const [qCorrect, setQCorrect] = useState<0|1|2|3>(0);
  const [qType, setQType] = useState<QuestionType>('normal');
  const [qImageUrl, setQImageUrl] = useState<string | null>(null);
  const [qYoutubeUrl, setQYoutubeUrl] = useState<string>('');  // réutilisé pour l'URL audio
  const [qImageUploading, setQImageUploading] = useState(false);
  const [qAudioUploading, setQAudioUploading] = useState(false);
  const qImageInputRef = useRef<HTMLInputElement>(null);
  const qAudioInputRef = useRef<HTMLInputElement>(null);
  const [qSaving, setQSaving] = useState(false);
  const [qSaveError, setQSaveError] = useState<string | null>(null);

  // Import CSV
  const csvInputRef = useRef<HTMLInputElement>(null);
  const [csvPreview, setCsvPreview] = useState<ParsedQuestion[]>([]);
  const [csvError, setCsvError] = useState('');
  const [csvImporting, setCsvImporting] = useState(false);

  // Tri des packs
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortAsc, setSortAsc] = useState(false);
  const [packSearch, setPackSearch] = useState('');

  // Génération IA
  const [aiTheme, setAiTheme] = useState('');
  const [aiCount, setAiCount] = useState(10);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiPreview, setAiPreview] = useState<ParsedQuestion[]>([]);
  const [aiError, setAiError] = useState('');
  const [aiImporting, setAiImporting] = useState(false);

  // Quota IA mensuel
  const [aiUsesThisMonth, setAiUsesThisMonth] = useState(0);

  const limits = TIER_LIMITS[tier];

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user || user.is_anonymous) { router.push('/login'); return; }
      setUserId(user.id);

      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_tier, ai_uses_count, ai_uses_month')
        .eq('id', user.id)
        .single();

      const userTier = normalizeTier(profile?.subscription_tier);
      setTier(userTier);

      // Calculer les utilisations IA du mois en cours
      const nowMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
      if (profile?.ai_uses_month === nowMonth) {
        setAiUsesThisMonth(profile.ai_uses_count ?? 0);
      } else {
        setAiUsesThisMonth(0);
      }

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
      const { count } = await supabase.from('custom_questions').select('id', { count: 'exact', head: true }).eq('pack_id', p.id);
      return { ...p, question_count: count ?? 0 };
    }));
    setPacks(withCounts as any);
  };

  const loadQuestions = async (packId: string) => {
    const { data } = await supabase.from('custom_questions').select('*').eq('pack_id', packId).order('created_at', { ascending: true });
    if (data) setQuestions(data as CustomQuestion[]);
  };

  const openPack = async (pack: QuestionPack) => {
    setSelectedPack(pack);
    await loadQuestions(pack.id);
    setAddMode(null);
    setView('questions');
  };

  // === CRUD PACKS ===
  const createPack = async () => {
    if (!packName.trim() || !userId) return;
    setPackSaving(true);
    const { data } = await supabase.from('question_packs').insert({
      owner_id: userId, name: packName.trim(), mode: packMode,
    }).select('*').single();
    if (data) { await loadPacks(userId); setShowPackForm(false); setPackName(''); setPackMode('qcm'); }
    setPackSaving(false);
  };

  const deletePack = async (packId: string) => {
    if (!confirm('Supprimer ce pack et toutes ses questions ?')) return;
    await supabase.from('question_packs').delete().eq('id', packId);
    if (userId) await loadPacks(userId);
  };

  // === MANUEL ===
  const openQForm = (q?: CustomQuestion) => {
    if (q) {
      setEditingQ(q);
      setQText(q.question);
      setQChoices([q.choice_a, q.choice_b, q.choice_c, q.choice_d]);
      setQCorrect(q.correct_index);
      setQType(q.question_type ?? 'normal');
      setQImageUrl(q.image_url ?? null);
      setQYoutubeUrl(q.youtube_url ?? '');
    } else {
      setEditingQ(null);
      setQText(''); setQChoices(['', '', '', '']); setQCorrect(0);
      setQYoutubeUrl('');
      setQType('normal'); setQImageUrl(null);
    }
    setAddMode('manual');
  };

  const uploadQuestionImage = async (file: File): Promise<string | null> => {
    if (!userId) return null;
    setQImageUploading(true);
    try {
      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `${userId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from('question-images')
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) { console.error('Upload image:', error.message); return null; }
      const { data: urlData } = supabase.storage.from('question-images').getPublicUrl(path);
      return urlData.publicUrl;
    } finally {
      setQImageUploading(false);
    }
  };

  const handleQImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadQuestionImage(file);
    if (url) setQImageUrl(url);
    e.target.value = '';
  };

  const uploadAudio = async (file: File): Promise<string | null> => {
    if (!userId) return null;
    setQAudioUploading(true);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase() ?? 'mp3';
      const path = `audio/${userId}/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage
        .from('question-images')
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) { console.error('Upload audio:', error.message); return null; }
      const { data: urlData } = supabase.storage.from('question-images').getPublicUrl(path);
      return urlData.publicUrl;
    } finally {
      setQAudioUploading(false);
    }
  };

  const handleQAudioChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadAudio(file);
    if (url) setQYoutubeUrl(url);  // stocké dans la colonne youtube_url
    e.target.value = '';
  };

  const saveQuestion = async () => {
    if (!selectedPack || !userId || !qText.trim() || qChoices.some(c => !c.trim())) return;
    // Pas de limite de questions par pack
    setQSaving(true);
    setQSaveError(null);
    const payload: any = {
      pack_id: selectedPack.id, owner_id: userId,
      question: qText.trim(),
      choice_a: qChoices[0].trim(), choice_b: qChoices[1].trim(),
      choice_c: qChoices[2].trim(), choice_d: qChoices[3].trim(),
      correct_index: qCorrect,
      question_type: qType,
      image_url: (qType !== 'normal') ? (qImageUrl ?? null) : null,
      youtube_url: qYoutubeUrl.trim() || null,
    };
    let err: any = null;
    if (editingQ) {
      const { error } = await supabase.from('custom_questions').update(payload).eq('id', editingQ.id);
      err = error;
    } else {
      const { error } = await supabase.from('custom_questions').insert(payload);
      err = error;
    }
    if (err) {
      // Colonne youtube_url absente → on réessaie sans elle
      if (err.code === '42703') {
        const { youtube_url: _drop, ...payloadWithout } = payload;
        const { error: err2 } = editingQ
          ? await supabase.from('custom_questions').update(payloadWithout).eq('id', editingQ.id)
          : await supabase.from('custom_questions').insert(payloadWithout);
        if (err2) { setQSaveError(err2.message); setQSaving(false); return; }
      } else {
        setQSaveError(err.message);
        setQSaving(false);
        return;
      }
    }
    await loadQuestions(selectedPack.id);
    setAddMode(null);
    setQType('normal'); setQImageUrl(null); setQYoutubeUrl('');
    setQSaving(false);
  };

  const deleteQuestion = async (qId: string) => {
    if (!confirm('Supprimer cette question ?')) return;
    await supabase.from('custom_questions').delete().eq('id', qId);
    if (selectedPack) await loadQuestions(selectedPack.id);
  };

  // === CSV IMPORT ===
  const handleCSVFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setCsvError('');
    const file = e.target.files?.[0];
    if (!file) return;

    // Détection automatique de l'encodage : UTF-8 en priorité, sinon Windows-1252 (export Excel)
    const buffer = await file.arrayBuffer();
    let text: string;
    try {
      const decoder = new TextDecoder('utf-8', { fatal: true });
      text = decoder.decode(buffer);
    } catch {
      // UTF-8 invalide → fichier Excel Windows → on tente Windows-1252
      const decoder = new TextDecoder('windows-1252');
      text = decoder.decode(buffer);
    }

    const parsed = parseCSV(text);
    if (parsed.length === 0) {
      setCsvError('Aucune question valide trouvée. Vérifie le format du fichier.');
    } else {
      setCsvPreview(parsed);
    }
  };

  const importCSV = async () => {
    if (!selectedPack || !userId || csvPreview.length === 0) return;
    const toImport = csvPreview.filter(q => q._selected);
    if (toImport.length === 0) return;
    setCsvImporting(true);
    const payload = toImport.map(q => ({
      pack_id: selectedPack.id, owner_id: userId,
      question: q.question, choice_a: q.choice_a, choice_b: q.choice_b,
      choice_c: q.choice_c, choice_d: q.choice_d, correct_index: q.correct_index,
    }));
    await supabase.from('custom_questions').insert(payload);
    await loadQuestions(selectedPack.id);
    setCsvPreview([]); setCsvError('');
    if (csvInputRef.current) csvInputRef.current.value = '';
    setAddMode(null);
    setCsvImporting(false);
  };

  // === IA ===
  const generateAI = async () => {
    if (!aiTheme.trim() || !selectedPack || !userId) return;

    // Vérifier le quota mensuel
    if (limits.maxAiPerMonth > 0 && aiUsesThisMonth >= limits.maxAiPerMonth) {
      setAiError(`Quota IA atteint pour ce mois (${limits.maxAiPerMonth} générations). Repassez le mois prochain !`);
      return;
    }

    setAiGenerating(true);
    setAiError('');
    setAiPreview([]);
    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: aiTheme.trim(), count: aiCount, mode: selectedPack.mode }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setAiError(data.error ?? 'Erreur inconnue');
      } else {
        setAiPreview((data.questions ?? []).map((q: any) => ({ ...q, _selected: true })));
        // Incrémenter le quota en DB
        const nowMonth = new Date().toISOString().slice(0, 7);
        const newCount = aiUsesThisMonth + 1;
        await supabase.from('profiles').update({
          ai_uses_count: newCount,
          ai_uses_month: nowMonth,
        }).eq('id', userId);
        setAiUsesThisMonth(newCount);
      }
    } catch (e: any) {
      setAiError(e.message ?? 'Erreur réseau');
    }
    setAiGenerating(false);
  };

  const importAI = async () => {
    if (!selectedPack || !userId || aiPreview.length === 0) return;
    const toImport = aiPreview.filter(q => q._selected);
    if (toImport.length === 0) return;
    setAiImporting(true);
    const payload = toImport.map(q => ({
      pack_id: selectedPack.id, owner_id: userId,
      question: q.question, choice_a: q.choice_a, choice_b: q.choice_b,
      choice_c: q.choice_c, choice_d: q.choice_d, correct_index: q.correct_index,
    }));
    await supabase.from('custom_questions').insert(payload);
    await loadQuestions(selectedPack.id);
    setAiPreview([]); setAiTheme('');
    setAddMode(null);
    setAiImporting(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen" style={{ background: '#0D1B3E' }}>
      <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
        style={{ borderColor: '#8B5CF6', borderTopColor: 'transparent' }} />
    </div>
  );

  const tc = TIER_COLORS[tier];
  const canAddMore = true; // pas de limite de questions par pack
  const aiRemaining = limits.maxAiPerMonth > 0 ? limits.maxAiPerMonth - aiUsesThisMonth : 0;

  // Packs filtrés + triés
  const sortedPacks = [...packs]
    .filter(p => packSearch.trim() === '' || p.name.toLowerCase().includes(packSearch.toLowerCase()))
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name, 'fr');
      else if (sortKey === 'created_at') cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      else if (sortKey === 'question_count') cmp = a.question_count - b.question_count;
      else if (sortKey === 'mode') cmp = a.mode.localeCompare(b.mode);
      return sortAsc ? cmp : -cmp;
    });

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(a => !a);
    else { setSortKey(key); setSortAsc(true); }
  };

  // ─── Rendu ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen muz-fade-in" style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 50%, #0D1B3E 100%)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
        <div className="flex items-center gap-3">
          {view === 'questions' ? (
            <div className="flex items-center gap-2">
              <button onClick={() => { setView('packs'); setAddMode(null); setAiPreview([]); setCsvPreview([]); }}
                className="text-sm font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(240,244,255,0.6)' }}>
                ← Packs
              </button>
              <Link href="/"
                className="text-sm font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                style={{ background: 'rgba(255,0,170,0.08)', color: 'rgba(255,0,170,0.7)', border: '1px solid rgba(255,0,170,0.2)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><MuzquizLogo width={18} showText={false} />Accueil</span>
              </Link>
            </div>
          ) : (
            <Link href="/"><MuzquizLogo width={50} textSize="1rem" horizontal /></Link>
          )}
          <span className="text-sm font-bold" style={{ color: 'rgba(240,244,255,0.5)' }}>
            {view === 'packs' ? 'Mes packs' : selectedPack?.name}
          </span>
        </div>
        <span className="text-xs font-black px-3 py-1.5 rounded-full"
          style={{ background: tc.bg, color: tc.text, border: `1px solid ${tc.text}44` }}>
          {tc.label}
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* ===== VUE PACKS ===== */}
        {view === 'packs' && (
          <>
            <div className="flex items-center justify-between mb-5 px-1">
              <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>
                <span style={{ color: '#F0F4FF', fontWeight: 700 }}>{packs.length}</span>
                {' '}pack{packs.length !== 1 ? 's' : ''}
              </p>
              <button onClick={() => setShowPackForm(true)} className="muz-btn-pink px-4 py-2 rounded-xl font-black text-sm">
                + Nouveau pack
              </button>
            </div>

            {showPackForm && (
              <div className="muz-card p-5 mb-4 muz-pop">
                <h3 className="font-black mb-4" style={{ color: '#F0F4FF' }}>Nouveau pack</h3>
                <div className="flex flex-col gap-3">
                  <input value={packName} onChange={e => setPackName(e.target.value)}
                    placeholder="Nom du pack (ex: Cinéma années 80)" style={inputStyle()} />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(240,244,255,0.35)' }}>Mode de jeu</p>
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

            {packs.length > 1 && (
              <>
                {/* Barre de recherche */}
                <div className="relative mb-3">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'rgba(240,244,255,0.35)' }}>🔍</span>
                  <input
                    value={packSearch}
                    onChange={e => setPackSearch(e.target.value)}
                    placeholder="Rechercher un pack…"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(139,92,246,0.25)', color: '#F0F4FF' }}
                  />
                </div>
                {/* Boutons de tri */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {([
                    { key: 'name' as SortKey, label: 'A–Z' },
                    { key: 'created_at' as SortKey, label: 'Date' },
                    { key: 'question_count' as SortKey, label: 'Nb questions' },
                    { key: 'mode' as SortKey, label: 'Mode' },
                  ]).map(s => (
                    <button key={s.key} onClick={() => toggleSort(s.key)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={{
                        background: sortKey === s.key ? 'rgba(139,92,246,0.2)' : 'rgba(255,255,255,0.05)',
                        border: `1px solid ${sortKey === s.key ? 'rgba(139,92,246,0.5)' : 'rgba(255,255,255,0.08)'}`,
                        color: sortKey === s.key ? '#8B5CF6' : 'rgba(240,244,255,0.45)',
                      }}>
                      {s.label} {sortKey === s.key ? (sortAsc ? '↑' : '↓') : ''}
                    </button>
                  ))}
                </div>
              </>
            )}

            {packs.length === 0 && !showPackForm && (
              <div className="muz-card p-8 text-center">
                <div className="flex justify-center mb-3"><MuzquizLogo width={60} showText={false} /></div>
                <p className="font-bold mb-1" style={{ color: '#F0F4FF' }}>Aucun pack pour l'instant</p>
                <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>Crée ton premier pack de questions !</p>
              </div>
            )}

            {sortedPacks.length === 0 && packSearch && (
              <p className="text-center text-sm py-6" style={{ color: 'rgba(240,244,255,0.35)' }}>
                Aucun pack ne correspond à « {packSearch} »
              </p>
            )}

            <div className="flex flex-col gap-3">
              {sortedPacks.map(pack => (
                <div key={pack.id} className="muz-card muz-card-lift p-4 flex items-center gap-4 cursor-pointer" onClick={() => openPack(pack)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black text-base" style={{ color: '#F0F4FF' }}>{pack.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{ background: 'rgba(139,92,246,0.12)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.25)' }}>
                        {MODE_LABEL[pack.mode]}
                      </span>
                    </div>
                    {pack.description && <p className="text-xs mt-0.5 truncate" style={{ color: 'rgba(240,244,255,0.4)' }}>{pack.description}</p>}
                    <p className="text-xs mt-1 font-bold" style={{ color: 'rgba(240,244,255,0.35)' }}>
                      {pack.question_count} question{pack.question_count !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={e => { e.stopPropagation(); deletePack(pack.id); }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black transition-all hover:scale-110"
                      style={{ background: 'rgba(255,0,170,0.1)', color: '#FF00AA' }}>×</button>
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
            {/* Compteur + 3 boutons d'ajout */}
            <div className="flex items-center justify-between mb-4 px-1">
              <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>
                <span style={{ color: '#F0F4FF', fontWeight: 700 }}>{questions.length}</span>
                {' '}question{questions.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Boutons d'ajout */}
            {canAddMore && addMode === null && (
              <div className="flex flex-col gap-3 mb-5">
                <div className={`grid gap-2 ${limits.canUseCSV ? 'grid-cols-3' : 'grid-cols-1'}`}>
                  {/* Manuel — disponible pour tous */}
                  <button onClick={() => { openQForm(); }}
                    className="flex flex-col items-center gap-1.5 py-4 px-2 rounded-2xl transition-all hover:scale-[1.02]"
                    style={{ background: 'rgba(255,0,170,0.1)', border: '1.5px solid rgba(255,0,170,0.3)' }}>
                    <MuzquizLogo width={32} showText={false} color="#FF00AA" />
                    <span className="text-xs font-black" style={{ color: '#FF00AA' }}>Manuel</span>
                    <span className="text-xs text-center" style={{ color: 'rgba(240,244,255,0.4)' }}>Question par question</span>
                  </button>

                  {/* CSV — Essentiel+ */}
                  {limits.canUseCSV && (
                    <button onClick={() => { setAddMode('csv'); setCsvPreview([]); setCsvError(''); }}
                      className="flex flex-col items-center gap-1.5 py-4 px-2 rounded-2xl transition-all hover:scale-[1.02]"
                      style={{ background: 'rgba(0,229,209,0.08)', border: '1.5px solid rgba(0,229,209,0.25)' }}>
                      <MuzquizLogo width={32} showText={false} color="#00E5D1" />
                      <span className="text-xs font-black" style={{ color: '#00E5D1' }}>Importer CSV</span>
                      <span className="text-xs text-center" style={{ color: 'rgba(240,244,255,0.4)' }}>Depuis Excel</span>
                    </button>
                  )}

                  {/* IA — Essentiel+ */}
                  {limits.maxAiPerMonth > 0 && (
                    <button onClick={() => { setAddMode('ai'); setAiPreview([]); setAiError(''); }}
                      disabled={aiRemaining <= 0}
                      className="flex flex-col items-center gap-1.5 py-4 px-2 rounded-2xl transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ background: 'rgba(139,92,246,0.12)', border: '1.5px solid rgba(139,92,246,0.35)' }}>
                      <MuzquizLogo width={32} showText={false} color="#8B5CF6" />
                      <span className="text-xs font-black" style={{ color: '#8B5CF6' }}>Générer par IA</span>
                      <span className="text-xs text-center" style={{ color: aiRemaining <= 0 ? '#FF00AA' : 'rgba(240,244,255,0.4)' }}>
                        {aiRemaining > 0 ? `${aiRemaining}/${limits.maxAiPerMonth} ce mois` : 'Quota atteint'}
                      </span>
                    </button>
                  )}
                </div>

                {/* Bandeau Découverte — inviter à passer à Essentiel */}
                {!limits.canUseCSV && (
                  <div className="flex items-center justify-between px-4 py-2.5 rounded-xl"
                    style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)' }}>
                    <span className="text-xs" style={{ color: 'rgba(240,244,255,0.45)' }}>
                      Import CSV et génération IA disponibles à partir de l'abonnement Essentiel
                    </span>
                    <Link href="/pricing" className="text-xs font-black px-3 py-1 rounded-lg flex-shrink-0 ml-3"
                      style={{ background: 'rgba(139,92,246,0.2)', color: '#8B5CF6' }}>
                      Voir →
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* ── PANNEAU MANUEL ─────────────────────────────────────────── */}
            {addMode === 'manual' && (
              <div className="muz-card p-5 mb-4 muz-pop">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black" style={{ color: '#F0F4FF' }}>
                    {editingQ ? 'Modifier la question' : 'Nouvelle question'}
                  </h3>
                  <button onClick={() => setAddMode(null)} style={{ color: 'rgba(240,244,255,0.4)', fontSize: '1.2rem' }}>×</button>
                </div>
                <div className="flex flex-col gap-3">
                  <textarea value={qText} onChange={e => setQText(e.target.value)}
                    placeholder="La question..." rows={2}
                    style={{ ...inputStyle(), resize: 'none' }} />

                  {/* Sélecteur type de question */}
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(240,244,255,0.35)' }}>
                      Type de question
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {([
                        { value: 'normal'     as QuestionType, label: 'Texte',      color: '#8B5CF6' },
                        { value: 'image'      as QuestionType, label: 'Image',      color: '#00E5D1' },
                        { value: 'blur_reveal'as QuestionType, label: 'Flou → Net', color: '#FF00AA' },
                      ]).map(opt => (
                        <button key={opt.value} onClick={() => { setQType(opt.value); if (opt.value === 'normal') setQImageUrl(null); }}
                          className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all"
                          style={{
                            background: qType === opt.value ? `${opt.color}20` : 'rgba(255,255,255,0.04)',
                            border: `1.5px solid ${qType === opt.value ? opt.color : 'rgba(255,255,255,0.08)'}`,
                          }}>
                          <MuzquizLogo width={28} showText={false} color={qType === opt.value ? opt.color : 'rgba(240,244,255,0.3)'} />
                          <span className="text-xs font-black" style={{ color: qType === opt.value ? opt.color : 'rgba(240,244,255,0.5)' }}>
                            {opt.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Upload image (si type image ou blur_reveal) */}
                  {(qType === 'image' || qType === 'blur_reveal') && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(240,244,255,0.35)' }}>
                        {qType === 'blur_reveal' ? 'Image (floue au départ, se révèle avec le temps)' : 'Image de la question'}
                      </p>
                      <input ref={qImageInputRef} type="file" accept="image/*" className="hidden" onChange={handleQImageChange} />
                      {qImageUrl ? (
                        <div className="relative rounded-xl overflow-hidden" style={{ maxHeight: 180 }}>
                          <img src={qImageUrl} alt="Aperçu" className="w-full object-cover" style={{ maxHeight: 180 }} />
                          <button
                            onClick={() => { setQImageUrl(null); }}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center font-black text-sm"
                            style={{ background: 'rgba(255,0,170,0.85)', color: 'white' }}>
                            ×
                          </button>
                          {qType === 'blur_reveal' && (
                            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-xs font-black"
                              style={{ background: 'rgba(139,92,246,0.85)', color: 'white' }}>
                              🔍 Déflou progressif
                            </div>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => qImageInputRef.current?.click()}
                          disabled={qImageUploading}
                          className="w-full py-8 rounded-xl flex flex-col items-center gap-2 transition-all hover:opacity-80 disabled:opacity-50"
                          style={{ border: '2px dashed rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.03)', color: 'rgba(240,244,255,0.4)' }}>
                          {qImageUploading
                            ? <><div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#8B5CF6', borderTopColor: 'transparent' }} /><span className="text-xs">Envoi en cours…</span></>
                            : <><span className="text-2xl">📁</span><span className="text-xs font-bold">Cliquer pour choisir une image</span></>
                          }
                        </button>
                      )}
                    </div>
                  )}

                  {/* Upload audio (pour packs blind test) */}
                  {selectedPack && (selectedPack.mode === 'blind_test' || selectedPack.mode === 'buzz_blind_test') && (
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(0,229,209,0.6)' }}>
                        ♪ Fichier audio (musique à identifier)
                      </p>
                      <input
                        ref={qAudioInputRef}
                        type="file"
                        accept=".mp3,.ogg,.wav,.aac,.m4a,audio/*"
                        className="hidden"
                        onChange={handleQAudioChange}
                      />
                      {qYoutubeUrl ? (
                        /* Aperçu : fichier chargé */
                        <div
                          className="flex items-center gap-3 px-4 py-3 rounded-xl"
                          style={{ background: 'rgba(0,229,209,0.07)', border: '1.5px solid rgba(0,229,209,0.4)' }}
                        >
                          <span style={{ color: '#00E5D1', fontSize: '1.3rem' }}>♪</span>
                          <span className="flex-1 min-w-0 text-xs font-bold truncate" style={{ color: '#00E5D1' }}>
                            Fichier audio chargé ✓
                          </span>
                          <button
                            onClick={() => setQYoutubeUrl('')}
                            className="text-xs font-black px-2 py-1 rounded-lg flex-shrink-0"
                            style={{ background: 'rgba(255,0,170,0.1)', color: '#FF00AA' }}
                          >
                            ✕ Supprimer
                          </button>
                        </div>
                      ) : (
                        /* Zone d'upload */
                        <button
                          onClick={() => qAudioInputRef.current?.click()}
                          disabled={qAudioUploading}
                          className="w-full py-6 rounded-xl flex flex-col items-center gap-2 transition-all hover:opacity-80 disabled:opacity-50"
                          style={{ border: '2px dashed rgba(0,229,209,0.3)', background: 'rgba(0,229,209,0.04)', color: 'rgba(240,244,255,0.4)' }}
                        >
                          {qAudioUploading ? (
                            <>
                              <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
                                style={{ borderColor: '#00E5D1', borderTopColor: 'transparent' }} />
                              <span className="text-xs font-bold" style={{ color: '#00E5D1' }}>Envoi en cours…</span>
                            </>
                          ) : (
                            <>
                              <span className="text-2xl">🎵</span>
                              <span className="text-xs font-bold" style={{ color: '#00E5D1' }}>Cliquer pour choisir un fichier audio</span>
                              <span className="text-xs" style={{ color: 'rgba(240,244,255,0.3)' }}>MP3, OGG, WAV, AAC, M4A</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}

                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(240,244,255,0.35)' }}>
                    Réponses (clique sur la lettre pour marquer comme correcte)
                  </p>
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
                        style={{ ...inputStyle(), flex: 1 }} />
                    </div>
                  ))}
                  {qSaveError && (
                    <p className="text-xs font-bold px-1 mt-1" style={{ color: '#FF00AA' }}>
                      ✗ {qSaveError}
                    </p>
                  )}
                  <div className="flex gap-2 mt-1">
                    <button onClick={() => { setAddMode(null); setQSaveError(null); }}
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

            {/* ── PANNEAU CSV ─────────────────────────────────────────────── */}
            {addMode === 'csv' && (
              <div className="muz-card p-5 mb-4 muz-pop">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black" style={{ color: '#F0F4FF' }}>Importer depuis un CSV</h3>
                  <button onClick={() => { setAddMode(null); setCsvPreview([]); }} style={{ color: 'rgba(240,244,255,0.4)', fontSize: '1.2rem' }}>×</button>
                </div>

                {csvPreview.length === 0 ? (
                  <>
                    {/* Zone de dépôt */}
                    <button onClick={() => csvInputRef.current?.click()}
                      className="w-full py-8 rounded-2xl flex flex-col items-center gap-3 transition-all hover:opacity-90"
                      style={{ background: 'rgba(0,229,209,0.05)', border: '2px dashed rgba(0,229,209,0.3)' }}>
                      <span className="text-3xl">📄</span>
                      <span className="font-bold text-sm" style={{ color: '#00E5D1' }}>Cliquer pour choisir un fichier .csv</span>
                      <span className="text-xs" style={{ color: 'rgba(240,244,255,0.35)' }}>
                        Colonnes : question, choix_a, choix_b, choix_c, choix_d, correct (0-3)
                      </span>
                    </button>
                    <input ref={csvInputRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleCSVFile} />

                    {/* Modèle CSV à télécharger */}
                    <button
                      onClick={() => {
                        const csv = 'question,choix_a,choix_b,choix_c,choix_d,correct\nQuelle est la capitale de la France?,Paris,Lyon,Marseille,Nice,0\nEn quelle année a été fondée Apple?,1976,1984,1992,2001,0';
                        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a'); a.href = url; a.download = 'modele_questions.csv'; a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="w-full mt-3 py-2 rounded-xl text-xs font-bold transition-all hover:opacity-80"
                      style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(240,244,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      ↓ Télécharger un modèle CSV
                    </button>

                    {csvError && <p className="text-sm font-bold mt-3 text-center" style={{ color: '#FF00AA' }}>{csvError}</p>}
                  </>
                ) : (
                  <>
                    {/* Aperçu + sélection */}
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold" style={{ color: '#00E5D1' }}>
                        {csvPreview.filter(q => q._selected).length} / {csvPreview.length} questions sélectionnées
                      </p>
                      <button onClick={() => setCsvPreview(prev => prev.map(q => ({ ...q, _selected: !prev.every(p => p._selected) })))}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(240,244,255,0.5)' }}>
                        {csvPreview.every(q => q._selected) ? 'Tout désélectionner' : 'Tout sélectionner'}
                      </button>
                    </div>
                    <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1 mb-4">
                      {csvPreview.map((q, i) => (
                        <button key={i} onClick={() => setCsvPreview(prev => prev.map((x, j) => j === i ? { ...x, _selected: !x._selected } : x))}
                          className="flex items-start gap-3 p-3 rounded-xl text-left transition-all"
                          style={{
                            background: q._selected ? 'rgba(0,229,209,0.08)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${q._selected ? 'rgba(0,229,209,0.3)' : 'rgba(255,255,255,0.06)'}`,
                          }}>
                          <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: q._selected ? '#00E5D1' : 'rgba(255,255,255,0.08)', color: '#0D1B3E' }}>
                            {q._selected && <span className="text-xs font-black">✓</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate" style={{ color: '#F0F4FF' }}>{q.question}</p>
                            <p className="text-xs mt-0.5 truncate" style={{ color: '#00E5D1' }}>
                              ✓ {[q.choice_a, q.choice_b, q.choice_c, q.choice_d][q.correct_index]}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setCsvPreview([]); if (csvInputRef.current) csvInputRef.current.value = ''; }}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                        style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(240,244,255,0.5)' }}>
                        ← Changer de fichier
                      </button>
                      <button onClick={importCSV} disabled={csvPreview.filter(q => q._selected).length === 0 || csvImporting}
                        className="flex-1 muz-btn-cyan py-2.5 rounded-xl font-black text-sm disabled:opacity-50">
                        {csvImporting ? '...' : `Importer ${csvPreview.filter(q => q._selected).length} questions →`}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── PANNEAU IA ──────────────────────────────────────────────── */}
            {addMode === 'ai' && (
              <div className="muz-card p-5 mb-4 muz-pop">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black" style={{ color: '#F0F4FF' }}>Générer par IA ✨</h3>
                  <button onClick={() => { setAddMode(null); setAiPreview([]); }} style={{ color: 'rgba(240,244,255,0.4)', fontSize: '1.2rem' }}>×</button>
                </div>

                {aiPreview.length === 0 ? (
                  <>
                    <div className="flex flex-col gap-3">
                      {/* Quota restant */}
                      <div className="flex items-center justify-between px-3 py-2 rounded-xl"
                        style={{ background: aiRemaining > 0 ? 'rgba(139,92,246,0.08)' : 'rgba(255,0,170,0.08)', border: `1px solid ${aiRemaining > 0 ? 'rgba(139,92,246,0.25)' : 'rgba(255,0,170,0.25)'}` }}>
                        <span className="text-xs font-bold" style={{ color: aiRemaining > 0 ? 'rgba(139,92,246,0.8)' : '#FF00AA' }}>
                          {aiRemaining > 0 ? `${aiRemaining} génération${aiRemaining > 1 ? 's' : ''} restante${aiRemaining > 1 ? 's' : ''} ce mois` : 'Quota mensuel atteint'}
                        </span>
                        <span className="text-xs font-bold" style={{ color: 'rgba(240,244,255,0.35)' }}>{aiUsesThisMonth}/{limits.maxAiPerMonth}</span>
                      </div>

                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(240,244,255,0.35)' }}>Thème ou sujet</p>
                        <input value={aiTheme} onChange={e => setAiTheme(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && generateAI()}
                          placeholder="ex: Cinéma des années 90, Géographie européenne, Marvel…"
                          style={inputStyle()} />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(240,244,255,0.35)' }}>
                          Nombre de questions (max {limits.maxAiQuestionsPerGen})
                        </p>
                        <div className="flex gap-2">
                          {[5, 10, 15, 20].filter(n => n <= limits.maxAiQuestionsPerGen).map(n => (
                            <button key={n} onClick={() => setAiCount(n)}
                              className="flex-1 py-2 rounded-xl text-sm font-bold transition-all"
                              style={{
                                background: aiCount === n ? '#8B5CF6' : 'rgba(255,255,255,0.06)',
                                color: aiCount === n ? 'white' : 'rgba(240,244,255,0.5)',
                                border: `1px solid ${aiCount === n ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                              }}>
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {aiError && (
                      <div className="mt-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,0,170,0.08)', border: '1px solid rgba(255,0,170,0.3)' }}>
                        <p className="text-sm font-bold" style={{ color: '#FF00AA' }}>{aiError}</p>
                      </div>
                    )}

                    <button onClick={generateAI} disabled={!aiTheme.trim() || aiGenerating}
                      className="w-full mt-4 py-3 rounded-xl font-black text-sm disabled:opacity-50 transition-all"
                      style={{ background: aiGenerating ? 'rgba(139,92,246,0.3)' : '#8B5CF6', color: 'white' }}>
                      {aiGenerating ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'white', borderTopColor: 'transparent' }} />
                          Génération en cours…
                        </span>
                      ) : `✨ Générer ${aiCount} questions`}
                    </button>
                  </>
                ) : (
                  <>
                    {/* Aperçu questions générées */}
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-bold" style={{ color: '#8B5CF6' }}>
                        {aiPreview.filter(q => q._selected).length} / {aiPreview.length} questions sélectionnées
                      </p>
                      <button onClick={() => setAiPreview(prev => prev.map(q => ({ ...q, _selected: !prev.every(p => p._selected) })))}
                        className="text-xs font-bold px-3 py-1.5 rounded-lg"
                        style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(240,244,255,0.5)' }}>
                        {aiPreview.every(q => q._selected) ? 'Tout désélectionner' : 'Tout sélectionner'}
                      </button>
                    </div>
                    <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1 mb-4">
                      {aiPreview.map((q, i) => (
                        <button key={i} onClick={() => setAiPreview(prev => prev.map((x, j) => j === i ? { ...x, _selected: !x._selected } : x))}
                          className="flex items-start gap-3 p-3 rounded-xl text-left transition-all"
                          style={{
                            background: q._selected ? 'rgba(139,92,246,0.1)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${q._selected ? 'rgba(139,92,246,0.35)' : 'rgba(255,255,255,0.06)'}`,
                          }}>
                          <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{ background: q._selected ? '#8B5CF6' : 'rgba(255,255,255,0.08)', color: 'white' }}>
                            {q._selected && <span className="text-xs font-black">✓</span>}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold" style={{ color: '#F0F4FF', whiteSpace: 'normal' }}>{q.question}</p>
                            <div className="grid grid-cols-2 gap-1 mt-1.5">
                              {[q.choice_a, q.choice_b, q.choice_c, q.choice_d].map((c, ci) => (
                                <span key={ci} className="text-xs px-1.5 py-0.5 rounded truncate"
                                  style={{
                                    background: q.correct_index === ci ? 'rgba(0,229,209,0.12)' : 'rgba(255,255,255,0.04)',
                                    color: q.correct_index === ci ? '#00E5D1' : 'rgba(240,244,255,0.4)',
                                    border: `1px solid ${q.correct_index === ci ? 'rgba(0,229,209,0.2)' : 'transparent'}`,
                                  }}>
                                  {LABELS[ci]}. {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setAiPreview([]); setAiError(''); }}
                        className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                        style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(240,244,255,0.5)' }}>
                        ← Regénérer
                      </button>
                      <button onClick={importAI} disabled={aiPreview.filter(q => q._selected).length === 0 || aiImporting}
                        className="flex-1 py-2.5 rounded-xl font-black text-sm disabled:opacity-50"
                        style={{ background: '#8B5CF6', color: 'white' }}>
                        {aiImporting ? '...' : `Ajouter ${aiPreview.filter(q => q._selected).length} questions →`}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Liste des questions */}
            {questions.length === 0 && addMode === null && (
              <div className="muz-card p-8 text-center">
                <div className="flex justify-center mb-3"><MuzquizLogo width={60} showText={false} /></div>
                <p className="font-bold mb-1" style={{ color: '#F0F4FF' }}>Aucune question</p>
                <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>
                  Choisis comment ajouter des questions ci-dessus.
                </p>
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
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <p className="font-bold text-sm" style={{ color: '#F0F4FF' }}>{q.question}</p>
                        {q.youtube_url && (
                          <span className="text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0"
                            style={{ background: 'rgba(0,229,209,0.12)', color: '#00E5D1', border: '1px solid rgba(0,229,209,0.25)' }}>
                            ♪ Audio
                          </span>
                        )}
                      </div>
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
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black transition-all hover:scale-110"
                        style={{ background: 'rgba(139,92,246,0.12)', color: '#8B5CF6' }}>✎</button>
                      <button onClick={() => deleteQuestion(q.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black transition-all hover:scale-110"
                        style={{ background: 'rgba(255,0,170,0.1)', color: '#FF00AA' }}>×</button>
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
