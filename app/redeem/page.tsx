// app/redeem/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MuzquizLogo } from '@/components/MuzquizLogo';
import Link from 'next/link';

export default function RedeemPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user;
      setIsLoggedIn(!!(user && !user.is_anonymous));
    });
  }, []);

  const handleRedeem = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);

    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    if (!token) {
      setResult({ success: false, message: 'Tu dois être connecté pour activer un code.' });
      setLoading(false);
      return;
    }

    const res = await fetch('/api/redeem-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ code: code.trim().toUpperCase() }),
    });

    const data = await res.json();

    if (res.ok && data.success) {
      setResult({ success: true, message: data.message });
      setCode('');
    } else {
      setResult({ success: false, message: data.error ?? 'Erreur inconnue' });
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 60%, #0D1B3E 100%)' }}>

      {/* Back */}
      <Link href="/"
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-sm font-bold px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
        style={{ background: 'rgba(255,0,170,0.08)', color: 'rgba(255,0,170,0.7)', border: '1px solid rgba(255,0,170,0.2)' }}>
        <MuzquizLogo width={16} showText={false} /> Accueil
      </Link>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="mb-4">
            <MuzquizLogo width={140} textSize="2.5rem" animate />
          </div>
          <h1 className="text-2xl font-black mb-2" style={{ color: '#F0F4FF' }}>
            Activer un code
          </h1>
          <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>
            Code cadeau ou code de réduction — entre-le ci-dessous
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1.5px solid rgba(255,0,170,0.2)' }}>

          {isLoggedIn === false ? (
            <div className="text-center">
              <p className="text-sm mb-4" style={{ color: 'rgba(240,244,255,0.5)' }}>
                Tu dois être connecté avec un vrai compte pour activer un code.
              </p>
              <Link href="/login"
                className="inline-block font-black px-6 py-3 rounded-xl text-sm"
                style={{ background: '#FF00AA', color: 'white' }}>
                Se connecter →
              </Link>
            </div>
          ) : (
            <>
              <label className="block text-xs font-black uppercase tracking-widest mb-2"
                style={{ color: 'rgba(240,244,255,0.4)' }}>
                Ton code
              </label>
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleRedeem()}
                placeholder="ex: MUZQUIZ2025"
                className="w-full px-4 py-3.5 rounded-xl text-center text-lg font-black tracking-[0.2em] outline-none mb-4"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1.5px solid rgba(255,255,255,0.12)',
                  color: '#F0F4FF',
                  letterSpacing: '0.2em',
                }}
              />

              <button
                onClick={handleRedeem}
                disabled={loading || !code.trim()}
                className="w-full py-4 rounded-xl font-black text-base transition-all hover:scale-[1.02] disabled:opacity-50 disabled:scale-100"
                style={{ background: '#FF00AA', color: 'white' }}>
                {loading ? 'Activation…' : 'Activer le code →'}
              </button>

              {/* Résultat */}
              {result && (
                <div className="mt-4 px-4 py-3 rounded-xl text-sm font-bold text-center"
                  style={{
                    background: result.success ? 'rgba(0,229,209,0.08)' : 'rgba(255,80,80,0.08)',
                    border: `1px solid ${result.success ? 'rgba(0,229,209,0.3)' : 'rgba(255,80,80,0.3)'}`,
                    color: result.success ? '#00E5D1' : '#FF6060',
                  }}>
                  {result.message}
                </div>
              )}
            </>
          )}
        </div>

        {/* Infos */}
        <div className="mt-6 flex flex-col gap-3">
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-lg flex-shrink-0">🎁</span>
            <div>
              <p className="text-xs font-black" style={{ color: '#F0F4FF' }}>Carte cadeau</p>
              <p className="text-xs" style={{ color: 'rgba(240,244,255,0.4)' }}>
                Active un abonnement (Essentiel, Pro ou Expert) pour une durée définie.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 px-4 py-3 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <span className="text-lg flex-shrink-0">🏷️</span>
            <div>
              <p className="text-xs font-black" style={{ color: '#F0F4FF' }}>Code de réduction</p>
              <p className="text-xs" style={{ color: 'rgba(240,244,255,0.4)' }}>
                Applique une réduction en % sur ton prochain abonnement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
