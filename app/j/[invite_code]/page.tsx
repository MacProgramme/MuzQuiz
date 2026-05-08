// app/j/[invite_code]/page.tsx
// Page de rejointe via lien d'invitation permanent.
// L'hôte partage ce lien une seule fois ; il redirige automatiquement
// vers la salle active quand l'hôte lance une partie.
"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MuzquizLogo } from '@/components/MuzquizLogo';

type Step = 'loading' | 'enter-nickname' | 'waiting-host' | 'redirecting' | 'error';

export default function JoinByInvitePage() {
  const { invite_code } = useParams<{ invite_code: string }>();
  const router = useRouter();

  const inviteCode = (invite_code as string)?.toUpperCase();

  const [step, setStep] = useState<Step>('loading');
  const [nickname, setNickname] = useState('');
  const [hostNickname, setHostNickname] = useState('');
  const [hostId, setHostId] = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState('');

  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const redirectedRef = useRef(false);

  // ── Charger le profil de l'hôte ──────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      // Pré-remplir le pseudo si l'utilisateur est connecté
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && !session.user.is_anonymous) {
        const { data: me } = await supabase
          .from('profiles')
          .select('nickname')
          .eq('id', session.user.id)
          .single();
        if (me?.nickname) setNickname(me.nickname);
      } else {
        // Pseudo anonyme sauvegardé localement
        const saved = typeof window !== 'undefined' ? localStorage.getItem('muz_nickname') : null;
        if (saved) setNickname(saved);
      }

      // Chercher l'hôte via son invite_code
      const { data: host, error } = await supabase
        .from('profiles')
        .select('id, nickname')
        .eq('invite_code', inviteCode)
        .single();

      if (error || !host) {
        setErrMsg("Ce lien d'invitation n'existe pas ou a expiré.");
        setStep('error');
        return;
      }

      setHostId(host.id);
      setHostNickname(host.nickname || 'Hôte');
      setStep('enter-nickname');
    };

    if (inviteCode) load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteCode]);

  // ── Chercher la salle active et s'abonner ────────────────────────────────
  const goToRoom = (roomCode: string) => {
    if (redirectedRef.current) return;
    redirectedRef.current = true;
    if (pollRef.current) clearInterval(pollRef.current);
    if (channelRef.current) supabase.removeChannel(channelRef.current);

    const nick = nickname.trim() || 'Joueur';
    if (typeof window !== 'undefined') localStorage.setItem('muz_nickname', nick);
    router.push(`/room/${roomCode}?nickname=${encodeURIComponent(nick)}`);
  };

  const findAndWait = async () => {
    if (!hostId) return;

    setStep('waiting-host');

    // Chercher la salle active de l'hôte
    const fetchRoom = async () => {
      const { data } = await supabase
        .from('rooms')
        .select('code, status')
        .eq('host_id', hostId)
        .in('status', ['waiting', 'playing'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      return data;
    };

    const existing = await fetchRoom();
    if (existing) { goToRoom(existing.code); return; }

    // Pas de salle active → s'abonner aux nouvelles salles de cet hôte
    const channel = supabase
      .channel(`muz-invite-wait-${hostId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'rooms', filter: `host_id=eq.${hostId}` },
        (payload: any) => {
          const s = payload.new?.status;
          if (s === 'waiting' || s === 'playing') {
            goToRoom(payload.new.code);
          }
        }
      )
      .subscribe();

    channelRef.current = channel;

    // Polling de secours toutes les 3s
    const poll = setInterval(async () => {
      if (redirectedRef.current) { clearInterval(poll); return; }
      const room = await fetchRoom();
      if (room) goToRoom(room.code);
    }, 3000);
    pollRef.current = poll;
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    findAndWait();
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // ── Rendu ─────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 muz-fade-in"
      style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}
    >
      <div className="flex flex-col items-center gap-6 w-full max-w-sm">

        <MuzquizLogo width={120} textSize="2rem" animate />

        {/* ── Chargement ── */}
        {step === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-full border-4 animate-spin"
              style={{ borderColor: '#FF00AA', borderTopColor: 'transparent' }} />
            <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>Vérification du lien…</p>
          </div>
        )}

        {/* ── Erreur ── */}
        {step === 'error' && (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
              style={{ background: 'rgba(255,0,170,0.12)', border: '2px solid rgba(255,0,170,0.3)' }}>
              ✗
            </div>
            <p className="font-bold" style={{ color: '#FF00AA' }}>{errMsg}</p>
            <button
              onClick={() => router.push('/')}
              className="text-sm font-bold underline"
              style={{ color: 'rgba(240,244,255,0.4)' }}
            >
              Retour à l'accueil
            </button>
          </div>
        )}

        {/* ── Saisie du pseudo ── */}
        {step === 'enter-nickname' && (
          <div className="w-full flex flex-col gap-5">
            {/* Invitation de l'hôte */}
            <div className="flex flex-col items-center gap-2 text-center">
              <div
                className="px-4 py-2 rounded-full font-bold text-sm"
                style={{
                  background: 'rgba(255,0,170,0.12)',
                  border: '1px solid rgba(255,0,170,0.3)',
                  color: '#FF00AA',
                }}
              >
                Invitation de <span className="font-black">{hostNickname}</span>
              </div>
              <p className="text-sm" style={{ color: 'rgba(240,244,255,0.5)' }}>
                Entre ton pseudo pour rejoindre la prochaine partie
              </p>
            </div>

            <form onSubmit={handleJoin} className="flex flex-col gap-3">
              <input
                autoFocus
                value={nickname}
                onChange={e => setNickname(e.target.value)}
                placeholder="Ton pseudo…"
                maxLength={20}
                className="w-full px-4 py-4 rounded-2xl font-bold text-center text-lg outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '2px solid rgba(255,0,170,0.3)',
                  color: '#F0F4FF',
                }}
              />
              <button
                type="submit"
                disabled={!nickname.trim()}
                className="w-full py-4 rounded-2xl font-black text-base transition-all disabled:opacity-40"
                style={{
                  background: 'linear-gradient(135deg, #FF00AA 0%, #8B5CF6 100%)',
                  color: 'white',
                  boxShadow: '0 0 20px rgba(255,0,170,0.25)',
                }}
              >
                Rejoindre →
              </button>
            </form>
          </div>
        )}

        {/* ── Attente de l'hôte ── */}
        {(step === 'waiting-host' || step === 'redirecting') && (
          <div className="w-full flex flex-col items-center gap-5 text-center">
            <div
              className="px-4 py-2 rounded-full font-bold text-sm"
              style={{
                background: 'rgba(255,0,170,0.12)',
                border: '1px solid rgba(255,0,170,0.3)',
                color: '#FF00AA',
              }}
            >
              Invitation de <span className="font-black">{hostNickname}</span>
            </div>

            {step === 'waiting-host' ? (
              <>
                {/* Indicateur pulsant */}
                <div className="relative flex items-center justify-center">
                  <div
                    className="w-16 h-16 rounded-full animate-pulse"
                    style={{ background: 'rgba(139,92,246,0.2)', border: '2px solid rgba(139,92,246,0.4)' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <MuzquizLogo width={36} showText={false} />
                  </div>
                </div>
                <div>
                  <p className="font-black text-lg" style={{ color: '#F0F4FF' }}>En attente de l'hôte…</p>
                  <p className="text-sm mt-1" style={{ color: 'rgba(240,244,255,0.4)' }}>
                    Tu seras redirigé automatiquement quand{' '}
                    <span style={{ color: '#FF00AA' }}>{hostNickname}</span> lance une partie
                  </p>
                </div>
                {/* Pseudo actif */}
                <div
                  className="px-4 py-2 rounded-full font-bold text-sm"
                  style={{ background: 'rgba(0,229,209,0.1)', border: '1px solid rgba(0,229,209,0.25)', color: '#00E5D1' }}
                >
                  {nickname.trim() || 'Joueur'}
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full border-4 animate-spin"
                  style={{ borderColor: '#00E5D1', borderTopColor: 'transparent' }} />
                <p className="font-black text-lg" style={{ color: '#00E5D1' }}>Connexion à la salle…</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
