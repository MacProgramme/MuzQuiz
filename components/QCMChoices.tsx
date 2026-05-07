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
function MustacheIcon({ color = '#00E5D1', size = 56 }: { color?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 1280 640"
      className="muz-mustache-anim"
      style={{ width: size, height: size * 0.5, flexShrink: 0, filter: `drop-shadow(0 0 10px ${color}bb)` }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(0,640) scale(0.1,-0.1)" fill={color} stroke="none">
        <path d="M5078 4980 c-350 -37 -700 -176 -1079 -431 -212 -142 -402 -292 -804 -634 -426 -362 -624 -510 -885 -657 -301 -171 -525 -263 -788 -325 -100 -23 -139 -27 -262 -27 -124 0 -154 3 -204 22 -89 33 -137 65 -199 132 -97 104 -150 250 -151 410 -1 116 23 178 91 241 79 72 155 100 443 162 132 28 199 56 246 104 63 63 41 97 -104 158 -158 66 -295 85 -442 61 -288 -47 -514 -194 -699 -452 -254 -356 -307 -752 -151 -1116 295 -687 1406 -1140 2966 -1209 818 -36 1849 104 2378 322 193 79 297 142 532 321 76 58 233 136 309 153 84 20 192 23 224 6 13 -7 62 -41 110 -76 806 -589 2529 -867 4021 -649 664 97 1218 291 1600 562 118 83 298 262 368 364 237 347 265 713 82 1078 -96 191 -259 388 -429 516 -97 74 -276 165 -366 188 -194 49 -363 16 -487 -94 -52 -46 -108 -124 -108 -152 0 -40 130 -81 426 -137 166 -31 240 -59 302 -115 100 -91 119 -254 46 -399 -30 -58 -144 -180 -241 -258 -208 -165 -447 -201 -728 -107 -97 32 -275 122 -376 190 -119 80 -514 380 -1009 767 -212 166 -456 352 -542 414 -513 365 -931 561 -1363 638 -112 20 -162 23 -360 23 -175 0 -253 -4 -325 -18 -230 -42 -451 -114 -659 -213 -152 -73 -166 -73 -301 0 -203 109 -468 198 -672 226 -114 16 -311 21 -410 11z"/>
      </g>
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
  disabledForNonBuzzer?: boolean; // true = boutons visibles mais non cliquables (spectateurs en mode Buzz Quiz)
}

export function QCMChoices({
  choices, selectedIndex, correctIndex, onChoose, revealed, disabledForNonBuzzer = false,
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
        } else if (disabledForNonBuzzer) {
          bgStyle = { background: 'rgba(255,255,255,0.03)' };
          borderColor = 'rgba(255,255,255,0.08)';
          textColor = 'rgba(240,244,255,0.25)';
        } else {
          bgStyle = { background: color.light };
          borderColor = color.border;
        }

        return (
          <button
            key={i}
            onClick={() => !revealed && selectedIndex === null && onChoose(i)}
            disabled={selectedIndex !== null || revealed || disabledForNonBuzzer}
            className={`relative flex items-center gap-3 p-4 rounded-2xl font-bold text-left transition-all duration-200 overflow-hidden
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

            {/* Texte avec padding droit pour laisser place à la moustache */}
            <span className="text-sm leading-tight flex-1" style={{ paddingRight: isCorrect ? '3rem' : '0', wordBreak: 'break-word', overflowWrap: 'break-word', minWidth: 0 }}>
              {choice}
            </span>

            {/* Moustache en overlay absolu — ne coupe jamais le texte sur mobile */}
            {isCorrect && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <MustacheIcon color="#00E5D1" size={44} />
              </div>
            )}

            {/* Croix discrète pour la mauvaise réponse */}
            {isWrong && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="text-lg opacity-40" style={{ color: '#FF00AA' }}>✗</span>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
