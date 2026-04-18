// app/profile/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { SubscriptionTier, TIER_LIMITS } from '@/types';
import Link from 'next/link';

interface Profile {
  id: string;
  nickname: string;
  avatar_color: string;
  subscription_tier: SubscriptionTier;
  created_at: string;
}

const TIER_INFO: Record<SubscriptionTier, { label: string; color: string; bg: string; price: string; perks: string[] }> = {
  free:    { label: 'Gratuit',  color: 'rgba(240,244,255,0.5)', bg: 'rgba(255,255,255,0.06)',  price: '0€',    perks: ['Accès aux questions MUZQUIZ', 'Parties illimitées'] },
  pro:     { label: 'Pro',      color: '#00E5D1',               bg: 'rgba(0,229,209,0.1)',      price: '9.99€', perks: ['Tout le Gratuit', 'Jusqu\'à 5 packs (30 questions chacun)', 'Questions personnalisées'] },
  premium: { label: 'Premium',  color: '#F59E0B',               bg: 'rgba(245,158,11,0.1)',     price: '19.99€',perks: ['Tout le Pro', 'Packs illimités', 'Questions illimitées'] },
};

interface GameEntry {
  room_id: string;
  room_code: string;
  mode: 'qcm' | 'buzz';
  score: number;
  rank: number;
  total_players: number;
  created_at: string;
  is_host: boolean;
}

interface HostRoom {
  id: string;
  code: string;
  mode: 'qcm' | 'buzz';
  status: string;
  player_count: number;
  created_at: string;
}

