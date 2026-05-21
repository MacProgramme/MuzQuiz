// app/community/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MuzquizLogo } from '@/components/MuzquizLogo';
import { TIER_LIMITS, normalizeTier } from '@/types';
import Link from 'next/link';

interface SharedPack {
  id: string;
  name: string;
  description: string;
  mode: string;
  shared_description: string;
  question_count: number;
  owner_nickname: string;
  owner_color: string;
  created_at: string;
}

const MODE_LABEL: Record<string, string> = {
  qcm: 'Quiz', buzz: 'Buzz Quiz', quiz: 'Quiz',
  blind_test: 'Blind Test', buzz_quiz: 'Buzz Quiz', buzz_blind_test: 'Buzz Blind Test',
};
const MODE_COLOR: Record<string, string> = {
  qcm: '#00E5D1', buzz: '#FF00AA', quiz: '#00E5D1',
  blind_test: '#8B5CF6', buzz_quiz: '#FF00AA', buzz_blind_test: '#F59E0B',
};

export default function CommunityPage() {
  const router = useRouter();
  const [packs, setPacks] = useState<SharedPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [userTier, setUserTier] = useState<string>('decouverte');
  const [importing, setImporting] = useState<string | null>(null);
  const [importMsg, setImportMsg] = useState<{ packId: string; ok: boolean; text: string } | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const load = async () => {
      // Récupérer le tier de l'utilisateur (peut être anonyme)
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && !session.user.is_anonymous) {
        const { data: prof } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', session.user.id)
          .single();
        if (prof) setUserTier(normalizeTier(prof.subscription_tier));
      }

      // Charger les packs partagés avec info propriétaire
      const { data, error } = await supabase
        .from('question_packs')
        .select(`
          id, name, description, mode, shared_description, created_at,
          profiles!inner(nickname, avatar_color)
        `)
        .eq('is_shared', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        // Récupérer le nombre de questions pour chaque pack
        const packsWithCount = await Promise.all(
          data.map(async (pack: any) => {
            const { count } = await supabase
              .from('custom_questions')
              .select('*', { count: 'exact', head: true })
              .eq('pack_id', pack.id);
            return {
              id: pack.id,
              name: pack.name,
              description: pack.description,
              mode: pack.mode,
              shared_description: pack.shared_description ?? '',
              question_count: count ?? 0,
              owner_nickname: pack.profiles?.nickname ?? 'Joueur',
              owner_color: pack.profiles?.avatar_color ?? '#8B5CF6',
              created_at: pack.created_at,
            };
          })
        );
        setPacks(packsWithCount);
      }
      setLoading(false);
    };
    load();
  }, []);

  const importPack = async (pack: SharedPack) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user || session.user.is_anonymous) {
      router.push('/login?redirect=/community');
      return;
    }

    // Découverte ne peut pas importer
    if (userTier === 'decouverte') {
      setImportMsg({ packId: pack.id, ok: false, text: 'Abonnement Essentiel ou supérieur requis pour importer.' });
      return;
    }

    setImporting(pack.id);
    setImportMsg(null);

    try {
      // Créer un nouveau pack copié dans les packs de l'utilisateur
      const { data: newPack, error: packErr } = await supabase
        .from('question_packs')
        .insert({
          owner_id: session.user.id,
          name: `${pack.name} (copie)`,
          description: pack.description,
          mode: pack.mode,
        })
        .select('id')
        .single();

      if (packErr || !newPack) {
        setImportMsg({ packId: pack.id, ok: false, text: 'Erreur lors de la création du pack.' });
        return;
      }

      // Copier toutes les questions
      const { data: questions } = await supabase
        .from('custom_questions')
        .select('*')
        .eq('pack_id', pack.id);

      if (questions && questions.length > 0) {
        const copies = questions.map((q: any) => ({
          pack_id: newPack.id,
          owner_id: session.user.id,
          question: q.question,
          choice_a: q.choice_a,
          choice_b: q.choice_b,
          choice_c: q.choice_c,
          choice_d: q.choice_d,
          correct_index: q.correct_index,
          question_type: q.question_type,
          image_url: q.image_url,
          youtube_url: q.youtube_url,
          audio_start_time: q.audio_start_time,
        }));
        await supabase.from('custom_questions').insert(copies);
      }

      setImportMsg({ packId: pack.id, ok: true, text: `Pack importé ! Retrouve-le dans tes packs.` });
    } catch {
      setImportMsg({ packId: pack.id, ok: false, text: 'Erreur réseau.' });
    } finally {
      setImporting(null);
    }
  };

  const filteredPacks = packs.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.shared_description.toLowerCase().includes(search.toLowerCase()) ||
    p.owner_nickname.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen muz-fade-in"
      style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 50%, #0D1B3E 100%)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
        <Link href="/"
          className="text-sm font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
          style={{ background: 'rgba(255,0,170,0.08)', color: 'rgba(255,0,170,0.7)', border: '1px solid rgba(255,0,170,0.2)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <MuzquizLogo width={18} showText={false} />Accueil
          </span>
        </Link>
        <MuzquizLogo width={100} textSize="1.2rem" />
        <Link href="/profile"
          className="text-sm font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
          style={{ background: 'rgba(139,92,246,0.08)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.2)' }}>
          Mon profil →
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Titre */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-2" style={{ color: '#F0F4FF' }}>
            🌐 Communauté
          </h1>
          <p className="text-sm" style={{ color: 'rgba(240,244,255,0.45)' }}>
            Packs de questions partagés par les joueurs Muzquiz
          </p>
          {userTier === 'decouverte' && (
            <div className="mt-4 px-4 py-2.5 rounded-xl inline-flex items-center gap-2 text-sm font-bold"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', color: '#F59E0B' }}>
              👀 Tu peux voir les packs — abonnement Essentiel requis pour importer
            </div>
          )}
        </div>

        {/* Barre de recherche */}
        <input
          type="text"
          placeholder="Rechercher un pack, un auteur…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-xl mb-6 font-medium outline-none"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1.5px solid rgba(139,92,246,0.25)',
            color: '#F0F4FF',
          }}
        />

        {/* Liste */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 rounded-full border-4 border-t-transparent animate-spin"
              style={{ borderColor: '#8B5CF6', borderTopColor: 'transparent' }} />
          </div>
        ) : filteredPacks.length === 0 ? (
          <div className="text-center py-16" style={{ color: 'rgba(240,244,255,0.3)' }}>
            <p className="text-4xl mb-3">📭</p>
            <p className="font-bold">
              {search ? 'Aucun pack ne correspond à ta recherche.' : 'Aucun pack partagé pour l\'instant.'}
            </p>
            <p className="text-sm mt-1 opacity-70">
              Partage tes packs depuis la page Mes Questions !
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredPacks.map(pack => {
              const modeColor = MODE_COLOR[pack.mode] ?? '#8B5CF6';
              const msg = importMsg?.packId === pack.id ? importMsg : null;
              return (
                <div key={pack.id} className="muz-card p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-black text-base" style={{ color: '#F0F4FF' }}>{pack.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0"
                          style={{ background: `${modeColor}22`, color: modeColor, border: `1px solid ${modeColor}44` }}>
                          {MODE_LABEL[pack.mode]}
                        </span>
                        <span className="text-xs font-bold flex-shrink-0"
                          style={{ color: 'rgba(240,244,255,0.35)' }}>
                          {pack.question_count} question{pack.question_count !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {pack.shared_description && (
                        <p className="text-sm mb-1" style={{ color: 'rgba(240,244,255,0.55)' }}>
                          {pack.shared_description}
                        </p>
                      )}
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ background: pack.owner_color }} />
                        <span className="text-xs font-bold" style={{ color: 'rgba(240,244,255,0.4)' }}>
                          {pack.owner_nickname}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bouton importer */}
                  <div className="flex items-center justify-between gap-3">
                    {msg && (
                      <p className="text-xs font-bold flex-1" style={{ color: msg.ok ? '#00E5D1' : '#FF6060' }}>
                        {msg.ok ? '✓ ' : '✗ '}{msg.text}
                      </p>
                    )}
                    <button
                      onClick={() => importPack(pack)}
                      disabled={importing === pack.id}
                      className="ml-auto shrink-0 px-4 py-2 rounded-xl font-black text-sm transition-all hover:scale-[1.03] disabled:opacity-50"
                      style={{
                        background: userTier === 'decouverte'
                          ? 'rgba(245,158,11,0.1)'
                          : 'rgba(0,229,209,0.1)',
                        color: userTier === 'decouverte' ? '#F59E0B' : '#00E5D1',
                        border: `1px solid ${userTier === 'decouverte' ? 'rgba(245,158,11,0.3)' : 'rgba(0,229,209,0.3)'}`,
                      }}>
                      {importing === pack.id ? '…' : userTier === 'decouverte' ? '🔒 Importer' : '⬇ Importer'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
