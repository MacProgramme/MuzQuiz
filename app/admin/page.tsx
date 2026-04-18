// app/admin/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { SubscriptionTier, TIER_LIMITS } from '@/types';
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

// Emails des administrateurs — seuls eux peuvent accéder à cette page
const ADMIN_EMAILS = ['antoine.gegedu27@gmail.com', 'dimitte-14@hotmail.fr'];

interface UserProfile {
  id: string;
  nickname: string;
  avatar_color: string;
  subscription_tier: SubscriptionTier;
  created_at: string;
  email?: string;
}

const TIER_OPTIONS: { value: SubscriptionTier; label: string; color: string }[] = [
  { value: 'free',    label: 'Gratuit',  color: 'rgba(240,244,255,0.5)' },
  { value: 'pro',     label: 'Pro',      color: '#00E5D1' },
  { value: 'premium', label: 'Premium',  color: '#F59E0B' },
];

export default function AdminPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;

      // Vérifier que c'est bien un admin
      if (!user || !ADMIN_EMAILS.includes(user.email ?? '')) {
        router.push('/');
        return;
      }

      // Charger tous les profils
      const { data: profiles } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profiles) setUsers(profiles as UserProfile[]);
      setLoading(false);
    };
    load();
  }, []);

  const changeTier = async (userId: string, tier: SubscriptionTier) => {
    setSaving(userId);
    await supabase.from('profiles').update({ subscription_tier: tier }).eq('id', userId);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, subscription_tier: tier } : u));
    setSaving(null);
  };

  const filtered = users.filter(u =>
    u.nickname.toLowerCase().includes(search.toLowerCase())
  );

  const counts = {
    free: users.filter(u => u.subscription_tier === 'free').length,
    pro: users.filter(u => u.subscription_tier === 'pro').length,
    premium: users.filter(u => u.subscription_tier === 'premium').length,
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen" style={{ background: '#0D1B3E' }}>
      <div className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
        style={{ borderColor: '#FF00AA', borderTopColor: 'transparent' }} />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 50%, #0D1B3E 100%)' }}>

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4"
        style={{ borderBottom: '1px solid rgba(255,0,170,0.2)' }}>
        <div className="flex items-center gap-3">
          <Link href="/">
            <MuzquizLogo width={60} textSize="1.1rem" horizontal />
          </Link>
          <span className="text-xs font-black px-3 py-1 rounded-full"
            style={{ background: 'rgba(255,0,170,0.15)', color: '#FF00AA', border: '1px solid rgba(255,0,170,0.3)' }}>
            Admin
          </span>
        </div>
        <Link href="/profile" className="text-sm font-bold" style={{ color: 'rgba(240,244,255,0.4)' }}>
          ← Mon profil
        </Link>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">

        <h1 className="text-2xl font-black mb-2" style={{ color: '#F0F4FF' }}>Gestion des utilisateurs</h1>
        <p className="text-sm mb-6" style={{ color: 'rgba(240,244,255,0.4)' }}>
          {users.length} compte{users.length > 1 ? 's' : ''} enregistré{users.length > 1 ? 's' : ''}
        </p>

        {/* Stats rapides */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Gratuit', value: counts.free, color: 'rgba(240,244,255,0.5)' },
            { label: 'Pro',     value: counts.pro,  color: '#00E5D1' },
            { label: 'Premium', value: counts.premium, color: '#F59E0B' },
          ].map(s => (
            <div key={s.label} className="muz-card p-4 text-center">
              <div className="text-2xl font-black" style={{ color: s.color }}>{s.value}</div>
              <div className="text-xs font-bold mt-1" style={{ color: 'rgba(240,244,255,0.4)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Recherche */}
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher un pseudo..."
          className="w-full px-4 py-3 rounded-xl font-medium outline-none mb-4"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1.5px solid rgba(139,92,246,0.25)',
            color: '#F0F4FF',
          }}
        />

        {/* Liste utilisateurs */}
        <div className="flex flex-col gap-3">
          {filtered.map(user => {
            const initial = user.nickname[0]?.toUpperCase() ?? '?';
            const currentTier = TIER_OPTIONS.find(t => t.value === user.subscription_tier)!;

            return (
              <div key={user.id} className="muz-card p-4 flex items-center gap-4">
                {/* Avatar */}
                <div className="w-11 h-11 rounded-full flex items-center justify-center font-black text-lg flex-shrink-0"
                  style={{ background: user.avatar_color, color: '#0D1B3E' }}>
                  {initial}
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <p className="font-black text-sm" style={{ color: '#F0F4FF' }}>{user.nickname}</p>
                  <p className="text-xs" style={{ color: 'rgba(240,244,255,0.35)' }}>
                    {new Date(user.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                {/* Sélecteur tier */}
                <div className="flex gap-1.5 flex-shrink-0">
                  {TIER_OPTIONS.map(tier => (
                    <button
                      key={tier.value}
                      onClick={() => changeTier(user.id, tier.value)}
                      disabled={saving === user.id || user.subscription_tier === tier.value}
                      className="px-3 py-1.5 rounded-lg text-xs font-black transition-all"
                      style={{
                        background: user.subscription_tier === tier.value
                          ? tier.value === 'free' ? 'rgba(255,255,255,0.12)' : tier.value === 'pro' ? 'rgba(0,229,209,0.2)' : 'rgba(245,158,11,0.2)'
                          : 'rgba(255,255,255,0.04)',
                        color: user.subscription_tier === tier.value ? tier.color : 'rgba(240,244,255,0.3)',
                        border: `1px solid ${user.subscription_tier === tier.value ? tier.color + '55' : 'rgba(255,255,255,0.07)'}`,
                        cursor: user.subscription_tier === tier.value ? 'default' : 'pointer',
                        transform: saving === user.id ? 'scale(0.95)' : 'scale(1)',
                      }}>
                      {tier.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="muz-card p-8 text-center">
              <p className="font-bold" style={{ color: 'rgba(240,244,255,0.5)' }}>Aucun résultat pour "{search}"</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
