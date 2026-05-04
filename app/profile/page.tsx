// app/profile/page.tsx
"use client";

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { SubscriptionTier, TIER_LIMITS, normalizeTier } from '@/types';
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';
import { DailyQuiz } from '@/components/DailyQuiz';
import { LeaderboardQuizDuJour } from '@/components/LeaderboardQuizDuJour';
import { InviteQRCode } from '@/components/InviteQRCode';

interface Profile {
  id: string;
  nickname: string;
  avatar_color: string;
  avatar_url: string | null;
  subscription_tier: SubscriptionTier;
  created_at: string;
}

// ===== Color Picker =====
function hsvToHex(h: number, s: number, v: number): string {
  s /= 100; v /= 100;
  const c = v * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) { r = c; g = x; }
  else if (h < 120) { r = x; g = c; }
  else if (h < 180) { g = c; b = x; }
  else if (h < 240) { g = x; b = c; }
  else if (h < 300) { r = x; b = c; }
  else { r = c; b = x; }
  return '#' + [r + m, g + m, b + m].map(n => Math.round(n * 255).toString(16).padStart(2, '0')).join('');
}

function hexToHsv(hex: string): [number, number, number] {
  const safe = /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : '#8B5CF6';
  const r = parseInt(safe.slice(1, 3), 16) / 255;
  const g = parseInt(safe.slice(3, 5), 16) / 255;
  const b = parseInt(safe.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  return [h, max === 0 ? 0 : Math.round((d / max) * 100), Math.round(max * 100)];
}

function ColorPicker({ value, onChange }: { value: string; onChange: (c: string) => void }) {
  const [hsv, setHsv] = useState<[number, number, number]>(() => hexToHsv(value));
  const [h, s, v] = hsv;
  const boxRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const currentColor = useMemo(() => hsvToHex(h, s, v), [h, s, v]);
  const hueColor = useMemo(() => hsvToHex(h, 100, 100), [h]);

  useEffect(() => { onChange(currentColor); }, [currentColor]);

  const pickFromEvent = useCallback((clientX: number, clientY: number) => {
    if (!boxRef.current) return;
    const rect = boxRef.current.getBoundingClientRect();
    const newS = Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)));
    const newV = Math.max(0, Math.min(100, Math.round((1 - (clientY - rect.top) / rect.height) * 100)));
    setHsv(([ph]) => [ph, newS, newV]);
  }, []);

  return (
    <div className="flex flex-col gap-3">
      {/* Gradient 2D saturation/valeur */}
      <div
        ref={boxRef}
        onMouseDown={e => { dragging.current = true; pickFromEvent(e.clientX, e.clientY); }}
        onMouseMove={e => { if (dragging.current) pickFromEvent(e.clientX, e.clientY); }}
        onMouseUp={() => { dragging.current = false; }}
        onMouseLeave={() => { dragging.current = false; }}
        onTouchStart={e => { dragging.current = true; pickFromEvent(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); }}
        onTouchMove={e => { if (dragging.current) pickFromEvent(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); }}
        onTouchEnd={() => { dragging.current = false; }}
        style={{
          position: 'relative', width: '100%', height: '160px', borderRadius: '12px',
          background: `linear-gradient(to bottom, transparent, #000), linear-gradient(to right, #fff, ${hueColor})`,
          cursor: 'crosshair', userSelect: 'none', touchAction: 'none', flexShrink: 0,
        }}
      >
        {/* Curseur */}
        <div style={{
          position: 'absolute', left: `${s}%`, top: `${100 - v}%`,
          transform: 'translate(-50%, -50%)',
          width: 18, height: 18, borderRadius: '50%',
          border: '2.5px solid white', background: currentColor,
          boxShadow: '0 0 0 1.5px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.4)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Slider teinte */}
      <input
        type="range" min="0" max="360" value={h}
        onChange={e => setHsv([Number(e.target.value), s, v])}
        className="muz-hue-slider"
        style={{ width: '100%', height: '14px' }}
      />

      {/* Aperçu + hex */}
      <div className="flex items-center gap-3">
        <div style={{
          width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
          background: currentColor,
          border: '2px solid rgba(255,255,255,0.15)',
          boxShadow: `0 0 14px ${currentColor}99`,
        }} />
        <span className="font-mono text-sm font-black" style={{ color: '#F0F4FF' }}>
          {currentColor.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

const TIER_INFO: Record<SubscriptionTier, { label: string; color: string; bg: string; price: string; perks: string[] }> = {
  decouverte: { label: 'Moustachu Découverte', color: 'rgba(240,244,255,0.5)', bg: 'rgba(255,255,255,0.06)',  price: '0€',     perks: ['Accès aux questions MUZQUIZ', 'Parties illimitées', 'Jusqu\'à 10 joueurs', 'Quiz QCM & Buzz Quiz'] },
  essentiel:  { label: 'Moustachu Essentiel',  color: '#00E5D1',               bg: 'rgba(0,229,209,0.1)',      price: '9,99€',  perks: ['Tout le Découverte', 'Jusqu\'à 20 joueurs', 'Questions image', 'Import Excel', 'IA : 10 quiz/mois'] },
  pro:        { label: 'Moustachu Pro',        color: '#8B5CF6',               bg: 'rgba(139,92,246,0.12)',    price: '19,99€', perks: ['Tout l\'Essentiel', 'Jusqu\'à 100 joueurs', 'Blind Test Audio', 'IA : 40 quiz/mois'] },
  expert:     { label: 'Moustachu Expert',     color: '#F59E0B',               bg: 'rgba(245,158,11,0.1)',     price: '29,99€', perks: ['Tout le Pro', 'Jusqu\'à 250 joueurs', 'Tous les modes', 'IA : 80 quiz/mois'] },
};

const AVATAR_COLORS = ['#FF00AA', '#00E5D1', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981'];

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Code promo
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoMsg, setPromoMsg] = useState<{ text: string; ok: boolean } | null>(null);

  // Invitation permanente
  const [inviteCode, setInviteCode] = useState<string | null>(null);
  const [inviteCopied, setInviteCopied] = useState(false);

  // Amis
  type FriendEntry = {
    id: string; // friendship id
    friendId: string;
    nickname: string;
    avatar_color: string;
    avatar_url: string | null;
    invite_code: string | null;
    status: 'accepted' | 'pending';
    direction: 'sent' | 'received';
  };
  const [friends, setFriends] = useState<FriendEntry[]>([]);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [addFriendCode, setAddFriendCode] = useState('');
  const [addFriendMsg, setAddFriendMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [addFriendLoading, setAddFriendLoading] = useState(false);

  // Edition profil
  const [isAdmin, setIsAdmin] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editNickname, setEditNickname] = useState('');
  const [editColor, setEditColor] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

        let activeProf = prof;
        if (!activeProf) {
          // Créer un profil vide si inexistant
          const { data: newProf } = await supabase
            .from('profiles')
            .insert({ id: user.id, nickname: user.email?.split('@')[0] ?? 'Joueur', avatar_color: '#8B5CF6' })
            .select('*')
            .single();
          if (newProf) {
            activeProf = newProf;
            setProfile({ ...newProf, subscription_tier: normalizeTier(newProf.subscription_tier) });
          }
        } else {
          setProfile({ ...prof, subscription_tier: normalizeTier(prof.subscription_tier) });
        }

        // invite_code — générer si absent
        let code: string = (activeProf as any)?.invite_code ?? null;
        if (!code && activeProf) {
          const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
          let attempts = 0;
          while (!code && attempts < 5) {
            let candidate = '';
            for (let i = 0; i < 7; i++) candidate += chars[Math.floor(Math.random() * chars.length)];
            const { error } = await supabase
              .from('profiles')
              .update({ invite_code: candidate })
              .eq('id', user.id);
            if (!error) code = candidate;
            attempts++;
          }
        }
        if (code) setInviteCode(code);

        // Charger les amis
        await loadFriends(user.id);

      } catch (e) {
        console.error('Erreur chargement profil:', e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const uploadAvatar = async (file: File) => {
    if (!profile) return;
    setUploadingAvatar(true);
    try {
      const ext = file.name.split('.').pop() ?? 'jpg';
      const path = `${profile.id}/avatar.${ext}`;
      const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
      if (error) { console.error('Upload error:', error); return; }
      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      // Ajouter un timestamp pour forcer le refresh du cache navigateur
      const urlWithCache = `${publicUrl}?t=${Date.now()}`;
      setEditAvatarUrl(urlWithCache);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const saveProfile = async () => {
    if (!profile || !editNickname.trim()) return;
    setSaving(true);
    await supabase.from('profiles').update({
      nickname: editNickname.trim(),
      avatar_color: editColor,
      avatar_url: editAvatarUrl,
    }).eq('id', profile.id);
    setProfile(p => p ? { ...p, nickname: editNickname.trim(), avatar_color: editColor, avatar_url: editAvatarUrl } : p);
    setSaving(false);
    setEditing(false);
  };

  const loadFriends = async (uid: string) => {
    setFriendsLoading(true);
    const { data } = await supabase
      .from('friendships')
      .select(`
        id, status, requester_id, addressee_id,
        requester:profiles!requester_id(id, nickname, avatar_color, avatar_url, invite_code),
        addressee:profiles!addressee_id(id, nickname, avatar_color, avatar_url, invite_code)
      `)
      .or(`requester_id.eq.${uid},addressee_id.eq.${uid}`)
      .order('created_at', { ascending: false });

    if (data) {
      const entries: FriendEntry[] = data.map((fs: any) => {
        const isSender = fs.requester_id === uid;
        const other = isSender ? fs.addressee : fs.requester;
        return {
          id: fs.id,
          friendId: other?.id ?? '',
          nickname: other?.nickname ?? 'Joueur',
          avatar_color: other?.avatar_color ?? '#8B5CF6',
          avatar_url: other?.avatar_url ?? null,
          invite_code: other?.invite_code ?? null,
          status: fs.status,
          direction: isSender ? 'sent' : 'received',
        };
      });
      setFriends(entries);
    }
    setFriendsLoading(false);
  };

  const addFriendByCode = async () => {
    if (!addFriendCode.trim() || !profile) return;
    setAddFriendLoading(true);
    setAddFriendMsg(null);
    const code = addFriendCode.trim().toUpperCase();

    // Chercher le profil avec ce code
    const { data: target } = await supabase
      .from('profiles')
      .select('id, nickname')
      .eq('invite_code', code)
      .maybeSingle();

    if (!target) {
      setAddFriendMsg({ text: 'Code introuvable. Vérifie et réessaie.', ok: false });
      setAddFriendLoading(false);
      return;
    }
    if (target.id === profile.id) {
      setAddFriendMsg({ text: 'Tu ne peux pas t\'ajouter toi-même !', ok: false });
      setAddFriendLoading(false);
      return;
    }

    const { error } = await supabase
      .from('friendships')
      .insert({ requester_id: profile.id, addressee_id: target.id, status: 'pending' });

    if (error) {
      setAddFriendMsg({ text: 'Demande déjà envoyée ou erreur.', ok: false });
    } else {
      setAddFriendMsg({ text: `Demande envoyée à ${target.nickname} !`, ok: true });
      setAddFriendCode('');
      await loadFriends(profile.id);
    }
    setAddFriendLoading(false);
  };

  const acceptFriend = async (friendshipId: string) => {
    await supabase.from('friendships').update({ status: 'accepted' }).eq('id', friendshipId);
    if (profile) await loadFriends(profile.id);
  };

  const declineFriend = async (friendshipId: string) => {
    await supabase.from('friendships').delete().eq('id', friendshipId);
    if (profile) await loadFriends(profile.id);
  };

  const removeFriend = async (friendshipId: string) => {
    if (!confirm('Retirer cet ami ?')) return;
    await supabase.from('friendships').delete().eq('id', friendshipId);
    if (profile) await loadFriends(profile.id);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const redeemPromoCode = async () => {
    if (!promoCode.trim()) return;
    setPromoLoading(true);
    setPromoMsg(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const res = await fetch('/api/redeem-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({ code: promoCode }),
      });
      const data = await res.json();
      if (res.ok) {
        setPromoMsg({ text: data.message, ok: true });
        setPromoCode('');
        // Recharger le profil pour mettre à jour le tier affiché
        setProfile(p => p ? { ...p, subscription_tier: data.tier } : p);
      } else {
        setPromoMsg({ text: data.error ?? 'Erreur', ok: false });
      }
    } catch {
      setPromoMsg({ text: 'Erreur réseau', ok: false });
    } finally {
      setPromoLoading(false);
    }
  };

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
    <div className="min-h-screen muz-fade-in" style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 50%, #0D1B3E 100%)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
        <Link href="/"
          className="text-sm font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
          style={{ background: 'rgba(255,0,170,0.08)', color: 'rgba(255,0,170,0.7)', border: '1px solid rgba(255,0,170,0.2)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}><MuzquizLogo width={18} showText={false} />Accueil</span>
        </Link>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link href="/admin"
              className="text-sm font-bold px-4 py-2 rounded-xl transition-all hover:opacity-80"
              style={{ background: 'rgba(255,0,170,0.08)', color: '#FF00AA', border: '1px solid rgba(255,0,170,0.2)' }}>
              Admin
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
          <div className="w-20 h-20 rounded-full flex-shrink-0 overflow-hidden"
            style={{ boxShadow: `0 0 30px ${profile.avatar_color}66` }}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-black text-3xl"
                style={{ background: profile.avatar_color, color: '#0D1B3E' }}>
                {initial}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-black" style={{ color: '#F0F4FF' }}>{profile.nickname}</h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(240,244,255,0.4)' }}>
              Membre depuis {formatDate(profile.created_at)}
            </p>
          </div>
        </div>

        {/* ═══ QR CODE PERMANENT ═══ */}
        {inviteCode && (
          <div className="mb-6 rounded-2xl p-5 flex flex-col items-center gap-4"
            style={{ background: 'rgba(255,0,170,0.05)', border: '1.5px solid rgba(255,0,170,0.25)' }}>
            <div className="flex items-center gap-2 self-start">
              <MuzquizLogo width={18} showText={false} color="#FF00AA" />
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,0,170,0.7)' }}>
                Mon code d'invitation
              </p>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full ml-1"
                style={{ background: 'rgba(255,0,170,0.1)', color: '#FF00AA', border: '1px solid rgba(255,0,170,0.2)' }}>
                Permanent
              </span>
            </div>
            <InviteQRCode inviteCode={inviteCode} size={180} variant="profile" />
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 text-center font-mono font-black tracking-[0.2em] text-xl px-3 py-2.5 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,0,170,0.2)', color: '#FF00AA' }}>
                {inviteCode}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/u/${inviteCode}`);
                  setInviteCopied(true);
                  setTimeout(() => setInviteCopied(false), 2000);
                }}
                className="py-2.5 px-4 rounded-xl font-bold text-sm transition-all flex-shrink-0"
                style={{
                  background: inviteCopied ? 'rgba(0,229,209,0.15)' : 'rgba(255,0,170,0.12)',
                  color: inviteCopied ? '#00E5D1' : '#FF00AA',
                  border: `1px solid ${inviteCopied ? 'rgba(0,229,209,0.3)' : 'rgba(255,0,170,0.3)'}`,
                }}>
                {inviteCopied ? '✓ Copié' : '🔗 Copier'}
              </button>
            </div>
            <p className="text-xs text-center" style={{ color: 'rgba(240,244,255,0.35)' }}>
              Fais scanner ce QR à tes amis pour qu'ils t'ajoutent et rejoignent tes parties
            </p>
          </div>
        )}

        {/* ═══ AMIS ═══ */}
        <div className="mb-6 muz-card p-5 flex flex-col gap-4">
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(240,244,255,0.4)' }}>
            Amis ({friends.filter(f => f.status === 'accepted').length})
          </p>

          {/* Demandes reçues */}
          {friends.filter(f => f.status === 'pending' && f.direction === 'received').map(f => (
            <div key={f.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
              style={{ background: 'rgba(0,229,209,0.06)', border: '1px solid rgba(0,229,209,0.2)' }}>
              <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden"
                style={{ background: f.avatar_color, boxShadow: `0 0 8px ${f.avatar_color}55` }}>
                {f.avatar_url
                  ? <img src={f.avatar_url} alt={f.nickname} className="w-full h-full object-cover" />
                  : <span className="w-full h-full flex items-center justify-center font-black text-sm" style={{ color: '#0D1B3E' }}>{f.nickname[0]?.toUpperCase()}</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate" style={{ color: '#F0F4FF' }}>{f.nickname}</p>
                <p className="text-xs" style={{ color: 'rgba(0,229,209,0.7)' }}>Demande d'ami</p>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => acceptFriend(f.id)}
                  className="px-3 py-1.5 rounded-lg font-black text-xs transition-all hover:opacity-90"
                  style={{ background: '#00E5D1', color: '#0D1B3E' }}>
                  ✓
                </button>
                <button onClick={() => declineFriend(f.id)}
                  className="px-3 py-1.5 rounded-lg font-bold text-xs transition-all hover:opacity-90"
                  style={{ background: 'rgba(255,0,170,0.1)', color: '#FF00AA', border: '1px solid rgba(255,0,170,0.2)' }}>
                  ✗
                </button>
              </div>
            </div>
          ))}

          {/* Amis acceptés */}
          {friends.filter(f => f.status === 'accepted').map(f => (
            <div key={f.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden"
                style={{ background: f.avatar_color, boxShadow: `0 0 8px ${f.avatar_color}44` }}>
                {f.avatar_url
                  ? <img src={f.avatar_url} alt={f.nickname} className="w-full h-full object-cover" />
                  : <span className="w-full h-full flex items-center justify-center font-black text-sm" style={{ color: '#0D1B3E' }}>{f.nickname[0]?.toUpperCase()}</span>
                }
              </div>
              <span className="flex-1 font-bold text-sm truncate" style={{ color: '#F0F4FF' }}>{f.nickname}</span>
              {f.invite_code && (
                <a href={`/u/${f.invite_code}`}
                  className="px-2 py-1.5 rounded-lg font-bold text-xs transition-all hover:opacity-80 flex-shrink-0"
                  style={{ background: 'rgba(139,92,246,0.1)', color: '#8B5CF6', border: '1px solid rgba(139,92,246,0.2)' }}>
                  Profil
                </a>
              )}
              <button onClick={() => removeFriend(f.id)}
                className="px-2 py-1.5 rounded-lg font-bold text-xs transition-all hover:opacity-80 flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(240,244,255,0.3)' }}>
                ✕
              </button>
            </div>
          ))}

          {/* Demandes envoyées en attente */}
          {friends.filter(f => f.status === 'pending' && f.direction === 'sent').map(f => (
            <div key={f.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
              style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
              <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden"
                style={{ background: f.avatar_color }}>
                {f.avatar_url
                  ? <img src={f.avatar_url} alt={f.nickname} className="w-full h-full object-cover" />
                  : <span className="w-full h-full flex items-center justify-center font-black text-sm" style={{ color: '#0D1B3E' }}>{f.nickname[0]?.toUpperCase()}</span>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate" style={{ color: '#F0F4FF' }}>{f.nickname}</p>
                <p className="text-xs" style={{ color: 'rgba(139,92,246,0.6)' }}>Demande envoyée…</p>
              </div>
              <button onClick={() => declineFriend(f.id)}
                className="text-xs px-2 py-1.5 rounded-lg flex-shrink-0"
                style={{ color: 'rgba(240,244,255,0.3)', background: 'rgba(255,255,255,0.04)' }}>
                Annuler
              </button>
            </div>
          ))}

          {/* Aucun ami */}
          {!friendsLoading && friends.length === 0 && (
            <p className="text-sm text-center py-2" style={{ color: 'rgba(240,244,255,0.3)' }}>
              Pas encore d'amis — partage ton QR pour commencer !
            </p>
          )}

          {/* Ajouter par code */}
          <div className="pt-2" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(240,244,255,0.35)' }}>
              Ajouter un ami par code
            </p>
            <div className="flex gap-2">
              <input
                value={addFriendCode}
                onChange={e => { setAddFriendCode(e.target.value.toUpperCase()); setAddFriendMsg(null); }}
                placeholder="Code d'invitation…"
                maxLength={10}
                className="flex-1 min-w-0 px-3 py-2 rounded-xl font-mono font-bold text-sm outline-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,0,170,0.25)', color: '#F0F4FF' }}
                onKeyDown={e => e.key === 'Enter' && !addFriendLoading && addFriendByCode()}
              />
              <button
                onClick={addFriendByCode}
                disabled={addFriendLoading || !addFriendCode.trim()}
                className="shrink-0 px-4 py-2 rounded-xl font-black text-sm transition-all disabled:opacity-40"
                style={{ background: '#FF00AA', color: 'white' }}>
                {addFriendLoading ? '…' : '➕'}
              </button>
            </div>
            {addFriendMsg && (
              <p className="text-xs font-bold mt-2" style={{ color: addFriendMsg.ok ? '#00E5D1' : '#FF00AA' }}>
                {addFriendMsg.ok ? '✓ ' : '✗ '}{addFriendMsg.text}
              </p>
            )}
          </div>
        </div>

        {/* Quiz du Jour (remplace les stats) */}
        <div className="mb-6">
          <DailyQuiz
            userId={profile.id}
            nickname={profile.nickname}
            avatarColor={profile.avatar_color}
          />
        </div>

        {/* Classement Quiz du Jour */}
        <div className="mb-6">
          <LeaderboardQuizDuJour userId={profile.id} />
        </div>

        {/* ===== PROFIL ===== */}
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
                {/* Abonnement */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: '1rem' }}>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: 'rgba(240,244,255,0.35)' }}>Abonnement</p>
                    {isAdmin && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{ background: 'rgba(255,0,170,0.1)', color: '#FF00AA', border: '1px solid rgba(255,0,170,0.2)' }}>
                        Admin
                      </span>
                    )}
                  </div>

                  {/* Tier actuel */}
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

                  {/* Switcher admin — visible uniquement pour les admins */}
                  {isAdmin && (
                    <div className="mt-3">
                      <p className="text-xs font-bold mb-2" style={{ color: 'rgba(255,0,170,0.6)' }}>
                        Changer le tier (test admin)
                      </p>
                      <div className="flex gap-2">
                        {(['decouverte', 'essentiel', 'pro', 'expert'] as SubscriptionTier[]).map(tier => {
                          const info = TIER_INFO[tier];
                          const isActive = profile.subscription_tier === tier;
                          return (
                            <button
                              key={tier}
                              onClick={async () => {
                                await supabase.from('profiles').update({ subscription_tier: tier }).eq('id', profile.id);
                                setProfile(p => p ? { ...p, subscription_tier: tier } : p);
                              }}
                              className="flex-1 py-2 rounded-xl text-xs font-black transition-all hover:opacity-90"
                              style={{
                                background: isActive ? info.color : info.bg,
                                color: isActive ? '#0D1B3E' : info.color,
                                border: `1.5px solid ${info.color}88`,
                                opacity: isActive ? 1 : 0.7,
                              }}>
                              {info.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Code promo */}
                  <div className="mt-3 p-4 rounded-2xl" style={{ background: 'rgba(139,92,246,0.07)', border: '1.5px solid rgba(139,92,246,0.15)' }}>
                    <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(139,92,246,0.7)' }}>🎟 Code promo</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Entre ton code…"
                        value={promoCode}
                        onChange={e => { setPromoCode(e.target.value.toUpperCase()); setPromoMsg(null); }}
                        className="min-w-0 flex-1 px-3 py-2 rounded-xl font-mono text-sm font-bold"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(139,92,246,0.25)', color: '#F0F4FF', outline: 'none' }}
                        onKeyDown={e => e.key === 'Enter' && !promoLoading && redeemPromoCode()}
                      />
                      <button
                        onClick={redeemPromoCode}
                        disabled={promoLoading || !promoCode.trim()}
                        className="shrink-0 px-4 py-2 rounded-xl font-black text-sm transition-all disabled:opacity-40 whitespace-nowrap"
                        style={{ background: '#8B5CF6', color: 'white' }}>
                        {promoLoading ? '…' : 'Activer'}
                      </button>
                    </div>
                    {promoMsg && (
                      <p className="text-xs font-bold mt-2" style={{ color: promoMsg.ok ? '#00E5D1' : '#FF00AA' }}>
                        {promoMsg.ok ? '✓ ' : '✗ '}{promoMsg.text}
                      </p>
                    )}
                  </div>

                  {/* Lien upgrade pour les non-admins en gratuit */}
                  {!isAdmin && profile.subscription_tier === 'decouverte' && (
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
                    className="flex items-center justify-between px-4 py-3 rounded-xl muz-card-lift"
                    style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)' }}>
                    <div className="flex items-center gap-2">
                      <MuzquizLogo width={22} showText={false} />
                      <span className="font-bold text-sm" style={{ color: '#8B5CF6' }}>Mes packs de questions</span>
                    </div>
                    <span style={{ color: 'rgba(139,92,246,0.6)' }}>›</span>
                  </Link>
                )}

                <button
                  onClick={() => { setEditing(true); setEditNickname(profile.nickname); setEditColor(profile.avatar_color); setEditAvatarUrl(profile.avatar_url ?? null); }}
                  className="muz-btn-pink py-3 rounded-xl font-black text-sm">
                  Modifier le profil →
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Aperçu avatar + upload photo */}
                <div className="flex items-center gap-4">
                  <div className="relative flex-shrink-0">
                    <div className="w-16 h-16 rounded-full overflow-hidden"
                      style={{ boxShadow: `0 0 16px ${editColor}66` }}>
                      {editAvatarUrl ? (
                        <img src={editAvatarUrl} alt="avatar" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-black text-xl"
                          style={{ background: editColor, color: '#0D1B3E' }}>
                          {editNickname[0]?.toUpperCase() ?? '?'}
                        </div>
                      )}
                    </div>
                    {/* Bouton modifier photo */}
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingAvatar}
                      className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
                      style={{ background: '#FF00AA', border: '2px solid #0D1B3E' }}
                      title="Changer la photo">
                      {uploadingAvatar ? (
                        <div className="w-3 h-3 rounded-full border-2 border-t-transparent animate-spin"
                          style={{ borderColor: 'white', borderTopColor: 'transparent' }} />
                      ) : (
                        <MuzquizLogo width={14} showText={false} />
                      )}
                    </button>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="font-bold text-sm" style={{ color: '#F0F4FF' }}>{editNickname || '…'}</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs font-bold transition-all hover:opacity-80"
                      style={{ color: '#FF00AA' }}>
                      Changer la photo →
                    </button>
                    {editAvatarUrl && (
                      <button
                        onClick={() => setEditAvatarUrl(null)}
                        className="text-xs transition-all hover:opacity-80"
                        style={{ color: 'rgba(240,244,255,0.35)' }}>
                        Supprimer la photo
                      </button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={e => { const f = e.target.files?.[0]; if (f) uploadAvatar(f); e.target.value = ''; }}
                  />
                </div>

                {/* Pseudo */}
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

                {/* Color picker complet */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3"
                    style={{ color: 'rgba(240,244,255,0.35)' }}>Couleur du cadre</p>
                  <ColorPicker value={editColor} onChange={setEditColor} />
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

        {/* Bouton jouer */}
        <div className="mt-8 text-center">
          <Link href="/" className="muz-btn-pink inline-block px-8 py-4 rounded-xl text-lg font-black">
            Jouer maintenant →
          </Link>
        </div>
      </div>
    </div>
  );
}
