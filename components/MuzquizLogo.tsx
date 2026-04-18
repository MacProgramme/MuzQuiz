// components/MuzquizLogo.tsx
"use client";

const MUSTACHE_PATH = "M5078 4980 c-350 -37 -700 -176 -1079 -431 -212 -142 -402 -292 -804 -634 -426 -362 -624 -510 -885 -657 -301 -171 -525 -263 -788 -325 -100 -23 -139 -27 -262 -27 -124 0 -154 3 -204 22 -89 33 -137 65 -199 132 -97 104 -150 250 -151 410 -1 116 23 178 91 241 79 72 155 100 443 162 132 28 199 56 246 104 63 63 41 97 -104 158 -158 66 -295 85 -442 61 -288 -47 -514 -194 -699 -452 -254 -356 -307 -752 -151 -1116 295 -687 1406 -1140 2966 -1209 818 -36 1849 104 2378 322 193 79 297 142 532 321 76 58 233 136 309 153 84 20 192 23 224 6 13 -7 62 -41 110 -76 806 -589 2529 -867 4021 -649 664 97 1218 291 1600 562 118 83 298 262 368 364 237 347 265 713 82 1078 -96 191 -259 388 -429 516 -97 74 -276 165 -366 188 -194 49 -363 16 -487 -94 -52 -46 -108 -124 -108 -152 0 -40 130 -81 426 -137 166 -31 240 -59 302 -115 100 -91 119 -254 46 -399 -30 -58 -144 -180 -241 -258 -208 -165 -447 -201 -728 -107 -97 32 -275 122 -376 190 -119 80 -514 380 -1009 767 -212 166 -456 352 -542 414 -513 365 -931 561 -1363 638 -112 20 -162 23 -360 23 -175 0 -253 -4 -325 -18 -230 -42 -451 -114 -659 -213 -152 -73 -166 -73 -301 0 -203 109 -468 198 -672 226 -114 16 -311 21 -410 11z";

interface Props {
  /** Largeur de la moustache en px */
  width?: number;
  /** Afficher le texte MUZQUIZ sous la moustache */
  showText?: boolean;
  /** Taille du texte (ex: '1rem', '2.5rem') */
  textSize?: string;
  /** Animer la moustache au chargement */
  animate?: boolean;
  /** Layout horizontal : moustache + texte côte à côte (pour les navbars) */
  horizontal?: boolean;
  className?: string;
}

export function MuzquizLogo({
  width = 140,
  showText = true,
  textSize = '1.5rem',
  animate = false,
  horizontal = false,
  className = '',
}: Props) {
  const moustache = (
    <svg
      viewBox="0 0 1280 640"
      className={animate ? 'muz-shake' : ''}
      style={{
        width,
        height: width * 0.5,
        flexShrink: 0,
        filter: 'drop-shadow(0 0 12px rgba(255,0,170,0.55))',
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(0,640) scale(0.1,-0.1)" fill="url(#muz-logo-grad)" stroke="none">
        <path d={MUSTACHE_PATH} />
      </g>
    </svg>
  );

  if (horizontal) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {moustache}
        {showText && (
          <span
            className="muz-logo font-black"
            style={{ fontFamily: 'var(--font-black-han)', fontSize: textSize, lineHeight: 1 }}
          >
            MUZQUIZ
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {moustache}
      {showText && (
        <span
          className="muz-logo font-black"
          style={{ fontFamily: 'var(--font-black-han)', fontSize: textSize, lineHeight: 1.1, marginTop: '-2px' }}
        >
          MUZQUIZ
        </span>
      )}
    </div>
  );
}
