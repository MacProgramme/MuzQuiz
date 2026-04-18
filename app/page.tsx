// app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { GameMode, QuestionPack, SubscriptionTier, TIER_LIMITS } from '@/types';
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

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
  const [userTier, setUserTier] = useState<SubscriptionTier>('free');
  const [myPacks, setMyPacks] = useState<QuestionPack[]>([]);
  const [selectedPackId, setSelectedPackId] = useState<string | null>(null);
  const [useCustom, setUseCustom] = useState(false);
  const [publicScreen, setPublicScreen] = useState(false);

  useEffect(() => {
    const loadProfile = async (userId: string) => {
      setProfileLoading(true);
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('nickname, subscription_tier')
          .eq('id', userId)
          .single();
        if (profile?.nickname) setNickname(profile.nickname);
        const tier = (profile?.subscription_tier as SubscriptionTier) ?? 'free';
        setUserTier(tier);

        if (TIER_LIMITS[tier].canCreate) {
          const { data: packs } = await supabase
            .from('question_packs')
            .select('*')
            .eq('owner_id', userId)
            .order('created_at', { ascending: false });
          if (packs) setMyPacks(packs as QuestionPack[]);
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
        setUserTier('free');
        setMyPacks([]);
        setProfileLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const genCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

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

      const roomCode = genCode();
      const { data: room, error } = await supabase
        .from('rooms')
        .insert({ code: roomCode, host_id: userId, mode, timer_duration: 20, max_players: 100, sound_enabled: true, pack_id: (useCustom && selectedPackId) ? selectedPackId : null, public_screen: publicScreen })
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

  return (
    <main className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 50%, #0D1B3E 100%)' }}>

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
          {isLoggedIn ? '👤 Mon compte' : 'Connexion'}
        </Link>
      </div>

      {/* Contenu centré */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">

      {/* Logo + Moustache SVG */}
      <div className="flex flex-col items-center mb-2">
        <MuzquizLogo width={200} textSize="3.5rem" animate />
      </div>
      <p className="text-sm mb-10" style={{ color: 'rgba(240,244,255,0.4)' }}>
        Quiz & Blind Test en temps réel
      </p>

      {/* Card principale */}
      <div className="muz-card w-full max-w-md p-8">

        {/* Tabs */}
        <div className="flex mb-6 rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {(['create', 'join'] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); setErr(''); }}
              className="flex-1 py-3 text-sm font-bold transition-all"
              style={{
                background: tab === t ? '#FF00AA' : 'transparent',
                color: tab === t ? 'white' : 'rgba(240,244,255,0.5)',
                borderRadius: '0.6rem',
              }}>
              {t === 'create' ? '✚ Créer une salle' : '→ Rejoindre'}
            </button>
          ))}
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

          {/* Mode de jeu (créer) */}
          {tab === 'create' && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(240,244,255,0.4)' }}>
                Mode de jeu
              </p>
              <div className="flex gap-3">
                {[
                  { value: 'qcm' as GameMode, icon: '🎵', label: 'Quiz Blind Test', sub: '4 choix simultané' },
                  { value: 'buzz' as GameMode, icon: '🔔', label: 'Buzz Quiz', sub: 'Buzz puis 4 choix' },
                ].map(m => (
                  <button key={m.value} onClick={() => setMode(m.value)}
                    className="flex-1 flex flex-col items-center gap-1 py-4 rounded-xl transition-all"
                    style={{
                      border: mode === m.value ? '2px solid #FF00AA' : '2px solid rgba(139,92,246,0.2)',
                      background: mode === m.value ? 'rgba(255,0,170,0.1)' : 'rgba(255,255,255,0.04)',
                    }}>
                    <span className="text-2xl">{m.icon}</span>
                    <span className="font-black text-sm" style={{ color: mode === m.value ? '#FF00AA' : '#F0F4FF' }}>
                      {m.label}
                    </span>
                    <span className="text-xs" style={{ color: 'rgba(240,244,255,0.35)' }}>{m.sub}</span>
                  </button>
                ))}
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
                <p className="font-black text-sm" style={{ color: publicScreen ? '#00E5D1' : '#F0F4FF' }}>
                  📺 Mode écran public
                </p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(240,244,255,0.4)' }}>
                  Bar / salle de jeux — question sur grand écran, boutons sur téléphone
                </p>
              </div>
              <div className="w-12 h-6 rounded-full transition-all relative ml-4 flex-shrink-0"
                style={{ background: publicScreen ? '#00E5D1' : 'rgba(255,255,255,0.12)' }}>
                <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                  style={{ left: publicScreen ? '1.5rem' : '2px' }} />
              </div>
            </button>
          )}

          {/* Sélection pack (créer, Pro/Premium) */}
          {tab === 'create' && TIER_LIMITS[userTier].canCreate && myPacks.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(240,244,255,0.4)' }}>
                  Questions
                </p>
                <Link href="/questions" className="text-xs font-bold" style={{ color: '#8B5CF6' }}>
                  Gérer mes packs →
                </Link>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => setUseCustom(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left"
                  style={{
                    background: !useCustom ? 'rgba(139,92,246,0.12)' : 'rgba(255,255,255,0.04)',
                    border: !useCustom ? '1.5px solid rgba(139,92,246,0.4)' : '1.5px solid rgba(255,255,255,0.08)',
                  }}>
                  <span className="text-lg">📚</span>
                  <span className="text-sm font-bold" style={{ color: '#F0F4FF' }}>Questions MUZQUIZ (défaut)</span>
                </button>
                {myPacks.map(pack => (
                  <button key={pack.id}
                    onClick={() => { setUseCustom(true); setSelectedPackId(pack.id); setMode(pack.mode); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left"
                    style={{
                      background: useCustom && selectedPackId === pack.id ? 'rgba(255,0,170,0.1)' : 'rgba(255,255,255,0.04)',
                      border: useCustom && selectedPackId === pack.id ? '1.5px solid rgba(255,0,170,0.4)' : '1.5px solid rgba(255,255,255,0.08)',
                    }}>
                    <span className="text-lg">📦</span>
                    <div>
                      <p className="text-sm font-bold" style={{ color: useCustom && selectedPackId === pack.id ? '#FF00AA' : '#F0F4FF' }}>
                        {pack.name}
                      </p>
                      <p className="text-xs" style={{ color: 'rgba(240,244,255,0.35)' }}>
                        {pack.mode === 'qcm' ? '🎵 Quiz Blind Test' : '🔔 Buzz Quiz'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input code (rejoindre) */}
          {tab === 'join' && (
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
          )}

          {err && (
            <p className="text-center text-sm font-bold" style={{ color: '#FF00AA' }}>{err}</p>
          )}

          {/* Bouton principal */}
          <button
            onClick={tab === 'create' ? createRoom : joinRoom}
            disabled={loading}
            className={`muz-btn-${tab === 'create' ? 'pink' : 'cyan'} py-4 rounded-xl text-lg font-black tracking-wide disabled:opacity-50`}
          >
            {loading ? '...' : tab === 'create' ? 'Créer la salle →' : 'Rejoindre →'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <Link href="/pricing"
        className="mt-6 text-sm font-bold transition-all hover:opacity-100"
        style={{ color: 'rgba(139,92,246,0.7)' }}>
        Voir les abonnements →
      </Link>
      <p className="text-xs mt-2" style={{ color: 'rgba(240,244,255,0.25)' }}>
        Gratuit • Jouez maintenant avec vos amis
      </p>

      </div>{/* fin contenu centré */}
    </main>
  );
}
