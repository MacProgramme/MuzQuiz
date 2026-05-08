// components/InviteQRCode.tsx
// QR code pointant vers le lien d'invitation permanent /j/[invite_code]
"use client";

import { useEffect, useRef, useState } from 'react';

interface Props {
  inviteCode: string;
  size?: number;
  /** 'profile' → /u/[code] (ami + jeu) | 'game' → /j/[code] (jeu uniquement) */
  variant?: 'profile' | 'game';
}

export function InviteQRCode({ inviteCode, size = 160, variant = 'game' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const url = variant === 'profile'
      ? `${window.location.origin}/u/${inviteCode}`
      : `${window.location.origin}/j/${inviteCode}`;
    import('qrcode').then(QRCode => {
      if (!canvasRef.current) return;
      QRCode.toCanvas(canvasRef.current, url, {
        width: size,
        margin: 2,
        color: {
          dark: '#F0F4FF',
          light: '#162856',
        },
      }, (err) => {
        if (!err) setReady(true);
      });
    });
  }, [inviteCode, size, variant]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="rounded-2xl overflow-hidden flex items-center justify-center"
        style={{
          padding: 6,
          background: '#162856',
          border: '2px solid rgba(255,0,170,0.4)',
          boxShadow: '0 0 24px rgba(255,0,170,0.15)',
          opacity: ready ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <canvas ref={canvasRef} width={size} height={size} />
      </div>
      <p className="text-xs font-bold" style={{ color: 'rgba(240,244,255,0.3)', letterSpacing: '0.06em' }}>
        SCANNER POUR REJOINDRE
      </p>
    </div>
  );
}
