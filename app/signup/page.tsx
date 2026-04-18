// app/signup/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { MuzquizLogo } from '@/components/MuzquizLogo';

const AVATAR_COLORS = [
  '#FF00AA', '#00E5D1', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981',
];

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[2]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const signup = async () => {
    if (!email.trim() || !password.trim() || !nickname.trim()) {
      setErr('Remplis tous les champs.'); return;
    }
    if (password.length < 6) {
      setErr('Le mot de passe doit faire au moins 6 caractères.'); return;
    }
    setLoading(true);
    setErr('');

    // Créer le compte Supabase
    // On passe le pseudo dans les métadonnées pour que le trigger SQL puisse l'utiliser
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: nickname.trim(),
          avatar_color: avatarColor,
        }
      }
    });
    if (error) {
      setErr(error.message === 'User already registered'
        ? 'Cet email est déjà utilisé.'
        : error.message);
      setLoading(false);
      return;
    }

    const userId = data.user?.id;
    if (!userId) { setErr("Erreur lors de la création du compte."); setLoading(false); return; }

    // Créer le profil (fonctionne si session active = confirmation email désactivée)
    // Si email confirmation activée, le trigger SQL crée le profil automatiquement
    const { error: profileError } = await supabase.from('profiles').insert({
      id: userId,
      nickname: nickname.trim(),
      avatar_color: avatarColor,
    });

    // Si l'insertion a réussi (session active), on va directement au profil
    if (!profileError) {
      router.push('/profile');
      return;
    }

    // Sinon, confirmation d'email requise — on affiche un message à l'utilisateur
    setLoading(false);
    setErr('✅ Compte créé ! Vérifie ton email pour confirmer ton inscription, puis connecte-toi.');
  };

  const initial = nickname.trim() ? nickname.trim()[0].toUpperCase() : '?';

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 50%, #0D1B3E 100%)' }}>

      {/* Logo */}
      <Link href="/" className="mb-8 block">
        <MuzquizLogo width={160} textSize="2rem" animate />
      </Link>

      {/* Card */}
      <div className="muz-card w-full max-w-md p-8">
        <h2 className="text-2xl font-black mb-1" style={{ color: '#F0F4FF' }}>Créer un compte</h2>
        <p className="text-sm mb-6" style={{ color: 'rgba(240,244,255,0.4)' }}>
          Déjà inscrit ?{' '}
          <Link href="/login" className="font-bold" style={{ color: '#00E5D1' }}>Se connecter →</Link>
        </p>

        <div className="flex flex-col gap-4">
          {/* Aperçu avatar */}
          <div className="flex items-center gap-4 p-4 rounded-xl"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center font-black text-xl flex-shrink-0"
              style={{ background: avatarColor, color: '#0D1B3E', boxShadow: `0 0 20px ${avatarColor}66` }}>
              {initial}
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: 'rgba(240,244,255,0.4)' }}>Couleur de l'avatar</p>
              <div className="flex gap-2">
                {AVATAR_COLORS.map(c => (
                  <button key={c} onClick={() => setAvatarColor(c)}
                    className="w-6 h-6 rounded-full transition-all"
                    style={{
                      background: c,
                      border: avatarColor === c ? '3px solid white' : '2px solid transparent',
                      transform: avatarColor === c ? 'scale(1.2)' : 'scale(1)',
                      boxShadow: avatarColor === c ? `0 0 10px ${c}` : 'none',
                    }} />
                ))}
              </div>
            </div>
          </div>

          <input
            value={nickname}
            onChange={e => setNickname(e.target.value)}
            placeholder="Ton pseudo"
            maxLength={16}
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
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
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
            onKeyDown={e => e.key === 'Enter' && signup()}
            placeholder="Mot de passe (min. 6 caractères)"
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
            onClick={signup}
            disabled={loading}
            className="muz-btn-cyan py-4 rounded-xl text-lg font-black disabled:opacity-50">
            {loading ? '...' : 'Créer mon compte →'}
          </button>
        </div>
      </div>

      <Link href="/" className="mt-6 text-sm" style={{ color: 'rgba(240,244,255,0.35)' }}>
        ← Retour à l'accueil
      </Link>
    </main>
  );
}
