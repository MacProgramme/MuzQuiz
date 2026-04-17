// components/BuzzerButton.tsx
"use client";

interface Props {
  onBuzz: () => void;
  disabled: boolean;
  buzzedByMe: boolean;
  buzzedByOther: string | null;
}

export function BuzzerButton({ onBuzz, disabled, buzzedByMe, buzzedByOther }: Props) {
  return (
    <div className="flex flex-col items-center gap-5">
      <button
        onClick={onBuzz}
        disabled={disabled}
        className={`muz-buzzer w-44 h-44 rounded-full font-black text-2xl uppercase tracking-wider select-none text-white transition-all duration-150
          ${buzzedByMe ? 'buzzed muz-glow' : ''}
        `}
        style={{ fontSize: buzzedByMe ? '1rem' : '1.5rem' }}
      >
        {buzzedByMe ? '🎤 Buzzé !' : 'BUZZ!'}
      </button>

      {buzzedByOther && (
        <div className="px-5 py-2 rounded-full font-bold text-sm muz-pop"
          style={{ background: 'rgba(255,0,170,0.15)', border: '1px solid rgba(255,0,170,0.4)', color: '#FF00AA' }}>
          🔔 {buzzedByOther} a buzzé !
        </div>
      )}
    </div>
  );
}
