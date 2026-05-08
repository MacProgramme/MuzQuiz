// components/Scoreboard.tsx
import { Player } from '@/types';

export function Scoreboard({ players, buzzedId }: { players: Player[]; buzzedId?: string }) {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="flex" style={{ borderBottom: '1px solid rgba(139,92,246,0.2)', background: '#112247' }}>
      {sorted.map((p, i) => (
        <div
          key={p.id}
          className="flex-1 text-center py-3 px-2 transition-all"
          style={{
            background: p.id === buzzedId ? 'rgba(255,0,170,0.15)' : 'transparent',
            borderRight: i < sorted.length - 1 ? '1px solid rgba(139,92,246,0.1)' : 'none',
          }}
        >
          <div className="text-xs truncate" style={{ color: 'rgba(240,244,255,0.5)' }}>
            {p.nickname}
          </div>
          <div className="font-black text-lg" style={{ color: p.id === buzzedId ? '#FF00AA' : '#F0F4FF' }}>
            {p.score}
          </div>
          {p.is_host && (
            <div className="text-xs" style={{ color: '#8B5CF6' }}>hôte</div>
          )}
        </div>
      ))}
    </div>
  );
}
