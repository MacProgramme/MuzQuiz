// components/FloatingMustaches.tsx
// Moustaches décoratives flottantes en arrière-plan — chaleur & vie

const MUSTACHE_PATH = "M5078 4980 c-350 -37 -700 -176 -1079 -431 -212 -142 -402 -292 -804 -634 -426 -362 -624 -510 -885 -657 -301 -171 -525 -263 -788 -325 -100 -23 -139 -27 -262 -27 -124 0 -154 3 -204 22 -89 33 -137 65 -199 132 -97 104 -150 250 -151 410 -1 116 23 178 91 241 79 72 155 100 443 162 132 28 199 56 246 104 63 63 41 97 -104 158 -158 66 -295 85 -442 61 -288 -47 -514 -194 -699 -452 -254 -356 -307 -752 -151 -1116 295 -687 1406 -1140 2966 -1209 818 -36 1849 104 2378 322 193 79 297 142 532 321 76 58 233 136 309 153 84 20 192 23 224 6 13 -7 62 -41 110 -76 806 -589 2529 -867 4021 -649 664 97 1218 291 1600 562 118 83 298 262 368 364 237 347 265 713 82 1078 -96 191 -259 388 -429 516 -97 74 -276 165 -366 188 -194 49 -363 16 -487 -94 -52 -46 -108 -124 -108 -152 0 -40 130 -81 426 -137 166 -31 240 -59 302 -115 100 -91 119 -254 46 -399 -30 -58 -144 -180 -241 -258 -208 -165 -447 -201 -728 -107 -97 32 -275 122 -376 190 -119 80 -514 380 -1009 767 -212 166 -456 352 -542 414 -513 365 -931 561 -1363 638 -112 20 -162 23 -360 23 -175 0 -253 -4 -325 -18 -230 -42 -451 -114 -659 -213 -152 -73 -166 -73 -301 0 -203 109 -468 198 -672 226 -114 16 -311 21 -410 11z";

// Positions et styles des moustaches flottantes
const FLOATERS = [
  { x: '8%',  y: '12%', size: 80,  opacity: 0.045, dur: 14, delay: 0,   color: '#FF00AA', rot: -8 },
  { x: '88%', y: '7%',  size: 60,  opacity: 0.035, dur: 18, delay: 3,   color: '#00E5D1', rot: 12 },
  { x: '75%', y: '55%', size: 100, opacity: 0.04,  dur: 22, delay: 1,   color: '#8B5CF6', rot: -5 },
  { x: '5%',  y: '65%', size: 70,  opacity: 0.03,  dur: 16, delay: 5,   color: '#FF00AA', rot: 15 },
  { x: '50%', y: '85%', size: 55,  opacity: 0.035, dur: 20, delay: 2,   color: '#00E5D1', rot: -12 },
  { x: '30%', y: '20%', size: 45,  opacity: 0.025, dur: 25, delay: 8,   color: '#F59E0B', rot: 6 },
  { x: '92%', y: '78%', size: 65,  opacity: 0.03,  dur: 17, delay: 4,   color: '#8B5CF6', rot: -18 },
];

export function FloatingMustaches() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      {FLOATERS.map((f, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: f.x,
            top: f.y,
            opacity: f.opacity,
            animation: `muz-float-${(i % 3) + 1} ${f.dur}s ease-in-out ${f.delay}s infinite`,
            transform: `rotate(${f.rot}deg)`,
            willChange: 'transform',
          }}
        >
          <svg
            viewBox="0 0 1280 640"
            style={{ width: f.size, height: f.size * 0.5 }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <g transform="translate(0,640) scale(0.1,-0.1)" fill={f.color} stroke="none">
              <path d={MUSTACHE_PATH} />
            </g>
          </svg>
        </div>
      ))}
    </div>
  );
}
