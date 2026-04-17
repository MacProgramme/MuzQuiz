// components/QCMChoices.tsx
"use client";

const LABELS = ['A', 'B', 'C', 'D'];

// Couleurs vives MUZQUIZ pour les 4 choix
const CHOICE_COLORS = [
  { bg: '#FF00AA', light: 'rgba(255,0,170,0.15)', border: 'rgba(255,0,170,0.5)' },   // pink
  { bg: '#00E5D1', light: 'rgba(0,229,209,0.15)', border: 'rgba(0,229,209,0.5)' },   // cyan
  { bg: '#8B5CF6', light: 'rgba(139,92,246,0.15)', border: 'rgba(139,92,246,0.5)' }, // violet
  { bg: '#F59E0B', light: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.5)' }, // amber
];

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
        const isNeutral = revealed && !isCorrect && !isSelected;

        let bgStyle: React.CSSProperties;
        let borderColor: string;
        let textColor = '#F0F4FF';

        if (revealed) {
          if (isCorrect) {
            bgStyle = { background: 'rgba(0,229,209,0.25)' };
            borderColor = '#00E5D1';
          } else if (isWrong) {
            bgStyle = { background: 'rgba(255,0,170,0.1)' };
            borderColor = 'rgba(255,0,170,0.3)';
            textColor = 'rgba(240,244,255,0.4)';
          } else {
            bgStyle = { background: 'rgba(255,255,255,0.03)' };
            borderColor = 'rgba(255,255,255,0.07)';
            textColor = 'rgba(240,244,255,0.3)';
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
              ${isCorrect ? 'muz-pop' : ''}
            `}
            style={{
              ...bgStyle,
              border: `2px solid ${borderColor}`,
              color: textColor,
              cursor: selectedIndex !== null || revealed ? 'default' : 'pointer',
              boxShadow: isCorrect ? `0 0 20px rgba(0,229,209,0.4)` : isSelected && !revealed ? `0 0 12px ${color.bg}55` : 'none',
            }}
          >
            {/* Label lettre */}
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
              style={{
                background: revealed
                  ? isCorrect ? '#00E5D1' : 'rgba(255,255,255,0.1)'
                  : isSelected ? color.bg : color.light,
                color: revealed
                  ? isCorrect ? '#0D1B3E' : textColor
                  : isSelected ? 'white' : color.bg,
              }}
            >
              {LABELS[i]}
            </span>

            <span className="text-sm leading-tight flex-1">{choice}</span>

            {isCorrect && <span className="text-xl ml-auto">✓</span>}
            {isWrong && <span className="text-xl ml-auto opacity-50">✗</span>}
          </button>
        );
      })}
    </div>
  );
}
