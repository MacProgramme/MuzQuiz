// app/auth/confirm/page.tsx
// Page affichée après le clic sur le lien de vérification email
"use client";

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { MuzquizLogo } from '@/components/MuzquizLogo';
import Link from 'next/link';

type Status = 'loading' | 'success' | 'error';

function ConfirmInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleConfirm = async () => {
      // Supabase envoie les tokens dans le hash (#) ou en query params selon la version
      const tokenHash = searchParams.get('token_hash');
      const type = searchParams.get('type') as any;
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');

      try {
        if (tokenHash && type) {
          // Nouveau format Supabase (PKCE)
          const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
          if (error) throw error;
        } else if (accessToken && refreshToken) {
          // Ancien format (hash fragment, géré par Supabase auto)
          const { error } = await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
          if (error) throw error;
        } else {
          // Laisser Supabase gérer lui-même (il lit le hash de l'URL automatiquement)
          await new Promise(resolve => setTimeout(resolve, 800));
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) throw new Error('Session introuvable');
        }

        setStatus('success');
        // Rediriger vers le profil après 3 secondes
        setTimeout(() => router.push('/profile'), 3000);
      } catch (err: any) {
        console.error('Confirm error:', err);
        setMessage(err?.message ?? 'Lien invalide ou expiré.');
        setStatus('error');
      }
    };

    handleConfirm();
  }, []);

  return (
    <div className="w-full max-w-sm text-center">
      <div className="mb-8">
        <MuzquizLogo width={140} textSize="2.5rem" animate />
      </div>

      {status === 'loading' && (
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#FF00AA', borderTopColor: 'transparent' }} />
          <p className="text-sm font-bold" style={{ color: 'rgba(240,244,255,0.5)' }}>
            Vérification en cours…
          </p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col items-center gap-6">
          {/* Icône succès */}
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,229,209,0.12)', border: '2px solid rgba(0,229,209,0.4)' }}>
            <span className="text-3xl">✓</span>
          </div>

          <div>
            <h1 className="text-xl font-black mb-2" style={{ color: '#F0F4FF' }}>
              Email vérifié !
            </h1>
            <p className="text-sm" style={{ color: 'rgba(240,244,255,0.5)' }}>
              Bienvenue sur MUZQUIZ 🎉<br />
              Tu vas être redirigé vers ton profil…
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Link href="/profile"
              className="block w-full py-3.5 rounded-xl font-black text-sm text-center transition-all hover:scale-[1.02]"
              style={{ background: '#FF00AA', color: 'white' }}>
              Aller sur mon profil →
            </Link>
            <Link href="/"
              className="block w-full py-3 rounded-xl font-black text-sm text-center"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(240,244,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
              Retour à l'accueil
            </Link>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,0,0,0.1)', border: '2px solid rgba(255,80,80,0.4)' }}>
            <span className="text-3xl">✕</span>
          </div>

          <div>
            <h1 className="text-xl font-black mb-2" style={{ color: '#F0F4FF' }}>
              Lien invalide
            </h1>
            <p className="text-sm" style={{ color: 'rgba(240,244,255,0.4)' }}>
              {message || 'Ce lien a expiré ou a déjà été utilisé.'}
            </p>
          </div>

          <div className="flex flex-col gap-2 w-full">
            <Link href="/signup"
              className="block w-full py-3.5 rounded-xl font-black text-sm text-center"
              style={{ background: '#FF00AA', color: 'white' }}>
              Créer un compte →
            </Link>
            <Link href="/login"
              className="block w-full py-3 rounded-xl font-black text-sm text-center"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(240,244,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
              Se connecter
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 60%, #0D1B3E 100%)' }}>
      <Suspense fallback={
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
            style={{ borderColor: '#FF00AA', borderTopColor: 'transparent' }} />
          <p className="text-sm font-bold" style={{ color: 'rgba(240,244,255,0.5)' }}>
            Chargement…
          </p>
        </div>
      }>
        <ConfirmInner />
      </Suspense>
    </main>
  );
}
