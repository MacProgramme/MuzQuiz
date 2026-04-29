// app/room/[code]/results/page.tsx
"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Player } from '@/types';
import { MuzquizLogo } from '@/components/MuzquizLogo';

const PODIUM_HEIGHTS = [160, 210, 120];
const PODIUM_ORDER = [1, 0, 2];
const PODIUM_COLORS = [
  { bg: '#9CA3AF', text: '#1a1a2e', border: 'rgba(156,163,175,0.4)' },
  { bg: '#F59E0B', text: '#1a1a2e', border: 'rgba(245,158,11,0.5)' },
  { bg: '#CD7C3A', text: '#1a1a2e', border: 'rgba(180,83,9,0.4)' },
];
const MEDALS_LIST = ['🥇', '🥈', '🥉'];

export default function ResultsPage() {
  const { code } = useParams<{ code: string }>();
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [roomInfo, setRoomInfo] = useState<{ id: string; public_screen: boolean; mode: string; pack_id: string | null; host_id: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [myUserId, setMyUserId] = useState<string | null>(null);
  const [myNickname, setMyNickname] = useState<string>('Joueur');
  const [replaying, setReplaying] = useState(false);
  const [replayCode, setReplayCode] = useState<string | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const pollIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const navigatedRef = useRef(false); // évite la double navigation

  useEffect(() => {
    const fetchResults = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id ?? null;
      setMyUserId(userId);

      // Inclure next_code dans le SELECT pour détecter un replay déjà lancé
      const { data: room } = await supabase
        .from('rooms')
        .select('id, public_screen, mode, pack_id, host_id, next_code')
        .eq('code', code.toUpperCase())
        .single();

      if (!room) { setLoading(false); return; }
      setRoomInfo(room as any);

      const { data } = await supabase
        .from('room_players')
        .select('*')
        .eq('room_id', room.id)
        .order('score', { ascending: false });

      if (data) {
        const finalPlayers = room.public_screen
          ? data.filter((p: any) => !p.is_host)
          : data;
        setPlayers(finalPlayers);

        // Trouver mon nickname
        const me = finalPlayers.find((p: any) => p.user_id === userId);
        if (me) setMyNickname(me.nickname);
      }

      setLoading(false);

      const myNick = (data ?? []).find((p: any) => p.user_id === userId)?.nickname ?? 'Joueur';

      // Helper de navigation — évite la double navigation
      const goToReplay = (nextCode: string) => {
        if (navigatedRef.current) return;
        navigatedRef.current = true;
        if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
        router.push(`/room/${nextCode}?nickname=${encodeURIComponent(myNick)}`);
      };

      // Cas 1 : next_code déjà défini au chargement (arrivé en retard sur la page résultats)
      if ((room as any).next_code) {
        goToReplay((room as any).next_code);
        return;
      }

      // Cas 2 : Realtime — postgres_changes (fiable, reçu si abonné avant l'événement)
      const realtimeChannel = supabase
        .channel(`muz-room-watch-${room.id}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'rooms', filter: `id=eq.${room.id}` },
          (payload: any) => {
            const nextCode: string | null = payload.new?.next_code ?? null;
            if (nextCode) goToReplay(nextCode);
          }
        )
        // Cas 3 : Broadcast (le plus rapide, mais fire-and-forget)
        .on('broadcast', { event: 'replay' }, ({ payload }: { payload: { code: string } }) => {
          if (payload?.code) goToReplay(payload.code);
        })
        .subscribe();

      channelRef.current = realtimeChannel;

      // Cas 4 : Polling toutes les 3s — filet de sécurité si broadcast et realtime ont été ratés
      const poll = setInterval(async () => {
        if (navigatedRef.current) { clearInterval(poll); return; }
        const { data: latestRoom } = await supabase
          .from('rooms')
          .select('next_code')
          .eq('id', room.id)
          .single();
        if (latestRoom?.next_code) goToReplay(latestRoom.next_code);
      }, 3000);
      pollIntervalRef.current = poll;
    };

    fetchResults();
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [code]);

  useEffect(() => {
    if (!loading && players.length > 0) {
      const t = setTimeout(() => setRevealed(true), 200);
      return () => clearTimeout(t);
    }
  }, [loading, players]);

  const replayGame = async () => {
    if (!roomInfo || replaying) return;
    setReplaying(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
      if (!userId) { setReplaying(false); return; }

      const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();

      const { data: newRoom, error } = await supabase
        .from('rooms')
        .insert({
          code: newCode,
          host_id: userId,
          mode: roomInfo.mode,
          timer_duration: 20,
          max_players: 100,
          sound_enabled: true,
          pack_id: roomInfo.pack_id,
          public_screen: roomInfo.public_screen,
        })
        .select('*')
        .single();

      if (error || !newRoom) { setReplaying(false); return; }

      // Trouver le nickname de l'hôte (cherche dans TOUS les players y compris is_host, pas juste finalPlayers)
      const { data: hostPlayerRow } = await supabase
        .from('room_players')
        .select('nickname')
        .eq('room_id', roomInfo.id)
        .eq('user_id', userId)
        .single();
      const hostNickname = hostPlayerRow?.nickname
        ?? players.find(p => p.user_id === userId)?.nickname
        ?? myNickname;

      // Ajouter l'hôte dans la nouvelle salle
      await supabase.from('room_players').insert({
        room_id: newRoom.id,
        user_id: userId,
        nickname: hostNickname,
        is_host: true,
      });

      // Écrire next_code dans l'ancienne salle → tous les clients abonnés via realtime le reçoivent
      await supabase.from('rooms').update({ next_code: newCode }).eq('id', roomInfo.id);

      // Broadcast en plus (arrivée immédiate, avant le changement DB)
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'replay',
          payload: { code: newCode },
        });
      }

      // Afficher le code pour les joueurs qui auraient raté les deux mécanismes
      setReplayCode(newCode);

      // Rediriger l'hôte
      router.push(`/room/${newCode}?nickname=${encodeURIComponent(hostNickname)}`);
    } catch {
      setReplaying(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen" style={{ background: '#0D1B3E' }}>
      <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
        style={{ borderColor: '#FF00AA', borderTopColor: 'transparent' }} />
    </div>
  );

  const isHost = roomInfo?.host_id === myUserId;
  const top3 = players.slice(0, 3);
  const rest = players.slice(3);

  return (
    <div className="min-h-screen flex flex-col items-center p-6 pb-12"
      style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 60%, #0D1B3E 100%)' }}>

      {/* Accueil button */}
      <div className="w-full max-w-md flex justify-start mb-2">
        <Link href="/"
          className="text-sm font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
          style={{ background: 'rgba(255,0,170,0.08)', color: 'rgba(255,0,170,0.7)', border: '1px solid rgba(255,0,170,0.2)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><MuzquizLogo width={18} showText={false} />Accueil</span>
        </Link>
      </div>

      <div className="mt-2 mb-4 text-center flex flex-col items-center">
        <MuzquizLogo width={120} textSize="2rem" />
        <p className="text-sm font-bold mt-1" style={{ color: 'rgba(240,244,255,0.4)' }}>
          Résultats finaux
        </p>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-3 mt-8 mb-2 w-full max-w-sm">
        {PODIUM_ORDER.map((playerIdx, visualIdx) => {
          const player = top3[playerIdx];
          if (!player) return <div key={`empty-${visualIdx}`} style={{ width: 88 }} />;
          const height = PODIUM_HEIGHTS[visualIdx];
          const colors = PODIUM_COLORS[visualIdx];
          const rank = playerIdx + 1;
          const delay = `${visualIdx * 150}ms`;
          return (
            <div key={player.id} className="flex flex-col items-center" style={{ width: 96 }}>
              {revealed && (
                <div className="muz-crown text-3xl mb-2" style={{ animationDelay: `${parseInt(delay) + 300}ms` }}>
                  {rank === 1 ? '👑' : MEDALS_LIST[rank - 1]}
                </div>
              )}
              <div className="text-center mb-2 px-1" style={{ opacity: revealed ? 1 : 0, transition: `opacity 0.5s ease ${delay}` }}>
                <p className="font-black text-xs leading-tight truncate w-full text-center"
                  style={{ color: rank === 1 ? '#F59E0B' : '#F0F4FF' }}>{player.nickname}</p>
                <p className="font-bold text-xs mt-0.5" style={{ color: rank === 1 ? '#F59E0B' : 'rgba(240,244,255,0.5)' }}>
                  {player.score} pts
                </p>
              </div>
              <div className="muz-podium-rise w-full rounded-t-xl flex items-start justify-center pt-3"
                style={{
                  height: revealed ? height : 0,
                  background: `linear-gradient(180deg, ${colors.bg}cc 0%, ${colors.bg}88 100%)`,
                  border: `2px solid ${colors.border}`,
                  borderBottom: 'none',
                  animationDelay: delay,
                  boxShadow: rank === 1 ? '0 0 30px rgba(245,158,11,0.3)' : 'none',
                }}>
                <span className="font-black text-2xl" style={{ color: colors.text, opacity: 0.9 }}>{rank}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full max-w-sm h-1 rounded-full mb-8"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), transparent)' }} />

      {rest.length > 0 && (
        <div className="w-full max-w-sm mb-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-3 text-center"
            style={{ color: 'rgba(240,244,255,0.3)' }}>Autres joueurs</p>
          <div className="flex flex-col gap-2">
            {rest.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                  opacity: revealed ? 1 : 0, transition: `opacity 0.4s ease ${(i + 3) * 100 + 400}ms`,
                }}>
                <span className="font-black text-sm w-8 text-center" style={{ color: 'rgba(240,244,255,0.35)' }}>#{i + 4}</span>
                <span className="flex-1 font-bold text-sm" style={{ color: '#F0F4FF' }}>{p.nickname}</span>
                <span className="font-black text-base" style={{ color: '#8B5CF6' }}>{p.score} pts</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Boutons */}
      <div className="flex flex-col items-center gap-3 w-full max-w-sm">

        {/* Code de la nouvelle salle si déjà créée (fallback pour joueurs lents) */}
        {replayCode && (
          <div className="w-full py-3 px-4 rounded-xl text-center"
            style={{ background: 'rgba(0,229,209,0.08)', border: '1px solid rgba(0,229,209,0.3)' }}>
            <p className="text-xs font-bold mb-1" style={{ color: 'rgba(0,229,209,0.6)' }}>Nouveau code de salle</p>
            <p className="font-black font-mono tracking-widest text-2xl" style={{ color: '#00E5D1' }}>{replayCode}</p>
          </div>
        )}

        {/* Rejouer — hôte uniquement */}
        {isHost && (
          <button
            onClick={replayGame}
            disabled={replaying}
            className="w-full py-4 rounded-xl text-base font-black transition-all disabled:opacity-60"
            style={{
              background: 'linear-gradient(135deg, #00E5D1 0%, #8B5CF6 100%)',
              color: 'white',
              boxShadow: '0 0 20px rgba(0,229,209,0.25)',
            }}>
            {replaying ? 'Création de la salle…' : '🔄 Rejouer avec les mêmes joueurs'}
          </button>
        )}

        {/* Message attente non-hôte */}
        {!isHost && !replayCode && (
          <div className="w-full py-3 rounded-xl text-sm font-bold text-center"
            style={{ background: 'rgba(139,92,246,0.08)', color: 'rgba(139,92,246,0.6)', border: '1px solid rgba(139,92,246,0.2)' }}>
            En attente d'un nouveau round de l'hôte…
          </div>
        )}

        <button onClick={() => router.push('/')} className="muz-btn-pink w-full py-4 rounded-xl text-lg font-black">
          Nouvelle partie →
        </button>
        <button onClick={() => router.push('/')}
          className="text-sm font-bold transition-all hover:opacity-100"
          style={{ color: 'rgba(240,244,255,0.35)' }}>
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
}