const MODE_LABEL: Record<string, string> = { qcm: '🎵 Quiz Blind Test', buzz: '🔔 Buzz Quiz' };
const AVATAR_COLORS = ['#FF00AA', '#00E5D1', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981'];
const MEDALS = ['🥇', '🥈', '🥉'];

type Tab = 'profile' | 'history' | 'dashboard';

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [games, setGames] = useState<GameEntry[]>([]);
  const [hostedRooms, setHostedRooms] = useState<HostRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('profile');

  // Edition profil
  const [isAdmin, setIsAdmin] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [editColor, setEditColor] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user || user.is_anonymous) {
          router.push('/login');
          return;
        }
        const ADMIN_EMAILS = ['antoine.gegedu27@gmail.com', 'dimitte-14@hotmail.fr'];
        if (ADMIN_EMAILS.includes(user.email ?? '')) setIsAdmin(true);

        // Charger le profil
        const { data: prof } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!prof) {
          // Créer un profil vide si inexistant
          const { data: newProf } = await supabase
            .from('profiles')
            .insert({ id: user.id, nickname: user.email?.split('@')[0] ?? 'Joueur', avatar_color: '#8B5CF6' })
            .select('*')
            .single();
          if (newProf) setProfile(newProf);
        } else {
          setProfile(prof);
        }

        // Charger l'historique des parties
        // Note: room_players utilise "joined_at" (pas "created_at")
        const { data: playerRows } = await supabase
          .from('room_players')
          .select('room_id, score, is_host, rooms(id, code, mode, status, created_at)')
          .eq('user_id', user.id)
          .order('joined_at', { ascending: false })
          .limit(20);

        if (playerRows) {
          // Pour chaque partie, calculer le rang
          const entries: GameEntry[] = [];
          for (const row of playerRows) {
            const room = row.rooms as any;
            if (!room || room.status !== 'finished') continue;

            // Récupérer tous les joueurs de cette salle pour calculer le rang
            const { data: allPlayers } = await supabase
              .from('room_players')
              .select('user_id, score')
              .eq('room_id', row.room_id)
              .order('score', { ascending: false });

            const total = allPlayers?.length ?? 1;
            const rank = (allPlayers?.findIndex(p => p.user_id === user.id) ?? 0) + 1;

            entries.push({
              room_id: row.room_id,
              room_code: room.code,
              mode: room.mode,
              score: row.score,
              rank,
              total_players: total,
              created_at: room.created_at,
              is_host: row.is_host,
            });
          }
          setGames(entries);
        }

        // Charger les salles hébergées
        const { data: rooms } = await supabase
          .from('rooms')
          .select('id, code, mode, status, created_at')
          .eq('host_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20);

        if (rooms) {
          const hostedEntries: HostRoom[] = [];
          for (const room of rooms) {
            const { count } = await supabase
              .from('room_players')
              .select('id', { count: 'exact', head: true })
              .eq('room_id', room.id);
            const playerCount = count ?? 0;

            // Auto-fermeture des salles fantômes (non terminées avec ≤1 joueur = seulement l'hôte ou personne)
            if (room.status !== 'finished' && playerCount <= 1) {
              await supabase.from('rooms').update({ status: 'finished' }).eq('id', room.id);
              hostedEntries.push({ ...room, status: 'finished', player_count: playerCount });
            } else {
              hostedEntries.push({ ...room, player_count: playerCount });
            }
          }
          setHostedRooms(hostedEntries);
        }
      } catch (e) {
        console.error('Erreur chargement profil:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const saveProfile = async () => {
    if (!profile || !editNickname.trim()) return;
    setSaving(true);
    await supabase.from('profiles').update({
      nickname: editNickname.trim(),
      avatar_color: editColor,
    }).eq('id', profile.id);
    setProfile(p => p ? { ...p, nickname: editNickname.trim(), avatar_color: editColor } : p);
    setSaving(false);
    setEditing(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // Stats calculées
  const totalGames = games.length;
  const wins = games.filter(g => g.rank === 1).length;
  const totalScore = games.reduce((s, g) => s + g.score, 0);
  const avgScore = totalGames > 0 ? Math.round(totalScore / totalGames) : 0;

  const formatDate = (str: string) => {
    const d = new Date(str);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen flex-col gap-4" style={{ background: '#0D1B3E' }}>
      <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
        style={{ borderColor: '#FF00AA', borderTopColor: 'transparent' }} />
    </div>
  );

  if (!profile) return (
    <div className="flex items-center justify-center h-screen flex-col gap-4" style={{ background: '#0D1B3E' }}>
      <p className="font-bold" style={{ color: 'rgba(240,244,255,0.5)' }}>Profil introuvable.</p>
      <button onClick={() => router.push('/login')}
        className="muz-btn-pink px-6 py-3 rounded-xl font-black text-sm">
        Se connecter
      </button>
    </div>
  );

  const initial = profile.nickname[0]?.toUpperCase() ?? '?';

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 50%, #0D1B3E 100%)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
        <Link href="/">
          <span className="muz-logo text-2xl font-black cursor-pointer" style={{ fontFamily: 'var(--font-black-han)' }}>
            MUZQUIZ
          </span>
        </Link>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link href="/admin"
              className="text-sm font-bold px-4 py-2 rounded-xl transition-all hover:opacity-80"
              style={{ background: 'rgba(255,0,170,0.08)', color: '#FF00AA', border: '1px solid rgba(255,0,170,0.2)' }}>
              🔐 Admin
            </Link>
          )}
          <button onClick={logout}
            className="text-sm font-bold px-4 py-2 rounded-xl transition-all hover:opacity-80"
            style={{ background: 'rgba(255,0,170,0.1)', color: '#FF00AA', border: '1px solid rgba(255,0,170,0.25)' }}>
            Déconnexion
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">

        {/* Avatar + nom */}
        <div className="flex items-center gap-5 mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center font-black text-3xl flex-shrink-0"
            style={{
              background: profile.avatar_color,
              color: '#0D1B3E',
              boxShadow: `0 0 30px ${profile.avatar_color}66`,
            }}>
            {initial}
          </div>
          <div>
            <h1 className="text-2xl font-black" style={{ color: '#F0F4FF' }}>{profile.nickname}</h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(240,244,255,0.4)' }}>
              Membre depuis {formatDate(profile.created_at)}
            </p>
          </div>
        </div>

        {/* Stats rapides */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Parties', value: totalGames, color: '#8B5CF6' },
            { label: 'Victoires', value: wins, color: '#F59E0B' },
            { label: 'Score moy.', value: avgScore, color: '#00E5D1' },
          ].map(stat => (
            <div key={stat.label} className="muz-card p-4 text-center">
              <div className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-xs font-bold mt-1" style={{ color: 'rgba(240,244,255,0.4)' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex mb-6 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {([
            { key: 'profile', label: '👤 Profil' },
            { key: 'history', label: '📜 Historique' },
            { key: 'dashboard', label: '🎮 Mes salles' },
          ] as { key: Tab; label: string }[]).map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex-1 py-3 text-sm font-bold transition-all"
              style={{
                background: tab === t.key ? '#8B5CF6' : 'transparent',
                color: tab === t.key ? 'white' : 'rgba(240,244,255,0.5)',
                borderRadius: '0.6rem',
              }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ===== TAB PROFIL ===== */}
        {tab === 'profile' && (
          <div className="muz-card p-6">
            {!editing ? (
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1"
                    style={{ color: 'rgba(240,244,255,0.35)' }}>Pseudo</p>
                  <p className="font-bold text-lg" style={{ color: '#F0F4FF' }}>{profile.nickname}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2"
                    style={{ color: 'rgba(240,244,255,0.35)' }}>Couleur de l'avatar</p>
                  <div className="flex gap-2">
                    {AVATAR_COLORS.map(c => (
                      <div key={c} className="w-7 h-7 rounded-full flex-shrink-0"
                        style={{
                          background: c,
                          border: profile.avatar_color === c ? '3px solid white' : '2px solid transparent',
                          boxShadow: profile.avatar_color === c ? `0 0 10px ${c}` : 'none',
                        }} />
                    ))}
                  </div>
                </div>
                {/* Abonnement actuel — lecture seule */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1rem' }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3"
                    style={{ color: 'rgba(240,244,255,0.35)' }}>Abonnement</p>
                  {(() => {
                    const info = TIER_INFO[profile.subscription_tier];
                    return (
                      <div className="flex items-center gap-3 px-4 py-3 rounded-xl"
                        style={{ background: info.bg, border: `1.5px solid ${info.color}66` }}>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm" style={{ color: info.color }}>{info.label}</span>
                            <span className="text-xs font-bold" style={{ color: 'rgba(240,244,255,0.35)' }}>{info.price}/mois</span>
                            <span className="text-xs font-black px-2 py-0.5 rounded-full"
                              style={{ background: info.color + '22', color: info.color }}>Actif</span>
                          </div>
                          <p className="text-xs mt-1" style={{ color: 'rgba(240,244,255,0.4)' }}>
                            {info.perks.join(' · ')}
                          </p>
                        </div>
                      </div>
                    );
                  })()}
                  {profile.subscription_tier === 'free' && (
                    <Link href="/pricing"
                      className="flex items-center justify-center gap-2 mt-3 py-2.5 rounded-xl font-black text-sm transition-all hover:opacity-90"
                      style={{ background: 'rgba(245,158,11,0.1)', color: '#F59E0B', border: '1px solid rgba(245,158,11,0.3)' }}>
                      ⬆ Passer Pro ou Premium →
                    </Link>
                  )}
                </div>

                {/* Lien vers les packs */}
                {TIER_LIMITS[profile.subscription_tier].canCreate && (
                  <Link href="/questions"
                    className="flex items-center justify-between px-4 py-3 rounded-xl transition-all hover:opacity-90"
                    style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)' }}>
                    <div className="flex items-center gap-2">
                      <span>📦</span>
                      <span className="font-bold text-sm" style={{ color: '#8B5CF6' }}>Mes packs de questions</span>
                    </div>
                    <span style={{ color: 'rgba(139,92,246,0.6)' }}>›</span>
                  </Link>
                )}

                <button
                  onClick={() => { setEditing(true); setEditNickname(profile.nickname); setEditColor(profile.avatar_color); }}
                  className="muz-btn-pink py-3 rounded-xl font-black text-sm">
                  Modifier le profil →
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Aperçu */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg flex-shrink-0"
                    style={{ background: editColor, color: '#0D1B3E', boxShadow: `0 0 16px ${editColor}66` }}>
                    {editNickname[0]?.toUpperCase() ?? '?'}
                  </div>
                  <p className="font-bold" style={{ color: '#F0F4FF' }}>{editNickname || '…'}</p>
                </div>

                <input
                  value={editNickname}
                  onChange={e => setEditNickname(e.target.value)}
                  maxLength={16}
                  placeholder="Ton pseudo"
                  className="w-full px-4 py-3 rounded-xl font-medium outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1.5px solid rgba(255,0,170,0.4)',
                    color: '#F0F4FF',
                  }}
                />

                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-2"
                    style={{ color: 'rgba(240,244,255,0.35)' }}>Couleur</p>
                  <div className="flex gap-2">
                    {AVATAR_COLORS.map(c => (
                      <button key={c} onClick={() => setEditColor(c)}
                        className="w-8 h-8 rounded-full transition-all"
                        style={{
                          background: c,
                          border: editColor === c ? '3px solid white' : '2px solid transparent',
                          transform: editColor === c ? 'scale(1.2)' : 'scale(1)',
                          boxShadow: editColor === c ? `0 0 10px ${c}` : 'none',
                        }} />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setEditing(false)}
                    className="flex-1 py-3 rounded-xl font-bold text-sm"
                    style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(240,244,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    Annuler
                  </button>
                  <button onClick={saveProfile} disabled={saving}
                    className="flex-1 muz-btn-pink py-3 rounded-xl font-black text-sm disabled:opacity-50">
                    {saving ? '...' : 'Sauvegarder'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== TAB HISTORIQUE ===== */}
        {tab === 'history' && (
          <div className="flex flex-col gap-3">
            {games.length === 0 ? (
              <div className="muz-card p-8 text-center">
                <div className="text-4xl mb-3">🎮</div>
                <p className="font-bold mb-1" style={{ color: '#F0F4FF' }}>Aucune partie terminée</p>
                <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>
                  Rejoins ou crée une salle pour commencer !
                </p>
                <Link href="/" className="inline-block mt-4 muz-btn-pink px-6 py-3 rounded-xl font-black text-sm">
                  Jouer maintenant →
                </Link>
              </div>
            ) : games.map((g, i) => (
              <div key={`${g.room_id}-${i}`} className="muz-card p-4 flex items-center gap-4">
                {/* Rang */}
                <div className="w-12 h-12 rounded-full flex items-center justify-center font-black flex-shrink-0 text-lg"
                  style={{
                    background: g.rank === 1 ? '#F59E0B' : g.rank === 2 ? '#9CA3AF' : g.rank === 3 ? '#CD7C3A' : 'rgba(255,255,255,0.08)',
                    color: g.rank <= 3 ? '#0D1B3E' : '#F0F4FF',
                    fontSize: g.rank <= 3 ? '1.4rem' : '0.85rem',
                  }}>
                  {g.rank <= 3 ? MEDALS[g.rank - 1] : `#${g.rank}`}
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm" style={{ color: '#F0F4FF' }}>
                      {MODE_LABEL[g.mode]}
                    </span>
                    {g.is_host && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{ background: 'rgba(255,0,170,0.12)', color: '#FF00AA', border: '1px solid rgba(255,0,170,0.25)' }}>
                        hôte
                      </span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(240,244,255,0.4)' }}>
                    {g.total_players} joueur{g.total_players > 1 ? 's' : ''} • {formatDate(g.created_at)}
                  </p>
                </div>

                {/* Score */}
                <div className="text-right flex-shrink-0">
                  <div className="font-black text-lg" style={{ color: '#8B5CF6' }}>{g.score}</div>
                  <div className="text-xs" style={{ color: 'rgba(240,244,255,0.35)' }}>pts</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ===== TAB DASHBOARD HÔTE ===== */}
        {tab === 'dashboard' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold" style={{ color: 'rgba(240,244,255,0.5)' }}>
                {hostedRooms.length} salle{hostedRooms.length > 1 ? 's' : ''} créée{hostedRooms.length > 1 ? 's' : ''}
              </p>
              <Link href="/" className="text-sm font-black px-4 py-2 rounded-xl muz-btn-pink">
                + Créer une salle
              </Link>
            </div>

            {hostedRooms.length === 0 ? (
              <div className="muz-card p-8 text-center">
                <div className="text-4xl mb-3">🏠</div>
                <p className="font-bold mb-1" style={{ color: '#F0F4FF' }}>Aucune salle créée</p>
                <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>
                  Crée ta première salle et invite tes amis !
                </p>
              </div>
            ) : hostedRooms.map(r => (
              <div key={r.id} className="muz-card p-4 flex items-center gap-4">
                {/* Code salle */}
                <div className="font-black font-mono tracking-widest text-base flex-shrink-0 px-3 py-2 rounded-xl"
                  style={{ background: 'rgba(0,229,209,0.08)', color: '#00E5D1', border: '1px solid rgba(0,229,209,0.2)' }}>
                  {r.code}
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm" style={{ color: '#F0F4FF' }}>
                      {MODE_LABEL[r.mode]}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                      style={{
                        background: r.status === 'finished' ? 'rgba(139,92,246,0.12)' : r.status === 'playing' ? 'rgba(0,229,209,0.12)' : 'rgba(255,255,255,0.06)',
                        color: r.status === 'finished' ? '#8B5CF6' : r.status === 'playing' ? '#00E5D1' : 'rgba(240,244,255,0.4)',
                        border: `1px solid ${r.status === 'finished' ? 'rgba(139,92,246,0.25)' : r.status === 'playing' ? 'rgba(0,229,209,0.25)' : 'rgba(255,255,255,0.08)'}`,
                      }}>
                      {r.status === 'finished' ? 'Terminée' : r.status === 'playing' ? 'En cours' : 'En attente'}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(240,244,255,0.4)' }}>
                    {r.player_count} joueur{r.player_count > 1 ? 's' : ''} • {formatDate(r.created_at)}
                  </p>
                </div>

                {/* Bouton fermer pour les salles actives */}
                {r.status !== 'finished' && (
                  <button
                    onClick={async () => {
                      await supabase.from('rooms').update({ status: 'finished' }).eq('id', r.id);
                      setHostedRooms(prev => prev.map(x => x.id === r.id ? { ...x, status: 'finished' } : x));
                    }}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg flex-shrink-0 transition-all hover:opacity-80"
                    style={{
                      background: 'rgba(255,0,170,0.08)',
                      color: 'rgba(255,0,170,0.6)',
                      border: '1px solid rgba(255,0,170,0.15)',
                    }}>
                    Fermer
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Bouton rejouer */}
        <div className="mt-8 text-center">
          <Link href="/" className="muz-btn-pink inline-block px-8 py-4 rounded-xl text-lg font-black">
            Jouer maintenant →
          </Link>
        </div>
      </div>
    </div>
  );
}
