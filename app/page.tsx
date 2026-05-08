// app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { GameMode, SubscriptionTier, TIER_LIMITS, normalizeTier } from '@/types';
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';
import { MustacheMedal, MEDAL_COLORS } from '@/components/MustacheMedal';
import { QRScanner } from '@/components/QRScanner';
import { DailyQuiz } from '@/components/DailyQuiz';

export default function Home() {
  const router = useRouter();
  const [tab, setTab] = useState<'create' | 'join'>('create');
  const [nickname, setNickname] = useState('');
  const [code, setCode] = useState('');
  const [mode, setMode] = useState<GameMode>('buzz');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [userTier, setUserTier] = useState<SubscriptionTier>('decouverte');
  const [publicScreen, setPublicScreen] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  // Pour le Quiz du Jour
  const [userId, setUserId] = useState<string | null>(null);
  const [avatarColor, setAvatarColor] = useState('#8B5CF6');

  // Salle active (hôte revenant du menu principal après un replay)
  const [activeWaitingRoom, setActiveWaitingRoom] = useState<{ id: string; code: string; mode: GameMode; inviteCode: string | null } | null>(null);

  // Classement journalier (mini — top 3 sur la home)
  type MiniEntry = { user_id: string; nickname: string; avatar_color: string; score: number; rank: number };
  const [miniLeaderboard, setMiniLeaderboard] = useState<MiniEntry[]>([]);

  // Lecture du param ?join=CODE dans l'URL (depuis un QR code scanné nativement)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get('join');
    if (joinCode) {
      setTab('join');
      setCode(joinCode.toUpperCase());
      // Nettoyer l'URL sans recharger la page
      window.history.replaceState({}, '', '/');
    }
  }, []);

  useEffect(() => {
    const loadProfile = async (uid: string) => {
      setProfileLoading(true);
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('nickname, subscription_tier, avatar_color, invite_code')
          .eq('id', uid)
          .single();
        if (profile?.nickname) setNickname(profile.nickname);
        const tier = normalizeTier(profile?.subscription_tier);
        setUserTier(tier);
        setAvatarColor(profile?.avatar_color ?? '#8B5CF6');
        setUserId(uid);

        // Détecter une salle en attente dont l'hôte est cet utilisateur
        const { data: waitingRoom } = await supabase
          .from('rooms')
          .select('id, code, mode, public_screen')
          .eq('host_id', uid)
          .eq('status', 'waiting')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (waitingRoom) {
          setActiveWaitingRoom({
            ...(waitingRoom as { id: string; code: string; mode: GameMode }),
            inviteCode: (profile as any)?.invite_code ?? null,
          });
          setMode((waitingRoom as any).mode as GameMode);
          setPublicScreen((waitingRoom as any).public_screen ?? false);
          setTab('create'); // on reste sur l'onglet "créer" qui sera remplacé par "Ma salle"
        } else {
          setActiveWaitingRoom(null);
        }
      } catch (e) {
        console.error('Erreur chargement profil:', e);
      } finally {
        setProfileLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // TOKEN_REFRESHED = simple renouvellement JWT en arrière-plan, pas besoin de recharger
      if (event === 'TOKEN_REFRESHED') return;

      const user = session?.user;
      const loggedIn = !!(user && !user.is_anonymous);
      setIsLoggedIn(loggedIn);

      if (loggedIn && user) {
        loadProfile(user.id);
      } else {
        setNickname('');
        setUserTier('decouverte');
        setUserId(null);
        setAvatarColor('#8B5CF6');
        setProfileLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Charger le mini classement journalier (top 3) au montage
  useEffect(() => {
    const loadMini = async () => {
      const now = new Date();
      const paris = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
      const dateStr = `${paris.getFullYear()}-${String(paris.getMonth() + 1).padStart(2, '0')}-${String(paris.getDate()).padStart(2, '0')}`;
      const { data } = await (supabase as any).rpc('get_daily_leaderboard', { target_date: dateStr });
      if (data) setMiniLeaderboard((data as MiniEntry[]).slice(0, 3));
    };
    loadMini();
  }, []);

  // Exclut le 0 (zéro) et le O (lettre) pour éviter la confusion
  const genCode = () => {
    // Exclut O/0 (confusion visuelle) et I/1 (confusion visuelle)
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  };

  const createRoom = async () => {
    if (!nickname.trim()) { setErr('Entre ton pseudo !'); return; }
    setLoading(true);
    setErr('');

    try {
      // getSession() lit depuis le cache — plus fiable que getUser() qui fait une requête réseau
      const { data: { session } } = await supabase.auth.getSession();
      let userId = session?.user?.id;

      // Seulement si pas du tout connecté (pas de session du tout)
      if (!userId) {
        const { data } = await supabase.auth.signInAnonymously();
        userId = data.user?.id;
      }
      if (!userId) { setErr("Erreur d'authentification. Recharge la page."); setLoading(false); return; }

      // Relire le tier en DB au moment de la création pour éviter tout problème de timing
      let currentTier = userTier;
      if (session?.user && !session.user.is_anonymous) {
        const { data: freshProfile } = await supabase
          .from('profiles')
          .select('subscription_tier')
          .eq('id', userId)
          .single();
        if (freshProfile?.subscription_tier) {
          currentTier = normalizeTier(freshProfile.subscription_tier);
        }
      }

      const roomCode = genCode();
      const { data: room, error } = await supabase
        .from('rooms')
        .insert({ code: roomCode, host_id: userId, mode, timer_duration: 20, max_players: TIER_LIMITS[currentTier].maxPlayers, sound_enabled: true, pack_id: null, public_screen: publicScreen })
        .select('*')
        .single();

      if (error || !room) {
        setErr(`Erreur lors de la création : ${error?.message ?? 'inconnue'}`);
        setLoading(false);
        return;
      }

      await supabase.from('room_players').insert({
        room_id: room.id,
        user_id: userId,
        nickname: nickname.trim(),
        is_host: true,
      });

      setLoading(false);
      router.push(`/room/${roomCode}?nickname=${encodeURIComponent(nickname.trim())}`);
    } catch (e: any) {
      setErr(`Erreur inattendue : ${e?.message ?? String(e)}`);
      setLoading(false);
    }
  };

  const joinRoom = async () => {
    if (!nickname.trim()) { setErr('Entre ton pseudo !'); return; }
    if (!code.trim()) { setErr('Entre le code de la salle !'); return; }
    router.push(`/room/${code.toUpperCase()}?nickname=${encodeURIComponent(nickname.trim())}`);
  };

  // Rejoindre la salle en attente existante après avoir choisi le mode depuis la home
  const joinActiveRoom = async () => {
    if (!activeWaitingRoom || loading) return;
    setLoading(true);
    // Appliquer le mode et l'écran public sélectionnés sur la salle existante
    await supabase.from('rooms').update({ mode, public_screen: publicScreen }).eq('id', activeWaitingRoom.id);
    router.push(`/room/${activeWaitingRoom.code}?nickname=${encodeURIComponent(nickname.trim() || 'Hôte')}&replay=1`);
  };

  return (
    <main className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 50%, #0D1B3E 100%)' }}>

      {/* Scanner QR modal */}
      {showScanner && (
        <QRScanner
          onScan={(scanned) => {
            setCode(scanned);
            setTab('join');
          }}
          onClose={() => setShowScanner(false)}
        />
      )}

      {/* Barre de navigation */}
      <div className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: '1px solid rgba(139,92,246,0.1)' }}>
        <MuzquizLogo width={40} textSize="1.1rem" horizontal />
        <Link href={isLoggedIn ? '/profile' : '/login'}
          className="text-sm font-bold px-4 py-2 rounded-xl transition-all hover:opacity-90"
          style={{
            background: isLoggedIn ? 'rgba(139,92,246,0.15)' : 'rgba(255,255,255,0.07)',
            color: isLoggedIn ? '#8B5CF6' : 'rgba(240,244,255,0.6)',
            border: `1px solid ${isLoggedIn ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.1)'}`,
          }}>
          {isLoggedIn ? 'Mon compte' : 'Connexion'}
        </Link>
      </div>

      {/* Contenu centré */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 muz-fade-in">

      {/* Logo */}
      <div className="flex flex-col items-center mb-3">
        <MuzquizLogo width={200} textSize="3.5rem" animate />
      </div>
      {/* Séparateur décoratif */}
      <div className="muz-divider w-48 mb-8" />

      {/* Quiz du Jour — accès rapide (essentiel et supérieur) */}
      {isLoggedIn && userId && (userTier === 'essentiel' || userTier === 'pro' || userTier === 'expert') && (
        <div className="w-full max-w-md mb-8">
          <div className="flex items-center gap-2 mb-3">
            <MuzquizLogo width={20} showText={false} color="rgba(255,0,170,0.7)" />
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(240,244,255,0.35)' }}>
              Quiz du Jour
            </p>
            <span className="text-xs font-black px-2 py-0.5 rounded-full ml-auto"
              style={{
                background: userTier === 'expert' ? 'rgba(245,158,11,0.15)' : userTier === 'pro' ? 'rgba(139,92,246,0.15)' : 'rgba(0,229,209,0.15)',
                color: userTier === 'expert' ? '#F59E0B' : userTier === 'pro' ? '#8B5CF6' : '#00E5D1',
                border: `1px solid ${userTier === 'expert' ? 'rgba(245,158,11,0.3)' : userTier === 'pro' ? 'rgba(139,92,246,0.3)' : 'rgba(0,229,209,0.3)'}`,
              }}>
              {userTier === 'expert' ? '⭐ Expert' : userTier === 'pro' ? '🚀 Pro' : '✨ Essentiel'}
            </span>
          </div>
          <DailyQuiz userId={userId} nickname={nickname} avatarColor={avatarColor} />
        </div>
      )}

      {/* Mini classement journalier — visible par tous */}
      {miniLeaderboard.length > 0 && (
        <div className="w-full max-w-md mb-6">
          <div className="flex items-center gap-2 mb-3">
            <MuzquizLogo width={20} showText={false} color="rgba(240,244,255,0.35)" />
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(240,244,255,0.35)' }}>
              Top du jour — Quiz du Jour
            </p>
          </div>
          <div className="flex flex-col gap-2">
            {miniLeaderboard.map((e) => {
              const rank = Number(e.rank) as 1 | 2 | 3;
              const isMe = userId === e.user_id;
              const rankColor = rank <= 3 ? MEDAL_COLORS[rank].fill : 'rgba(240,244,255,0.3)';
              return (
                <div
                  key={e.user_id}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-2xl"
                  style={{
                    background: isMe
                      ? 'rgba(139,92,246,0.12)'
                      : rank === 1
                      ? 'rgba(245,158,11,0.08)'
                      : 'rgba(255,255,255,0.03)',
                    border: isMe
                      ? '1.5px solid rgba(139,92,246,0.4)'
                      : rank === 1
                      ? '1.5px solid rgba(245,158,11,0.3)'
                      : '1.5px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <div className="flex items-center justify-center flex-shrink-0" style={{ width: 36 }}>
                    {rank <= 3
                      ? <MustacheMedal rank={rank} width={36} />
                      : <span className="font-black text-xs" style={{ color: rankColor }}>#{rank}</span>
                    }
                  </div>
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0"
                    style={{ background: e.avatar_color ?? '#8B5CF6', color: '#0D1B3E' }}
                  >
                    {e.nickname[0]?.toUpperCase()}
                  </div>
                  <span className="flex-1 font-bold text-sm truncate" style={{ color: isMe ? '#8B5CF6' : '#F0F4FF' }}>
                    {e.nickname} {isMe && <span className="text-xs opacity-50">(toi)</span>}
                  </span>
                  <span
                    className="font-black text-sm flex-shrink-0"
                    style={{ color: Number(e.rank) === 1 ? '#F59E0B' : isMe ? '#8B5CF6' : 'rgba(240,244,255,0.6)' }}
                  >
                    {e.score} pts
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Card principale */}
      <div className="muz-card muz-card-pink w-full max-w-md p-8">

        {/* Tabs */}
        <div className="flex mb-6 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <button onClick={() => { setTab('create'); setErr(''); }}
            className="flex-1 py-3 text-sm font-bold transition-all"
            style={{
              background: tab === 'create' ? (activeWaitingRoom ? '#00E5D1' : '#FF00AA') : 'transparent',
              color: tab === 'create' ? (activeWaitingRoom ? '#0D1B3E' : 'white') : 'rgba(240,244,255,0.5)',
              borderRadius: '0.6rem',
            }}>
            {activeWaitingRoom ? '● Ma salle' : '✚ Créer une salle'}
          </button>
          <button onClick={() => { setTab('join'); setErr(''); }}
            className="flex-1 py-3 text-sm font-bold transition-all"
            style={{
              background: tab === 'join' ? '#FF00AA' : 'transparent',
              color: tab === 'join' ? 'white' : 'rgba(240,244,255,0.5)',
              borderRadius: '0.6rem',
            }}>
            → Rejoindre
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Input pseudo — verrouillé si connecté avec un compte */}
          <div className="relative">
            <input
              value={nickname}
              onChange={e => !(isLoggedIn && nickname) && setNickname(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && (tab === 'create' ? createRoom() : joinRoom())}
              placeholder={profileLoading && isLoggedIn ? 'Chargement…' : 'Ton pseudo'}
              maxLength={16}
              readOnly={isLoggedIn && !!nickname}
              className="w-full px-4 py-3 rounded-xl font-medium outline-none transition-all"
              style={{
                background: isLoggedIn && nickname ? 'rgba(139,92,246,0.08)' : 'rgba(255,255,255,0.07)',
                border: `1.5px solid ${isLoggedIn && nickname ? 'rgba(139,92,246,0.4)' : 'rgba(139,92,246,0.3)'}`,
                color: '#F0F4FF',
                cursor: isLoggedIn && nickname ? 'default' : 'text',
              }}
              onFocus={e => { if (!(isLoggedIn && nickname)) e.target.style.borderColor = '#FF00AA'; }}
              onBlur={e => { if (!(isLoggedIn && nickname)) e.target.style.borderColor = 'rgba(139,92,246,0.3)'; }}
            />
            {isLoggedIn && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{ background: 'rgba(139,92,246,0.15)', color: '#8B5CF6' }}>
                {profileLoading && !nickname
                  ? <span className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#8B5CF6', borderTopColor: 'transparent' }} />
                  : 'compte'}
              </span>
            )}
          </div>

          {/* Mode de jeu (créer) — 4 boutons */}
          {tab === 'create' && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(240,244,255,0.4)' }}>
                Mode de jeu
              </p>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { value: 'quiz'            as GameMode, label: 'Quiz',            sub: '4 choix simultané',  color: '#8B5CF6', mechanic: 'QCM',  minTier: 'decouverte' },
                  { value: 'blind_test'      as GameMode, label: 'Blind Test',       sub: 'Musique, 4 choix',   color: '#00E5D1', mechanic: 'QCM',  minTier: 'pro' },
                  { value: 'buzz_quiz'       as GameMode, label: 'Buzz Quiz',        sub: 'Buzz puis répondre', color: '#FF00AA', mechanic: 'BUZZ', minTier: 'decouverte' },
                  { value: 'buzz_blind_test' as GameMode, label: 'Buzz Blind Test',  sub: 'Musique + buzz',     color: '#F59E0B', mechanic: 'BUZZ', minTier: 'pro' },
                ] as const).map(m => {
                  const tierOrder: SubscriptionTier[] = ['decouverte', 'essentiel', 'pro', 'expert'];
                  const locked = isLoggedIn && tierOrder.indexOf(userTier) < tierOrder.indexOf(m.minTier as SubscriptionTier);
                  return (
                  <button key={m.value}
                    onClick={() => { if (!locked) setMode(m.value); }}
                    className="flex flex-col items-start gap-1 p-3 rounded-xl transition-all text-left relative overflow-hidden"
                    style={{
                      border: `2px solid ${locked ? 'rgba(255,255,255,0.06)' : mode === m.value ? m.color : 'rgba(139,92,246,0.15)'}`,
                      background: locked ? 'rgba(255,255,255,0.02)' : mode === m.value ? `${m.color}18` : 'rgba(255,255,255,0.03)',
                      cursor: locked ? 'not-allowed' : 'pointer',
                      opacity: locked ? 0.5 : 1,
                    }}>
                    <div className="flex items-center gap-1.5 w-full">
                      <MuzquizLogo width={22} showText={false} color={locked ? 'rgba(240,244,255,0.15)' : mode === m.value ? m.color : 'rgba(240,244,255,0.25)'} />
                      <span className="text-xs font-black px-1.5 py-0.5 rounded-md"
                        style={{
                          background: mode === m.value && !locked ? `${m.color}25` : 'transparent',
                          color: locked ? 'rgba(240,244,255,0.15)' : mode === m.value ? m.color : 'rgba(240,244,255,0.2)',
                          fontSize: '0.6rem', letterSpacing: '0.08em',
                        }}>
                        {m.mechanic}
                      </span>
                      {locked && <span className="ml-auto text-xs" style={{ color: 'rgba(240,244,255,0.25)' }}>🔒 Pro</span>}
                    </div>
                    <span className="font-black text-sm leading-tight" style={{ color: locked ? 'rgba(240,244,255,0.3)' : mode === m.value ? m.color : '#F0F4FF' }}>
                      {m.label}
                    </span>
                    <span className="text-xs" style={{ color: 'rgba(240,244,255,0.3)' }}>{m.sub}</span>
                  </button>
                );})}
              </div>
            </div>
          )}


          {/* Toggle mode écran public */}
          {tab === 'create' && (
            <button
              onClick={() => setPublicScreen(s => !s)}
              className="flex items-center justify-between px-4 py-3 rounded-xl w-full text-left transition-all"
              style={{
                background: publicScreen ? 'rgba(0,229,209,0.08)' : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${publicScreen ? 'rgba(0,229,209,0.4)' : 'rgba(255,255,255,0.1)'}`,
              }}>
              <div>
                <div className="flex items-center gap-2">
                  <MuzquizLogo width={20} showText={false} />
                  <p className="font-black text-sm" style={{ color: publicScreen ? '#00E5D1' : '#F0F4FF' }}>
                    Mode écran public
                  </p>
                </div>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(240,244,255,0.4)' }}>
                  Bar / salle de jeux — question sur grand écran
                </p>
              </div>
              <div className="w-12 h-6 rounded-full transition-all relative ml-4 flex-shrink-0"
                style={{ background: publicScreen ? '#00E5D1' : 'rgba(255,255,255,0.12)' }}>
                <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                  style={{ left: publicScreen ? '1.5rem' : '2px' }} />
              </div>
            </button>
          )}

          {/* Input code (rejoindre) */}
          {tab === 'join' && (
            <div className="flex flex-col gap-3">
              <input
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && joinRoom()}
                placeholder="CODE DE LA SALLE"
                maxLength={8}
                className="w-full px-4 py-3 rounded-xl font-mono text-lg font-black tracking-widest uppercase outline-none transition-all text-center"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1.5px solid rgba(0,229,209,0.3)',
                  color: '#00E5D1',
                  letterSpacing: '0.2em',
                }}
                onFocus={e => e.target.style.borderColor = '#00E5D1'}
                onBlur={e => e.target.style.borderColor = 'rgba(0,229,209,0.3)'}
              />
              {/* Bouton scanner QR */}
              <button
                onClick={() => setShowScanner(true)}
                className="flex items-center justify-center gap-2.5 py-3 rounded-xl font-bold text-sm transition-all hover:opacity-90"
                style={{
                  background: 'rgba(0,229,209,0.07)',
                  border: '1.5px solid rgba(0,229,209,0.25)',
                  color: '#00E5D1',
                }}>
                {/* Icône QR code minimaliste */}
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <rect x="3" y="3" width="2" height="2" fill="currentColor"/>
                  <rect x="11" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <rect x="13" y="3" width="2" height="2" fill="currentColor"/>
                  <rect x="1" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                  <rect x="3" y="13" width="2" height="2" fill="currentColor"/>
                  <rect x="11" y="11" width="2" height="2" fill="currentColor"/>
                  <rect x="15" y="11" width="2" height="2" fill="currentColor"/>
                  <rect x="11" y="15" width="2" height="2" fill="currentColor"/>
                  <rect x="15" y="15" width="2" height="2" fill="currentColor"/>
                  <rect x="13" y="13" width="2" height="2" fill="currentColor"/>
                </svg>
                Scanner un QR code
              </button>
            </div>
          )}

          {err && (
            <p className="text-center text-sm font-bold" style={{ color: '#FF00AA' }}>{err}</p>
          )}

          {/* Bouton principal */}
          <button
            onClick={
              tab === 'create'
                ? (activeWaitingRoom ? joinActiveRoom : createRoom)
                : joinRoom
            }
            disabled={loading}
            className={`py-4 rounded-xl text-lg font-black tracking-wide disabled:opacity-50 ${
              tab === 'create' && activeWaitingRoom ? '' : tab === 'create' ? 'muz-btn-pink' : 'muz-btn-cyan'
            }`}
            style={tab === 'create' && activeWaitingRoom ? {
              background: '#00E5D1',
              color: '#0D1B3E',
              boxShadow: '0 0 20px rgba(0,229,209,0.25)',
            } : undefined}
          >
            {loading ? '...' : tab === 'create'
              ? (activeWaitingRoom ? 'Rejoindre ma salle →' : 'Créer la salle →')
              : 'Rejoindre →'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <Link href="/pricing"
        className="mt-7 text-xs font-bold tracking-wide uppercase transition-all hover:opacity-100"
        style={{ color: 'rgba(139,92,246,0.55)', letterSpacing: '0.08em' }}>
        Formules & abonnements →
      </Link>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-bold"
        style={{ color: 'rgba(240,244,255,0.2)' }}>
        <Link href="/mentions-legales" className="hover:opacity-70 transition-opacity">Mentions légales</Link>
        <span style={{ color: 'rgba(240,244,255,0.1)' }}>·</span>
        <Link href="/cgu" className="hover:opacity-70 transition-opacity">CGU</Link>
        <span style={{ color: 'rgba(240,244,255,0.1)' }}>·</span>
        <Link href="/cgv" className="hover:opacity-70 transition-opacity">CGV</Link>
        <span style={{ color: 'rgba(240,244,255,0.1)' }}>·</span>
        <Link href="/confidentialite" className="hover:opacity-70 transition-opacity">Confidentialité</Link>
      </div>

      </div>{/* fin contenu centré */}
    </main>
  );
}
