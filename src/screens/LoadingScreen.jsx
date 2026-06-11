import { useEffect, useState } from 'react';
import AppLogo from '../components/AppLogo';
import { C, F } from '../styles/tokens';

export default function LoadingScreen() {
  const [dots, setDots] = useState('');
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const d = setInterval(() => setDots(p => p.length >= 3 ? '' : p + '.'), 400);
    const p = setInterval(() => setPulse(v => !v), 800);
    return () => { clearInterval(d); clearInterval(p); };
  }, []);

  return (
    <div style={{
      minHeight:'100dvh', background:C.bg,
      display:'flex', alignItems:'center', justifyContent:'center',
      flexDirection:'column', gap:20,
    }}>
      <style>{`
        @keyframes logoGlow {
          0%,100% { filter: drop-shadow(0 0 12px rgba(255,26,117,0.4)); transform: scale(1); }
          50%      { filter: drop-shadow(0 0 28px rgba(255,26,117,0.8)); transform: scale(1.06); }
        }
        @keyframes barPulse {
          0%,100% { opacity:0.4; width: 40%; }
          50%      { opacity:1;   width: 80%; }
        }
      `}</style>

      {/* Logo com glow pulsante */}
      <div style={{ animation:'logoGlow 1.6s ease-in-out infinite' }}>
        <AppLogo size={72} />
      </div>

      {/* Barra de progresso animada */}
      <div style={{ width:120, height:3, background:'rgba(255,255,255,0.08)', borderRadius:4, overflow:'hidden', position:'relative' }}>
        <div style={{
          position:'absolute', left:'10%', height:'100%',
          background:`linear-gradient(90deg, ${C.accent}, ${C.cyan})`,
          borderRadius:4,
          animation:'barPulse 1.4s ease-in-out infinite',
        }} />
      </div>

      <div style={{ fontFamily:F.mono, color:C.textDim, fontSize:12, letterSpacing:3 }}>
        CARREGANDO{dots}
      </div>
    </div>
  );
}
