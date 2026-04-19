// app/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { GameMode, QuestionPack, SubscriptionTier, TIER_LIMITS, MODE_DISPLAY } from '@/types';
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';
import { QRScanner } from '@/components/QRScanner';

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
  const [showScanner, setShowScanner] = useState(false);

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
      <div className="flex-1 flex flex-col items-center justify-center p-6">

      {/* Logo */}
      <div className="flex flex-col items-center mb-3">
        <MuzquizLogo width={200} textSize="3.5rem" animate />
        <p className="text-sm mt-3 font-medium tracking-wide" style={{ color: 'rgba(240,244,255,0.38)', letterSpacing: '0.05em' }}>
          Quizz musical avec tes potes — le vrai.
        </p>
      </div>
      {/* Séparateur décoratif */}
      <div className="muz-divider w-48 mb-8" />

      {/* Card principale */}
      <div className="muz-card muz-card-pink w-full max-w-md p-8">

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

          {/* Mode de jeu (créer) — 4 boutons */}
          {tab === 'create' && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(240,244,255,0.4)' }}>
                Mode de jeu
              </p>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { value: 'quiz'            as GameMode, label: 'Quiz',            sub: '4 choix simultané',  color: '#8B5CF6', mechanic: 'QCM' },
                  { value: 'blind_test'      as GameMode, label: 'Blind Test',       sub: 'Musique, 4 choix',   color: '#00E5D1', mechanic: 'QCM' },
                  { value: 'buzz_quiz'       as GameMode, label: 'Buzz Quiz',        sub: 'Buzz puis répondre', color: '#FF00AA', mechanic: 'BUZZ' },
                  { value: 'buzz_blind_test' as GameMode, label: 'Buzz Blind Test',  sub: 'Musique + buzz',     color: '#F59E0B', mechanic: 'BUZZ' },
                ] as const).map(m => (
                  <button key={m.value} onClick={() => setMode(m.value)}
                    className="flex flex-col items-start gap-1 p-3 rounded-xl transition-all text-left"
                    style={{
                      border: `2px solid ${mode === m.value ? m.color : 'rgba(139,92,246,0.15)'}`,
                      background: mode === m.value ? `${m.color}18` : 'rgba(255,255,255,0.03)',
                    }}>
                    <div className="flex items-center gap-1.5 w-full">
                      <MuzquizLogo width={22} showText={false} color={mode === m.value ? m.color : 'rgba(240,244,255,0.25)'} />
                      <span className="text-xs font-black px-1.5 py-0.5 rounded-md"
                        style={{
                          background: mode === m.value ? `${m.color}25` : 'transparent',
                          color: mode === m.value ? m.color : 'rgba(240,244,255,0.2)',
                          fontSize: '0.6rem', letterSpacing: '0.08em',
                        }}>
                        {m.mechanic}
                      </span>
                    </div>
                    <span className="font-black text-sm leading-tight" style={{ color: mode === m.value ? m.color : '#F0F4FF' }}>
                      {m.label}
                    </span>
                    <span className="text-xs" style={{ color: 'rgba(240,244,255,0.3)' }}>{m.sub}</span>
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
                <div className="flex items-center gap-2">
                  <MuzquizLogo width={20} showText={false} />
                  <p className="font-black text-sm" style={{ color: publicScreen ? '#00E5D1' : '#F0F4FF' }}>
                    Mode écran public
                  </p>
                </div>
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
                  <MuzquizLogo width={22} showText={false} />
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
                    <MuzquizLogo width={22} showText={false} />
                    <div>
                      <p className="text-sm font-bold" style={{ color: useCustom && selectedPackId === pack.id ? '#FF00AA' : '#F0F4FF' }}>
                        {pack.name}
                      </p>
                      <p className="text-xs" style={{ color: 'rgba(240,244,255,0.35)' }}>
                        {pack.mode === 'qcm' ? 'Quiz Blind Test' : 'Buzz Quiz'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
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
        className="mt-7 text-xs font-bold tracking-wide uppercase transition-all hover:opacity-100"
        style={{ color: 'rgba(139,92,246,0.55)', letterSpacing: '0.08em' }}>
        Formules & abonnements →
      </Link>

      </div>{/* fin contenu centré */}
    </main>
  );
}
