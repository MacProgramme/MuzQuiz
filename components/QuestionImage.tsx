// components/QuestionImage.tsx
"use client";

import { QuestionType } from '@/types';

interface Props {
  imageUrl: string;
  questionType: QuestionType;
  /** Incrémenté à chaque nouvelle question — réinitialise l'animation CSS */
  timerKey: number;
  /** Durée du timer en secondes (= durée du déflou) */
  timerDuration: number;
  isPaused?: boolean;
  /** true = taille grand écran public */
  large?: boolean;
}

export function QuestionImage({
  imageUrl,
  questionType,
  timerKey,
  timerDuration,
  isPaused = false,
  large = false,
}: Props) {
  const isBlur = questionType === 'blur_reveal';
  const maxH = large ? '360px' : '240px';

  return (
    <div
      className="w-full overflow-hidden rounded-2xl"
      style={{
        maxHeight: maxH,
        background: 'rgba(255,255,255,0.04)',
        border: '1.5px solid rgba(255,255,255,0.08)',
        boxShadow: isBlur
          ? '0 0 30px rgba(139,92,246,0.15)'
          : '0 0 20px rgba(0,0,0,0.3)',
        position: 'relative',
      }}
    >
      {/* Badge type d'image */}
      <div
        className="absolute top-2 right-2 z-10 text-xs font-black px-2 py-0.5 rounded-full"
        style={{
          background: isBlur
            ? 'rgba(139,92,246,0.85)'
            : 'rgba(0,229,209,0.85)',
          color: 'white',
          backdropFilter: 'blur(4px)',
          letterSpacing: '0.05em',
        }}
      >
        {isBlur ? '🔍 Devine !' : '🖼️ Image'}
      </div>

      {/* L'image elle-même */}
      <img
        key={`img-${timerKey}`}
        src={imageUrl}
        alt="Question"
        className="muz-deblur-img"
        style={{
          ...(isBlur
            ? {
                animation: `muz-deblur ${timerDuration}s linear forwards`,
                animationPlayState: isPaused ? 'paused' : 'running',
              }
            : {}),
        }}
        onError={(e) => {
          // Cacher l'image si elle ne charge pas
          (e.currentTarget.parentElement as HTMLElement).style.display = 'none';
        }}
      />
    </div>
  );
}
