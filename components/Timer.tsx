// components/Timer.tsx
"use client";

import { useEffect, useState } from 'react';

interface Props {
  duration: number;
  running: boolean;
  onExpire: () => void;
}

export function Timer({ duration, running, onExpire }: Props) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (!running) return;
    if (timeLeft <= 0) { onExpire(); return; }
    const id = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, running]);

  const pct = (timeLeft / duration) * 100;

  // Couleurs selon le temps restant
  const color = timeLeft <= 5 ? '#FF00AA' : timeLeft <= 10 ? '#F59E0B' : '#00E5D1';
  const glowColor = timeLeft <= 5
    ? 'rgba(255,0,170,0.5)'
    : timeLeft <= 10
    ? 'rgba(245,158,11,0.4)'
    : 'rgba(0,229,209,0.3)';

  return (
    <div className="flex flex-col items-center gap-1.5">
      <span
        className={`text-3xl font-black tabular-nums ${timeLeft <= 5 ? 'animate-pulse' : ''}`}
        style={{
          color,
          textShadow: timeLeft <= 5 ? `0 0 16px ${glowColor}` : 'none',
          fontFamily: 'var(--font-black-han)',
        }}
      >
        {timeLeft}
      </span>
      <div className="w-20 h-1.5 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full transition-all duration-1000 ease-linear"
          style={{
            width: `${pct}%`,
            background: color,
            boxShadow: `0 0 8px ${glowColor}`,
          }}
        />
      </div>
    </div>
  );
}
