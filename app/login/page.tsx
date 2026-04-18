// app/login/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const login = async () => {
    if (!email.trim() || !password.trim()) { setErr('Remplis tous les champs.'); return; }
    setLoading(true);
    setErr('');

    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) {
      setErr(error.message === 'Invalid login credentials'
        ? 'Email ou mot de passe incorrect.'
        : error.message);
      setLoading(false);
      return;
    }
    router.push('/profile');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 50%, #0D1B3E 100%)' }}>

      {/* Logo */}
      <Link href="/" className="mb-8 block">
        <MuzquizLogo width={160} textSize="2rem" animate />
      </Link>

      {/* Card */}
      <div className="muz-card w-full max-w-md p-8">
        <h2 className="text-2xl font-black mb-1" style={{ color: '#F0F4FF' }}>Connexion</h2>
        <p className="text-sm mb-6" style={{ color: 'rgba(240,244,255,0.4)' }}>
          Pas encore de compte ?{' '}
          <Link href="/signup" className="font-bold" style={{ color: '#FF00AA' }}>S'inscrire →</Link>
        </p>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="Ton email"
            className="w-full px-4 py-3 rounded-xl font-medium outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1.5px solid rgba(139,92,246,0.3)',
              color: '#F0F4FF',
            }}
            onFocus={e => e.target.style.borderColor = '#FF00AA'}
            onBlur={e => e.target.style.borderColor = 'rgba(139,92,246,0.3)'}
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="Mot de passe"
            className="w-full px-4 py-3 rounded-xl font-medium outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1.5px solid rgba(139,92,246,0.3)',
              color: '#F0F4FF',
            }}
            onFocus={e => e.target.style.borderColor = '#FF00AA'}
            onBlur={e => e.target.style.borderColor = 'rgba(139,92,246,0.3)'}
          />

          {err && <p className="text-sm font-bold text-center" style={{ color: '#FF00AA' }}>{err}</p>}

          <button
            onClick={login}
            disabled={loading}
            className="muz-btn-pink py-4 rounded-xl text-lg font-black disabled:opacity-50">
            {loading ? '...' : 'Se connecter →'}
          </button>
        </div>
      </div>

      <Link href="/" className="mt-6 text-sm" style={{ color: 'rgba(240,244,255,0.35)' }}>
        ← Retour à l'accueil
      </Link>
    </main>
  );
}
