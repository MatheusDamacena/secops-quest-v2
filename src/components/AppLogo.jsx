// ─── APP LOGO ─────────────────────────────────────────────────────────────────
// Logo oficial do SecOps Quest — escudo com gradiente cyan→pink e texto "SQ"
// Uso: <AppLogo size={80} />

export default function AppLogo({ size = 80 }) {
  const id = 'sq-grad-' + size; // id único para múltiplos usos na página
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block' }}
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%"   stopColor="#00c4cc" />
          <stop offset="100%" stopColor="#ff1a75" />
        </linearGradient>
      </defs>

      {/* Escudo preenchido (glow sutil) */}
      <path
        d="M256 48 L80 120 L80 256 C80 374 168 456 256 488 C344 456 432 374 432 256 L432 120 Z"
        fill={`url(#${id})`}
        opacity="0.12"
      />

      {/* Escudo outline com gradiente */}
      <path
        d="M256 64 L96 132 L96 256 C96 364 178 440 256 472 C334 440 416 364 416 256 L416 132 Z"
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="16"
        strokeLinejoin="round"
      />

      {/* Texto SQ */}
      <text
        x="256"
        y="318"
        fontFamily="Inter, Nunito, sans-serif"
        fontWeight="900"
        fontSize="172"
        fill={`url(#${id})`}
        textAnchor="middle"
        letterSpacing="-8"
      >
        SQ
      </text>
    </svg>
  );
}
