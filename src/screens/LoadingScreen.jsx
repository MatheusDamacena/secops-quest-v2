import { C, F } from '../styles/tokens';
export default function LoadingScreen() {
  return (
    <div style={{ minHeight:'100dvh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16 }}>
      <div style={{ fontSize:48 }}>🔒</div>
      <div style={{ fontFamily:F.mono, color:C.accent, fontSize:14, letterSpacing:2 }}>CARREGANDO...</div>
    </div>
  );
}
