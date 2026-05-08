// app/u/[invite_code]/page.tsx
// Profil public + ajouter en ami + rejoindre la partie.
// Ce lien est permanent — partagez-le une seule fois.
"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MuzquizLogo } from '@/components/MuzquizLogo';
import Link from 'next/link';

type FriendStatus = 'none' | 'pending_sent' | 'pending_received' | 'accepted';

interface HostProfile {
  id: string;
  nickname: string;
  avatar_color: string;
  avatar_url: string | null;
}

export default function PublicProfilePage() {
  const { invite_code } = useParams<{ invite_code: string }>();
  const router = useRouter();

  const inviteCode = (invite_code as string)?.toUpperCase();

  const [host, setHost] = useState<HostProfile | null>(null);
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [friendStatus, setFriendStatus] = useState<FriendStatus>('none');
  const [friendshipId, setFriendshipId] = useState<string | null>(null);
  const [friendLoading, setFriendLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [hasActiveRoom, setHasActiveRoom] = useState(false);
  const [activeRoomCode, setActiveRoomCode] = useState<string | null>(null);
  const [joinNickname, setJoinNickname] = useState('');
  const [showJoin, setShowJoin] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    const load = async () => {
      // Moi
      const { data: { session } } = await supabase.auth.getSession();
      const me = session?.user;
      const uid = (me && !me.is_anonymous) ? me.id : null;
      setMyUserId(uid);

      // Profil de l'hôte
      const { data: prof, error } = await supabase
        .from('profiles')
        .select('id, nickname, avatar_color, avatar_url')
        .eq('invite_code', inviteCode)
        .single();

      if (error || !prof) {
        setErrMsg("Ce lien d'invitation n'existe pas.");
        setPageLoading(false);
        return;
      }
      setHost(prof);

      // Je ne peux pas m'ajouter moi-même
      if (uid && uid !== prof.id) {
        // Statut d'amitié
        const { data: fs } = await supabase
          .from('friendships')
          .select('id, status, requester_id, addressee_id')
          .or(`and(requester_id.eq.${uid},addressee_id.eq.${prof.id}),and(requester_id.eq.${prof.id},addressee_id.eq.${uid})`)
          .maybeSingle();

        if (fs) {
          setFriendshipId(fs.id);
          if (fs.status === 'accepted') setFriendStatus('accepted');
          else if (fs.status === 'pending') {
            setFriendStatus(fs.requester_id === uid ? 'pending_sent' : 'pending_received');
          }
        }

        // Pre-fill nickname
        const { data: myProf } = await supabase
          .from('profiles')
          .select('nickname')
          .eq('id', uid)
          .single();
        if (myProf?.nickname) setJoinNickname(myProf.nickname);
      } else if (!uid) {
        const saved = typeof window !== 'undefined' ? localStorage.getItem('muz_nickname') : null;
        if (saved) setJoinNickname(saved);
      }

      // Vérifier si l'hôte a une salle active
      const { data: room } = await supabase
        .from('rooms')
        .select('code, status')
        .eq('host_id', prof.id)
        .in('status', ['waiting', 'playing'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (room) {
        setHasActiveRoom(true);
        setActiveRoomCode(room.code);
      }

      setPageLoading(false);
    };

    if (inviteCode) load();

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inviteCode]);

  // ── Actions amis ────────────────────────────────────────────────────────────
  const sendFriendRequest = async () => {
    if (!myUserId || !host) return;
    setFriendLoading(true);
    const { data, error } = await supabase
      .from('friendships')
      .insert({ requester_id: myUserId, addressee_id: host.id, status: 'pending' })
      .select('id')
      .single();
    if (!error && data) {
      setFriendshipId(data.id);
      setFriendStatus('pending_sent');
    }
    setFriendLoading(false);
  };

  const acceptRequest = async () => {
    if (!friendshipId) return;
    setFriendLoading(true);
    await supabase.from('friendships').update({ status: 'accepted' }).eq('id', friendshipId);
    setFriendStatus('accepted');
    setFriendLoading(false);
  };

  const removeFriend = async () => {
    if (!friendshipId || !confirm('Retirer cet ami ?')) return;
    setFriendLoading(true);
    await supabase.from('friendships').delete().eq('id', friendshipId);
    setFriendshipId(null);
    setFriendStatus('none');
    setFriendLoading(false);
  };

  // ── Rejoindre la partie ──────────────────────────────────────────────────────
  const handleJoin = () => {
    const nick = joinNickname.trim() || 'Joueur';
    if (typeof window !== 'undefined') localStorage.setItem('muz_nickname', nick);
    if (activeRoomCode) {
      router.push(`/room/${activeRoomCode}?nickname=${encodeURIComponent(nick)}`);
    }
  };

  // ── Rendu ────────────────────────────────────────────────────────────────────
  if (pageLoading) return (
    <div className="flex items-center justify-center h-screen" style={{ background: '#0D1B3E' }}>
      <div className="w-10 h-10 rounded-full border-4 animate-spin"
        style={{ borderColor: '#FF00AA', borderTopColor: 'transparent' }} />
    </div>
  );

  if (errMsg || !host) return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 p-6"
      style={{ background: '#0D1B3E' }}>
      <p className="font-bold text-center" style={{ color: '#FF00AA' }}>{errMsg || 'Profil introuvable.'}</p>
      <button onClick={() => router.push('/')} className="text-sm underline" style={{ color: 'rgba(240,244,255,0.4)' }}>
        Retour à l'accueil
      </button>
    </div>
  );

  const initial = host.nickname[0]?.toUpperCase() ?? '?';
  const isSelf = myUserId === host.id;

  return (
    <div className="min-h-screen flex flex-col items-center p-6 muz-fade-in"
      style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)' }}>

      <div className="w-full max-w-sm flex flex-col gap-5">

        {/* Nav */}
        <div className="flex items-center justify-between">
          <Link href="/"
            className="text-sm font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
            style={{ background: 'rgba(255,0,170,0.08)', color: 'rgba(255,0,170,0.7)', border: '1px solid rgba(255,0,170,0.2)' }}>
            ← Accueil
          </Link>
          <MuzquizLogo width={80} textSize="1.2rem" />
        </div>

        {/* Carte profil */}
        <div className="flex flex-col items-center gap-4 py-6 px-4 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1.5px solid rgba(255,255,255,0.08)' }}>

          {/* Avatar */}
          <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0"
            style={{ boxShadow: `0 0 30px ${host.avatar_color}66` }}>
            {host.avatar_url ? (
              <img src={host.avatar_url} alt={host.nickname} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-black text-3xl"
                style={{ background: host.avatar_color, color: '#0D1B3E' }}>
                {initial}
              </div>
            )}
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-black" style={{ color: '#F0F4FF' }}>{host.nickname}</h1>
            {isSelf && (
              <p className="text-xs mt-1 font-bold" style={{ color: 'rgba(240,244,255,0.35)' }}>C'est votre profil</p>
            )}
          </div>

          {/* ── Bouton ami ── */}
          {!isSelf && myUserId && (
            <div className="flex gap-2 w-full">
              {friendStatus === 'none' && (
                <button
                  onClick={sendFriendRequest}
                  disabled={friendLoading}
                  className="flex-1 py-3 rounded-xl font-black text-sm transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #FF00AA 0%, #8B5CF6 100%)', color: 'white' }}>
                  {friendLoading ? '…' : '➕ Ajouter en ami'}
                </button>
              )}
              {friendStatus === 'pending_sent' && (
                <div className="flex-1 py-3 rounded-xl font-bold text-sm text-center"
                  style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.3)' }}>
                  ⏳ Demande envoyée
                </div>
              )}
              {friendStatus === 'pending_received' && (
                <button
                  onClick={acceptRequest}
                  disabled={friendLoading}
                  className="flex-1 py-3 rounded-xl font-black text-sm transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: 'rgba(0,229,209,0.15)', color: '#00E5D1', border: '1.5px solid rgba(0,229,209,0.4)' }}>
                  {friendLoading ? '…' : '✓ Accepter la demande'}
                </button>
              )}
              {friendStatus === 'accepted' && (
                <div className="flex-1 flex items-center gap-2 py-3 px-4 rounded-xl"
                  style={{ background: 'rgba(0,229,209,0.08)', border: '1px solid rgba(0,229,209,0.25)' }}>
                  <span className="font-black text-sm flex-1" style={{ color: '#00E5D1' }}>✓ Amis</span>
                  <button onClick={removeFriend} className="text-xs" style={{ color: 'rgba(240,244,255,0.3)' }}>
                    Retirer
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Non connecté → inviter à se connecter */}
          {!isSelf && !myUserId && (
            <Link href="/login"
              className="w-full py-3 rounded-xl font-bold text-sm text-center transition-all hover:opacity-90"
              style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.25)' }}>
              Connecte-toi pour ajouter en ami →
            </Link>
          )}
        </div>

        {/* ── Rejoindre la partie ── */}
        {hasActiveRoom && !isSelf && (
          <div className="rounded-2xl p-4 flex flex-col gap-3"
            style={{ background: 'rgba(0,229,209,0.06)', border: '1.5px solid rgba(0,229,209,0.3)' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#00E5D1' }} />
              <p className="font-black text-sm" style={{ color: '#00E5D1' }}>
                {host.nickname} est en train de jouer !
              </p>
            </div>
            {!showJoin ? (
              <button
                onClick={() => setShowJoin(true)}
                className="w-full py-3 rounded-xl font-black text-sm transition-all hover:opacity-90"
                style={{ background: 'rgba(0,229,209,0.15)', color: '#00E5D1', border: '1px solid rgba(0,229,209,0.4)' }}>
                ▶ Rejoindre la partie →
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <input
                  autoFocus
                  value={joinNickname}
                  onChange={e => setJoinNickname(e.target.value)}
                  placeholder="Ton pseudo…"
                  maxLength={20}
                  className="w-full px-4 py-3 rounded-xl font-bold text-center outline-none"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '2px solid rgba(0,229,209,0.4)', color: '#F0F4FF' }}
                  onKeyDown={e => e.key === 'Enter' && joinNickname.trim() && handleJoin()}
                />
                <button
                  onClick={handleJoin}
                  disabled={!joinNickname.trim()}
                  className="w-full py-3 rounded-xl font-black text-sm transition-all disabled:opacity-40"
                  style={{ background: '#00E5D1', color: '#0D1B3E' }}>
                  Rejoindre →
                </button>
              </div>
            )}
          </div>
        )}

        {/* Pas de partie active */}
        {!hasActiveRoom && !isSelf && (
          <div className="rounded-2xl py-3 px-4 text-center"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p className="text-sm font-bold" style={{ color: 'rgba(240,244,255,0.35)' }}>
              Aucune partie en cours pour l'instant
            </p>
            <p className="text-xs mt-0.5" style={{ color: 'rgba(240,244,255,0.2)' }}>
              Reviens quand {host.nickname} lance une partie
            </p>
          </div>
        )}

        {/* Voir son propre profil */}
        {isSelf && (
          <Link href="/profile"
            className="w-full py-4 rounded-xl font-black text-base text-center transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #FF00AA 0%, #8B5CF6 100%)', color: 'white' }}>
            Voir mon profil →
          </Link>
        )}

      </div>
    </div>
  );
}
