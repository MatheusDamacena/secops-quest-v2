// ─── APP LOGO — SecOps Quest Mascote ─────────────────────────────────────────
export default function AppLogo({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <defs>
        <linearGradient id="lg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.6"/>
          <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.1"/>
        </linearGradient>
      </defs>
      <path d="M60 115C60 115,10 90,10 40C10 20,25 15,60 15C95 15,110 20,110 40C110 90,60 115,60 115Z" fill="#b92b6a"/>
      <path d="M60 110C60 110,10 85,10 35C10 15,25 10,60 10C95 10,110 15,110 35C110 85,60 110,60 110Z" fill="#ff4b8b"/>
      <path d="M60 102C60 102,18 80,18 38C18 22,30 18,60 18C90 18,102 22,102 38C102 80,60 102,60 102Z" fill="#1b2733"/>
      <path d="M30 100C30 80,40 75,60 75C80 75,90 80,90 100" fill="#2c3e50"/>
      <circle cx="60" cy="55" r="28" fill="#2c3e50"/>
      <path d="M35 55C20 50,15 65,15 65C15 65,25 60,32 62Z" fill="#2c3e50"/>
      <path d="M35 55C22 55,18 70,18 70C18 70,28 65,33 66Z" fill="#1a252f"/>
      <rect x="40" y="44" width="40" height="16" rx="8" fill="#fcdbb5"/>
      <circle cx="48" cy="52" r="4" fill="#121e26"/>
      <circle cx="46.5" cy="50.5" r="1.5" fill="#ffffff"/>
      <circle cx="70" cy="52" r="5" fill="#121e26"/>
      <circle cx="68" cy="50" r="2" fill="#ffffff"/>
      <path d="M82 68L95 85" stroke="#ffcd00" strokeWidth="6" strokeLinecap="round"/>
      <path d="M86 68L98 84" stroke="#d4aa00" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="72" cy="54" r="16" fill="none" stroke="#ffcd00" strokeWidth="5"/>
      <circle cx="72" cy="54" r="13.5" fill="url(#lg)"/>
      <path d="M64 45A11 11 0 0 1 78 45" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    </svg>
  );
}
