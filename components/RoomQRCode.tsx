// components/RoomQRCode.tsx
"use client";

import { useEffect, useRef, useState } from 'react';

interface Props {
  code: string;
  size?: number;
}

export function RoomQRCode({ code, size = 160 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const url = `${window.location.origin}/?join=${code}`;
    import('qrcode').then(QRCode => {
      if (!canvasRef.current) return;
      QRCode.toCanvas(canvasRef.current, url, {
        width: size,
        margin: 2,
        color: {
          dark: '#F0F4FF',   // points clairs pour fond sombre
          light: '#162856',  // fond = couleur carte MUZQUIZ
        },
      }, (err) => {
        if (!err) setReady(true);
      });
    });
  }, [code, size]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="rounded-2xl overflow-hidden flex items-center justify-center"
        style={{
          padding: 6,
          background: '#162856',
          border: '2px solid rgba(0,229,209,0.35)',
          boxShadow: '0 0 24px rgba(0,229,209,0.15)',
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
