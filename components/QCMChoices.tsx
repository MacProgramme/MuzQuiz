// components/QCMChoices.tsx
"use client";

const LABELS = ['A', 'B', 'C', 'D'];

const CHOICE_COLORS = [
  { bg: '#FF00AA', light: 'rgba(255,0,170,0.15)', border: 'rgba(255,0,170,0.5)' },
  { bg: '#00E5D1', light: 'rgba(0,229,209,0.15)', border: 'rgba(0,229,209,0.5)' },
  { bg: '#8B5CF6', light: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.5)' },
  { bg: '#F59E0B', light: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.5)' },
];

// Moustache SVG inline pour la bonne réponse
function MustacheIcon({ color = '#00E5D1', size = 44 }: { color?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 100 50"
      className="muz-mustache-anim"
      style={{ width: size, height: size * 0.5, flexShrink: 0, filter: `drop-shadow(0 0 8px ${color}99)` }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M50 30 C44 24 32 18 18 22 C10 25 4 28 2 24 C0 20 2 13 8 12 C14 11 22 15 30 20 C38 25 46 28 50 26 C54 28 62 25 70 20 C78 15 86 11 92 12 C98 13 100 20 98 24 C96 28 90 25 82 22 C68 18 56 24 50 30 Z"
        fill={color}
      />
    </svg>
  );
}

interface Props {
  choices: [string, string, string, string];
  selectedIndex: number | null;
  correctIndex: number | null;
  answeredBy: number[];
  totalPlayers: number;
  onChoose: (index: number) => void;
  revealed: boolean;
}

export function QCMChoices({
  choices, selectedIndex, correctIndex, onChoose, revealed,
}: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
      {choices.map((choice, i) => {
        const color = CHOICE_COLORS[i];
        const isSelected = selectedIndex === i;
        const isCorrect = revealed && correctIndex === i;
        const isWrong = revealed && isSelected && correctIndex !== null && i !== correctIndex;

        let bgStyle: React.CSSProperties;
        let borderColor: string;
        let textColor = '#F0F4FF';

        if (revealed) {
          if (isCorrect) {
            bgStyle = { background: 'rgba(0,229,209,0.2)' };
            borderColor = '#00E5D1';
          } else if (isWrong) {
            bgStyle = { background: 'rgba(255,0,170,0.08)' };
            borderColor = 'rgba(255,0,170,0.25)';
            textColor = 'rgba(240,244,255,0.35)';
          } else {
            bgStyle = { background: 'rgba(255,255,255,0.02)' };
            borderColor = 'rgba(255,255,255,0.06)';
            textColor = 'rgba(240,244,255,0.25)';
          }
        } else if (selectedIndex !== null) {
          if (isSelected) {
            bgStyle = { background: color.light };
            borderColor = color.bg;
          } else {
            bgStyle = { background: 'rgba(255,255,255,0.03)' };
            borderColor = 'rgba(255,255,255,0.07)';
            textColor = 'rgba(240,244,255,0.3)';
          }
        } else {
          bgStyle = { background: color.light };
          borderColor = color.border;
        }

        return (
          <button
            key={i}
            onClick={() => !revealed && selectedIndex === null && onChoose(i)}
            disabled={selectedIndex !== null || revealed}
            className={`relative flex items-center gap-3 p-4 rounded-2xl font-bold text-left transition-all duration-200
              ${!revealed && selectedIndex === null ? 'hover:scale-[1.03] active:scale-95' : ''}
            `}
            style={{
              ...bgStyle,
              border: `2px solid ${borderColor}`,
              color: textColor,
              cursor: selectedIndex !== null || revealed ? 'default' : 'pointer',
              boxShadow: isCorrect
                ? '0 0 24px rgba(0,229,209,0.5)'
                : isSelected && !revealed
                ? `0 0 12px ${color.bg}55`
                : 'none',
            }}
          >
            {/* Label lettre */}
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
              style={{
                background: revealed
                  ? isCorrect ? '#00E5D1' : 'rgba(255,255,255,0.07)'
                  : isSelected ? color.bg : color.light,
                color: revealed
                  ? isCorrect ? '#0D1B3E' : textColor
                  : isSelected ? 'white' : color.bg,
              }}
            >
              {LABELS[i]}
            </span>

            <span className="text-sm leading-tight flex-1">{choice}</span>

            {/* Moustache animée pour la bonne réponse */}
            {isCorrect && <MustacheIcon color="#00E5D1" size={48} />}

            {/* Croix discrète pour la mauvaise réponse */}
            {isWrong && (
              <span className="ml-auto text-lg opacity-40" style={{ color: '#FF00AA' }}>✗</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
