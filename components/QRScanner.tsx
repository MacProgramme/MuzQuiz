// components/QRScanner.tsx
"use client";

import { useEffect, useRef, useState, useCallback } from 'react';

interface Props {
  onScan: (code: string) => void;
  onClose: () => void;
}

export function QRScanner({ onScan, onClose }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(true);

  const extractCode = (text: string): string | null => {
    // Si c'est une URL avec ?join=CODE
    try {
      const url = new URL(text);
      const join = url.searchParams.get('join');
      if (join) return join.toUpperCase();
    } catch (_) {}
    // Si c'est directement un code (6 chars alphanum)
    if (/^[A-Z0-9]{4,8}$/i.test(text.trim())) return text.trim().toUpperCase();
    return null;
  };

  const tick = useCallback(async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !scanning) return;
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    try {
      const jsQR = (await import('jsqr')).default;
      const result = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert',
      });

      if (result?.data) {
        const code = extractCode(result.data);
        if (code) {
          setScanning(false);
          // Feedback visuel rapide avant de fermer
          setTimeout(() => {
            onScan(code);
            onClose();
          }, 180);
          return;
        }
      }
    } catch (_) {}

    rafRef.current = requestAnimationFrame(tick);
  }, [scanning, onScan, onClose]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        rafRef.current = requestAnimationFrame(tick);
      } catch (e: any) {
        if (e?.name === 'NotAllowedError') {
          setError("Accès à la caméra refusé. Autorise la caméra dans les paramètres de ton navigateur.");
        } else {
          setError("Impossible d'ouvrir la caméra. Essaie depuis Chrome ou Safari.");
        }
      }
    };
    startCamera();

    return () => {
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach(t => t.stop());
    };
  }, []);

  // Relancer tick quand scanning change
  useEffect(() => {
    if (scanning) {
      rafRef.current = requestAnimationFrame(tick);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [scanning, tick]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(8px)' }}>

      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-sm px-4 mb-5">
        <p className="font-black text-lg" style={{ color: '#F0F4FF' }}>Scanner le QR code</p>
        <button onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center font-bold transition-all hover:scale-110"
          style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(240,244,255,0.7)' }}>
          ✕
        </button>
      </div>

      {error ? (
        <div className="flex flex-col items-center gap-4 px-6 text-center max-w-sm">
          <div className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(255,0,170,0.12)', border: '2px solid rgba(255,0,170,0.3)' }}>
            <span className="text-2xl">!</span>
          </div>
          <p className="text-sm font-bold" style={{ color: 'rgba(240,244,255,0.7)' }}>{error}</p>
          <button onClick={onClose}
            className="muz-btn-pink px-6 py-3 rounded-xl font-black text-sm">
            Fermer
          </button>
        </div>
      ) : (
        <div className="relative w-full max-w-sm mx-4">
          {/* Viewfinder */}
          <div className="relative rounded-2xl overflow-hidden"
            style={{ aspectRatio: '1 / 1', border: '2px solid rgba(0,229,209,0.5)' }}>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
            {/* Canvas caché pour l'analyse */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Coin d'aiguillage stylisés */}
            {(['tl', 'tr', 'bl', 'br'] as const).map(corner => (
              <div key={corner} className="absolute w-8 h-8"
                style={{
                  top: corner.startsWith('t') ? 10 : 'auto',
                  bottom: corner.startsWith('b') ? 10 : 'auto',
                  left: corner.endsWith('l') ? 10 : 'auto',
                  right: corner.endsWith('r') ? 10 : 'auto',
                  borderTop: corner.startsWith('t') ? '3px solid #00E5D1' : 'none',
                  borderBottom: corner.startsWith('b') ? '3px solid #00E5D1' : 'none',
                  borderLeft: corner.endsWith('l') ? '3px solid #00E5D1' : 'none',
                  borderRight: corner.endsWith('r') ? '3px solid #00E5D1' : 'none',
                  borderRadius: corner === 'tl' ? '6px 0 0 0' : corner === 'tr' ? '0 6px 0 0' : corner === 'bl' ? '0 0 0 6px' : '0 0 6px 0',
                }} />
            ))}

            {/* Ligne de scan animée */}
            {scanning && (
              <div className="absolute left-4 right-4 h-0.5 rounded-full"
                style={{
                  background: 'linear-gradient(90deg, transparent, #00E5D1, transparent)',
                  animation: 'muz-scan-line 2s ease-in-out infinite',
                  top: '50%',
                }} />
            )}

            {/* Succès overlay */}
            {!scanning && (
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'rgba(0,229,209,0.2)' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: '#00E5D1', boxShadow: '0 0 40px rgba(0,229,209,0.8)' }}>
                  <span className="text-2xl font-black" style={{ color: '#0D1B3E' }}>✓</span>
                </div>
              </div>
            )}
          </div>

          <p className="text-center text-sm mt-4 font-medium"
            style={{ color: 'rgba(240,244,255,0.4)' }}>
            {scanning ? 'Place le QR code dans le cadre' : 'Code détecté !'}
          </p>
        </div>
      )}

      <style>{`
        @keyframes muz-scan-line {
          0%, 100% { transform: translateY(-40px); opacity: 0.3; }
          50% { transform: translateY(40px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
