// app/maintenance/page.tsx
// Page de maintenance — affichée quand NEXT_PUBLIC_MAINTENANCE_MODE=true
// Design aux couleurs de Muzquiz

export default function MaintenancePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'linear-gradient(160deg, #0D1B3E 0%, #112247 100%)',
        fontFamily: 'var(--font-inter, sans-serif)',
        textAlign: 'center',
      }}
    >
      {/* Logo SVG inline (pas de dépendance composant) */}
      <svg
        viewBox="0 0 1280 640"
        style={{ width: 80, height: 40, marginBottom: '1.5rem', filter: 'drop-shadow(0 0 16px rgba(255,0,170,0.5))' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="maint-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF00AA" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#00E5D1" />
          </linearGradient>
        </defs>
        <g transform="translate(0,640) scale(0.1,-0.1)" fill="url(#maint-grad)" stroke="none">
          <path d="M5078 4980 c-350 -37 -700 -176 -1079 -431 -212 -142 -402 -292 -804 -634 -426 -362 -624 -510 -885 -657 -301 -171 -525 -263 -788 -325 -100 -23 -139 -27 -262 -27 -124 0 -154 3 -204 22 -89 33 -137 65 -199 132 -97 104 -150 250 -151 410 -1 116 23 178 91 241 79 72 155 100 443 162 132 28 199 56 246 104 63 63 41 97 -104 158 -158 66 -295 85 -442 61 -288 -47 -514 -194 -699 -452 -254 -356 -307 -752 -151 -1116 295 -687 1406 -1140 2966 -1209 818 -36 1849 104 2378 322 193 79 297 142 532 321 76 58 233 136 309 153 84 20 192 23 224 6 13 -7 62 -41 110 -76 806 -589 2529 -867 4021 -649 664 97 1218 291 1600 562 118 83 298 262 368 364 237 347 265 713 82 1078 -96 191 -259 388 -429 516 -97 74 -276 165 -366 188 -194 49 -363 16 -487 -94 -52 -46 -108 -124 -108 -152 0 -40 130 -81 426 -137 166 -31 240 -59 302 -115 100 -91 119 -254 46 -399 -30 -58 -144 -180 -241 -258 -208 -165 -447 -201 -728 -107 -97 32 -275 122 -376 190 -119 80 -514 380 -1009 767 -212 166 -456 352 -542 414 -513 365 -931 561 -1363 638 -112 20 -162 23 -360 23 -175 0 -253 -4 -325 -18 -230 -42 -451 -114 -659 -213 -152 -73 -166 -73 -301 0 -203 109 -468 198 -672 226 -114 16 -311 21 -410 11z" />
        </g>
      </svg>

      {/* Titre */}
      <h1
        style={{
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          fontWeight: 900,
          color: '#F0F4FF',
          margin: '0 0 0.5rem',
          letterSpacing: '-0.02em',
          fontFamily: 'var(--font-black-han, sans-serif)',
        }}
      >
        MUZQUIZ
      </h1>

      {/* Sous-titre */}
      <p
        style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #FF00AA, #8B5CF6, #00E5D1)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '0 0 2.5rem',
        }}
      >
        Quiz & Blind Test en temps réel
      </p>

      {/* Encart maintenance */}
      <div
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1.5px solid rgba(139,92,246,0.3)',
          borderRadius: '1.25rem',
          padding: '2rem 2.5rem',
          maxWidth: '480px',
          width: '100%',
        }}
      >
        {/* Icône outil */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'rgba(139,92,246,0.12)',
            border: '2px solid rgba(139,92,246,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            fontSize: '1.6rem',
          }}
        >
          🛠️
        </div>

        <h2
          style={{
            fontSize: '1.3rem',
            fontWeight: 900,
            color: '#F0F4FF',
            margin: '0 0 0.75rem',
          }}
        >
          Site en maintenance
        </h2>

        <p
          style={{
            fontSize: '0.95rem',
            color: 'rgba(240,244,255,0.55)',
            lineHeight: 1.6,
            margin: '0 0 1.5rem',
          }}
        >
          Nous effectuons quelques améliorations pour vous offrir la meilleure expérience.
          <br />
          Le site sera de nouveau accessible très prochainement.
        </p>

        {/* Barre décorative */}
        <div
          style={{
            height: 3,
            borderRadius: 99,
            background: 'linear-gradient(90deg, #FF00AA, #8B5CF6, #00E5D1)',
            opacity: 0.6,
          }}
        />
      </div>

      {/* Contact */}
      <p
        style={{
          marginTop: '2rem',
          fontSize: '0.8rem',
          color: 'rgba(240,244,255,0.25)',
        }}
      >
        Une question ? Contactez-nous sur les réseaux sociaux.
      </p>
    </div>
  );
}
